#!/usr/bin/env node
/**
 * i18n integrity check.
 *
 * Guarantees every language ships the exact same key set as English, that no
 * namespace is empty, and that no value is still the untranslated English
 * fallback in a non-English locale (except proper nouns / technical terms).
 *
 * Usage: node scripts/verify-i18n.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, '..', 'client', 'src', 'i18n', 'locales');
const SOURCE = 'en';
const FALLBACK_ALLOWED = /\b(MoTA|PVTG|DBT|PFMS|APBS|IFSC|AISHE|U-DISE|NSFST|NOS|NFST|AI|OCR|SHA-256|QR|PDF|JSON|API|UID|State|ST|SC|OBC|EWS|DBT)\b/;

const readDir = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir) : []);

const languages = readDir(LOCALES_DIR).filter((d) =>
  fs.statSync(path.join(LOCALES_DIR, d)).isDirectory()
);

if (!languages.includes(SOURCE)) {
  console.error(`FATAL: source locale "${SOURCE}" missing in ${LOCALES_DIR}`);
  process.exit(1);
}

const loadNamespace = async (lang, file) => {
  const mod = await import(pathToFileURL(path.join(LOCALES_DIR, lang, file)).href);
  return mod.default || {};
};

const namespaces = readDir(path.join(LOCALES_DIR, SOURCE)).filter((f) => f.endsWith('.js'));
let failures = 0;
let totalKeys = 0;

console.log(`\nTribalScholar AI — i18n check (source: ${SOURCE})`);
console.log(`Languages: ${languages.join(', ')}`);
console.log('─'.repeat(64));

for (const file of namespaces) {
  const base = await loadNamespace(SOURCE, file);
  const baseKeys = Object.keys(base);
  totalKeys += baseKeys.length;

  if (baseKeys.length === 0) {
    console.error(`  ✗ ${file}: source namespace is EMPTY`);
    failures++;
    continue;
  }

  for (const lang of languages) {
    if (lang === SOURCE) continue;
    const filePath = path.join(LOCALES_DIR, lang, file);
    if (!fs.existsSync(filePath)) {
      console.error(`  ✗ ${file}: missing in "${lang}"`);
      failures++;
      continue;
    }
    const dict = await loadNamespace(lang, file);
    const langKeys = new Set(Object.keys(dict));

    const missing = baseKeys.filter((k) => !langKeys.has(k));
    const extra = Object.keys(dict).filter((k) => !(k in base));
    const untranslated = baseKeys.filter(
      (k) => dict[k] === base[k] && !FALLBACK_ALLOWED.test(String(base[k]))
    );

    const parts = [];
    if (missing.length) parts.push(`${missing.length} missing`);
    if (extra.length) parts.push(`${extra.length} unknown`);
    if (untranslated.length) parts.push(`${untranslated.length} identical-to-English`);

    if (parts.length) {
      failures++;
      console.error(`  ✗ ${file} [${lang}]: ${parts.join(', ')}`);
      if (missing.length) console.error(`      missing e.g. ${missing.slice(0, 4).join(', ')}`);
      if (untranslated.length)
        console.error(`      identical e.g. ${untranslated.slice(0, 4).join(', ')}`);
    }
  }
}

console.log('─'.repeat(64));
console.log(
  failures === 0
    ? `✓ PASS — ${namespaces.length} namespaces, ${totalKeys} keys, ${languages.length} languages, full parity\n`
    : `✗ FAIL — ${failures} problem group(s) found\n`
);
process.exit(failures === 0 ? 0 : 1);
