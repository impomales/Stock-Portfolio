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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      fetchedUser: false
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
      .then(user => this.setState({ user, fetchedUser: true }));
  }

  render() {
    const { user, fetchedUser } = this.state;
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
                <Portfolio user={user} updateUser={this.fetchUser} />
              )}
            />
            <Route
              path="/portfolio"
              render={() => (
                <Portfolio user={user} updateUser={this.fetchUser} />
              )}
            />
            <Route
              path="/history"
              render={() => (
                <Transactions user={user} updateUser={this.fetchUser} />
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
