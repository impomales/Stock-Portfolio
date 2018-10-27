import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Portfolio from './Portfolio';
import Transactions from './Transactions';
import SignIn from './SignIn';
import Register from './Register';
import Loading from '../containers/Loading';
import NoMatch from '../containers/NoMatch';

const apiUrl = 'https://api.iextrading.com/1.0/stock';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      fetchedUser: false,
      transactions: [],
      portfolio: []
    };

    this.fetchUser = this.fetchUser.bind(this);
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser() {
    axios
      .get('/auth/me')
      .then(res => res.data)
      .then(user => {
        if (user && user.id) {
          this.fetchTransactions().then(transactions => {
            this.fetchPortfolio().then(portfolio =>
              this.setState({
                user,
                transactions,
                portfolio,
                fetchedUser: true
              })
            );
          });
        } else {
          this.setState({ user, fetchedUser: true });
        }
      })
      .catch(err => console.error(err));
  }

  fetchTransactions() {
    return axios
      .get('/api/transactions')
      .then(res => res.data)
      .catch(err => console.error(err));
  }

  fetchPortfolio() {
    return axios
      .get('/api/stocks')
      .then(res => res.data)
      .then(stocks => {
        const portfolio = [];
        const promises = stocks.map(stock => {
          return axios
            .get(`${apiUrl}/${stock.symbol}/quote`)
            .then(res => res.data)
            .then(quote => {
              portfolio.push({
                id: stock.id,
                symbol: stock.symbol,
                quantity: stock.quantity,
                latestPrice: quote.latestPrice * 100,
                openPrice: quote.open * 100
              });
            });
        });

        return Promise.all(promises).then(() => portfolio);
      })
      .catch(err => console.error(err));
  }

  render() {
    const { user, fetchedUser, transactions, portfolio } = this.state;
    return !fetchedUser ? (
      <Loading />
    ) : (
      <Router>
        {// user is logged in.
        user && user.id ? (
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Portfolio
                  user={user}
                  updateUser={this.fetchUser}
                  portfolio={portfolio}
                />
              )}
            />
            <Route
              path="/portfolio"
              render={() => (
                <Portfolio
                  user={user}
                  updateUser={this.fetchUser}
                  portfolio={portfolio}
                />
              )}
            />
            <Route
              path="/history"
              render={() => (
                <Transactions
                  user={user}
                  updateUser={this.fetchUser}
                  transactions={transactions}
                />
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path="/"
              render={() => <SignIn updateUser={this.fetchUser} />}
            />
            } />
            <Route
              path="/(portfolio|signin|history)"
              render={() => <SignIn updateUser={this.fetchUser} />}
            />
            <Route
              path="/register"
              render={() => <Register updateUser={this.fetchUser} />}
            />
            <Route component={NoMatch} />
          </Switch>
        )}
      </Router>
    );
  }
}

export default App;
