import React, { Component } from 'React';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      err: '',
      success: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ err: 'empty input fields not allowed' });
      return;
    }

    axios
      .post('/auth/login', { email, password })
      .then(res => res.data)
      .then(user => {
        if (user.message) {
          this.setState({ err: user.message });
          return;
        }
        this.props.updateUser();
        this.setState({ success: true });
      })
      .catch(err => {
        this.setState({ err: err.message });
        console.error(err);
      });
  }

  render() {
    const { email, password, err, success } = this.state;

    return (
      <div className="auth">
        <h1>Sign In</h1>
        { err && <p>{err}</p>}
        <form onSubmit={this.handleSubmit}>
          <input
            name="email"
            type="text"
            value={email}
            placeholder="email"
            onChange={this.handleChange}
          />
          <input
            name="password"
            type="password"
            value={password}
            placeholder="password"
            onChange={this.handleChange}
          />
          <input type="submit" value="Sign In" />
        </form>
      </div>
    );
  }
}

export default SignIn;
