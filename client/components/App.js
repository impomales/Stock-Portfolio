import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
    }
  }

  componentDidMount() {
    this.fetchUserId();
  }

  fetchUserId() {
    fetch('/auth/me')
      .then(res => res.json())
      .then(user => this.setState({ user }));
  }

  isLoggedIn() {
    return this.state.user && this.state.user.id;
  }

  render() {
    console.log(this.state.user);
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Portfolio} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/history" component={Transactions} />
          <Route path="/signin" component={SignIn} />
          <Route path="/register" component={Register} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
