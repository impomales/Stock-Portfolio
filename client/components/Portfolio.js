import React from 'React';
import Buy from './Buy';
import Nav from '../containers/Nav';

import { formatCurrency, calcPortfolioValue } from '../util';

const Portfolio = ({ updateUser, user, portfolio }) => (
  <div>
    <Nav updateUser={updateUser} name={user.name} />
    <h1>{`Portfolio (${calcPortfolioValue(portfolio)})`}</h1>
    <div>
      {portfolio.map(stock => (
        <li key={stock.id}>
          <p>
            {`${stock.symbol} - ${stock.quantity}`}
          </p>
          <p>{formatCurrency(stock.latestPrice)}</p>
        </li>
      ))}
    </div>
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
