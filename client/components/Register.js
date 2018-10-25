import React, { Component } from 'React';
import { Redirect } from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      err: '',
      success: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value, err: '' });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { name, email, password } = this.state;

    if (!name || !email || !password) {
      this.setState({ err: 'empty input fields not allowed' });
      return;
    }

    if (password.length < 5) {
      this.setState({ err: 'password must be at least 5 characters long.' });
      return;
    }

    fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => {
        if (res.status === 401) throw new Error('User already exists.');
        res.json();
      })
      .then(user => {
        // created user.
        this.setState({ email: '', password: '', name: '', err: '', success: true });

      })
      .catch(err => {
        if (err.message === 'User already exists.') {
          this.setState({ err: err.message });
          return;
        }
        console.error(err);
      });
  }

  render() {
    const { name, email, password, err, success } = this.state;

    if (success) return <Redirect to="/" />;

    return (
      <div id="register">
        <h1>Register</h1>
        {err && <p>{err}</p>}
        <form onSubmit={this.handleSubmit}>
          <input
            name="name"
            type="text"
            value={name}
            placeholder="name"
            onChange={this.handleChange}
          />
          <input
            name="email"
            type="text"
            value={email}
            placeholder="email"
            onChange={this.handleChange}
          />
          <input
            name="password"
            type="text"
            value={password}
            placeholder="password"
            onChange={this.handleChange}
          />
          <input type="submit" value="Register" />
        </form>
      </div>
    );
  }
}

export default Register;
