import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Portfolio from './Portfolio';
import Transactions from './Transactions';
import SignIn from './SignIn';
import Register from './Register';
import NoMatch from '../containers/NoMatch';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.fetchUserId();
  }

  fetchUserId() {
    axios
      .get('/auth/me')
      .then(res => res.data)
      .then(user => this.setState({ user }));
  }

  render() {
    const { user } = this.state;
    console.log('USER', user);
    return (
      <Router>
        {// user is logged in.
        user && user.id ? (
          <Switch>
            <Route exact path="/" render={() => <Portfolio user={user} />} />
            <Route path="/portfolio" render={() => <Portfolio user={user} />} />
            <Route
              path="/history"
              render={() => <Transactions user={user} />}
            />
            <Route component={NoMatch} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" component={SignIn} />} />
            <Route path="/(portfolio|sigin|history)" component={SignIn} />
            <Route path="/register" component={Register} />
            <Route component={NoMatch} />
          </Switch>
        )}
      </Router>
    );
  }
}

export default App;
