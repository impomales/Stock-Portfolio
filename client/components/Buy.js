import React, { Component } from 'react';
import axios from 'axios';
import { formatCurrency } from '../util';

const apiUrl = 'https://api.iextrading.com/1.0/stock';

class Buy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: '',
      quantity: '',
      err: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { symbol, quantity } = this.state;

    if (!symbol || quantity === undefined) {
      this.setState({ err: 'input field cannot be empty.' });
      return;
    }

    if (quantity <= 0 || !Number.isInteger(+quantity)) {
      this.setState({ err: 'quantity must be a valid whole number.' });
      return;
    }

    axios
      .get(`${apiUrl}/${symbol.toLowerCase()}/price`)
      .then(iexRes => iexRes.data)
      .then(price => {
        price = price * 100;
        if (price * +quantity > this.props.balance) {
          throw new Error('not enough cash');
        }
        return axios.post('/api/transactions', {
          symbol: symbol.toUpperCase(),
          quantity,
          price
        });
      })
      .then(transRes => transRes.data)
      .then(() => {
        this.props.updateUser();
        this.setState({ symbol: '', quantity: '', err: '' });
      })
      .catch(err => {
        if (err.message === 'Request failed with status code 404') {
          this.setState({ err: 'invalid ticker symbol' });
          return;
        }

        if (err.message === 'not enough cash') {
          this.setState({ err: 'not enough cash to complete purchase' });
          return;
        }

        console.error(err);
      });
  }

  render() {
    const { symbol, quantity, err } = this.state;
    return (
      <div>
        <p>Cash - {formatCurrency(this.props.balance)}</p>
        <form onSubmit={this.handleSubmit}>
          {err && <p className="red">{err}</p>}
          <input
            name="symbol"
            type="text"
            value={symbol}
            placeholder="Ticker"
            onChange={this.handleChange}
          />
          <input
            name="quantity"
            type="text"
            value={quantity}
            placeholder="Qty"
            onChange={this.handleChange}
          />
          <input className="submit" type="submit" value="Buy" />
        </form>
      </div>
    );
  }
}

export default Buy;
