// Currency Converter & Formater for ShoeX E-Commerce

export const getStoredCurrency = () => {
  return localStorage.getItem('shoex_currency') || 'INR (₹)';
};

export const getStoredSymbol = () => {
  const curr = getStoredCurrency();
  if (curr.includes('₹') || curr.includes('INR')) return '₹';
  if (curr.includes('$') || curr.includes('USD')) return '$';
  if (curr.includes('€') || curr.includes('EUR')) return '€';
  if (curr.includes('£') || curr.includes('GBP')) return '£';
  return '₹';
};

export const setStoredCurrency = (curr) => {
  if (curr) {
    localStorage.setItem('shoex_currency', curr);
    window.dispatchEvent(new Event('shoex_currency_changed'));
  }
};

export const formatPrice = (amount, customCurrency) => {
  const num = Number(amount || 0);
  const activeCurrency = customCurrency || getStoredCurrency();

  // 1. INR (₹)
  if (activeCurrency.includes('₹') || activeCurrency.includes('INR')) {
    const val = num < 1000 ? Math.round(num * 83.1) : num;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  }

  // 2. USD ($)
  if (activeCurrency.includes('$') || activeCurrency.includes('USD')) {
    const val = num >= 1000 ? (num / 83.1) : num;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val);
  }

  // 3. EUR (€)
  if (activeCurrency.includes('€') || activeCurrency.includes('EUR')) {
    const val = num >= 1000 ? (num / 83.1) * 0.92 : num * 0.92;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(val);
  }

  // 4. GBP (£)
  if (activeCurrency.includes('£') || activeCurrency.includes('GBP')) {
    const val = num >= 1000 ? (num / 83.1) * 0.79 : num * 0.79;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(val);
  }

  return `₹${num}`;
};

export const formatINR = formatPrice;
