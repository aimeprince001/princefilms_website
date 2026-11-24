import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "rw" | "fr";

const messages: Record<Language, Record<string, string>> = {
  en: {
    home: "Home", movies: "Movies", series: "Series", interpreters: "Interpreters", contact: "Contact",
    search: "Search", searchTitles: "Search titles and interpreters", myList: "My List", profile: "Profile",
    signOut: "Sign out", signIn: "Sign in", joinFree: "Join free", createAccount: "Create an account",
    browse: "Browse", categories: "Categories", account: "Account", contactUs: "Contact us",
    language: "Language", skip: "Skip to content", languageHelp: "Choose website language",
    footerDescription: "Kinyarwanda dubs of feature films and series, recorded in Kigali and streamed on demand.",
    subtitles: "Kinyarwanda audio. English, French and Swahili subtitles on every title.",
    recentlyAdded: "Recently added", recentlyAddedDesc: "Fresh titles landing on PRINCEFILMS this week.", allNew: "All new releases", continueWatching: "Continue watching", viewMyList: "View My List",
  },
  rw: {
    home: "Ahabanza", movies: "Filime", series: "Ibiganiro", interpreters: "Abasemuzi", contact: "Twandikire",
    search: "Shakisha", searchTitles: "Shakisha filime n'abasemuzi", myList: "Urutonde rwanjye", profile: "Umwirondoro",
    signOut: "Sohoka", signIn: "Injira", joinFree: "Iyandikishe ku buntu", createAccount: "Fungura konti",
    browse: "Reba", categories: "Ibyiciro", account: "Konti", contactUs: "Twandikire",
    language: "Ururimi", skip: "Jya ku bikubiyemo", languageHelp: "Hitamo ururimi rw'urubuga",
    footerDescription: "Filime n'uruhererekane byasobanuwe mu Kinyarwanda, byafatiwe i Kigali kandi birebwa igihe icyo ari cyo cyose.",
    subtitles: "Ijwi ry'Ikinyarwanda. Subtitles z'Icyongereza, Igifaransa n'Igiswahili kuri buri filime.",
    recentlyAdded: "Byongeweho vuba", recentlyAddedDesc: "Filime nshya zageze kuri PRINCEFILMS muri iki cyumweru.", allNew: "Filime nshya zose", continueWatching: "Komeza kureba", viewMyList: "Reba urutonde rwanjye",
  },
  fr: {
    home: "Accueil", movies: "Films", series: "Séries", interpreters: "Interprètes", contact: "Contact",
    search: "Rechercher", searchTitles: "Rechercher des films et interprètes", myList: "Ma liste", profile: "Profil",
    signOut: "Se déconnecter", signIn: "Connexion", joinFree: "Inscription gratuite", createAccount: "Créer un compte",
    browse: "Explorer", categories: "Catégories", account: "Compte", contactUs: "Nous contacter",
    language: "Langue", skip: "Aller au contenu", languageHelp: "Choisir la langue du site",
    footerDescription: "Films et séries doublés en kinyarwanda, enregistrés à Kigali et disponibles à la demande.",
    subtitles: "Audio en kinyarwanda. Sous-titres anglais, français et swahili pour chaque titre.",
    recentlyAdded: "Ajouts récents", recentlyAddedDesc: "Nouveaux titres ajoutés à PRINCEFILMS cette semaine.", allNew: "Toutes les nouveautés", continueWatching: "Continuer à regarder", viewMyList: "Voir ma liste",
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("princefilms-language");
      return saved === "rw" || saved === "fr" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem("princefilms-language", next);
    } catch {
      // Keep language switching usable if storage is unavailable.
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: (key: string) => messages[language][key] ?? messages.en[key] ?? key,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
