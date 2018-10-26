import React from 'React';
import Nav from '../containers/Nav';

const Transactions = ({ updateUser, user }) => (
  <div>
    <Nav updateUser={updateUser} name={user.name} />
    <h1>Transactions</h1>
  </div>
);

export default Transactions;
