import React from 'React';
import Nav from '../containers/Nav';

import { formatCurrency } from '../util';

const Transactions = ({ updateUser, user, transactions }) => (
  <div>
    <Nav updateUser={updateUser} name={user.name} />
    <h1>Transactions</h1>
    <ul>
      {transactions.map(transaction => (
        <li key={transaction.id}>{`BUY (${transaction.symbol}) - ${
          transaction.quantity
        } @ ${formatCurrency(transaction.price)}`}</li>
      ))}
    </ul>
  </div>
);

export default Transactions;
