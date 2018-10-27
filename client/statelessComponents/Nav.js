import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import './Nav.css';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logout: false
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(evt) {
    evt.preventDefault();
    axios
      .post('/auth/logout')
      .then(() => {
        this.props.updateUser();
        this.setState({ logout: true });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    if (window.location.pathname !== '/' && this.state.logout)
      return <Redirect push to="/" />;
    const link =
      window.location.pathname === '/history' ? (
        <Link to="/portfolio">Portfolio</Link>
      ) : (
        <Link to="/history">Transactions</Link>
      );

    return (
      <div className="nav">
        <h1>Welcome, {this.props.name}</h1>
        <nav>
          {link}
          <a href="#" onClick={this.handleLogout}>
            Sign out
          </a>
        </nav>
      </div>
    );
  }
}

export default Nav;
