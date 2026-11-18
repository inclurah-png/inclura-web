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

    // Reel and post creation
createPost: "Create Post",
createReel: "Create a Reel",
backToReels: "Back to Reels",
createReelInstructions: "Upload a video, add a description, and choose the accessibility features available in your video.",
postPlaceholder: "Share something with the Inclura community...",
postTextLabel: "Post text",
postCategory: "Post category",
postPhoto: "Photo",
postVideo: "Video",
postAccessibilityTags: "Accessibility tags for this post",
postAccessibilityHelp: "Select the accessibility features provided by your content. These tags describe the post; they do not automatically generate captions, alt text, or sign language.",
postChoosePhoto: "Choose a photo",
postChooseVideo: "Choose a video",
postPosting: "Posting...",
postPublish: "Publish",
postAddContent: "Add text, image or video first.",
postOneMediaOnly: "Please create a post with either a photo or a video, not both.",
postLoginAgain: "Please log in again.",
postProfileNameMissing: "Your profile name is not available yet. Please complete your profile name and try again.",
postCreated: "Post created successfully!",
postCreatedScoringWarning: "Your post was created successfully, but creator scoring could not be recorded. Please try again later.",
postFollowupFailed: "Your post was created, but a follow-up operation failed during",
postUnableToComplete: "Unable to complete",

// Posts & Content
translatePost: "Translate post",
showOriginal: "Show original",
showTranslation: "Show translation",
originalLanguage: "Original language",
translated: "Translated",
translationUnavailable: "Translation unavailable",
translating: "Translating...",
translateComments: "Translate comments",
comment: "Comment",
comments: "Comments",
crossPost: "Cross-post",
savePost: "Save post",
sharePost: "Share post",
readPostAloud: "Read post aloud",
postImage: "Post image",
postVideo: "Post video",
alternativeDescription: "Alternative description",
audioDescription: "Audio description",
captions: "Captions",

// Accessibility
accessibilityOptions: "Accessibility options",
screenReader: "Screen reader",
voiceNavigation: "Voice navigation",
signLanguage: "Sign language",
braille: "Braille",
largeText: "Large text",
highContrast: "High contrast",
reducedMotion: "Reduced motion",
keyboardNavigation: "Keyboard navigation",
audioSupport: "Audio support",
visualSupport: "Visual support",
hearingSupport: "Hearing support",
motorSupport: "Motor support",
cognitiveSupport: "Cognitive support",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Display and language",
    preferredLanguage: "Preferred language",
    textSize: "Text size",
    highContrastDesc: "Use a dark background and bright text.",
    reduceMotion: "Reduce motion",
    reduceMotionDesc: "Reduce animated transitions where supported.",
    voiceGuidance: "Voice guidance",
    enableVoiceGuidance: "Enable voice guidance",
    voiceGuidanceDesc: "Enable spoken guidance for supported features.",
    voiceGuidanceActive: "Voice guidance is active because it is enabled or your accessibility profile indicates that it may be helpful.",
    testVoice: "Test voice",
    stopSpeaking: "Stop speaking",
    speechUnsupported: "Speech synthesis is not supported by this browser.",
    accessibilityProfile: "Accessibility profile",
    accessibilityProfileDesc: "Select any needs you want Inclura to take into account.",
    savingAccessibility: "Saving accessibility settings…",
    accessibilitySavedFallback: "Changes take effect immediately. Save status will appear here.",
    blindness: "Blindness",
    lowVision: "Low vision",
    deafness: "Deafness",
    hardOfHearing: "Hard of hearing",
    wheelchairUser: "Wheelchair user",
    mobilityImpairment: "Mobility impairment",
    speechImpairment: "Speech impairment",
    dyslexia: "Dyslexia",
    adhd: "ADHD",
    autism: "Autism",
    accessibilityHubTitle: "Accessibility Hub",
    accessibilityHubIntro: "Explore accessibility settings and support services designed to make Inclura easier to use.",
    accessibilitySections: "Accessibility Hub sections",
    accessibilityRequests: "Accessibility Requests",
    accessibilityResources: "Accessibility Resources",
    accessibilityDirectory: "Accessibility Directory",
    communitySupport: "Community Support",
    emergencyAccessibilityHelp: "Emergency Accessibility Help",
    notConnected: "Not yet connected",
    resourcesNotConnected: "Resources not yet connected",
    directoryNotConnected: "Directory not yet connected",
    communityNotConnected: "Community feature not yet connected",
    emergencyNotConnected: "Emergency workflow not yet connected",
    emergencyDisclaimer: "If someone is in immediate danger, contact the appropriate local emergency service directly. This Inclura section does not dispatch emergency assistance.",
    verificationStatusTitle: "Verification Status",
    trackVerification: "Track your verification progress through the Inclura Fortress Security Engine (IFSE).",
    verificationSummary: "Verification Summary",
    verificationType: "Verification Type",
    status: "Status",
    riskScore: "Risk Score",
    threatLevel: "Threat Level",
    executiveReview: "Executive Review",
    required: "Required",
    notRequired: "Not Required",
    submitted: "Submitted",
    secureUploadedDocuments: "Securely Uploaded Documents",
    privateDocumentsNotice: "Only the application owner or an authorized administrator can open these private files. Access links expire automatically.",
    noDocumentsUploaded: "No verification documents have been uploaded to this application yet.",
    verificationProgress: "IFSE Verification Progress",
    overallProgress: "Overall Progress",
    verificationTimeline: "Verification Timeline",
    noVerificationEvents: "No verification events yet.",
    ifseSecurityEvents: "IFSE Security Events",
    noSecurityEvents: "No IFSE security events recorded.",
    resolved: "Resolved",
    pending: "Pending",
    ifseAuditLogs: "IFSE Audit Logs",
    noAuditLogs: "No audit logs available.",
    ifseProtection: "IFSE Protection",
    openSecurely: "Open securely",
    authorizing: "Authorizing…",
    allowPopups: "Allow pop-ups for Inclura to open your secure document.",
    openingSecureDocument: "Opening secure verification document",
    authorizingDocument: "Authorizing secure document access…",
    verificationCentre: "Verification Centre",
    uploadAdditionalDocuments: "Upload Additional Documents",
    verificationPayment: "Verification Payment",
    vc_intro: "Complete your verification to build trust and unlock more opportunities on Inclura.",
    vc_verificationStatusAccess: "Verification status access",
    vc_trackDescription: "Track your verification progress and review your application status.",
    vc_viewVerificationStatus: "View verification status",
    vc_viewStatus: "View Status",
    vc_uploadDocuments: "Upload Documents",
    vc_continuePayment: "Continue to Payment",
    vc_identityVerification: "Identity Verification",
    vc_documentAuthentication: "Document Authentication",
    vc_aiFraudDetection: "AI Fraud Detection",
    vc_forgeryDetection: "Document Forgery Detection",
    vc_duplicateDetection: "Duplicate Detection",
    vc_paymentProtection: "Payment Protection",
    vc_accessibilityCompliance: "Accessibility Compliance",
    vc_executiveReview: "Executive Review",
    vc_executiveReviewEngine: "Executive Review Engine",
    vc_continuousMonitoring: "Continuous Monitoring",
    vc_waiting: "Waiting",
    vc_workflowIntro: "Follow these steps to complete your verification.",
    vc_step: "Step {{number}}",
    vc_chooseCategory: "Choose a Verification Category",
    vc_securePoweredByIFSE: "Securely powered by IFSE",
    vc_availableTypes: "Available verification types",
    vc_more: "more",
    vc_startVerification: "Start Verification",
    vc_securityLayers: "Security Layers",
    vc_activityOverview: "Verification Activity Overview",
    vc_totalRequests: "Total Requests",
    vc_rejected: "Rejected",
    vc_benefits: "Benefits of Verification",
    vc_process: "Verification Process",
    vc_processChooseCategory: "Choose your verification category",
    vc_processSelectType: "Select a verification type",
    vc_processCompleteForm: "Complete the application form",
    vc_processUploadDocs: "Upload the required documents",
    vc_processPayment: "Complete the verification payment",
    vc_processIFSE: "IFSE performs security checks",
    vc_processReview: "Your application is reviewed",
    vc_processBadge: "Receive your verification badge",
    vc_ifseTitle: "Protected by the Inclura Fortress Security Engine",
    vc_ifseDescription: "IFSE applies security checks and monitoring throughout the verification process.",
    vc_officialBadge: "Official verification badge",
    vc_higherTrust: "Build greater trust with the community",
    vc_searchPriority: "Improved visibility in search",
    vc_impersonationProtection: "Protection against impersonation",
    vc_premiumFeatures: "Access to premium features",
    vc_prioritySupport: "Priority support",
    vc_businessOpportunities: "More business opportunities",
    vc_continuousProtection: "Ongoing account protection",
    vc_badgeCertificate: "Verification Badge & Certificate",
    vc_verificationBadge: "Verification Badge",
    vc_digitalCertificate: "Digital Certificate",
    vc_ifseTrustScore: "IFSE Trust Score",
    vc_securityAlerts: "IFSE Security Alerts",
    vc_identityStatus: "Identity Status",
    vc_documentMonitoring: "Document Monitoring",
    vc_fraudMonitoring: "Fraud Monitoring",
    vc_executiveReviewQueue: "Executive Review Queue",
    vc_renewalMonitor: "Verification Renewal Monitor",
    vc_currentStatus: "Current Status",
    vc_renewalMonitoring: "Renewal Monitoring",
    vc_certificateStatus: "Certificate Status",
    vc_quickActions: "IFSE Quick Actions",
    ifseThreatLow: "Low",
    ifseThreatMedium: "Medium",
    ifseThreatHigh: "High",
    ifseThreatCritical: "Critical",
    returnHome: "Return Home",
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

    // Création de Reels et de publications
createPost: "Créer une publication",
createReel: "Créer un Reel",
backToReels: "Retour aux Reels",
createReelInstructions: "Téléversez une vidéo, ajoutez une description et choisissez les fonctionnalités d’accessibilité disponibles dans votre vidéo.",
postPlaceholder: "Partagez quelque chose avec la communauté Inclura...",
postTextLabel: "Texte de la publication",
postCategory: "Catégorie de publication",
postPhoto: "Photo",
postVideo: "Vidéo",
postAccessibilityTags: "Balises d’accessibilité de cette publication",
postAccessibilityHelp: "Sélectionnez les fonctionnalités d’accessibilité fournies avec votre contenu. Ces balises décrivent la publication ; elles ne génèrent pas automatiquement de sous-titres, de texte alternatif ou de langue des signes.",
postChoosePhoto: "Choisir une photo",
postChooseVideo: "Choisir une vidéo",
postPosting: "Publication en cours...",
postPublish: "Publier",
postAddContent: "Ajoutez d’abord du texte, une image ou une vidéo.",
postOneMediaOnly: "Veuillez créer une publication avec une photo ou une vidéo, mais pas les deux.",
postLoginAgain: "Veuillez vous reconnecter.",
postProfileNameMissing: "Votre nom de profil n’est pas encore disponible. Veuillez compléter votre profil et réessayer.",
postCreated: "Publication créée avec succès !",
postCreatedScoringWarning: "Votre publication a été créée, mais le score du créateur n’a pas pu être enregistré. Veuillez réessayer plus tard.",
postFollowupFailed: "Votre publication a été créée, mais une opération de suivi a échoué pendant",
postUnableToComplete: "Impossible de terminer",

    // Posts & Content
translatePost: "Túmọ̀ ìfìwéránṣẹ́",
showOriginal: "Ṣàfihàn èdè ìpilẹ̀ṣẹ̀",
showTranslation: "Ṣàfihàn ìtumọ̀",
originalLanguage: "Èdè ìpilẹ̀ṣẹ̀",
translated: "Túmọ̀",
translationUnavailable: "Ìtumọ̀ kò sí",
translating: "Ń túmọ̀...",
translateComments: "Túmọ̀ àwọn àlàyé",
comment: "Àlàyé",
comments: "Àwọn àlàyé",
crossPost: "Kọjá-fìwéránṣẹ́",
savePost: "Fipamọ́ ìfìwéránṣẹ́",
sharePost: "Pín ìfìwéránṣẹ́",
readPostAloud: "Ka ìfìwéránṣẹ́ sókè",
postImage: "Àwòrán ìfìwéránṣẹ́",
postVideo: "Fídíò ìfìwéránṣẹ́",
alternativeDescription: "Àpèjúwe àfidípò",
audioDescription: "Àpèjúwe ohun",
captions: "Àkọlé ohun",

