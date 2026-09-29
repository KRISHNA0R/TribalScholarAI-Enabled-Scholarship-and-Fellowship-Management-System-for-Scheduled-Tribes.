import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  makeTranslator,
  readStoredLanguage,
  STORAGE_KEY,
} from '../i18n/index.js';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Real persisted language (en / hi / bn)
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Persist language + reflect in <html lang> for accessibility / screen readers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* storage unavailable */
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => setLanguageState(lang), []);

  const decreaseFontSize = () => setFontScale((prev) => Math.max(0.85, prev - 0.1));
  const resetFontSize = () => setFontScale(1);
  const increaseFontSize = () => setFontScale((prev) => Math.min(1.3, prev + 0.1));
  const toggleContrast = () => setHighContrast((prev) => !prev);
  const toggleMotion = () => setReduceMotion((prev) => !prev);

  // Centralized translator: falls back to English, then the key itself.
  // Supports interpolation: t('key', { name: 'Krishna' })
  const t = makeTranslator(language);

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        highContrast,
        reduceMotion,
        language,
        setLanguage,
        decreaseFontSize,
        resetFontSize,
        increaseFontSize,
        toggleContrast,
        toggleMotion,
        t,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
