import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, getLanguage, setLanguage as saveLanguage, translations } from '../services/language';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: typeof translations.en;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, [user]);

  const loadLanguage = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const savedLanguage = await getLanguage(user.id);
      setLanguageState(savedLanguage);
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    if (!user) return;

    try {
      await saveLanguage(user.id, newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