// Accessibility
accessibilityOptions: "Àwọn aṣàyàn ààyè rírọrùn",
screenReader: "Olùkà iboju",
voiceNavigation: "Ìṣàwákiri pẹ̀lú ohùn",
signLanguage: "Èdè àwọn adití",
braille: "Ìkọ̀wé àwọn afọ́jú",
largeText: "Ọ̀rọ̀ ńlá",
highContrast: "Ìyàtọ̀ gíga",
reducedMotion: "Ìdínkù ìṣíkà",
keyboardNavigation: "Ìṣàwákiri pẹ̀lú bọ́tìnì",
audioSupport: "Àtìlẹ́yìn ohun",
visualSupport: "Àtìlẹ́yìn ìran",
hearingSupport: "Àtìlẹ́yìn ìgbọ́ran",
motorSupport: "Àtìlẹ́yìn ìṣíkà ara",
cognitiveSupport: "Àtìlẹ́yìn ìmọ̀ àti òye",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Ìfihàn àti èdè",
    preferredLanguage: "Èdè tí o fẹ́",
    textSize: "Ìwọ̀n ọ̀rọ̀",
    highContrastDesc: "Lo ẹ̀yìn dúdú àti ọ̀rọ̀ tó mọ́lẹ̀.",
    reduceMotion: "Dín ìṣíkà kù",
    reduceMotionDesc: "Dín ìṣíkà àfihàn kù níbi tí ó bá ṣeé ṣe.",
    voiceGuidance: "Ìtọ́sọ́nà ohùn",
    enableVoiceGuidance: "Mú ìtọ́sọ́nà ohùn ṣiṣẹ́",
    voiceGuidanceDesc: "Mú ìtọ́sọ́nà tí a ń sọ ṣiṣẹ́ fún àwọn iṣẹ́ tó ṣeé ṣe.",
    voiceGuidanceActive: "Ìtọ́sọ́nà ohùn ti ṣiṣẹ́.",
    testVoice: "Dán ohùn wò",
    stopSpeaking: "Dá ọ̀rọ̀ dúró",
    speechUnsupported: "Ẹ̀rọ aṣàwárí yìí kò ṣe àtìlẹ́yìn fún sísọ ọ̀rọ̀.",
    accessibilityProfile: "Profaili ààyè rírọrùn",
    accessibilityProfileDesc: "Yan àwọn àìní tí o fẹ́ kí Inclura ṣe àkíyèsí.",
    savingAccessibility: "Ń fipamọ́ àwọn ètò ààyè rírọrùn…",
    accessibilitySavedFallback: "Àwọn àyípadà bẹ̀rẹ̀ lẹ́sẹ̀kẹsẹ̀.",
    blindness: "Ìfọ́jú",
    lowVision: "Ìran tí kò lágbára",
    deafness: "Adití",
    hardOfHearing: "Ìgbọ́ran tí kò pé",
    wheelchairUser: "Olùlò kẹ̀kẹ́ arọ",
    mobilityImpairment: "Ìṣòro ìrìn",
    speechImpairment: "Ìṣòro ọ̀rọ̀ sísọ",
    dyslexia: "Dyslexia",
    adhd: "ADHD",
    autism: "Autism",
    accessibilityHubTitle: "Ilé-iṣẹ́ Ààyè Rírọrùn",
    accessibilityHubIntro: "Ṣàyẹ̀wò àwọn ètò àti ìrànlọ́wọ́ tó mú kí Inclura rọrùn láti lò.",
    accessibilitySections: "Àwọn apá Ilé-iṣẹ́ Ààyè Rírọrùn",
    accessibilityRequests: "Àwọn Ìbéèrè Ìrànlọ́wọ́",
    accessibilityResources: "Àwọn Ohun Èlò Ìrànlọ́wọ́",
    accessibilityDirectory: "Àkójọ Àwọn Iṣẹ́",
    communitySupport: "Ìrànlọ́wọ́ Àwùjọ",
    emergencyAccessibilityHelp: "Ìrànlọ́wọ́ Pàjáwìrì",
    notConnected: "A kò tíì so mọ́ ọn",
    resourcesNotConnected: "A kò tíì so àwọn ohun èlò mọ́ ọn",
    directoryNotConnected: "A kò tíì so àkójọ mọ́ ọn",
    communityNotConnected: "A kò tíì so iṣẹ́ àwùjọ mọ́ ọn",
    emergencyNotConnected: "A kò tíì so iṣẹ́ pàjáwìrì mọ́ ọn",
    emergencyDisclaimer: "Bí ẹnikan bá wà nínú ewu lẹ́sẹ̀kẹsẹ̀, kàn sí iṣẹ́ pàjáwìrì agbègbè rẹ̀. Apá Inclura yìí kò fi ìrànlọ́wọ́ pàjáwìrì ránṣẹ́.",
    verificationStatusTitle: "Ipò Ìmúdájú",
    trackVerification: "Tẹ̀lé ìlọsíwájú ìmúdájú rẹ nípasẹ̀ IFSE.",
    verificationSummary: "Àkótán Ìmúdájú",
    verificationType: "Irú Ìmúdájú",
    status: "Ipò",
    riskScore: "Àmì Ewu",
    threatLevel: "Ìpele Ewu",
    executiveReview: "Àyẹ̀wò Olórí",
    required: "Ó yẹ",
    notRequired: "Kò yẹ",
    submitted: "Ti fi ránṣẹ́",
    secureUploadedDocuments: "Àwọn Ìwé Tí A Gbé Sókè Ní Ààbò",
    privateDocumentsNotice: "Olùní ohun èlò tàbí alákóso tó ní àṣẹ nìkan ló lè ṣí àwọn fáìlì àdáni wọ̀nyí.",
    noDocumentsUploaded: "A kò tíì gbé ìwé kankan sókè fún ìbéèrè yìí.",
    verificationProgress: "Ìlọsíwájú Ìmúdájú IFSE",
    overallProgress: "Ìlọsíwájú Gbogbogbò",
    verificationTimeline: "Àkọsílẹ̀ Àkókò Ìmúdájú",
    noVerificationEvents: "Kò sí ìṣẹ̀lẹ̀ ìmúdájú kankan.",
    ifseSecurityEvents: "Àwọn Ìṣẹ̀lẹ̀ Ààbò IFSE",
    noSecurityEvents: "A kò kọ ìṣẹ̀lẹ̀ ààbò IFSE kankan sílẹ̀.",
    resolved: "Ti yanjú",
    pending: "Ń dúró",
    ifseAuditLogs: "Àkọsílẹ̀ Àyẹ̀wò IFSE",
    noAuditLogs: "Kò sí àkọsílẹ̀ àyẹ̀wò.",
    ifseProtection: "Ààbò IFSE",
    openSecurely: "Ṣí ní ààbò",
    authorizing: "Ń fún ní àṣẹ…",
    allowPopups: "Jọ̀wọ́ gba pop-up láàyè kí Inclura lè ṣí ìwé ààbò rẹ.",
    openingSecureDocument: "Ń ṣí ìwé ìmúdájú ààbò",
    authorizingDocument: "Ń fúnni ní àṣẹ láti wọlé sí ìwé ààbò…",
    verificationCentre: "Ilé-iṣẹ́ Ìmúdájú",
    uploadAdditionalDocuments: "Gbé Àwọn Ìwé Mìíràn Sókè",
    verificationPayment: "Ìsanwó Ìmúdájú",
    vc_intro: "Parí ìmúdájú rẹ láti mú ìgbẹ́kẹ̀lé pọ̀ sí i àti láti ṣí àǹfààní sílẹ̀ lórí Inclura.",
    vc_verificationStatusAccess: "Wíwọlé sí ipò ìmúdájú",
    vc_trackDescription: "Tẹ̀lé ìlọsíwájú ìmúdájú rẹ àti ipò ìbéèrè rẹ.",
    vc_viewVerificationStatus: "Wo ipò ìmúdájú",
    vc_viewStatus: "Wo Ipò",
    vc_uploadDocuments: "Gbé Àwọn Ìwé Sókè",
    vc_continuePayment: "Tẹ̀síwájú sí Ìsanwó",
    vc_identityVerification: "Ìmúdájú Ìdánimọ̀",
    vc_documentAuthentication: "Ìjẹ́rìí Ìwé",
    vc_aiFraudDetection: "Ìṣàwárí Ẹ̀tàn AI",
    vc_forgeryDetection: "Ìṣàwárí Ìwé Èké",
    vc_duplicateDetection: "Ìṣàwárí Àtúnsọ",
    vc_paymentProtection: "Ààbò Ìsanwó",
    vc_accessibilityCompliance: "Ìbámu Ààyè Rírọrùn",
    vc_executiveReview: "Àyẹ̀wò Olórí",
    vc_executiveReviewEngine: "Ẹ̀rọ Àyẹ̀wò Olórí",
    vc_continuousMonitoring: "Ìṣọ́ra Títílọ",
    vc_waiting: "Ń dúró",
    vc_workflowIntro: "Tẹ̀lé àwọn ìgbésẹ̀ wọ̀nyí láti parí ìmúdájú rẹ.",
    vc_step: "Ìgbésẹ̀ {{number}}",
    vc_chooseCategory: "Yan Ẹ̀ka Ìmúdájú",
    vc_securePoweredByIFSE: "IFSE ló ń pèsè ààbò rẹ̀",
    vc_availableTypes: "Àwọn irú ìmúdájú tó wà",
    vc_more: "sí i",
    vc_startVerification: "Bẹ̀rẹ̀ Ìmúdájú",
    vc_securityLayers: "Àwọn Ìpele Ààbò",
    vc_activityOverview: "Àkótán Iṣẹ́ Ìmúdájú",
    vc_totalRequests: "Àpapọ̀ Àwọn Ìbéèrè",
    vc_rejected: "A Kọ̀",
    vc_benefits: "Àǹfààní Ìmúdájú",
    vc_process: "Ìlànà Ìmúdájú",
    vc_processChooseCategory: "Yan ẹ̀ka ìmúdájú rẹ",
    vc_processSelectType: "Yan irú ìmúdájú",
    vc_processCompleteForm: "Kún fọ́ọ̀mù ìbéèrè",
    vc_processUploadDocs: "Gbé àwọn ìwé tó yẹ sókè",
    vc_processPayment: "Parí ìsanwó ìmúdájú",
    vc_processIFSE: "IFSE yóò ṣe àyẹ̀wò ààbò",
    vc_processReview: "A ó ṣe àyẹ̀wò ìbéèrè rẹ",
    vc_processBadge: "Gba àmì ìmúdájú rẹ",
    vc_ifseTitle: "Ẹ̀rọ Ààbò Inclura Fortress ń dáàbò bo ọ",
    vc_ifseDescription: "IFSE ń ṣe àyẹ̀wò ààbò àti ìṣọ́ra ní gbogbo ìlànà ìmúdájú.",
    vc_officialBadge: "Àmì ìmúdájú òṣìṣẹ́",
    vc_higherTrust: "Mú ìgbẹ́kẹ̀lé àwùjọ pọ̀ sí i",
    vc_searchPriority: "Ìfarahàn tó dára sí i nínú ìwá kiri",
    vc_impersonationProtection: "Ààbò lọ́wọ́ fífi ara ẹni ṣe ẹlòmíràn",
    vc_premiumFeatures: "Wíwọlé sí àwọn ẹ̀yà pàtàkì",
    vc_prioritySupport: "Ìrànlọ́wọ́ pàtàkì",
    vc_businessOpportunities: "Àǹfààní iṣẹ́-ajé sí i",
    vc_continuousProtection: "Ààbò àkọọlẹ tó ń bá a lọ",
    vc_badgeCertificate: "Àmì Ìmúdájú àti Ìwé-ẹ̀rí",
    vc_verificationBadge: "Àmì Ìmúdájú",
    vc_digitalCertificate: "Ìwé-ẹ̀rí Ẹ̀rọ Ayélujára",
    vc_ifseTrustScore: "Àmì Ìgbẹ́kẹ̀lé IFSE",
    vc_securityAlerts: "Àwọn Ìkìlọ̀ Ààbò IFSE",
    vc_identityStatus: "Ipò Ìdánimọ̀",
    vc_documentMonitoring: "Ìṣọ́ra Ìwé",
    vc_fraudMonitoring: "Ìṣọ́ra Ẹ̀tàn",
    vc_executiveReviewQueue: "Àkójọ Àyẹ̀wò Olórí",
    vc_renewalMonitor: "Ìṣọ́ra Àtúnṣe Ìmúdájú",
    vc_currentStatus: "Ipò Lọ́wọ́lọ́wọ́",
    vc_renewalMonitoring: "Ìṣọ́ra Àtúnṣe",
    vc_certificateStatus: "Ipò Ìwé-ẹ̀rí",
    vc_quickActions: "Àwọn Ìgbésẹ̀ Kíákíá IFSE",
    ifseThreatLow: "Kéré",
    ifseThreatMedium: "Àárín",
    ifseThreatHigh: "Gíga",
    ifseThreatCritical: "Líle koko",
    returnHome: "Padà sí Ilé",
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

    // Posts & Content
translatePost: "Tụgharịa edemede",
showOriginal: "Gosi nke mbụ",
showTranslation: "Gosi ntụgharị",
originalLanguage: "Asụsụ mbụ",
translated: "A tụgharịrị",
translationUnavailable: "Ntụgharị adịghị",
translating: "Na-atụgharị...",
translateComments: "Tụgharịa nkọwa",
comment: "Nkọwa",
comments: "Nkọwa",
crossPost: "Kekọrịta n'ofe",
savePost: "Chekwaa edemede",
sharePost: "Kekọrịta edemede",
readPostAloud: "Gụọ edemede n'olu",
postImage: "Foto edemede",
postVideo: "Vidiyo edemede",
alternativeDescription: "Nkọwa ọzọ",
audioDescription: "Nkọwa ọdịyo",
captions: "Ndepụta okwu",

