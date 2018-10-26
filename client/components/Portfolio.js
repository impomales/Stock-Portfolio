import React from 'React';
import Buy from './Buy';
import Nav from '../containers/Nav';

const Portfolio = ({ updateUser, user }) => (
  <div>
    <Nav updateUser={updateUser} name={user.name} />
    <h1>Portfolio</h1>

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
