import React from 'React';
import Nav from './Nav';

import { formatCurrency } from '../util';

const Transactions = ({ updateUser, user, transactions }) => (
  <div className="section">
    <Nav updateUser={updateUser} name={user.name} />
    <h1 className="header">Transactions</h1>
    <ul>
      {transactions.map(transaction => (
        <li key={transaction.id}>{`BUY (${transaction.symbol}) - ${
          transaction.quantity
        } Shares @ ${formatCurrency(transaction.price)}`}</li>
      ))}
    </ul>
  </div>
);

export default Transactions;