// Accessibility
accessibilityOptions: "Nhọrọ nnweta",
screenReader: "Onye na-agụ ihuenyo",
voiceNavigation: "Nnyagharị olu",
signLanguage: "Asụsụ ogbi",
braille: "Ihe odide ndị kpuru ìsì",
largeText: "Edemede buru ibu",
highContrast: "Ọdịiche dị elu",
reducedMotion: "Mmegharị belatara",
keyboardNavigation: "Nnyagharị keyboard",
audioSupport: "Nkwado ọdịyo",
visualSupport: "Nkwado ịhụ ụzọ",
hearingSupport: "Nkwado ịnụ ihe",
motorSupport: "Nkwado mmegharị ahụ",
cognitiveSupport: "Nkwado nghọta",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Ngosipụta na asụsụ",
    preferredLanguage: "Asụsụ ị họọrọ",
    textSize: "Nha ederede",
    highContrastDesc: "Jiri okirikiri gbara ọchịchịrị na ederede na-egbuke egbuke.",
    reduceMotion: "Belata mmegharị",
    reduceMotionDesc: "Belata mmegharị eserese ebe o kwere omume.",
    voiceGuidance: "Nduzi olu",
    enableVoiceGuidance: "Gbanye nduzi olu",
    voiceGuidanceDesc: "Gbanye nduzi a na-ekwu maka ọrụ ndị akwadoro.",
    voiceGuidanceActive: "Nduzi olu na-arụ ọrụ.",
    testVoice: "Nwalee olu",
    stopSpeaking: "Kwụsị ikwu okwu",
    speechUnsupported: "Ihe nchọgharị a anaghị akwado ịgụpụta okwu.",
    accessibilityProfile: "Profaịlụ nnweta",
    accessibilityProfileDesc: "Họrọ mkpa ịchọrọ ka Inclura tụlee.",
    savingAccessibility: "A na-echekwa ntọala nnweta…",
    accessibilitySavedFallback: "Mgbanwe na-arụ ọrụ ozugbo.",
    blindness: "Ìsì",
    lowVision: "Anya adịghị ike",
    deafness: "Ịdị ogbi",
    hardOfHearing: "Ịnụ ihe siri ike",
    wheelchairUser: "Onye na-eji oche nkwagharị",
    mobilityImpairment: "Nsogbu ijegharị",
    speechImpairment: "Nsogbu ikwu okwu",
    dyslexia: "Dyslexia",
    adhd: "ADHD",
    autism: "Autism",
    accessibilityHubTitle: "Ebe Nnweta",
    accessibilityHubIntro: "Chọpụta ntọala na enyemaka ga-eme ka Inclura dị mfe iji.",
    accessibilitySections: "Akụkụ Ebe Nnweta",
    accessibilityRequests: "Arịrịọ Enyemaka",
    accessibilityResources: "Akụrụngwa Nnweta",
    accessibilityDirectory: "Ndepụta Ọrụ Nnweta",
    communitySupport: "Nkwado Obodo",
    emergencyAccessibilityHelp: "Enyemaka Mberede",
    notConnected: "Ejikọbeghị ya",
    resourcesNotConnected: "Ejikọbeghị akụrụngwa",
    directoryNotConnected: "Ejikọbeghị ndekọ",
    communityNotConnected: "Ejikọbeghị ọrụ obodo",
    emergencyNotConnected: "Ejikọbeghị usoro mberede",
    emergencyDisclaimer: "Ọ bụrụ na mmadụ nọ n'ihe egwu ozugbo, kpọtụrụ ọrụ mberede mpaghara. Akụkụ Inclura a anaghị eziga enyemaka mberede.",
    verificationStatusTitle: "Ọnọdụ Nkwenye",
    trackVerification: "Soro ọganihu nkwenye gị site na IFSE.",
    verificationSummary: "Nchịkọta Nkwenye",
    verificationType: "Ụdị Nkwenye",
    status: "Ọnọdụ",
    riskScore: "Akara Ihe Ize Ndụ",
    threatLevel: "Ọkwa Egwu",
    executiveReview: "Nyocha Ndị Isi",
    required: "Achọrọ",
    notRequired: "Achọghị",
    submitted: "E tinyela ya",
    secureUploadedDocuments: "Akwụkwọ Ebulitere N'ụzọ Nchekwa",
    privateDocumentsNotice: "Naanị onye nwe ngwa ma ọ bụ onye nchịkwa nwere ikike nwere ike imepe faịlụ nzuzo ndị a.",
    noDocumentsUploaded: "Ebugobeghị akwụkwọ ọ bụla maka ngwa a.",
    verificationProgress: "Ọganihu Nkwenye IFSE",
    overallProgress: "Ọganihu N'ozuzu",
    verificationTimeline: "Usoro Oge Nkwenye",
    noVerificationEvents: "Enweghị ihe omume nkwenye.",
    ifseSecurityEvents: "Ihe Omume Nchekwa IFSE",
    noSecurityEvents: "Edekọbeghị ihe omume nchekwa IFSE.",
    resolved: "Edoziela",
    pending: "Na-eche",
    ifseAuditLogs: "Ndekọ Nnyocha IFSE",
    noAuditLogs: "Enweghị ndekọ nyocha.",
    ifseProtection: "Nchekwa IFSE",
    openSecurely: "Mepee n'ụzọ nchekwa",
    authorizing: "Na-enye ikike…",
    allowPopups: "Kwe ka pop-up mepee akwụkwọ nchekwa gị.",
    openingSecureDocument: "Na-emepe akwụkwọ nkwenye nchekwa",
    authorizingDocument: "Na-enye ikike ịnweta akwụkwọ nchekwa…",
    verificationCentre: "Ebe Nkwenye",
    uploadAdditionalDocuments: "Bulite Akwụkwọ Ndị Ọzọ",
    verificationPayment: "Ịkwụ Ụgwọ Nkwenye",
    vc_intro: "Mechaa nkwenye gị iji wulite ntụkwasị obi ma nweta ohere ndị ọzọ na Inclura.",
    vc_verificationStatusAccess: "Nweta ọnọdụ nkwenye",
    vc_trackDescription: "Soro ọganihu nkwenye gị na ọnọdụ arịrịọ gị.",
    vc_viewVerificationStatus: "Lelee ọnọdụ nkwenye",
    vc_viewStatus: "Lelee Ọnọdụ",
    vc_uploadDocuments: "Bulite Akwụkwọ",
    vc_continuePayment: "Gaa n'ihu na Ịkwụ Ụgwọ",
    vc_identityVerification: "Nkwenye Njirimara",
    vc_documentAuthentication: "Nyocha Akwụkwọ",
    vc_aiFraudDetection: "Nchọpụta Aghụghọ AI",
    vc_forgeryDetection: "Nchọpụta Akwụkwọ Adịgboroja",
    vc_duplicateDetection: "Nchọpụta Oyiri",
    vc_paymentProtection: "Nchekwa Ịkwụ Ụgwọ",
    vc_accessibilityCompliance: "Nrube Isi Iwu Ịnweta",
    vc_executiveReview: "Nyocha Ndị Isi",
    vc_executiveReviewEngine: "Igwe Nyocha Ndị Isi",
    vc_continuousMonitoring: "Nlekọta Na-aga n'ihu",
    vc_waiting: "Na-eche",
    vc_workflowIntro: "Soro usoro ndị a iji mechaa nkwenye gị.",
    vc_step: "Nzọụkwụ {{number}}",
    vc_chooseCategory: "Họrọ Udi Nkwenye",
    vc_securePoweredByIFSE: "IFSE na-enye nchebe",
    vc_availableTypes: "Ụdị nkwenye dị",
    vc_more: "ọzọ",
    vc_startVerification: "Malite Nkwenye",
    vc_securityLayers: "Ọkwa Nchebe",
    vc_activityOverview: "Nchịkọta Ọrụ Nkwenye",
    vc_totalRequests: "Ngụkọta Arịrịọ",
    vc_rejected: "Ajụrụ",
    vc_benefits: "Uru Nkwenye",
    vc_process: "Usoro Nkwenye",
    vc_processChooseCategory: "Họrọ udi nkwenye gị",
    vc_processSelectType: "Họrọ ụdị nkwenye",
    vc_processCompleteForm: "Mejupụta fọm arịrịọ",
    vc_processUploadDocs: "Bulite akwụkwọ achọrọ",
    vc_processPayment: "Mechaa ịkwụ ụgwọ nkwenye",
    vc_processIFSE: "IFSE ga-eme nyocha nchebe",
    vc_processReview: "A ga-enyocha arịrịọ gị",
    vc_processBadge: "Nweta akara nkwenye gị",
    vc_ifseTitle: "Inclura Fortress Security Engine na-echebe gị",
    vc_ifseDescription: "IFSE na-eme nyocha na nlekọta nchebe n'oge usoro nkwenye niile.",
    vc_officialBadge: "Akara nkwenye gọọmentị",
    vc_higherTrust: "Mee ka ntụkwasị obi obodo bawanye",
    vc_searchPriority: "Ngosipụta ka mma na ọchụchọ",
    vc_impersonationProtection: "Nchebe pụọ n'ime ka à ga-asị na ị bụ onye ọzọ",
    vc_premiumFeatures: "Nweta atụmatụ pụrụ iche",
    vc_prioritySupport: "Nkwado dị mkpa",
    vc_businessOpportunities: "Ohere azụmahịa ndị ọzọ",
    vc_continuousProtection: "Nchekwa akaụntụ na-aga n'ihu",
    vc_badgeCertificate: "Akara Nkwenye na Asambodo",
    vc_verificationBadge: "Akara Nkwenye",
    vc_digitalCertificate: "Asambodo Dijitalụ",
    vc_ifseTrustScore: "Akara Ntụkwasị Obi IFSE",
    vc_securityAlerts: "Ịdọ Aka Nchebe IFSE",
    vc_identityStatus: "Ọnọdụ Njirimara",
    vc_documentMonitoring: "Nlekọta Akwụkwọ",
    vc_fraudMonitoring: "Nlekọta Aghụghọ",
    vc_executiveReviewQueue: "Ahịrị Nyocha Ndị Isi",
    vc_renewalMonitor: "Nlekọta Mmeghari Nkwenye",
    vc_currentStatus: "Ọnọdụ Ugbu a",
    vc_renewalMonitoring: "Nlekọta Mmeghari",
    vc_certificateStatus: "Ọnọdụ Asambodo",
    vc_quickActions: "Omume Ngwa Ngwa IFSE",
    ifseThreatLow: "Dị Ala",
    ifseThreatMedium: "Ọkara",
    ifseThreatHigh: "Dị Elu",
    ifseThreatCritical: "Dị Egwu Ukwu",
    returnHome: "Laghachi n'ụlọ",
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

    // Posts & Content
translatePost: "Fassara rubutu",
showOriginal: "Nuna asali",
showTranslation: "Nuna fassara",
originalLanguage: "Harshen asali",
translated: "An fassara",
translationUnavailable: "Ba a samun fassarar",
translating: "Ana fassarawa...",
translateComments: "Fassara sharhi",
comment: "Sharhi",
comments: "Sharhi",
crossPost: "Raba a wasu wurare",
savePost: "Ajiye rubutu",
sharePost: "Raba rubutu",
readPostAloud: "Karanta rubutu da murya",
postImage: "Hoton rubutu",
postVideo: "Bidiyon rubutu",
alternativeDescription: "Madadin bayani",
audioDescription: "Bayanin sauti",
captions: "Rubutun bidiyo",

