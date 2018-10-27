import React from 'React';
import Buy from '../components/Buy';
import Nav from './Nav';

import './Portfolio.css';

import { formatCurrency, calcPortfolioValue, calcColor } from '../util';

const Portfolio = ({ updateUser, user, portfolio }) => (
  <div>
    <Nav updateUser={updateUser} name={user.name} />
    <h1 className="header">{`Portfolio (${calcPortfolioValue(portfolio)})`}</h1>
    <ul>
      {portfolio.map(stock => {
        const color = calcColor(stock);

        return (
          <li key={stock.id} className="stock-info">
            <p>
              <span className={color}>{stock.symbol}</span> - {stock.quantity}
            </p>
            <p className={color}>{formatCurrency(stock.latestPrice)}</p>
          </li>
        );
      })}
    </ul>
    <Buy updateUser={updateUser} balance={user.balance} />
    <footer>
      <p>
        Data provided for free by{' '}
        <a href="https://iextrading.com/developer/">IEX</a>. View{' '}
        <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.
      </p>
    </footer>
  </div>
);

export default Portfolio;
