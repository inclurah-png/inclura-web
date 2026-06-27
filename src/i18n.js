import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Inclura",
      login: "Login",
      signup: "Sign Up",
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

  yo: {
    translation: {
      welcome: "Kaabọ si Inclura",
      login: "Wọlé",
      signup: "Forúkọsílẹ",
      home: "Ilé",
      profile: "Profaili",
      logout: "Jáde",
      searchPlaceholder: "Wa lori Inclura...",
      notifications: "Ìfitónilétí",
      messages: "Ìfiránṣẹ",
      add: "Fi kun",
      language: "Èdè",
    },
  },

  ig: {
    translation: {
      welcome: "Nnọọ na Inclura",
      login: "Banye",
      signup: "Debanye aha",
      home: "Ụlọ",
      profile: "Profaịlụ",
      logout: "Pụọ",
      searchPlaceholder: "Chọọ na Inclura...",
      notifications: "Ọkwa",
      messages: "Ozi",
      add: "Tinye",
      language: "Asụsụ",
    },
  },

  ha: {
    translation: {
      welcome: "Barka da zuwa Inclura",
      login: "Shiga",
      signup: "Yi Rijista",
      home: "Gida",
      profile: "Bayanan Kai",
      logout: "Fita",
      searchPlaceholder: "Bincika Inclura...",
      notifications: "Sanarwa",
      messages: "Saƙonni",
      add: "Ƙara",
      language: "Harshe",
    },
  },

  fr: {
    translation: {
      welcome: "Bienvenue sur Inclura",
      login: "Connexion",
      signup: "Créer un compte",
      home: "Accueil",
      profile: "Profil",
      logout: "Déconnexion",
      searchPlaceholder: "Rechercher sur Inclura...",
      notifications: "Notifications",
      messages: "Messages",
      add: "Ajouter",
      language: "Langue",
    },
  },

  ar: {
    translation: {
      welcome: "مرحبًا بك في إنكلورا",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      home: "الرئيسية",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
      searchPlaceholder: "ابحث في إنكلورا...",
      notifications: "الإشعارات",
      messages: "الرسائل",
      add: "إضافة",
      language: "اللغة",
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

  zh: {
    translation: {
      welcome: "欢迎来到 Inclura",
      login: "登录",
      signup: "注册",
      home: "首页",
      profile: "个人资料",
      logout: "退出登录",
      searchPlaceholder: "搜索 Inclura...",
      notifications: "通知",
      messages: "消息",
      add: "添加",
      language: "语言",
    },
  },

  pt: {
    translation: {
      welcome: "Bem-vindo ao Inclura",
      login: "Entrar",
      signup: "Cadastrar",
      home: "Início",
      profile: "Perfil",
      logout: "Sair",
      searchPlaceholder: "Pesquisar no Inclura...",
      notifications: "Notificações",
      messages: "Mensagens",
      add: "Adicionar",
      language: "Idioma",
    },
  },

  sw: {
    translation: {
      welcome: "Karibu Inclura",
      login: "Ingia",
      signup: "Jisajili",
      home: "Nyumbani",
      profile: "Wasifu",
      logout: "Ondoka",
      searchPlaceholder: "Tafuta Inclura...",
      notifications: "Arifa",
      messages: "Ujumbe",
      add: "Ongeza",
      language: "Lugha",
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
