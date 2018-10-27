const formatCurrency = num => {
  return (num / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const calcPortfolioValue = portfolio => {
  let value = 0;

  portfolio.forEach(stock => {
    value += stock.latestPrice * stock.quantity
  });

  return formatCurrency(value);
}

const calcColor = stock => {
  if (stock.latestPrice < stock.openPrice) return 'red';
  if (stock.latestPrice > stock.openPrice) return 'green';
  return 'gray';
};

export { formatCurrency, calcPortfolioValue, calcColor };
