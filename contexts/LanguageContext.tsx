'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// La scelta fatta col selettore. È l'unica strada per l'inglese: niente lingua del browser,
// perché Googlebot gira in en-US e indicizzerebbe l'inglese sotto <html lang="it">.
const CHIAVE_LINGUA = 'lingua';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Italiano sul server e al primo disegno nel browser: lo stesso HTML, niente errori di idratazione
  const [language, setLanguageState] = useState<Language>('it');

  // dopo il montaggio, l'inglese solo se qualcuno l'ha scelto (localStorage può mancare: navigazione privata)
  useEffect(() => {
    try {
      if (localStorage.getItem(CHIAVE_LINGUA) === 'en') setLanguageState('en');
    } catch {}
  }, []);

  // <html lang> segue la lingua mostrata, su ogni pagina: chi legge con lo schermo sente la pronuncia giusta
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(CHIAVE_LINGUA, lang);
    } catch {}
  };

  const t = (key: TranslationKey, params?: Record<string, string | number | undefined>): string => {
    let text = translations[language][key] || key;

    // Replace template variables like {variable} with param values
    if (params) {
      Object.keys(params).forEach((param) => {
        const value = params[param];
        if (value !== undefined) {
          text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
        }
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
