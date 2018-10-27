const formatCurrency = num => {
  return (num / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const calcPortfolioValue = portfolio => {
  let value = 0;

  portfolio.forEach(stock => {
    value += stock.latestPrice * stock.quantity;
  });

  return formatCurrency(value);
};

const calcColor = stock => {
  if (stock.latestPrice < stock.openPrice)
    return { color: 'red', triangle: 'down' };
  if (stock.latestPrice > stock.openPrice)
    return { color: 'green', triangle: 'up' };
  return { color: 'gray', triangle: '' };
};

export { formatCurrency, calcPortfolioValue, calcColor };
