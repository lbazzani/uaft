'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKey, detectBrowserLanguage } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Rileva la lingua del browser al mount
    const detectedLang = detectBrowserLanguage();
    setLanguage(detectedLang);
    setMounted(true);
  }, []);

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

  // Evita flash of untranslated content
  if (!mounted) {
    return null;
  }

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
