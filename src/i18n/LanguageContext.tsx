"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

type Locale = "fr" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const dictionaries = {
  fr,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("app_locale") as Locale;
    if (saved === "fr" || saved === "en") {
      setLocaleState(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "en") {
        setLocaleState("en");
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("app_locale", newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const dictionary = dictionaries[locale];
    let val = getNestedValue(dictionary, key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return val;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useT() {
  const { t } = useLanguage();
  return t;
}
