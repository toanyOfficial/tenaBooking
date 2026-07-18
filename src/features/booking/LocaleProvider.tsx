'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLocale, locales, messages } from '@/locales/messages';
import type { Locale } from '@/locales/messages';

const storageKey = 'medical-stay-locale';
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (typeof messages)[Locale] };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function resolveLocale(value: string | undefined | null): Locale {
  if (!value) return defaultLocale;
  if ((locales as readonly string[]).includes(value)) return value as Locale;
  if (value.startsWith('ko')) return 'ko';
  if (value.startsWith('en')) return 'en';
  if (value.startsWith('ja')) return 'ja';
  if (value.startsWith('zh')) return 'zh-CN';
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    setLocaleState(resolveLocale(stored ?? window.navigator.language));
  }, []);
  useEffect(() => { document.documentElement.lang = locale; window.localStorage.setItem(storageKey, locale); }, [locale]);
  const value = useMemo(() => ({ locale, setLocale: setLocaleState, t: messages[locale] }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider');
  return context;
}