// Accessibility
accessibilityOptions: "Zaɓuɓɓukan samun dama",
screenReader: "Mai karanta allo",
voiceNavigation: "Kewayawa da murya",
signLanguage: "Harshen kurame",
braille: "Rubutun makafi",
largeText: "Babban rubutu",
highContrast: "Babban bambanci",
reducedMotion: "Rage motsi",
keyboardNavigation: "Kewayawa da maballin kwamfuta",
audioSupport: "Tallafin sauti",
visualSupport: "Tallafin gani",
hearingSupport: "Tallafin ji",
motorSupport: "Tallafin motsin jiki",
cognitiveSupport: "Tallafin fahimta",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Nuni da harshe",
    preferredLanguage: "Harshen da aka fi so",
    textSize: "Girman rubutu",
    highContrastDesc: "Yi amfani da duhun bango da rubutu mai haske.",
    reduceMotion: "Rage motsi",
    reduceMotionDesc: "Rage motsin abubuwa idan yana yiwuwa.",
    voiceGuidance: "Jagorar murya",
    enableVoiceGuidance: "Kunna jagorar murya",
    voiceGuidanceDesc: "Kunna jagorar magana ga ayyukan da ake tallafawa.",
    voiceGuidanceActive: "Jagorar murya tana aiki.",
    testVoice: "Gwada murya",
    stopSpeaking: "Dakatar da magana",
    speechUnsupported: "Wannan burauzar ba ta tallafawa karanta magana.",
    accessibilityProfile: "Bayanan bukatun samun dama",
    accessibilityProfileDesc: "Zaɓi bukatun da kake so Inclura ta kula da su.",
    savingAccessibility: "Ana adana saitunan samun dama…",
    accessibilitySavedFallback: "Canje-canje suna aiki nan take.",
    blindness: "Makanta",
    lowVision: "Rashin gani sosai",
    deafness: "Kurame",
    hardOfHearing: "Wahalar ji",
    wheelchairUser: "Mai amfani da keken guragu",
    mobilityImpairment: "Matsalar motsi",
    speechImpairment: "Matsalar magana",
    dyslexia: "Dyslexia",
    adhd: "ADHD",
    autism: "Autism",
    accessibilityHubTitle: "Cibiyar Samun Dama",
    accessibilityHubIntro: "Duba saituna da taimako da ke sauƙaƙa amfani da Inclura.",
    accessibilitySections: "Sassan Cibiyar Samun Dama",
    accessibilityRequests: "Buƙatun Taimako",
    accessibilityResources: "Kayan Taimako",
    accessibilityDirectory: "Jerin Ayyukan Samun Dama",
    communitySupport: "Tallafin Al'umma",
    emergencyAccessibilityHelp: "Taimakon Gaggawa",
    notConnected: "Ba a haɗa ba tukuna",
    resourcesNotConnected: "Ba a haɗa kayan taimako ba",
    directoryNotConnected: "Ba a haɗa kundin ba",
    communityNotConnected: "Ba a haɗa aikin al'umma ba",
    emergencyNotConnected: "Ba a haɗa tsarin gaggawa ba",
    emergencyDisclaimer: "Idan wani yana cikin haɗari nan take, tuntuɓi hukumar gaggawa ta yankinku. Wannan sashe na Inclura ba ya aika agajin gaggawa.",
    verificationStatusTitle: "Matsayin Tabbatarwa",
    trackVerification: "Bi ci gaban tabbatarwarka ta IFSE.",
    verificationSummary: "Takaitaccen Tabbatarwa",
    verificationType: "Nau'in Tabbatarwa",
    status: "Matsayi",
    riskScore: "Makin Haɗari",
    threatLevel: "Matakin Barazana",
    executiveReview: "Binciken Shugabanci",
    required: "Ana buƙata",
    notRequired: "Ba a buƙata ba",
    submitted: "An aika",
    secureUploadedDocuments: "Takardun da aka ɗora cikin tsaro",
    privateDocumentsNotice: "Mai aikace-aikacen ko mai gudanarwa mai izini ne kawai zai iya buɗe waɗannan fayiloli na sirri.",
    noDocumentsUploaded: "Ba a ɗora takardu ga wannan aikace-aikacen ba tukuna.",
    verificationProgress: "Ci gaban Tabbatarwa na IFSE",
    overallProgress: "Jimillar Ci gaba",
    verificationTimeline: "Jadawalin Tabbatarwa",
    noVerificationEvents: "Babu wani taron tabbatarwa tukuna.",
    ifseSecurityEvents: "Abubuwan Tsaron IFSE",
    noSecurityEvents: "Ba a rubuta abubuwan tsaron IFSE ba.",
    resolved: "An warware",
    pending: "Ana jira",
    ifseAuditLogs: "Bayanan Binciken IFSE",
    noAuditLogs: "Babu bayanan bincike.",
    ifseProtection: "Kariyar IFSE",
    openSecurely: "Buɗe cikin tsaro",
    authorizing: "Ana ba da izini…",
    allowPopups: "Ba da damar pop-up domin Inclura ta buɗe takardarka cikin tsaro.",
    openingSecureDocument: "Ana buɗe takardar tabbatarwa cikin tsaro",
    authorizingDocument: "Ana ba da izinin shiga takarda…",
    verificationCentre: "Cibiyar Tabbatarwa",
    uploadAdditionalDocuments: "Ɗora ƙarin takardu",
    verificationPayment: "Biyan Kuɗin Tabbatarwa",
    vc_intro: "Kammala tantancewa don gina amana da samun karin damammaki a Inclura.",
    vc_verificationStatusAccess: "Samun matsayin tantancewa",
    vc_trackDescription: "Bibiyi ci gaban tantancewarka da matsayin bukatarka.",
    vc_viewVerificationStatus: "Duba matsayin tantancewa",
    vc_viewStatus: "Duba Matsayi",
    vc_uploadDocuments: "Loda Takardu",
    vc_continuePayment: "Ci gaba zuwa Biyan Kuɗi",
    vc_identityVerification: "Tantance Shaida",
    vc_documentAuthentication: "Tabbatar da Takardu",
    vc_aiFraudDetection: "Gano Zamba ta AI",
    vc_forgeryDetection: "Gano Takardun Jabu",
    vc_duplicateDetection: "Gano Kwafi",
    vc_paymentProtection: "Kariyar Biyan Kuɗi",
    vc_accessibilityCompliance: "Bin Ka'idojin Sauƙin Amfani",
    vc_executiveReview: "Binciken Manyan Jami'ai",
    vc_executiveReviewEngine: "Tsarin Binciken Manyan Jami'ai",
    vc_continuousMonitoring: "Sa Ido Mai Ci Gaba",
    vc_waiting: "Ana jira",
    vc_workflowIntro: "Bi waɗannan matakai don kammala tantancewarka.",
    vc_step: "Mataki na {{number}}",
    vc_chooseCategory: "Zaɓi Rukunin Tantancewa",
    vc_securePoweredByIFSE: "IFSE ne ke samar da kariya",
    vc_availableTypes: "Nau'o'in tantancewa da ake da su",
    vc_more: "ƙari",
    vc_startVerification: "Fara Tantancewa",
    vc_securityLayers: "Matakan Tsaro",
    vc_activityOverview: "Takaitaccen Ayyukan Tantancewa",
    vc_totalRequests: "Jimillar Buƙatu",
    vc_rejected: "An ƙi",
    vc_benefits: "Amfanin Tantancewa",
    vc_process: "Tsarin Tantancewa",
    vc_processChooseCategory: "Zaɓi rukunin tantancewarka",
    vc_processSelectType: "Zaɓi nau'in tantancewa",
    vc_processCompleteForm: "Cika fom ɗin buƙata",
    vc_processUploadDocs: "Loda takardun da ake buƙata",
    vc_processPayment: "Kammala biyan kuɗin tantancewa",
    vc_processIFSE: "IFSE zai gudanar da binciken tsaro",
    vc_processReview: "Za a duba buƙatarka",
    vc_processBadge: "Sami tambarin tantancewarka",
    vc_ifseTitle: "Inclura Fortress Security Engine na kare ka",
    vc_ifseDescription: "IFSE na gudanar da binciken tsaro da sa ido a duk lokacin tantancewa.",
    vc_officialBadge: "Tambarin tantancewa na hukuma",
    vc_higherTrust: "Ƙara amincewar al'umma",
    vc_searchPriority: "Ingantaccen bayyanar sakamakon bincike",
    vc_impersonationProtection: "Kariya daga kwaikwayon kai",
    vc_premiumFeatures: "Samun fasaloli na musamman",
    vc_prioritySupport: "Tallafin fifiko",
    vc_businessOpportunities: "Ƙarin damar kasuwanci",
    vc_continuousProtection: "Kariyar asusu mai ci gaba",
    vc_badgeCertificate: "Alamar Tantancewa da Takardar Shaida",
    vc_verificationBadge: "Alamar Tantancewa",
    vc_digitalCertificate: "Takardar Shaida ta Dijital",
    vc_ifseTrustScore: "Makin Amincewa na IFSE",
    vc_securityAlerts: "Faɗakarwar Tsaron IFSE",
    vc_identityStatus: "Matsayin Shaida",
    vc_documentMonitoring: "Sa Ido kan Takardu",
    vc_fraudMonitoring: "Sa Ido kan Zamba",
    vc_executiveReviewQueue: "Jerin Binciken Manyan Jami'ai",
    vc_renewalMonitor: "Sa Ido kan Sabunta Tantancewa",
    vc_currentStatus: "Matsayi na Yanzu",
    vc_renewalMonitoring: "Sa Ido kan Sabuntawa",
    vc_certificateStatus: "Matsayin Takardar Shaida",
    vc_quickActions: "Ayyukan Gaggawa na IFSE",
    ifseThreatLow: "Ƙasa",
    ifseThreatMedium: "Matsakaici",
    ifseThreatHigh: "Mai yawa",
    ifseThreatCritical: "Mai tsanani",
    returnHome: "Komawa Gida",
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

    // Posts & Content
translatePost: "Traduire la publication",
showOriginal: "Afficher l'original",
showTranslation: "Afficher la traduction",
originalLanguage: "Langue d'origine",
translated: "Traduit",
translationUnavailable: "Traduction indisponible",
translating: "Traduction en cours...",
translateComments: "Traduire les commentaires",
comment: "Commenter",
comments: "Commentaires",
crossPost: "Republication",
savePost: "Enregistrer la publication",
sharePost: "Partager la publication",
readPostAloud: "Lire la publication à voix haute",
postImage: "Image de la publication",
postVideo: "Vidéo de la publication",
alternativeDescription: "Description alternative",
audioDescription: "Description audio",
captions: "Sous-titres",

// Accessibility
accessibilityOptions: "Options d'accessibilité",
screenReader: "Lecteur d'écran",
voiceNavigation: "Navigation vocale",
signLanguage: "Langue des signes",
braille: "Braille",
largeText: "Texte agrandi",
highContrast: "Contraste élevé",
reducedMotion: "Mouvement réduit",
keyboardNavigation: "Navigation au clavier",
audioSupport: "Assistance audio",
visualSupport: "Assistance visuelle",
hearingSupport: "Assistance auditive",
motorSupport: "Assistance motrice",
cognitiveSupport: "Assistance cognitive",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Affichage et langue",
    preferredLanguage: "Langue préférée",
    textSize: "Taille du texte",
    highContrastDesc: "Utiliser un fond sombre et un texte lumineux.",
    reduceMotion: "Réduire les animations",
    reduceMotionDesc: "Réduire les transitions animées lorsque cela est possible.",
    voiceGuidance: "Guidage vocal",
    enableVoiceGuidance: "Activer le guidage vocal",
    voiceGuidanceDesc: "Activer les indications vocales pour les fonctions prises en charge.",
    voiceGuidanceActive: "Le guidage vocal est actif.",
    testVoice: "Tester la voix",
    stopSpeaking: "Arrêter la lecture",
    speechUnsupported: "Ce navigateur ne prend pas en charge la synthèse vocale.",
    accessibilityProfile: "Profil d’accessibilité",
    accessibilityProfileDesc: "Sélectionnez les besoins dont Inclura doit tenir compte.",
    savingAccessibility: "Enregistrement des paramètres d’accessibilité…",
    accessibilitySavedFallback: "Les modifications prennent effet immédiatement.",
    blindness: "Cécité",
    lowVision: "Basse vision",
    deafness: "Surdité",
    hardOfHearing: "Malentendance",
    wheelchairUser: "Utilisateur de fauteuil roulant",
    mobilityImpairment: "Mobilité réduite",
    speechImpairment: "Trouble de la parole",
    dyslexia: "Dyslexie",
    adhd: "TDAH",
    autism: "Autisme",
    accessibilityHubTitle: "Centre d’accessibilité",
    accessibilityHubIntro: "Découvrez les paramètres et services d’assistance qui facilitent l’utilisation d’Inclura.",
    accessibilitySections: "Sections du centre d’accessibilité",
    accessibilityRequests: "Demandes d’assistance",
    accessibilityResources: "Ressources d’accessibilité",
    accessibilityDirectory: "Répertoire d’accessibilité",
    communitySupport: "Soutien communautaire",
    emergencyAccessibilityHelp: "Aide d’urgence à l’accessibilité",
    notConnected: "Pas encore connecté",
    resourcesNotConnected: "Ressources non connectées",
    directoryNotConnected: "Répertoire non connecté",
    communityNotConnected: "Fonction communautaire non connectée",
    emergencyNotConnected: "Fonction d’urgence non connectée",
    emergencyDisclaimer: "En cas de danger immédiat, contactez directement les services d’urgence locaux. Cette section d’Inclura n’envoie pas de secours.",
    verificationStatusTitle: "État de la vérification",
    trackVerification: "Suivez votre vérification avec le moteur IFSE.",
    verificationSummary: "Résumé de la vérification",
    verificationType: "Type de vérification",
    status: "Statut",
    riskScore: "Score de risque",
    threatLevel: "Niveau de menace",
    executiveReview: "Examen de direction",
    required: "Requis",
    notRequired: "Non requis",
    submitted: "Envoyé",
    secureUploadedDocuments: "Documents téléversés de manière sécurisée",
    privateDocumentsNotice: "Seul le propriétaire de la demande ou un administrateur autorisé peut ouvrir ces fichiers privés.",
    noDocumentsUploaded: "Aucun document n’a encore été téléversé pour cette demande.",
    verificationProgress: "Progression de la vérification IFSE",
    overallProgress: "Progression globale",
    verificationTimeline: "Chronologie de vérification",
    noVerificationEvents: "Aucun événement de vérification pour le moment.",
    ifseSecurityEvents: "Événements de sécurité IFSE",
    noSecurityEvents: "Aucun événement de sécurité IFSE enregistré.",
    resolved: "Résolu",
    pending: "En attente",
    ifseAuditLogs: "Journaux d’audit IFSE",
    noAuditLogs: "Aucun journal d’audit disponible.",
    ifseProtection: "Protection IFSE",
    openSecurely: "Ouvrir en toute sécurité",
    authorizing: "Autorisation…",
    allowPopups: "Autorisez les fenêtres contextuelles pour ouvrir votre document sécurisé.",
    openingSecureDocument: "Ouverture du document sécurisé",
    authorizingDocument: "Autorisation de l’accès au document…",
    verificationCentre: "Centre de vérification",
    uploadAdditionalDocuments: "Téléverser d’autres documents",
    verificationPayment: "Paiement de vérification",
    vc_intro: "Effectuez votre vérification pour renforcer la confiance et accéder à davantage d’opportunités sur Inclura.",
    vc_verificationStatusAccess: "Accès au statut de vérification",
    vc_trackDescription: "Suivez l’avancement de votre vérification et consultez le statut de votre demande.",
    vc_viewVerificationStatus: "Voir le statut de vérification",
    vc_viewStatus: "Voir le statut",
    vc_uploadDocuments: "Téléverser des documents",
    vc_continuePayment: "Continuer vers le paiement",
    vc_identityVerification: "Vérification d’identité",
    vc_documentAuthentication: "Authentification des documents",
    vc_aiFraudDetection: "Détection de fraude par IA",
    vc_forgeryDetection: "Détection de documents falsifiés",
    vc_duplicateDetection: "Détection des doublons",
    vc_paymentProtection: "Protection des paiements",
    vc_accessibilityCompliance: "Conformité à l’accessibilité",
    vc_executiveReview: "Examen par la direction",
    vc_executiveReviewEngine: "Moteur d’examen par la direction",
    vc_continuousMonitoring: "Surveillance continue",
    vc_waiting: "En attente",
    vc_workflowIntro: "Suivez ces étapes pour terminer votre vérification.",
    vc_step: "Étape {{number}}",
    vc_chooseCategory: "Choisir une catégorie de vérification",
    vc_securePoweredByIFSE: "Sécurisé par IFSE",
    vc_availableTypes: "Types de vérification disponibles",
    vc_more: "de plus",
    vc_startVerification: "Commencer la vérification",
    vc_securityLayers: "Couches de sécurité",
    vc_activityOverview: "Aperçu de l’activité de vérification",
    vc_totalRequests: "Nombre total de demandes",
    vc_rejected: "Rejetées",
    vc_benefits: "Avantages de la vérification",
    vc_process: "Processus de vérification",
    vc_processChooseCategory: "Choisissez votre catégorie de vérification",
    vc_processSelectType: "Sélectionnez un type de vérification",
    vc_processCompleteForm: "Remplissez le formulaire de demande",
    vc_processUploadDocs: "Téléversez les documents requis",
    vc_processPayment: "Effectuez le paiement de vérification",
    vc_processIFSE: "IFSE effectue les contrôles de sécurité",
    vc_processReview: "Votre demande est examinée",
    vc_processBadge: "Recevez votre badge de vérification",
    vc_ifseTitle: "Protégé par l’Inclura Fortress Security Engine",
    vc_ifseDescription: "IFSE applique des contrôles et une surveillance de sécurité tout au long du processus.",
    vc_officialBadge: "Badge officiel de vérification",
    vc_higherTrust: "Renforcez la confiance de la communauté",
    vc_searchPriority: "Meilleure visibilité dans les recherches",
    vc_impersonationProtection: "Protection contre l’usurpation d’identité",
    vc_premiumFeatures: "Accès aux fonctionnalités premium",
    vc_prioritySupport: "Assistance prioritaire",
    vc_businessOpportunities: "Davantage d’opportunités commerciales",
    vc_continuousProtection: "Protection continue du compte",
    vc_badgeCertificate: "Badge et certificat de vérification",
    vc_verificationBadge: "Badge de vérification",
    vc_digitalCertificate: "Certificat numérique",
    vc_ifseTrustScore: "Score de confiance IFSE",
    vc_securityAlerts: "Alertes de sécurité IFSE",
    vc_identityStatus: "Statut de l’identité",
    vc_documentMonitoring: "Surveillance des documents",
    vc_fraudMonitoring: "Surveillance de la fraude",
    vc_executiveReviewQueue: "File d’examen de la direction",
    vc_renewalMonitor: "Suivi du renouvellement de vérification",
    vc_currentStatus: "Statut actuel",
    vc_renewalMonitoring: "Suivi du renouvellement",
    vc_certificateStatus: "Statut du certificat",
    vc_quickActions: "Actions rapides IFSE",
    ifseThreatLow: "Faible",
    ifseThreatMedium: "Modéré",
    ifseThreatHigh: "Élevé",
    ifseThreatCritical: "Critique",
    returnHome: "Retour à l’accueil",
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

    // Posts & Content
