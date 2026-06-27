import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Inclura",
      login: "Login",
      signup: "Sign up",
      home: "Home",
      profile: "Profile",
      logout: "Logout",
      searchPlaceholder: "Search Inclura...",
      notifications: "Notifications",
      messages: "Messages",
      add: "Add",
      language: "Language",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido a Inclura",
      login: "Iniciar sesión",
      signup: "Regístrate",
      home: "Inicio",
      profile: "Perfil",
      logout: "Cerrar sesión",
      searchPlaceholder: "Buscar en Inclura...",
      notifications: "Notificaciones",
      messages: "Mensajes",
      add: "Agregar",
      language: "Idioma",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
