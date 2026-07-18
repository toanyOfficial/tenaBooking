'use client';

import { useLocale } from '@/features/booking/LocaleProvider';
import type { Locale } from '@/locales/messages';

const labels: Record<Locale, string> = { ko: '한국어', en: 'English', ja: '日本語', 'zh-CN': '简体中文' };

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();
  return (
    <label className="languageSelect" aria-label={t.header.languageLabel}>
      <span className="srOnly">{t.header.languageLabel}</span>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
        {(Object.keys(labels) as Locale[]).map((option) => <option key={option} value={option}>{labels[option]}</option>)}
      </select>
    </label>
  );
}