translatePost: "ترجمة المنشور",
showOriginal: "عرض الأصل",
showTranslation: "عرض الترجمة",
originalLanguage: "اللغة الأصلية",
translated: "تمت الترجمة",
translationUnavailable: "الترجمة غير متاحة",
translating: "جارٍ الترجمة...",
translateComments: "ترجمة التعليقات",
comment: "تعليق",
comments: "التعليقات",
crossPost: "إعادة النشر",
savePost: "حفظ المنشور",
sharePost: "مشاركة المنشور",
readPostAloud: "قراءة المنشور بصوت عالٍ",
postImage: "صورة المنشور",
postVideo: "فيديو المنشور",
alternativeDescription: "وصف بديل",
audioDescription: "وصف صوتي",
captions: "التسميات التوضيحية",

// Accessibility
accessibilityOptions: "خيارات إمكانية الوصول",
screenReader: "قارئ الشاشة",
voiceNavigation: "التنقل الصوتي",
signLanguage: "لغة الإشارة",
braille: "برايل",
largeText: "نص كبير",
highContrast: "تباين عالٍ",
reducedMotion: "حركة منخفضة",
keyboardNavigation: "التنقل باستخدام لوحة المفاتيح",
audioSupport: "دعم صوتي",
visualSupport: "دعم بصري",
hearingSupport: "دعم السمع",
motorSupport: "دعم الحركة",
cognitiveSupport: "دعم الإدراك",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "العرض واللغة",
    preferredLanguage: "اللغة المفضلة",
    textSize: "حجم النص",
    highContrastDesc: "استخدم خلفية داكنة ونصاً ساطعاً.",
    reduceMotion: "تقليل الحركة",
    reduceMotionDesc: "تقليل الانتقالات المتحركة حيثما أمكن.",
    voiceGuidance: "الإرشاد الصوتي",
    enableVoiceGuidance: "تفعيل الإرشاد الصوتي",
    voiceGuidanceDesc: "تفعيل الإرشادات المنطوقة للميزات المدعومة.",
    voiceGuidanceActive: "الإرشاد الصوتي نشط.",
    testVoice: "اختبار الصوت",
    stopSpeaking: "إيقاف التحدث",
    speechUnsupported: "هذا المتصفح لا يدعم تحويل النص إلى كلام.",
    accessibilityProfile: "ملف إمكانية الوصول",
    accessibilityProfileDesc: "حدد الاحتياجات التي تريد من Inclura مراعاتها.",
    savingAccessibility: "جارٍ حفظ إعدادات إمكانية الوصول…",
    accessibilitySavedFallback: "تسري التغييرات فوراً.",
    blindness: "العمى",
    lowVision: "ضعف البصر",
    deafness: "الصمم",
    hardOfHearing: "ضعف السمع",
    wheelchairUser: "مستخدم كرسي متحرك",
    mobilityImpairment: "ضعف الحركة",
    speechImpairment: "اضطراب النطق",
    dyslexia: "عسر القراءة",
    adhd: "اضطراب فرط الحركة وتشتت الانتباه",
    autism: "التوحد",
    accessibilityHubTitle: "مركز إمكانية الوصول",
    accessibilityHubIntro: "استكشف إعدادات وخدمات الدعم التي تجعل استخدام Inclura أسهل.",
    accessibilitySections: "أقسام مركز إمكانية الوصول",
    accessibilityRequests: "طلبات المساعدة",
    accessibilityResources: "موارد إمكانية الوصول",
    accessibilityDirectory: "دليل إمكانية الوصول",
    communitySupport: "دعم المجتمع",
    emergencyAccessibilityHelp: "مساعدة إمكانية الوصول في الطوارئ",
    notConnected: "لم يتم الربط بعد",
    resourcesNotConnected: "الموارد غير مرتبطة بعد",
    directoryNotConnected: "الدليل غير مرتبط بعد",
    communityNotConnected: "ميزة المجتمع غير مرتبطة بعد",
    emergencyNotConnected: "سير عمل الطوارئ غير مرتبط بعد",
    emergencyDisclaimer: "إذا كان شخص ما في خطر فوري، فاتصل بخدمات الطوارئ المحلية مباشرةً. هذا القسم من Inclura لا يرسل المساعدة الطارئة.",
    verificationStatusTitle: "حالة التحقق",
    trackVerification: "تابع تقدم التحقق عبر IFSE.",
    verificationSummary: "ملخص التحقق",
    verificationType: "نوع التحقق",
    status: "الحالة",
    riskScore: "درجة المخاطر",
    threatLevel: "مستوى التهديد",
    executiveReview: "مراجعة الإدارة",
    required: "مطلوب",
    notRequired: "غير مطلوب",
    submitted: "تم الإرسال",
    secureUploadedDocuments: "المستندات المرفوعة بأمان",
    privateDocumentsNotice: "يمكن لمالك الطلب أو المسؤول المصرح له فقط فتح هذه الملفات الخاصة.",
    noDocumentsUploaded: "لم يتم رفع أي مستندات لهذا الطلب بعد.",
    verificationProgress: "تقدم التحقق في IFSE",
    overallProgress: "التقدم الإجمالي",
    verificationTimeline: "الجدول الزمني للتحقق",
    noVerificationEvents: "لا توجد أحداث تحقق بعد.",
    ifseSecurityEvents: "أحداث أمان IFSE",
    noSecurityEvents: "لم يتم تسجيل أحداث أمان IFSE.",
    resolved: "تم الحل",
    pending: "قيد الانتظار",
    ifseAuditLogs: "سجلات تدقيق IFSE",
    noAuditLogs: "لا توجد سجلات تدقيق.",
    ifseProtection: "حماية IFSE",
    openSecurely: "فتح بأمان",
    authorizing: "جارٍ التفويض…",
    allowPopups: "اسمح بالنوافذ المنبثقة لفتح المستند الآمن.",
    openingSecureDocument: "جارٍ فتح مستند التحقق الآمن",
    authorizingDocument: "جارٍ التصريح بالوصول إلى المستند…",
    verificationCentre: "مركز التحقق",
    uploadAdditionalDocuments: "رفع مستندات إضافية",
    verificationPayment: "دفع رسوم التحقق",
    vc_intro: "أكمل التحقق لتعزيز الثقة وفتح المزيد من الفرص على إنكلورا.",
    vc_verificationStatusAccess: "الوصول إلى حالة التحقق",
    vc_trackDescription: "تابع تقدم التحقق وراجع حالة طلبك.",
    vc_viewVerificationStatus: "عرض حالة التحقق",
    vc_viewStatus: "عرض الحالة",
    vc_uploadDocuments: "تحميل المستندات",
    vc_continuePayment: "المتابعة إلى الدفع",
    vc_identityVerification: "التحقق من الهوية",
    vc_documentAuthentication: "مصادقة المستندات",
    vc_aiFraudDetection: "اكتشاف الاحتيال بالذكاء الاصطناعي",
    vc_forgeryDetection: "اكتشاف تزوير المستندات",
    vc_duplicateDetection: "اكتشاف التكرار",
    vc_paymentProtection: "حماية الدفع",
    vc_accessibilityCompliance: "الامتثال لإمكانية الوصول",
    vc_executiveReview: "مراجعة الإدارة",
    vc_executiveReviewEngine: "محرك مراجعة الإدارة",
    vc_continuousMonitoring: "مراقبة مستمرة",
    vc_waiting: "قيد الانتظار",
    vc_workflowIntro: "اتبع هذه الخطوات لإكمال التحقق.",
    vc_step: "الخطوة {{number}}",
    vc_chooseCategory: "اختر فئة التحقق",
    vc_securePoweredByIFSE: "محمي بواسطة IFSE",
    vc_availableTypes: "أنواع التحقق المتاحة",
    vc_more: "المزيد",
    vc_startVerification: "بدء التحقق",
    vc_securityLayers: "طبقات الأمان",
    vc_activityOverview: "نظرة عامة على نشاط التحقق",
    vc_totalRequests: "إجمالي الطلبات",
    vc_rejected: "مرفوض",
    vc_benefits: "مزايا التحقق",
    vc_process: "عملية التحقق",
    vc_processChooseCategory: "اختر فئة التحقق",
    vc_processSelectType: "حدد نوع التحقق",
    vc_processCompleteForm: "أكمل نموذج الطلب",
    vc_processUploadDocs: "حمّل المستندات المطلوبة",
    vc_processPayment: "أكمل رسوم التحقق",
    vc_processIFSE: "يجري IFSE فحوصات الأمان",
    vc_processReview: "تتم مراجعة طلبك",
    vc_processBadge: "احصل على شارة التحقق",
    vc_ifseTitle: "محمي بواسطة محرك أمن إنكلورا",
    vc_ifseDescription: "يطبق IFSE فحوصات ومراقبة أمنية طوال عملية التحقق.",
    vc_officialBadge: "شارة تحقق رسمية",
    vc_higherTrust: "تعزيز ثقة المجتمع",
    vc_searchPriority: "ظهور أفضل في نتائج البحث",
    vc_impersonationProtection: "الحماية من انتحال الشخصية",
    vc_premiumFeatures: "الوصول إلى الميزات المميزة",
    vc_prioritySupport: "دعم ذو أولوية",
    vc_businessOpportunities: "فرص أعمال أكثر",
    vc_continuousProtection: "حماية مستمرة للحساب",
    vc_badgeCertificate: "شارة التحقق والشهادة",
    vc_verificationBadge: "شارة التحقق",
    vc_digitalCertificate: "الشهادة الرقمية",
    vc_ifseTrustScore: "درجة الثقة في IFSE",
    vc_securityAlerts: "تنبيهات أمان IFSE",
    vc_identityStatus: "حالة الهوية",
    vc_documentMonitoring: "مراقبة المستندات",
    vc_fraudMonitoring: "مراقبة الاحتيال",
    vc_executiveReviewQueue: "قائمة مراجعة الإدارة",
    vc_renewalMonitor: "متابعة تجديد التحقق",
    vc_currentStatus: "الحالة الحالية",
    vc_renewalMonitoring: "مراقبة التجديد",
    vc_certificateStatus: "حالة الشهادة",
    vc_quickActions: "إجراءات IFSE السريعة",
    ifseThreatLow: "منخفض",
    ifseThreatMedium: "متوسط",
    ifseThreatHigh: "مرتفع",
    ifseThreatCritical: "حرج",
    returnHome: "العودة إلى الرئيسية",
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

    // Posts & Content
