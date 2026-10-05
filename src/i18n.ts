import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'km', 'fr', 'es', 'ru'],
    backend: {
      loadPath: '/i18n/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
