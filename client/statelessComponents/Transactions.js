import React from 'React';
import Nav from './Nav';

import './Transactions.css';

import { formatCurrency } from '../util';

const Transactions = ({ updateUser, user, transactions }) => (
  <div className="section">
    <Nav updateUser={updateUser} name={user.name} />
    <h1 className="header">Transactions</h1>
    <ul className="transactions">
      {transactions.map(transaction => (
        <li key={transaction.id}>
          <p>{new Date(transaction.createdAt).toDateString()}</p>
          <p>{`BUY (${transaction.symbol}) - ${
            transaction.quantity
          } Shares @ ${formatCurrency(transaction.price)}`}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default Transactions;