translatePost: "Traducir publicación",
showOriginal: "Mostrar original",
showTranslation: "Mostrar traducción",
originalLanguage: "Idioma original",
translated: "Traducido",
translationUnavailable: "Traducción no disponible",
translating: "Traduciendo...",
translateComments: "Traducir comentarios",
comment: "Comentar",
comments: "Comentarios",
crossPost: "Publicación cruzada",
savePost: "Guardar publicación",
sharePost: "Compartir publicación",
readPostAloud: "Leer publicación en voz alta",
postImage: "Imagen de la publicación",
postVideo: "Vídeo de la publicación",
alternativeDescription: "Descripción alternativa",
audioDescription: "Descripción de audio",
captions: "Subtítulos",

// Accessibility
accessibilityOptions: "Opciones de accesibilidad",
screenReader: "Lector de pantalla",
voiceNavigation: "Navegación por voz",
signLanguage: "Lengua de signos",
braille: "Sistema de lectura y escritura para ciegos",
largeText: "Texto grande",
highContrast: "Alto contraste",
reducedMotion: "Movimiento reducido",
keyboardNavigation: "Navegación con teclado",
audioSupport: "Compatibilidad de audio",
visualSupport: "Compatibilidad visual",
hearingSupport: "Compatibilidad auditiva",
motorSupport: "Compatibilidad motora",
cognitiveSupport: "Compatibilidad cognitiva",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Pantalla e idioma",
    preferredLanguage: "Idioma preferido",
    textSize: "Tamaño del texto",
    highContrastDesc: "Usar un fondo oscuro y texto brillante.",
    reduceMotion: "Reducir movimiento",
    reduceMotionDesc: "Reducir las transiciones animadas cuando sea posible.",
    voiceGuidance: "Guía por voz",
    enableVoiceGuidance: "Activar guía por voz",
    voiceGuidanceDesc: "Activar indicaciones habladas para las funciones compatibles.",
    voiceGuidanceActive: "La guía por voz está activa.",
    testVoice: "Probar voz",
    stopSpeaking: "Detener lectura",
    speechUnsupported: "Este navegador no admite síntesis de voz.",
    accessibilityProfile: "Perfil de accesibilidad",
    accessibilityProfileDesc: "Selecciona las necesidades que Inclura debe tener en cuenta.",
    savingAccessibility: "Guardando ajustes de accesibilidad…",
    accessibilitySavedFallback: "Los cambios se aplican inmediatamente.",
    blindness: "Ceguera",
    lowVision: "Baja visión",
    deafness: "Sordera",
    hardOfHearing: "Dificultad auditiva",
    wheelchairUser: "Usuario de silla de ruedas",
    mobilityImpairment: "Movilidad reducida",
    speechImpairment: "Dificultad del habla",
    dyslexia: "Dislexia",
    adhd: "TDAH",
    autism: "Autismo",
    accessibilityHubTitle: "Centro de accesibilidad",
    accessibilityHubIntro: "Explora ajustes y servicios de apoyo que facilitan el uso de Inclura.",
    accessibilitySections: "Secciones del centro de accesibilidad",
    accessibilityRequests: "Solicitudes de accesibilidad",
    accessibilityResources: "Recursos de accesibilidad",
    accessibilityDirectory: "Directorio de accesibilidad",
    communitySupport: "Apoyo comunitario",
    emergencyAccessibilityHelp: "Ayuda de accesibilidad de emergencia",
    notConnected: "Aún no conectado",
    resourcesNotConnected: "Recursos aún no conectados",
    directoryNotConnected: "Directorio aún no conectado",
    communityNotConnected: "Función comunitaria aún no conectada",
    emergencyNotConnected: "Flujo de emergencia aún no conectado",
    emergencyDisclaimer: "Si alguien está en peligro inmediato, contacta directamente con los servicios de emergencia locales. Esta sección de Inclura no envía asistencia de emergencia.",
    verificationStatusTitle: "Estado de verificación",
    trackVerification: "Sigue el progreso de tu verificación mediante IFSE.",
    verificationSummary: "Resumen de verificación",
    verificationType: "Tipo de verificación",
    status: "Estado",
    riskScore: "Puntuación de riesgo",
    threatLevel: "Nivel de amenaza",
    executiveReview: "Revisión ejecutiva",
    required: "Requerido",
    notRequired: "No requerido",
    submitted: "Enviado",
    secureUploadedDocuments: "Documentos cargados de forma segura",
    privateDocumentsNotice: "Solo el propietario de la solicitud o un administrador autorizado puede abrir estos archivos privados.",
    noDocumentsUploaded: "Aún no se han cargado documentos para esta solicitud.",
    verificationProgress: "Progreso de verificación IFSE",
    overallProgress: "Progreso general",
    verificationTimeline: "Cronología de verificación",
    noVerificationEvents: "Aún no hay eventos de verificación.",
    ifseSecurityEvents: "Eventos de seguridad IFSE",
    noSecurityEvents: "No se han registrado eventos de seguridad IFSE.",
    resolved: "Resuelto",
    pending: "Pendiente",
    ifseAuditLogs: "Registros de auditoría IFSE",
    noAuditLogs: "No hay registros de auditoría disponibles.",
    ifseProtection: "Protección IFSE",
    openSecurely: "Abrir de forma segura",
    authorizing: "Autorizando…",
    allowPopups: "Permite las ventanas emergentes para abrir tu documento seguro.",
    openingSecureDocument: "Abriendo documento de verificación seguro",
    authorizingDocument: "Autorizando el acceso al documento…",
    verificationCentre: "Centro de verificación",
    uploadAdditionalDocuments: "Cargar documentos adicionales",
    verificationPayment: "Pago de verificación",
    vc_intro: "Completa tu verificación para generar confianza y acceder a más oportunidades en Inclura.",
    vc_verificationStatusAccess: "Acceso al estado de verificación",
    vc_trackDescription: "Sigue el progreso de tu verificación y consulta el estado de tu solicitud.",
    vc_viewVerificationStatus: "Ver estado de verificación",
    vc_viewStatus: "Ver estado",
    vc_uploadDocuments: "Subir documentos",
    vc_continuePayment: "Continuar al pago",
    vc_identityVerification: "Verificación de identidad",
    vc_documentAuthentication: "Autenticación de documentos",
    vc_aiFraudDetection: "Detección de fraude con IA",
    vc_forgeryDetection: "Detección de documentos falsificados",
    vc_duplicateDetection: "Detección de duplicados",
    vc_paymentProtection: "Protección de pagos",
    vc_accessibilityCompliance: "Cumplimiento de accesibilidad",
    vc_executiveReview: "Revisión ejecutiva",
    vc_executiveReviewEngine: "Motor de revisión ejecutiva",
    vc_continuousMonitoring: "Supervisión continua",
    vc_waiting: "En espera",
    vc_workflowIntro: "Sigue estos pasos para completar tu verificación.",
    vc_step: "Paso {{number}}",
    vc_chooseCategory: "Elige una categoría de verificación",
    vc_securePoweredByIFSE: "Protegido por IFSE",
    vc_availableTypes: "Tipos de verificación disponibles",
    vc_more: "más",
    vc_startVerification: "Iniciar verificación",
    vc_securityLayers: "Capas de seguridad",
    vc_activityOverview: "Resumen de actividad de verificación",
    vc_totalRequests: "Solicitudes totales",
    vc_rejected: "Rechazadas",
    vc_benefits: "Beneficios de la verificación",
    vc_process: "Proceso de verificación",
    vc_processChooseCategory: "Elige tu categoría de verificación",
    vc_processSelectType: "Selecciona un tipo de verificación",
    vc_processCompleteForm: "Completa el formulario de solicitud",
    vc_processUploadDocs: "Sube los documentos requeridos",
    vc_processPayment: "Completa el pago de verificación",
    vc_processIFSE: "IFSE realiza comprobaciones de seguridad",
    vc_processReview: "Se revisará tu solicitud",
    vc_processBadge: "Recibe tu insignia de verificación",
    vc_ifseTitle: "Protegido por Inclura Fortress Security Engine",
    vc_ifseDescription: "IFSE aplica controles y supervisión de seguridad durante todo el proceso.",
    vc_officialBadge: "Insignia oficial de verificación",
    vc_higherTrust: "Genera mayor confianza en la comunidad",
    vc_searchPriority: "Mayor visibilidad en las búsquedas",
    vc_impersonationProtection: "Protección contra la suplantación de identidad",
    vc_premiumFeatures: "Acceso a funciones premium",
    vc_prioritySupport: "Atención prioritaria",
    vc_businessOpportunities: "Más oportunidades de negocio",
    vc_continuousProtection: "Protección continua de la cuenta",
    vc_badgeCertificate: "Insignia y certificado de verificación",
    vc_verificationBadge: "Insignia de verificación",
    vc_digitalCertificate: "Certificado digital",
    vc_ifseTrustScore: "Puntuación de confianza IFSE",
    vc_securityAlerts: "Alertas de seguridad IFSE",
    vc_identityStatus: "Estado de identidad",
    vc_documentMonitoring: "Supervisión de documentos",
    vc_fraudMonitoring: "Supervisión de fraude",
    vc_executiveReviewQueue: "Cola de revisión ejecutiva",
    vc_renewalMonitor: "Monitor de renovación de verificación",
    vc_currentStatus: "Estado actual",
    vc_renewalMonitoring: "Supervisión de renovación",
    vc_certificateStatus: "Estado del certificado",
    vc_quickActions: "Acciones rápidas de IFSE",
    ifseThreatLow: "Bajo",
    ifseThreatMedium: "Medio",
    ifseThreatHigh: "Alto",
    ifseThreatCritical: "Crítico",
    returnHome: "Volver al inicio",
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

    // Posts & Content
translatePost: "翻译帖子",
showOriginal: "显示原文",
showTranslation: "显示翻译",
originalLanguage: "原始语言",
translated: "已翻译",
translationUnavailable: "翻译不可用",
translating: "正在翻译...",
translateComments: "翻译评论",
comment: "评论",
comments: "评论",
crossPost: "交叉发布",
savePost: "保存帖子",
sharePost: "分享帖子",
readPostAloud: "朗读帖子",
postImage: "帖子图片",
postVideo: "帖子视频",
alternativeDescription: "替代描述",
audioDescription: "音频描述",
captions: "字幕",

