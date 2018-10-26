import React from 'React';
import Nav from '../containers/Nav';

const Transactions = ({ updateUser }) => (
  <div>
    <Nav updateUser={updateUser} />
    <h1>Transactions</h1>
  </div>
);

export default Transactions;
