import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP' | 'SAR' | 'AED';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
};

const CURRENCY_STORAGE_KEY = 'user_currency';

export const getCurrency = async (userId: string): Promise<Currency> => {
  try {
    const key = `${CURRENCY_STORAGE_KEY}_${userId}`;
    const currency = await AsyncStorage.getItem(key);
    return (currency as Currency) || 'PKR';
  } catch (error) {
    console.error('Error getting currency:', error);
    return 'PKR';
  }
};

export const setCurrency = async (userId: string, currency: Currency): Promise<boolean> => {
  try {
    const key = `${CURRENCY_STORAGE_KEY}_${userId}`;
    await AsyncStorage.setItem(key, currency);
    return true;
  } catch (error) {
    console.error('Error setting currency:', error);
    return false;
  }
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const currencyInfo = CURRENCIES[currency];
  const formattedAmount = amount.toFixed(2);
  
  if (currency === 'PKR') {
    // Pakistani Rupee: Rs 1,234.56
    return `${currencyInfo.symbol} ${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  } else {
    // Other currencies: $1,234.56 or €1,234.56
    return `${currencyInfo.symbol}${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
};