// Accessibility
accessibilityOptions: "无障碍选项",
screenReader: "屏幕阅读器",
voiceNavigation: "语音导航",
signLanguage: "手语",
braille: "盲文",
largeText: "大字体",
highContrast: "高对比度",
reducedMotion: "减少动态效果",
keyboardNavigation: "键盘导航",
audioSupport: "音频支持",
visualSupport: "视觉支持",
hearingSupport: "听觉支持",
motorSupport: "运动支持",
cognitiveSupport: "认知支持",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "显示与语言",
    preferredLanguage: "首选语言",
    textSize: "文字大小",
    highContrastDesc: "使用深色背景和明亮文字。",
    reduceMotion: "减少动态效果",
    reduceMotionDesc: "在支持的地方减少动画过渡。",
    voiceGuidance: "语音指导",
    enableVoiceGuidance: "启用语音指导",
    voiceGuidanceDesc: "为支持的功能启用语音提示。",
    voiceGuidanceActive: "语音指导已启用。",
    testVoice: "测试语音",
    stopSpeaking: "停止朗读",
    speechUnsupported: "此浏览器不支持语音合成。",
    accessibilityProfile: "无障碍配置",
    accessibilityProfileDesc: "选择希望 Inclura 考虑的需求。",
    savingAccessibility: "正在保存无障碍设置…",
    accessibilitySavedFallback: "更改会立即生效。",
    blindness: "失明",
    lowVision: "低视力",
    deafness: "失聪",
    hardOfHearing: "听力困难",
    wheelchairUser: "轮椅使用者",
    mobilityImpairment: "行动障碍",
    speechImpairment: "言语障碍",
    dyslexia: "阅读障碍",
    adhd: "注意缺陷多动障碍",
    autism: "自闭症",
    accessibilityHubTitle: "无障碍中心",
    accessibilityHubIntro: "探索让 Inclura 更易使用的无障碍设置和支持服务。",
    accessibilitySections: "无障碍中心栏目",
    accessibilityRequests: "无障碍帮助请求",
    accessibilityResources: "无障碍资源",
    accessibilityDirectory: "无障碍服务目录",
    communitySupport: "社区支持",
    emergencyAccessibilityHelp: "紧急无障碍帮助",
    notConnected: "尚未连接",
    resourcesNotConnected: "资源尚未连接",
    directoryNotConnected: "目录尚未连接",
    communityNotConnected: "社区功能尚未连接",
    emergencyNotConnected: "紧急流程尚未连接",
    emergencyDisclaimer: "如有人身处紧急危险，请直接联系当地紧急服务。本 Inclura 页面不会派遣紧急救援。",
    verificationStatusTitle: "验证状态",
    trackVerification: "通过 IFSE 跟踪您的验证进度。",
    verificationSummary: "验证摘要",
    verificationType: "验证类型",
    status: "状态",
    riskScore: "风险评分",
    threatLevel: "威胁等级",
    executiveReview: "管理层审核",
    required: "需要",
    notRequired: "不需要",
    submitted: "已提交",
    secureUploadedDocuments: "安全上传的文件",
    privateDocumentsNotice: "只有申请所有者或授权管理员可以打开这些私人文件。",
    noDocumentsUploaded: "此申请尚未上传验证文件。",
    verificationProgress: "IFSE 验证进度",
    overallProgress: "总体进度",
    verificationTimeline: "验证时间线",
    noVerificationEvents: "暂无验证事件。",
    ifseSecurityEvents: "IFSE 安全事件",
    noSecurityEvents: "未记录 IFSE 安全事件。",
    resolved: "已解决",
    pending: "待处理",
    ifseAuditLogs: "IFSE 审计日志",
    noAuditLogs: "没有可用的审计日志。",
    ifseProtection: "IFSE 保护",
    openSecurely: "安全打开",
    authorizing: "正在授权…",
    allowPopups: "允许弹出窗口以打开安全文件。",
    openingSecureDocument: "正在打开安全验证文件",
    authorizingDocument: "正在授权访问文件…",
    verificationCentre: "验证中心",
    uploadAdditionalDocuments: "上传其他文件",
    verificationPayment: "验证付款",
    vc_intro: "完成身份验证，建立信任并解锁 Inclura 上的更多机会。",
    vc_verificationStatusAccess: "验证状态入口",
    vc_trackDescription: "跟踪验证进度并查看申请状态。",
    vc_viewVerificationStatus: "查看验证状态",
    vc_viewStatus: "查看状态",
    vc_uploadDocuments: "上传文件",
    vc_continuePayment: "继续付款",
    vc_identityVerification: "身份验证",
    vc_documentAuthentication: "文件认证",
    vc_aiFraudDetection: "人工智能欺诈检测",
    vc_forgeryDetection: "伪造文件检测",
    vc_duplicateDetection: "重复项检测",
    vc_paymentProtection: "付款保护",
    vc_accessibilityCompliance: "无障碍合规",
    vc_executiveReview: "管理层审核",
    vc_executiveReviewEngine: "管理层审核引擎",
    vc_continuousMonitoring: "持续监控",
    vc_waiting: "等待中",
    vc_workflowIntro: "按照以下步骤完成验证。",
    vc_step: "第 {{number}} 步",
    vc_chooseCategory: "选择验证类别",
    vc_securePoweredByIFSE: "由 IFSE 提供安全保护",
    vc_availableTypes: "可用的验证类型",
    vc_more: "更多",
    vc_startVerification: "开始验证",
    vc_securityLayers: "安全层",
    vc_activityOverview: "验证活动概览",
    vc_totalRequests: "请求总数",
    vc_rejected: "已拒绝",
    vc_benefits: "验证权益",
    vc_process: "验证流程",
    vc_processChooseCategory: "选择验证类别",
    vc_processSelectType: "选择验证类型",
    vc_processCompleteForm: "填写申请表",
    vc_processUploadDocs: "上传所需文件",
    vc_processPayment: "完成验证付款",
    vc_processIFSE: "IFSE 执行安全检查",
    vc_processReview: "审核您的申请",
    vc_processBadge: "获取验证徽章",
    vc_ifseTitle: "由 Inclura Fortress Security Engine 提供保护",
    vc_ifseDescription: "IFSE 在整个验证过程中执行安全检查和持续监控。",
    vc_officialBadge: "官方验证徽章",
    vc_higherTrust: "提升社区信任度",
    vc_searchPriority: "提高搜索可见度",
    vc_impersonationProtection: "防止身份冒用",
    vc_premiumFeatures: "使用高级功能",
    vc_prioritySupport: "优先支持",
    vc_businessOpportunities: "更多商业机会",
    vc_continuousProtection: "持续账户保护",
    vc_badgeCertificate: "验证徽章与证书",
    vc_verificationBadge: "验证徽章",
    vc_digitalCertificate: "数字证书",
    vc_ifseTrustScore: "IFSE 信任评分",
    vc_securityAlerts: "IFSE 安全警报",
    vc_identityStatus: "身份状态",
    vc_documentMonitoring: "文件监控",
    vc_fraudMonitoring: "欺诈监控",
    vc_executiveReviewQueue: "管理审核队列",
    vc_renewalMonitor: "验证续期监控",
    vc_currentStatus: "当前状态",
    vc_renewalMonitoring: "续期监控",
    vc_certificateStatus: "证书状态",
    vc_quickActions: "IFSE 快捷操作",
    ifseThreatLow: "低",
    ifseThreatMedium: "中",
    ifseThreatHigh: "高",
    ifseThreatCritical: "严重",
    returnHome: "返回首页",
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

    // Posts & Content
translatePost: "Traduzir publicação",
showOriginal: "Mostrar original",
showTranslation: "Mostrar tradução",
originalLanguage: "Idioma original",
translated: "Traduzido",
translationUnavailable: "Tradução indisponível",
translating: "Traduzindo...",
translateComments: "Traduzir comentários",
comment: "Comentar",
comments: "Comentários",
crossPost: "Publicação cruzada",
savePost: "Salvar publicação",
sharePost: "Compartilhar publicação",
readPostAloud: "Ler publicação em voz alta",
postImage: "Imagem da publicação",
postVideo: "Vídeo da publicação",
alternativeDescription: "Descrição alternativa",
audioDescription: "Descrição de áudio",
captions: "Legendas",

// Accessibility
accessibilityOptions: "Opções de acessibilidade",
screenReader: "Leitor de tela",
voiceNavigation: "Navegação por voz",
signLanguage: "Língua de sinais",
braille: "Sistema de leitura e escrita para cegos",
largeText: "Texto grande",
highContrast: "Alto contraste",
reducedMotion: "Movimento reduzido",
keyboardNavigation: "Navegação pelo teclado",
audioSupport: "Suporte de áudio",
visualSupport: "Suporte visual",
hearingSupport: "Suporte auditivo",
motorSupport: "Suporte motor",
cognitiveSupport: "Suporte cognitivo",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Ecrã e idioma",
    preferredLanguage: "Idioma preferido",
    textSize: "Tamanho do texto",
    highContrastDesc: "Utilize um fundo escuro e texto brilhante.",
    reduceMotion: "Reduzir movimento",
    reduceMotionDesc: "Reduzir transições animadas quando possível.",
    voiceGuidance: "Orientação por voz",
    enableVoiceGuidance: "Ativar orientação por voz",
    voiceGuidanceDesc: "Ativar orientação falada para funcionalidades compatíveis.",
    voiceGuidanceActive: "A orientação por voz está ativa.",
    testVoice: "Testar voz",
    stopSpeaking: "Parar leitura",
    speechUnsupported: "Este navegador não suporta síntese de voz.",
    accessibilityProfile: "Perfil de acessibilidade",
    accessibilityProfileDesc: "Selecione as necessidades que pretende que a Inclura considere.",
    savingAccessibility: "A guardar definições de acessibilidade…",
    accessibilitySavedFallback: "As alterações têm efeito imediato.",
    blindness: "Cegueira",
    lowVision: "Baixa visão",
    deafness: "Surdez",
    hardOfHearing: "Dificuldade auditiva",
    wheelchairUser: "Utilizador de cadeira de rodas",
    mobilityImpairment: "Mobilidade reduzida",
    speechImpairment: "Dificuldade de fala",
    dyslexia: "Dislexia",
    adhd: "PHDA",
    autism: "Autismo",
    accessibilityHubTitle: "Centro de acessibilidade",
    accessibilityHubIntro: "Explore definições e serviços de apoio que tornam a Inclura mais fácil de utilizar.",
    accessibilitySections: "Secções do centro de acessibilidade",
    accessibilityRequests: "Pedidos de acessibilidade",
    accessibilityResources: "Recursos de acessibilidade",
    accessibilityDirectory: "Diretório de acessibilidade",
    communitySupport: "Apoio comunitário",
    emergencyAccessibilityHelp: "Ajuda de acessibilidade de emergência",
    notConnected: "Ainda não ligado",
    resourcesNotConnected: "Recursos ainda não ligados",
    directoryNotConnected: "Diretório ainda não ligado",
    communityNotConnected: "Funcionalidade comunitária ainda não ligada",
    emergencyNotConnected: "Fluxo de emergência ainda não ligado",
    emergencyDisclaimer: "Se alguém estiver em perigo imediato, contacte diretamente os serviços de emergência locais. Esta secção da Inclura não envia assistência de emergência.",
    verificationStatusTitle: "Estado da verificação",
    trackVerification: "Acompanhe o progresso da sua verificação através do IFSE.",
    verificationSummary: "Resumo da verificação",
    verificationType: "Tipo de verificação",
    status: "Estado",
    riskScore: "Pontuação de risco",
    threatLevel: "Nível de ameaça",
    executiveReview: "Revisão executiva",
    required: "Necessário",
    notRequired: "Não necessário",
    submitted: "Submetido",
    secureUploadedDocuments: "Documentos carregados em segurança",
    privateDocumentsNotice: "Apenas o titular do pedido ou um administrador autorizado pode abrir estes ficheiros privados.",
    noDocumentsUploaded: "Ainda não foram carregados documentos para este pedido.",
    verificationProgress: "Progresso da verificação IFSE",
    overallProgress: "Progresso geral",
    verificationTimeline: "Cronologia da verificação",
    noVerificationEvents: "Ainda não existem eventos de verificação.",
    ifseSecurityEvents: "Eventos de segurança IFSE",
    noSecurityEvents: "Não foram registados eventos de segurança IFSE.",
    resolved: "Resolvido",
    pending: "Pendente",
    ifseAuditLogs: "Registos de auditoria IFSE",
    noAuditLogs: "Não existem registos de auditoria.",
    ifseProtection: "Proteção IFSE",
    openSecurely: "Abrir em segurança",
    authorizing: "A autorizar…",
    allowPopups: "Permita janelas pop-up para abrir o seu documento seguro.",
    openingSecureDocument: "A abrir documento de verificação seguro",
    authorizingDocument: "A autorizar acesso ao documento…",
    verificationCentre: "Centro de verificação",
    uploadAdditionalDocuments: "Carregar documentos adicionais",
    verificationPayment: "Pagamento da verificação",
    vc_intro: "Conclua sua verificação para fortalecer a confiança e desbloquear mais oportunidades no Inclura.",
    vc_verificationStatusAccess: "Acesso ao estado da verificação",
    vc_trackDescription: "Acompanhe o progresso da verificação e consulte o estado da solicitação.",
    vc_viewVerificationStatus: "Ver estado da verificação",
    vc_viewStatus: "Ver estado",
    vc_uploadDocuments: "Enviar documentos",
    vc_continuePayment: "Continuar para pagamento",
    vc_identityVerification: "Verificação de identidade",
    vc_documentAuthentication: "Autenticação de documentos",
    vc_aiFraudDetection: "Deteção de fraude por IA",
    vc_forgeryDetection: "Deteção de documentos falsificados",
    vc_duplicateDetection: "Deteção de duplicados",
    vc_paymentProtection: "Proteção de pagamentos",
    vc_accessibilityCompliance: "Conformidade de acessibilidade",
    vc_executiveReview: "Revisão executiva",
    vc_executiveReviewEngine: "Sistema de revisão executiva",
    vc_continuousMonitoring: "Monitorização contínua",
    vc_waiting: "A aguardar",
    vc_workflowIntro: "Siga estas etapas para concluir a sua verificação.",
    vc_step: "Etapa {{number}}",
    vc_chooseCategory: "Escolha uma categoria de verificação",
    vc_securePoweredByIFSE: "Protegido pelo IFSE",
    vc_availableTypes: "Tipos de verificação disponíveis",
    vc_more: "mais",
    vc_startVerification: "Iniciar verificação",
    vc_securityLayers: "Camadas de segurança",
    vc_activityOverview: "Visão geral da atividade de verificação",
    vc_totalRequests: "Total de pedidos",
    vc_rejected: "Rejeitados",
    vc_benefits: "Benefícios da verificação",
    vc_process: "Processo de verificação",
    vc_processChooseCategory: "Escolha a categoria de verificação",
    vc_processSelectType: "Selecione um tipo de verificação",
    vc_processCompleteForm: "Preencha o formulário de candidatura",
    vc_processUploadDocs: "Envie os documentos necessários",
    vc_processPayment: "Conclua o pagamento da verificação",
    vc_processIFSE: "O IFSE realiza verificações de segurança",
    vc_processReview: "A sua candidatura será analisada",
    vc_processBadge: "Receba o seu selo de verificação",
    vc_ifseTitle: "Protegido pelo Inclura Fortress Security Engine",
    vc_ifseDescription: "O IFSE aplica verificações e monitorização de segurança durante todo o processo.",
    vc_officialBadge: "Selo oficial de verificação",
    vc_higherTrust: "Aumente a confiança da comunidade",
    vc_searchPriority: "Maior visibilidade nas pesquisas",
    vc_impersonationProtection: "Proteção contra falsificação de identidade",
    vc_premiumFeatures: "Acesso a funcionalidades premium",
    vc_prioritySupport: "Apoio prioritário",
    vc_businessOpportunities: "Mais oportunidades de negócio",
    vc_continuousProtection: "Proteção contínua da conta",
    vc_badgeCertificate: "Selo e certificado de verificação",
    vc_verificationBadge: "Selo de verificação",
    vc_digitalCertificate: "Certificado digital",
    vc_ifseTrustScore: "Pontuação de confiança IFSE",
    vc_securityAlerts: "Alertas de segurança IFSE",
    vc_identityStatus: "Estado da identidade",
    vc_documentMonitoring: "Monitorização de documentos",
    vc_fraudMonitoring: "Monitorização de fraude",
    vc_executiveReviewQueue: "Fila de revisão executiva",
    vc_renewalMonitor: "Monitor de renovação da verificação",
    vc_currentStatus: "Estado atual",
    vc_renewalMonitoring: "Monitorização da renovação",
    vc_certificateStatus: "Estado do certificado",
    vc_quickActions: "Ações rápidas IFSE",
    ifseThreatLow: "Baixo",
    ifseThreatMedium: "Moderado",
    ifseThreatHigh: "Elevado",
    ifseThreatCritical: "Crítico",
    returnHome: "Voltar ao início",
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

    // Posts & Content
