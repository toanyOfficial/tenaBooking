'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLocale, locales, messages } from '@/locales/messages';
import type { Locale } from '@/locales/messages';

const storageKey = 'medical-stay-locale';
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (typeof messages)[Locale] };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function resolveLocale(value: string | undefined | null): Locale {
  const normalized = value?.trim();
  if (!normalized) return defaultLocale;
  if ((locales as readonly string[]).includes(normalized)) return normalized as Locale;
  const lower = normalized.toLowerCase();
  if (lower.startsWith('en')) return 'en';
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('ja')) return 'ja';
  if (lower === 'zh-tw' || lower === 'zh-hk' || lower === 'zh-mo' || lower.includes('hant')) return 'zh-TW';
  if (lower === 'zh-cn' || lower === 'zh-sg' || lower.includes('hans')) return 'zh-CN';
  if (lower.startsWith('th')) return 'th';
  if (lower.startsWith('vi')) return 'vi';
  if (lower.startsWith('ru')) return 'ru';
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    setLocaleState(resolveLocale(stored ?? window.navigator.language));
  }, []);
  useEffect(() => { document.documentElement.lang = locale; window.localStorage.setItem(storageKey, locale); }, [locale]);
  const value = useMemo(() => ({ locale, setLocale: setLocaleState, t: messages[locale] ?? messages.en }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider');
  return context;
}
