import { useSelector } from 'react-redux';
import { selectSettings } from '../store/settingsSlice';

export function useCurrency() {
  const { currency, exchangeRate, countryCode } = useSelector(selectSettings);

  const formatPrice = (usdAmount) => {
    if (typeof usdAmount !== 'number') return '';
    
    // Convert base USD to local currency
    const localAmount = usdAmount * exchangeRate;

    // Format using Intl.NumberFormat
    return new Intl.NumberFormat('en-' + countryCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(localAmount);
  };

  return { formatPrice, currency, exchangeRate, countryCode };
}
