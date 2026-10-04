import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import or from './locales/or.json';
import as_ from './locales/as.json';
import ur from './locales/ur.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    gu: { translation: gu },
    pa: { translation: pa },
    bn: { translation: bn },
    ta: { translation: ta },
    te: { translation: te },
    kn: { translation: kn },
    ml: { translation: ml },
    or: { translation: or },
    as: { translation: as_ },
    ur: { translation: ur },
  },
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', script: 'Latin' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳', script: 'Gujarati' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳', script: 'Gurmukhi' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳', script: 'Bengali' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳', script: 'Tamil' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳', script: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳', script: 'Kannada' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳', script: 'Malayalam' },
  { code: 'or', label: 'ଓଡ଼ିଆ', flag: '🇮🇳', script: 'Odia' },
  { code: 'as', label: 'অসমীয়া', flag: '🇮🇳', script: 'Bengali' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰', script: 'Arabic', rtl: true },
];

export default i18n;
