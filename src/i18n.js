import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "The Inclusive Social Platform for Everyone",

    // Authentication
    welcome: "Welcome to Inclura",
    welcomeBack: "Welcome Back",

    login: "Login",
    logout: "Logout",

    signup: "Sign Up",
    createAccount: "Create Account",

    continueWithGoogle: "Continue with Google",

    email: "Email Address",
    password: "Password",
    fullName: "Full Name",

    // Dashboard
    dashboard: "Dashboard",
    home: "Home",
    profile: "Profile",
    notifications: "Notifications",
    messages: "Messages",
    wallet: "Wallet",

    // Navigation
    search: "Search",
    searchPlaceholder: "Search Inclura...",
    savedPosts: "Saved Posts",
    editProfile: "Edit Profile",

    // Language
    language: "Language",

    // Accessibility
    accessibilityHub: "Accessibility Hub",
    accessibilityNeeds: "Accessibility Needs",

    // Opportunities
    opportunitiesHub: "Opportunities Hub",
    careGigs: "Care-Gigs",
    mentorHub: "Mentor Hub",
    marketplace: "Marketplace",
    reels: "Reels",

    // Verification
    verificationCenter: "Verification Center",

    // Sidebar
    creatorEarnings: "Creator Earnings",
    creatorMonetization: "Creator Monetization",
    creatorAnalytics: "Creator Analytics",

    advertiserDashboard: "Advertiser Dashboard",
    adManager: "Ad Manager",

    enterprise: "Enterprise",
    enterpriseAds: "Enterprise Ads",
    enterpriseCampaigns: "Enterprise Campaigns",
    enterpriseAnalytics: "Enterprise Analytics",

    platformAnalytics: "Platform Analytics",
    pricingManager: "Pricing Manager",
    usersManagement: "Users Management",
    reportsViolations: "Reports & Violations",
    verificationRequests: "Verification Requests",
    verificationManager: "Verification Manager",
    walletMonitoring: "Wallet Monitoring",
    adApprovalQueue: "Ad Approval Queue",
    adminPanel: "Admin Panel",

    sos: "Emergency SOS",

    // General
    add: "Add",
    cancel: "Cancel",
    save: "Save",
    continue: "Continue",

    yes: "Yes",
    no: "No",

    loading: "Loading...",
    submit: "Submit",
    next: "Next",
    back: "Back",
    close: "Close",

    success: "Success",
    error: "Something went wrong.",
    retry: "Retry",

    settings: "Settings",
    account: "Account",
    privacy: "Privacy",
    security: "Security",

    followers: "Followers",
    following: "Following",

    verified: "Verified",
    creator: "Creator",
    organization: "Organization",
    employer: "Employer",
    volunteer: "Volunteer",
    advocate: "Advocate",
    caregiver: "Caregiver",
    disability: "Disability",
    ally: "Ally",
    jobSeeker: "Job Seeker",

    premium: "Premium",
    upgrade: "Upgrade",

    viewAll: "View All",

    noResults: "No results found.",

    comingSoon: "Coming Soon",
  },
},

  yo: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "Pẹpẹ Awujọ Alágbáṣiṣẹ fún Gbogbo Ènìyàn",

    // Authentication
    welcome: "Kaabọ sí Inclura",
    welcomeBack: "Kaabọ Padà",

    login: "Wọlé",
    logout: "Jáde",

    signup: "Forúkọsílẹ",
    createAccount: "Ṣẹda Àkọọlẹ",

    continueWithGoogle: "Tẹ̀síwájú pẹ̀lú Google",

    email: "Adirẹsi Ímeèlì",
    password: "Ọrọigbaniwọle",
    fullName: "Orúkọ Kíkún",

    // Dashboard
    dashboard: "Dasibodu",
    home: "Ilé",
    profile: "Profaili",
    notifications: "Ìfitónilétí",
    messages: "Ìfiránṣẹ́",
    wallet: "Apamọwọ",

    // Navigation
    search: "Wá",
    searchPlaceholder: "Wá lórí Inclura...",
    savedPosts: "Àwọn Ìfìwéránṣẹ́ Tí A Fipamọ́",
    editProfile: "Ṣatúnṣe Profaili",

    // Language
    language: "Èdè",

    // Accessibility
    accessibilityHub: "Ilé-iṣẹ́ Ààyè Rírọrùn",
    accessibilityNeeds: "Àwọn Àìní Ààyè Rírọrùn",

    // Opportunities
    opportunitiesHub: "Ilé-iṣẹ́ Àwọn Ànfààní",
    careGigs: "Àwọn Iṣẹ́ Ìtọju",
    mentorHub: "Ilé-iṣẹ́ Olùtọ́nisọ́nà",
    marketplace: "Ọjà",
    reels: "Fídíò Kúkúrú",

    // Verification
    verificationCenter: "Ilé-iṣẹ́ Ìmúdájú",

    // Sidebar
    creatorEarnings: "Owó Olùdá Àkóónú",
    creatorMonetization: "Ìnáwó Olùdá Àkóónú",
    creatorAnalytics: "Ìtúpalẹ̀ Olùdá Àkóónú",

    advertiserDashboard: "Dasibodu Olùpolówó",
    adManager: "Alákóso Ìpolówó",

    enterprise: "Ilé-iṣẹ́",
    enterpriseAds: "Ìpolówó Ilé-iṣẹ́",
    enterpriseCampaigns: "Ìpolongo Ilé-iṣẹ́",
    enterpriseAnalytics: "Ìtúpalẹ̀ Ilé-iṣẹ́",

    platformAnalytics: "Ìtúpalẹ̀ Pẹpẹ",
    pricingManager: "Alákóso Owó",
    usersManagement: "Ìṣàkóso Àwọn Olùlò",
    reportsViolations: "Ìròyìn àti Ìrúfin",
    verificationRequests: "Ìbéèrè Ìmúdájú",
    verificationManager: "Alákóso Ìmúdájú",
    walletMonitoring: "Ìtọ́jú Apamọwọ",
    adApprovalQueue: "Ìfọwọ́sí Ìpolówó",
    adminPanel: "Pánẹ́lì Alákóso",

    sos: "SOS Pàjáwìrì",

    // General
    add: "Fikún",
    cancel: "Fagilé",
    save: "Fipamọ́",
    continue: "Tẹ̀síwájú",

    yes: "Bẹ́ẹ̀ni",
    no: "Rárá",

    loading: "Ń Gbéyọ...",
    submit: "Firanṣẹ́",
    next: "Tẹ̀lé",
    back: "Padà",
    close: "Pàdé",

    success: "Àṣeyọrí",
    error: "Àṣìṣe kan ṣẹlẹ̀.",
    retry: "Gbìyànjú Lẹ́ẹ̀kansi",

    settings: "Ètò",
    account: "Àkọọlẹ",
    privacy: "Ìpamọ́",
    security: "Ààbò",

    followers: "Àwọn Olùtẹ̀lé",
    following: "Àwọn Tí O N Tẹ̀lé",

    verified: "Tí A Ti Múdájú",
    creator: "Olùdá Àkóónú",
    organization: "Ẹgbẹ́",
    employer: "Agbanisiṣẹ́",
    volunteer: "Olùyọ̀ǹda",
    advocate: "Alágbátẹrù",
    caregiver: "Olùtọju",
    disability: "Aìlera",
    ally: "Alábàáṣiṣẹ́",
    jobSeeker: "Olùwá Iṣẹ́",

    premium: "Ere Gíga",
    upgrade: "Ṣe Ìgbéga",

    viewAll: "Wo Gbogbo",

    noResults: "Kò sí èsì kankan.",

    comingSoon: "Ó ń Bọ Láìpẹ́",
  },
},

  ig: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "Ikpo okwu mmekọrịta mmadụ na ibe ya maka mmadụ niile",

    // Authentication
    welcome: "Nnọọ na Inclura",
    welcomeBack: "Nnọọ ọzọ",

    login: "Banye",
    logout: "Pụọ",

    signup: "Debanye aha",
    createAccount: "Mepụta Akaụntụ",

    continueWithGoogle: "Gaa n'ihu na Google",

    email: "Adreesị Email",
    password: "Okwuntughe",
    fullName: "Aha zuru ezu",

    // Dashboard
    dashboard: "Dashboard",
    home: "Ụlọ",
    profile: "Profaịlụ",
    notifications: "Ọkwa",
    messages: "Ozi",
    wallet: "Akpa Ego",

    // Navigation
    search: "Chọọ",
    searchPlaceholder: "Chọọ na Inclura...",
    savedPosts: "Edemede Echekwara",
    editProfile: "Dezie Profaịlụ",

    // Language
    language: "Asụsụ",

    // Accessibility
    accessibilityHub: "Ebe Nkwado Ndị Nwere Nkwarụ",
    accessibilityNeeds: "Mkpa Nkwado",

    // Opportunities
    opportunitiesHub: "Ebe Ohere Dị",
    careGigs: "Ọrụ Nlekọta",
    mentorHub: "Ebe Ndị Ndúzi",
    marketplace: "Ahịa",
    reels: "Reels",

    // Verification
    verificationCenter: "Ebe Nkwenye",

    // Sidebar
    creatorEarnings: "Ego Onye Okike",
    creatorMonetization: "Ụzọ Inweta Ego",
    creatorAnalytics: "Nyocha Onye Okike",

    advertiserDashboard: "Dashboard Onye Mgbasa Ozi",
    adManager: "Njikwa Mgbasa Ozi",

    enterprise: "Ụlọ Ọrụ",
    enterpriseAds: "Mgbasa Ozi Ụlọ Ọrụ",
    enterpriseCampaigns: "Mmemme Mgbasa Ozi",
    enterpriseAnalytics: "Nyocha Ụlọ Ọrụ",

    platformAnalytics: "Nyocha Ikpo Okwu",
    pricingManager: "Njikwa Ọnụahịa",
    usersManagement: "Njikwa Ndị Ọrụ",
    reportsViolations: "Akụkọ na Mmebi Iwu",
    verificationRequests: "Arịrịọ Nkwenye",
    verificationManager: "Njikwa Nkwenye",
    walletMonitoring: "Nlekọta Akpa Ego",
    adApprovalQueue: "Nkwenye Mgbasa Ozi",
    adminPanel: "Ogwe Onye Nchịkwa",

    sos: "SOS Mberede",

    // General
    add: "Tinye",
    cancel: "Kagbuo",
    save: "Chekwaa",
    continue: "Gaa n'ihu",

    yes: "Ee",
    no: "Mba",

    loading: "Na-ebudata...",
    submit: "Zipu",
    next: "Ọzọ",
    back: "Laghachi",
    close: "Mechie",

    success: "Ọganiihu",
    error: "Nsogbu mere.",
    retry: "Gbalịa ọzọ",

    settings: "Ntọala",
    account: "Akaụntụ",
    privacy: "Nzuzo",
    security: "Nche",

    followers: "Ndị Na-eso",
    following: "Ndị Ị Na-eso",

    verified: "Ekwenyere",
    creator: "Onye Okike",
    organization: "Òtù",
    employer: "Onye Were Ọrụ",
    volunteer: "Onye Ọrụ Afọ Ofufo",
    advocate: "Onye Nkwado",
    caregiver: "Onye Nlekọta",
    disability: "Nkwarụ",
    ally: "Enyi Nkwado",
    jobSeeker: "Onye Na-achọ Ọrụ",

    premium: "Premium",
    upgrade: "Mee Ka Ọ Dị Elu",

    viewAll: "Lee Ha Niile",

    noResults: "Enweghị nsonaazụ.",

    comingSoon: "Na-abịa n'oge na-adịghị anya",
  },
},

  ha: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "Dandalin Zamantakewa Mai Haɗa Kowa",

    // Authentication
    welcome: "Barka da zuwa Inclura",
    welcomeBack: "Barka da dawowa",

    login: "Shiga",
    logout: "Fita",

    signup: "Yi Rijista",
    createAccount: "Ƙirƙiri Asusun",

    continueWithGoogle: "Ci gaba da Google",

    email: "Adireshin Imel",
    password: "Kalmar Sirri",
    fullName: "Cikakken Suna",

    // Dashboard
    dashboard: "Dashboard",
    home: "Gida",
    profile: "Bayanan Kai",
    notifications: "Sanarwa",
    messages: "Saƙonni",
    wallet: "Walat",

    // Navigation
    search: "Bincika",
    searchPlaceholder: "Bincika a Inclura...",
    savedPosts: "Abubuwan da Aka Ajiye",
    editProfile: "Gyara Bayanan Kai",

    // Language
    language: "Harshe",

    // Accessibility
    accessibilityHub: "Cibiyar Samun Dama",
    accessibilityNeeds: "Bukatun Samun Dama",

    // Opportunities
    opportunitiesHub: "Cibiyar Dama",
    careGigs: "Ayyukan Kulawa",
    mentorHub: "Cibiyar Jagoranci",
    marketplace: "Kasuwa",
    reels: "Reels",

    // Verification
    verificationCenter: "Cibiyar Tabbatarwa",

    // Sidebar
    creatorEarnings: "Kuɗin Mai Ƙirƙira",
    creatorMonetization: "Samun Kuɗi",
    creatorAnalytics: "Nazarin Mai Ƙirƙira",

    advertiserDashboard: "Dashboard na Mai Tallace-tallace",
    adManager: "Mai Sarrafa Tallace-tallace",

    enterprise: "Kamfani",
    enterpriseAds: "Tallace-tallacen Kamfani",
    enterpriseCampaigns: "Kamfen na Kamfani",
    enterpriseAnalytics: "Nazarin Kamfani",

    platformAnalytics: "Nazarin Dandali",
    pricingManager: "Mai Sarrafa Farashi",
    usersManagement: "Gudanar da Masu Amfani",
    reportsViolations: "Rahotanni da Keta Dokoki",
    verificationRequests: "Buƙatun Tabbatarwa",
    verificationManager: "Mai Gudanar da Tabbatarwa",
    walletMonitoring: "Sa Ido kan Walat",
    adApprovalQueue: "Amincewa da Tallace-tallace",
    adminPanel: "Kwamitin Gudanarwa",

    sos: "SOS na Gaggawa",

    // General
    add: "Ƙara",
    cancel: "Soke",
    save: "Ajiye",
    continue: "Ci gaba",

    yes: "Eh",
    no: "A'a",

    loading: "Ana Lodawa...",
    submit: "Aika",
    next: "Na Gaba",
    back: "Komawa",
    close: "Rufe",

    success: "An Yi Nasara",
    error: "An samu matsala.",
    retry: "Sake Gwadawa",

    settings: "Saituna",
    account: "Asusu",
    privacy: "Sirri",
    security: "Tsaro",

    followers: "Masu Bi",
    following: "Ana Bi",

    verified: "An Tabbatar",
    creator: "Mai Ƙirƙira",
    organization: "Ƙungiya",
    employer: "Mai Daukar Aiki",
    volunteer: "Mai Aikin Sa-kai",
    advocate: "Mai Kare Haƙƙi",
    caregiver: "Mai Kulawa",
    disability: "Nakasa",
    ally: "Abokin Tallafi",
    jobSeeker: "Mai Neman Aiki",

    premium: "Premium",
    upgrade: "Haɓaka",

    viewAll: "Duba Duka",

    noResults: "Ba a sami sakamako ba.",

    comingSoon: "Zai Zo Nan Ba Da Jimawa Ba",
  },
},

  fr: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "La plateforme sociale inclusive pour tous",

    // Authentication
    welcome: "Bienvenue sur Inclura",
    welcomeBack: "Bon retour",

    login: "Se connecter",
    logout: "Se déconnecter",

    signup: "S'inscrire",
    createAccount: "Créer un compte",

    continueWithGoogle:
      "Continuer avec Google",

    email: "Adresse e-mail",
    password: "Mot de passe",
    fullName: "Nom complet",

    // Dashboard
    dashboard: "Tableau de bord",
    home: "Accueil",
    profile: "Profil",
    notifications: "Notifications",
    messages: "Messages",
    wallet: "Portefeuille",

    // Navigation
    search: "Rechercher",
    searchPlaceholder:
      "Rechercher sur Inclura...",

    savedPosts:
      "Publications enregistrées",

    editProfile:
      "Modifier le profil",

    // Language
    language: "Langue",

    // Accessibility
    accessibilityHub:
      "Centre d'accessibilité",

    accessibilityNeeds:
      "Besoins d'accessibilité",

    // Opportunities
    opportunitiesHub:
      "Centre des opportunités",

    careGigs:
      "Services d'assistance",

    mentorHub:
      "Centre de mentorat",

    marketplace:
      "Marché",

    reels:
      "Reels",

    // Verification
    verificationCenter:
      "Centre de vérification",

    // Sidebar
    creatorEarnings:
      "Revenus du créateur",

    creatorMonetization:
      "Monétisation du créateur",

    creatorAnalytics:
      "Analyses du créateur",

    advertiserDashboard:
      "Tableau de bord annonceur",

    adManager:
      "Gestionnaire de publicités",

    enterprise:
      "Entreprise",

    enterpriseAds:
      "Publicités d'entreprise",

    enterpriseCampaigns:
      "Campagnes d'entreprise",

    enterpriseAnalytics:
      "Analyses d'entreprise",

    platformAnalytics:
      "Analyses de la plateforme",

    pricingManager:
      "Gestionnaire des tarifs",

    usersManagement:
      "Gestion des utilisateurs",

    reportsViolations:
      "Signalements et violations",

    verificationRequests:
      "Demandes de vérification",

    verificationManager:
      "Gestionnaire des vérifications",

    walletMonitoring:
      "Surveillance du portefeuille",

    adApprovalQueue:
      "File d'approbation des publicités",

    adminPanel:
      "Panneau d'administration",

    sos:
      "SOS d'urgence",

    // General
    add: "Ajouter",
    cancel: "Annuler",
    save: "Enregistrer",
    continue: "Continuer",

    yes: "Oui",
    no: "Non",

    loading: "Chargement...",
    submit: "Soumettre",
    next: "Suivant",
    back: "Retour",
    close: "Fermer",

    success: "Succès",
    error: "Une erreur est survenue.",
    retry: "Réessayer",

    settings: "Paramètres",
    account: "Compte",
    privacy: "Confidentialité",
    security: "Sécurité",

    followers: "Abonnés",
    following: "Abonnements",

    verified: "Vérifié",
    creator: "Créateur",
    organization: "Organisation",
    employer: "Employeur",
    volunteer: "Bénévole",
    advocate: "Défenseur",
    caregiver: "Aidant",
    disability: "Handicap",
    ally: "Allié",
    jobSeeker: "Chercheur d'emploi",

    premium: "Premium",
    upgrade: "Passer à Premium",

    viewAll: "Voir tout",

    noResults:
      "Aucun résultat trouvé.",

    comingSoon:
      "Bientôt disponible",
  },
},

  ar: {
  translation: {
    // Branding
    appName: "إنكلورا",
    slogan: "منصة التواصل الاجتماعي الشاملة للجميع",

    // Authentication
    welcome: "مرحبًا بك في إنكلورا",
    welcomeBack: "مرحبًا بعودتك",

    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",

    signup: "إنشاء حساب",
    createAccount: "إنشاء حساب",

    continueWithGoogle:
      "المتابعة باستخدام Google",

    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",

    // Dashboard
    dashboard: "لوحة التحكم",
    home: "الرئيسية",
    profile: "الملف الشخصي",
    notifications: "الإشعارات",
    messages: "الرسائل",
    wallet: "المحفظة",

    // Navigation
    search: "بحث",
    searchPlaceholder:
      "ابحث في إنكلورا...",

    savedPosts:
      "المنشورات المحفوظة",

    editProfile:
      "تعديل الملف الشخصي",

    // Language
    language: "اللغة",

    // Accessibility
    accessibilityHub:
      "مركز إمكانية الوصول",

    accessibilityNeeds:
      "احتياجات إمكانية الوصول",

    // Opportunities
    opportunitiesHub:
      "مركز الفرص",

    careGigs:
      "أعمال الرعاية",

    mentorHub:
      "مركز الإرشاد",

    marketplace:
      "السوق",

    reels:
      "ريلز",

    // Verification
    verificationCenter:
      "مركز التحقق",

    // Sidebar
    creatorEarnings:
      "أرباح المنشئ",

    creatorMonetization:
      "تحقيق الدخل",

    creatorAnalytics:
      "تحليلات المنشئ",

    advertiserDashboard:
      "لوحة تحكم المعلن",

    adManager:
      "إدارة الإعلانات",

    enterprise:
      "المؤسسة",

    enterpriseAds:
      "إعلانات المؤسسة",

    enterpriseCampaigns:
      "حملات المؤسسة",

    enterpriseAnalytics:
      "تحليلات المؤسسة",

    platformAnalytics:
      "تحليلات المنصة",

    pricingManager:
      "إدارة الأسعار",

    usersManagement:
      "إدارة المستخدمين",

    reportsViolations:
      "البلاغات والانتهاكات",

    verificationRequests:
      "طلبات التحقق",

    verificationManager:
      "إدارة التحقق",

    walletMonitoring:
      "مراقبة المحفظة",

    adApprovalQueue:
      "قائمة موافقة الإعلانات",

    adminPanel:
      "لوحة الإدارة",

    sos:
      "استغاثة طارئة",

    // General
    add: "إضافة",
    cancel: "إلغاء",
    save: "حفظ",
    continue: "متابعة",

    yes: "نعم",
    no: "لا",

    loading: "جارٍ التحميل...",
    submit: "إرسال",
    next: "التالي",
    back: "رجوع",
    close: "إغلاق",

    success: "تم بنجاح",
    error: "حدث خطأ.",
    retry: "إعادة المحاولة",

    settings: "الإعدادات",
    account: "الحساب",
    privacy: "الخصوصية",
    security: "الأمان",

    followers: "المتابعون",
    following: "يتابع",

    verified: "موثق",
    creator: "منشئ",
    organization: "مؤسسة",
    employer: "صاحب عمل",
    volunteer: "متطوع",
    advocate: "مناصر",
    caregiver: "مقدم رعاية",
    disability: "إعاقة",
    ally: "حليف",
    jobSeeker: "باحث عن عمل",

    premium: "بريميوم",
    upgrade: "الترقية",

    viewAll: "عرض الكل",

    noResults:
      "لا توجد نتائج.",

    comingSoon:
      "قريبًا",
  },
},

  es: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "La plataforma social inclusiva para todos",

    // Authentication
    welcome: "Bienvenido a Inclura",
    welcomeBack: "Bienvenido de nuevo",

    login: "Iniciar sesión",
    logout: "Cerrar sesión",

    signup: "Crear cuenta",
    createAccount: "Crear cuenta",

    continueWithGoogle:
      "Continuar con Google",

    email: "Correo electrónico",
    password: "Contraseña",
    fullName: "Nombre completo",

    // Dashboard
    dashboard: "Panel",
    home: "Inicio",
    profile: "Perfil",
    notifications: "Notificaciones",
    messages: "Mensajes",
    wallet: "Billetera",

    // Navigation
    search: "Buscar",
    searchPlaceholder:
      "Buscar en Inclura...",

    savedPosts:
      "Publicaciones guardadas",

    editProfile:
      "Editar perfil",

    // Language
    language: "Idioma",

    // Accessibility
    accessibilityHub:
      "Centro de accesibilidad",

    accessibilityNeeds:
      "Necesidades de accesibilidad",

    // Opportunities
    opportunitiesHub:
      "Centro de oportunidades",

    careGigs:
      "Trabajos de asistencia",

    mentorHub:
      "Centro de mentoría",

    marketplace:
      "Mercado",

    reels:
      "Reels",

    // Verification
    verificationCenter:
      "Centro de verificación",

    // Sidebar
    creatorEarnings:
      "Ingresos del creador",

    creatorMonetization:
      "Monetización del creador",

    creatorAnalytics:
      "Analíticas del creador",

    advertiserDashboard:
      "Panel del anunciante",

    adManager:
      "Administrador de anuncios",

    enterprise:
      "Empresa",

    enterpriseAds:
      "Anuncios empresariales",

    enterpriseCampaigns:
      "Campañas empresariales",

    enterpriseAnalytics:
      "Analíticas empresariales",

    platformAnalytics:
      "Analíticas de la plataforma",

    pricingManager:
      "Administrador de precios",

    usersManagement:
      "Gestión de usuarios",

    reportsViolations:
      "Reportes e infracciones",

    verificationRequests:
      "Solicitudes de verificación",

    verificationManager:
      "Administrador de verificación",

    walletMonitoring:
      "Monitoreo de billetera",

    adApprovalQueue:
      "Cola de aprobación de anuncios",

    adminPanel:
      "Panel de administración",

    sos:
      "SOS de emergencia",

    // General
    add: "Agregar",
    cancel: "Cancelar",
    save: "Guardar",
    continue: "Continuar",

    yes: "Sí",
    no: "No",

    loading: "Cargando...",
    submit: "Enviar",
    next: "Siguiente",
    back: "Atrás",
    close: "Cerrar",

    success: "Éxito",
    error: "Ha ocurrido un error.",
    retry: "Reintentar",

    settings: "Configuración",
    account: "Cuenta",
    privacy: "Privacidad",
    security: "Seguridad",

    followers: "Seguidores",
    following: "Siguiendo",

    verified: "Verificado",
    creator: "Creador",
    organization: "Organización",
    employer: "Empleador",
    volunteer: "Voluntario",
    advocate: "Defensor",
    caregiver: "Cuidador",
    disability: "Discapacidad",
    ally: "Aliado",
    jobSeeker: "Buscador de empleo",

    premium: "Premium",
    upgrade: "Actualizar",

    viewAll: "Ver todo",

    noResults:
      "No se encontraron resultados.",

    comingSoon:
      "Próximamente",
  },
},

  zh: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "面向所有人的包容性社交平台",

    // Authentication
    welcome: "欢迎来到 Inclura",
    welcomeBack: "欢迎回来",

    login: "登录",
    logout: "退出登录",

    signup: "注册",
    createAccount: "创建账户",

    continueWithGoogle: "使用 Google 继续",

    email: "电子邮箱",
    password: "密码",
    fullName: "姓名",

    // Dashboard
    dashboard: "仪表板",
    home: "首页",
    profile: "个人资料",
    notifications: "通知",
    messages: "消息",
    wallet: "钱包",

    // Navigation
    search: "搜索",
    searchPlaceholder: "搜索 Inclura...",

    savedPosts: "已保存的帖子",

    editProfile: "编辑个人资料",

    // Language
    language: "语言",

    // Accessibility
    accessibilityHub: "无障碍中心",

    accessibilityNeeds: "无障碍需求",

    // Opportunities
    opportunitiesHub: "机会中心",

    careGigs: "护理工作",

    mentorHub: "导师中心",

    marketplace: "市场",

    reels: "短视频",

    // Verification
    verificationCenter: "认证中心",

    // Sidebar
    creatorEarnings: "创作者收益",

    creatorMonetization: "创作者变现",

    creatorAnalytics: "创作者分析",

    advertiserDashboard: "广告主仪表板",

    adManager: "广告管理",

    enterprise: "企业",

    enterpriseAds: "企业广告",

    enterpriseCampaigns: "企业活动",

    enterpriseAnalytics: "企业分析",

    platformAnalytics: "平台分析",

    pricingManager: "价格管理",

    usersManagement: "用户管理",

    reportsViolations: "举报与违规",

    verificationRequests: "认证申请",

    verificationManager: "认证管理",

    walletMonitoring: "钱包监控",

    adApprovalQueue: "广告审核队列",

    adminPanel: "管理面板",

    sos: "紧急求助",

    // General
    add: "添加",
    cancel: "取消",
    save: "保存",
    continue: "继续",

    yes: "是",
    no: "否",

    loading: "加载中...",
    submit: "提交",
    next: "下一步",
    back: "返回",
    close: "关闭",

    success: "成功",
    error: "发生错误。",
    retry: "重试",

    settings: "设置",
    account: "账户",
    privacy: "隐私",
    security: "安全",

    followers: "粉丝",
    following: "关注",

    verified: "已认证",
    creator: "创作者",
    organization: "机构",
    employer: "雇主",
    volunteer: "志愿者",
    advocate: "倡导者",
    caregiver: "护理人员",
    disability: "残障人士",
    ally: "支持者",
    jobSeeker: "求职者",

    premium: "高级会员",
    upgrade: "升级",

    viewAll: "查看全部",

    noResults: "未找到结果。",

    comingSoon: "即将推出",
  },
},

  pt: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "A plataforma social inclusiva para todos",

    // Authentication
    welcome: "Bem-vindo ao Inclura",
    welcomeBack: "Bem-vindo de volta",

    login: "Entrar",
    logout: "Sair",

    signup: "Criar conta",
    createAccount: "Criar conta",

    continueWithGoogle:
      "Continuar com Google",

    email: "Endereço de e-mail",
    password: "Senha",
    fullName: "Nome completo",

    // Dashboard
    dashboard: "Painel",
    home: "Início",
    profile: "Perfil",
    notifications: "Notificações",
    messages: "Mensagens",
    wallet: "Carteira",

    // Navigation
    search: "Pesquisar",
    searchPlaceholder:
      "Pesquisar no Inclura...",

    savedPosts:
      "Publicações salvas",

    editProfile:
      "Editar perfil",

    // Language
    language: "Idioma",

    // Accessibility
    accessibilityHub:
      "Centro de acessibilidade",

    accessibilityNeeds:
      "Necessidades de acessibilidade",

    // Opportunities
    opportunitiesHub:
      "Centro de oportunidades",

    careGigs:
      "Serviços de cuidado",

    mentorHub:
      "Centro de mentoria",

    marketplace:
      "Marketplace",

    reels:
      "Reels",

    // Verification
    verificationCenter:
      "Centro de verificação",

    // Sidebar
    creatorEarnings:
      "Ganhos do criador",

    creatorMonetization:
      "Monetização do criador",

    creatorAnalytics:
      "Análises do criador",

    advertiserDashboard:
      "Painel do anunciante",

    adManager:
      "Gerenciador de anúncios",

    enterprise:
      "Empresa",

    enterpriseAds:
      "Anúncios da empresa",

    enterpriseCampaigns:
      "Campanhas da empresa",

    enterpriseAnalytics:
      "Análises da empresa",

    platformAnalytics:
      "Análises da plataforma",

    pricingManager:
      "Gerenciador de preços",

    usersManagement:
      "Gerenciamento de usuários",

    reportsViolations:
      "Relatórios e violações",

    verificationRequests:
      "Solicitações de verificação",

    verificationManager:
      "Gerenciador de verificação",

    walletMonitoring:
      "Monitoramento da carteira",

    adApprovalQueue:
      "Fila de aprovação de anúncios",

    adminPanel:
      "Painel administrativo",

    sos:
      "SOS de emergência",

    // General
    add: "Adicionar",
    cancel: "Cancelar",
    save: "Salvar",
    continue: "Continuar",

    yes: "Sim",
    no: "Não",

    loading: "Carregando...",
    submit: "Enviar",
    next: "Próximo",
    back: "Voltar",
    close: "Fechar",

    success: "Sucesso",
    error: "Ocorreu um erro.",
    retry: "Tentar novamente",

    settings: "Configurações",
    account: "Conta",
    privacy: "Privacidade",
    security: "Segurança",

    followers: "Seguidores",
    following: "Seguindo",

    verified: "Verificado",
    creator: "Criador",
    organization: "Organização",
    employer: "Empregador",
    volunteer: "Voluntário",
    advocate: "Defensor",
    caregiver: "Cuidador",
    disability: "Deficiência",
    ally: "Aliado",
    jobSeeker: "Candidato a emprego",

    premium: "Premium",
    upgrade: "Atualizar",

    viewAll: "Ver tudo",

    noResults:
      "Nenhum resultado encontrado.",

    comingSoon:
      "Em breve",
  },
},
  
  sw: {
  translation: {
    // Branding
    appName: "Inclura",
    slogan: "Jukwaa la kijamii linalojumuisha kila mtu",

    // Authentication
    welcome: "Karibu Inclura",
    welcomeBack: "Karibu tena",

    login: "Ingia",
    logout: "Ondoka",

    signup: "Fungua Akaunti",
    createAccount: "Fungua Akaunti",

    continueWithGoogle:
      "Endelea na Google",

    email: "Barua pepe",
    password: "Nenosiri",
    fullName: "Jina kamili",

    // Dashboard
    dashboard: "Dashibodi",
    home: "Nyumbani",
    profile: "Wasifu",
    notifications: "Arifa",
    messages: "Ujumbe",
    wallet: "Pochi",

    // Navigation
    search: "Tafuta",
    searchPlaceholder:
      "Tafuta kwenye Inclura...",

    savedPosts:
      "Machapisho yaliyohifadhiwa",

    editProfile:
      "Hariri Wasifu",

    // Language
    language: "Lugha",

    // Accessibility
    accessibilityHub:
      "Kituo cha Upatikanaji",

    accessibilityNeeds:
      "Mahitaji ya Upatikanaji",

    // Opportunities
    opportunitiesHub:
      "Kituo cha Fursa",

    careGigs:
      "Kazi za Huduma",

    mentorHub:
      "Kituo cha Ushauri",

    marketplace:
      "Soko",

    reels:
      "Reels",

    // Verification
    verificationCenter:
      "Kituo cha Uthibitishaji",

    // Sidebar
    creatorEarnings:
      "Mapato ya Mtayarishi",

    creatorMonetization:
      "Mapato ya Mtayarishi",

    creatorAnalytics:
      "Takwimu za Mtayarishi",

    advertiserDashboard:
      "Dashibodi ya Mtangazaji",

    adManager:
      "Msimamizi wa Matangazo",

    enterprise:
      "Biashara",

    enterpriseAds:
      "Matangazo ya Biashara",

    enterpriseCampaigns:
      "Kampeni za Biashara",

    enterpriseAnalytics:
      "Takwimu za Biashara",

    platformAnalytics:
      "Takwimu za Jukwaa",

    pricingManager:
      "Msimamizi wa Bei",

    usersManagement:
      "Usimamizi wa Watumiaji",

    reportsViolations:
      "Ripoti na Ukiukaji",

    verificationRequests:
      "Maombi ya Uthibitishaji",

    verificationManager:
      "Msimamizi wa Uthibitishaji",

    walletMonitoring:
      "Ufuatiliaji wa Pochi",

    adApprovalQueue:
      "Foleni ya Idhini ya Matangazo",

    adminPanel:
      "Jopo la Msimamizi",

    sos:
      "SOS ya Dharura",

    // General
    add: "Ongeza",
    cancel: "Ghairi",
    save: "Hifadhi",
    continue: "Endelea",

    yes: "Ndiyo",
    no: "Hapana",

    loading: "Inapakia...",
    submit: "Wasilisha",
    next: "Ifuatayo",
    back: "Rudi",
    close: "Funga",

    success: "Imefanikiwa",
    error: "Hitilafu imetokea.",
    retry: "Jaribu tena",

    settings: "Mipangilio",
    account: "Akaunti",
    privacy: "Faragha",
    security: "Usalama",

    followers: "Wafuasi",
    following: "Anafuata",

    verified: "Imethibitishwa",
    creator: "Mtayarishi",
    organization: "Shirika",
    employer: "Mwajiri",
    volunteer: "Mjitoleaji",
    advocate: "Mtetezi",
    caregiver: "Mlezi",
    disability: "Ulemavu",
    ally: "Mshirika",
    jobSeeker: "Mtafuta Kazi",

    premium: "Premium",
    upgrade: "Boresha",

    viewAll: "Tazama yote",

    noResults:
      "Hakuna matokeo yaliyopatikana.",

    comingSoon:
      "Inakuja hivi karibuni",
  },
},
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
supportedLngs: [
  "en",
  "fr",
  "yo",
  "ig",
  "ha",
  "sw",
  "pt",
  "es",
  "ar",
  "zh",
],
    debug: false,
    interpolation: {
      escapeValue: false,
    },

    react: {
  useSuspense: false,
},
    
    detection: {
  order: [
    "localStorage",
    "navigator",
    "htmlTag",
    "cookie",
  ],

  lookupLocalStorage:
    "inclura-language",

  caches: [
    "localStorage",
  ],
},
  });

export default i18n;
