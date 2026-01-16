import React, { createContext, useState, useContext, useEffect } from 'react';
import { Currency, getCurrency, setCurrency as saveCurrency } from '../services/currency';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => Promise<void>;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>('PKR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrency();
  }, [user]);

  const loadCurrency = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const savedCurrency = await getCurrency(user.id);
      setCurrencyState(savedCurrency);
    } catch (error) {
      console.error('Error loading currency:', error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    if (!user) return;

    try {
      await saveCurrency(user.id, newCurrency);
      setCurrencyState(newCurrency);
    } catch (error) {
      console.error('Error setting currency:', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