translatePost: "Tafsiri chapisho",
showOriginal: "Onyesha asili",
showTranslation: "Onyesha tafsiri",
originalLanguage: "Lugha ya asili",
translated: "Imetafsiriwa",
translationUnavailable: "Tafsiri haipatikani",
translating: "Inatafsiri...",
translateComments: "Tafsiri maoni",
comment: "Maoni",
comments: "Maoni",
crossPost: "Chapisha tena",
savePost: "Hifadhi chapisho",
sharePost: "Shiriki chapisho",
readPostAloud: "Soma chapisho kwa sauti",
postImage: "Picha ya chapisho",
postVideo: "Video ya chapisho",
alternativeDescription: "Maelezo mbadala",
audioDescription: "Maelezo ya sauti",
captions: "Manukuu",

// Accessibility
accessibilityOptions: "Chaguo za ufikivu",
screenReader: "Kisoma skrini",
voiceNavigation: "Urambazaji wa sauti",
signLanguage: "Lugha ya ishara",
braille: "Maandishi ya vipofu",
largeText: "Maandishi makubwa",
highContrast: "Tofauti kubwa",
reducedMotion: "Mwendo uliopunguzwa",
keyboardNavigation: "Urambazaji wa kibodi",
audioSupport: "Usaidizi wa sauti",
visualSupport: "Usaidizi wa kuona",
hearingSupport: "Usaidizi wa kusikia",
motorSupport: "Usaidizi wa mwendo",
cognitiveSupport: "Usaidizi wa utambuzi",

    // Accessibility and verification interface
    accessibilityDisplayLanguage: "Mwonekano na lugha",
    preferredLanguage: "Lugha unayopendelea",
    textSize: "Ukubwa wa maandishi",
    highContrastDesc: "Tumia mandharinyuma meusi na maandishi angavu.",
    reduceMotion: "Punguza mwendo",
    reduceMotionDesc: "Punguza mabadiliko ya uhuishaji inapowezekana.",
    voiceGuidance: "Mwongozo wa sauti",
    enableVoiceGuidance: "Washa mwongozo wa sauti",
    voiceGuidanceDesc: "Washa maelekezo ya sauti kwa vipengele vinavyotumika.",
    voiceGuidanceActive: "Mwongozo wa sauti umewashwa.",
    testVoice: "Jaribu sauti",
    stopSpeaking: "Acha kusoma",
    speechUnsupported: "Kivinjari hiki hakitumii usomaji wa maandishi kwa sauti.",
    accessibilityProfile: "Wasifu wa ufikivu",
    accessibilityProfileDesc: "Chagua mahitaji ambayo ungependa Inclura izingatie.",
    savingAccessibility: "Inahifadhi mipangilio ya ufikivu…",
    accessibilitySavedFallback: "Mabadiliko yanaanza kutumika mara moja.",
    blindness: "Upofu",
    lowVision: "Uoni hafifu",
    deafness: "Uziwi",
    hardOfHearing: "Ugumu wa kusikia",
    wheelchairUser: "Mtumiaji wa kiti cha magurudumu",
    mobilityImpairment: "Changamoto ya kutembea",
    speechImpairment: "Changamoto ya kuzungumza",
    dyslexia: "Dyslexia",
    adhd: "ADHD",
    autism: "Autism",
    accessibilityHubTitle: "Kituo cha Ufikivu",
    accessibilityHubIntro: "Chunguza mipangilio na huduma za usaidizi zinazorahisisha matumizi ya Inclura.",
    accessibilitySections: "Sehemu za kituo cha ufikivu",
    accessibilityRequests: "Maombi ya usaidizi",
    accessibilityResources: "Rasilimali za ufikivu",
    accessibilityDirectory: "Orodha ya huduma za ufikivu",
    communitySupport: "Usaidizi wa jamii",
    emergencyAccessibilityHelp: "Usaidizi wa dharura wa ufikivu",
    notConnected: "Bado haijaunganishwa",
    resourcesNotConnected: "Rasilimali bado hazijaunganishwa",
    directoryNotConnected: "Orodha bado haijaunganishwa",
    communityNotConnected: "Huduma ya jamii bado haijaunganishwa",
    emergencyNotConnected: "Mfumo wa dharura bado haujaunganishwa",
    emergencyDisclaimer: "Mtu akiwa katika hatari ya haraka, wasiliana moja kwa moja na huduma za dharura za eneo lako. Sehemu hii ya Inclura haitumi msaada wa dharura.",
    verificationStatusTitle: "Hali ya Uthibitishaji",
    trackVerification: "Fuatilia maendeleo ya uthibitishaji wako kupitia IFSE.",
    verificationSummary: "Muhtasari wa Uthibitishaji",
    verificationType: "Aina ya Uthibitishaji",
    status: "Hali",
    riskScore: "Alama ya Hatari",
    threatLevel: "Kiwango cha Tishio",
    executiveReview: "Ukaguzi wa Uongozi",
    required: "Inahitajika",
    notRequired: "Haihitajiki",
    submitted: "Imewasilishwa",
    secureUploadedDocuments: "Nyaraka zilizopakiwa kwa usalama",
    privateDocumentsNotice: "Mmiliki wa ombi au msimamizi aliyeidhinishwa pekee ndiye anayeweza kufungua faili hizi za faragha.",
    noDocumentsUploaded: "Hakuna nyaraka zilizopakiwa kwa ombi hili bado.",
    verificationProgress: "Maendeleo ya Uthibitishaji wa IFSE",
    overallProgress: "Maendeleo kwa Jumla",
    verificationTimeline: "Ratiba ya Uthibitishaji",
    noVerificationEvents: "Hakuna matukio ya uthibitishaji bado.",
    ifseSecurityEvents: "Matukio ya Usalama ya IFSE",
    noSecurityEvents: "Hakuna matukio ya usalama ya IFSE yaliyorekodiwa.",
    resolved: "Imetatuliwa",
    pending: "Inasubiri",
    ifseAuditLogs: "Kumbukumbu za Ukaguzi za IFSE",
    noAuditLogs: "Hakuna kumbukumbu za ukaguzi.",
    ifseProtection: "Ulinzi wa IFSE",
    openSecurely: "Fungua kwa usalama",
    authorizing: "Inaidhinisha…",
    allowPopups: "Ruhusu madirisha ibukizi ili Inclura ifungue hati yako salama.",
    openingSecureDocument: "Inafungua hati salama ya uthibitishaji",
    authorizingDocument: "Inaidhinisha ufikiaji wa hati…",
    verificationCentre: "Kituo cha Uthibitishaji",
    uploadAdditionalDocuments: "Pakia nyaraka za ziada",
    verificationPayment: "Malipo ya Uthibitishaji",
    vc_intro: "Kamilisha uthibitishaji wako ili kujenga uaminifu na kupata fursa zaidi kwenye Inclura.",
    vc_verificationStatusAccess: "Ufikiaji wa hali ya uthibitishaji",
    vc_trackDescription: "Fuatilia maendeleo ya uthibitishaji na hali ya ombi lako.",
    vc_viewVerificationStatus: "Tazama hali ya uthibitishaji",
    vc_viewStatus: "Tazama Hali",
    vc_uploadDocuments: "Pakia Nyaraka",
    vc_continuePayment: "Endelea Kulipa",
    vc_identityVerification: "Uthibitishaji wa Utambulisho",
    vc_documentAuthentication: "Uthibitishaji wa Nyaraka",
    vc_aiFraudDetection: "Ugunduzi wa Ulaghai wa AI",
    vc_forgeryDetection: "Ugunduzi wa Nyaraka Bandia",
    vc_duplicateDetection: "Ugunduzi wa Nakala",
    vc_paymentProtection: "Ulinzi wa Malipo",
    vc_accessibilityCompliance: "Uzingatiaji wa Ufikiaji",
    vc_executiveReview: "Ukaguzi wa Uongozi",
    vc_executiveReviewEngine: "Mfumo wa Ukaguzi wa Uongozi",
    vc_continuousMonitoring: "Ufuatiliaji Endelevu",
    vc_waiting: "Inasubiri",
    vc_workflowIntro: "Fuata hatua hizi ili kukamilisha uthibitishaji wako.",
    vc_step: "Hatua ya {{number}}",
    vc_chooseCategory: "Chagua Aina ya Uthibitishaji",
    vc_securePoweredByIFSE: "Imelindwa na IFSE",
    vc_availableTypes: "Aina za uthibitishaji zinazopatikana",
    vc_more: "zaidi",
    vc_startVerification: "Anza Uthibitishaji",
    vc_securityLayers: "Tabaka za Usalama",
    vc_activityOverview: "Muhtasari wa Shughuli za Uthibitishaji",
    vc_totalRequests: "Jumla ya Maombi",
    vc_rejected: "Yaliyokataliwa",
    vc_benefits: "Faida za Uthibitishaji",
    vc_process: "Mchakato wa Uthibitishaji",
    vc_processChooseCategory: "Chagua aina ya uthibitishaji",
    vc_processSelectType: "Chagua aina ya uthibitishaji",
    vc_processCompleteForm: "Jaza fomu ya maombi",
    vc_processUploadDocs: "Pakia nyaraka zinazohitajika",
    vc_processPayment: "Kamilisha malipo ya uthibitishaji",
    vc_processIFSE: "IFSE hufanya ukaguzi wa usalama",
    vc_processReview: "Ombi lako litakaguliwa",
    vc_processBadge: "Pokea beji yako ya uthibitishaji",
    vc_ifseTitle: "Unalindwa na Inclura Fortress Security Engine",
    vc_ifseDescription: "IFSE hutekeleza ukaguzi na ufuatiliaji wa usalama katika mchakato wote.",
    vc_officialBadge: "Beji rasmi ya uthibitishaji",
    vc_higherTrust: "Jenga uaminifu zaidi katika jamii",
    vc_searchPriority: "Kuonekana zaidi kwenye utafutaji",
    vc_impersonationProtection: "Ulinzi dhidi ya kujifanya mtu mwingine",
    vc_premiumFeatures: "Ufikiaji wa vipengele vya malipo",
    vc_prioritySupport: "Usaidizi wa kipaumbele",
    vc_businessOpportunities: "Fursa zaidi za biashara",
    vc_continuousProtection: "Ulinzi endelevu wa akaunti",
    vc_badgeCertificate: "Beji na Cheti cha Uthibitishaji",
    vc_verificationBadge: "Beji ya Uthibitishaji",
    vc_digitalCertificate: "Cheti cha Kidijitali",
    vc_ifseTrustScore: "Alama ya Uaminifu ya IFSE",
    vc_securityAlerts: "Tahadhari za Usalama za IFSE",
    vc_identityStatus: "Hali ya Utambulisho",
    vc_documentMonitoring: "Ufuatiliaji wa Nyaraka",
    vc_fraudMonitoring: "Ufuatiliaji wa Ulaghai",
    vc_executiveReviewQueue: "Foleni ya Ukaguzi wa Uongozi",
    vc_renewalMonitor: "Kifuatiliaji cha Upyaji wa Uthibitishaji",
    vc_currentStatus: "Hali ya Sasa",
    vc_renewalMonitoring: "Ufuatiliaji wa Upyaji",
    vc_certificateStatus: "Hali ya Cheti",
    vc_quickActions: "Vitendo vya Haraka vya IFSE",
    ifseThreatLow: "Chini",
    ifseThreatMedium: "Wastani",
    ifseThreatHigh: "Juu",
    ifseThreatCritical: "Hatari Kubwa",
    returnHome: "Rudi Nyumbani",
  },
},
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
supportedLngs: ["en", "fr", "yo", "ig", "ha", "sw", "pt", "es", "ar", "zh"],
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
