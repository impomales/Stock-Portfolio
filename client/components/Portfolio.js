import React from 'React';
import Nav from '../containers/Nav';

const apiUrl = 'https://api.iextrading.com/1.0';

const Portfolio = ({ updateUser }) => (
  <div>
    <Nav updateUser={updateUser} />
    <h1>Portfolio</h1>
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
