/**
 * TribalScholar AI — Centralized i18n system.
 *
 * Architecture:
 *  - Each language lives in ./locales/<lang>/<namespace>.js
 *  - Every namespace module default-exports a FLAT object of dotted keys:
 *        export default { 'nav.home': 'Home', ... }
 *  - All namespaces are auto-discovered via import.meta.glob, so adding a new
 *    language = adding a folder, and adding new strings = adding a namespace file.
 *    No changes to this file are required.
 *
 * Key convention: <area>.<element>  e.g. 'login.title', 'common.save'
 * Interpolation:  t('key', { name: 'Krishna' }) replaces {name} tokens.
 */

const localeModules = import.meta.glob('./locales/*/*.js', { eager: true });

const translations = {};

for (const [path, mod] of Object.entries(localeModules)) {
  // './locales/en/common.js' -> ['', 'locales', 'en', 'common.js']
  const parts = path.split('/');
  const lang = parts[2];
  const dict = mod.default || {};
  if (!translations[lang]) translations[lang] = {};
  Object.assign(translations[lang], dict);
}

/** Supported languages. To add one: create ./locales/<code>/ and append here. */
export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'sat', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
];

export const DEFAULT_LANGUAGE = 'en';
export const STORAGE_KEY = 'tribalscholar_lang';

/** Raw dictionaries (en/hi/bn/...). */
export { translations };

/** Build a translator bound to a language. Falls back to English, then the key. */
export const makeTranslator = (lang) => (key, vars) => {
  if (!key) return '';
  let value = translations[lang]?.[key];
  if (value === undefined) value = translations[DEFAULT_LANGUAGE]?.[key];
  if (value === undefined) return key;
  if (vars && typeof value === 'string') {
    value = value.replace(/\{(\w+)\}/g, (m, name) =>
      vars[name] !== undefined ? String(vars[name]) : m
    );
  }
  return value;
};

/** Read persisted language safely (SSR/lockdown-proof). */
export const readStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_LANGUAGE;
};
