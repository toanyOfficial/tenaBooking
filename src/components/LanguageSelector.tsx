'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/features/booking/LocaleProvider';
import type { Locale } from '@/locales/messages';

const labels: Record<Locale, string> = { en: 'English', ko: '한국어', 'zh-CN': '简体中文', 'zh-TW': '繁體中文', ja: '日本語', th: 'ไทย', vi: 'Tiếng Việt', ru: 'Русский' };
const options = Object.keys(labels) as Locale[];

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); } };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, []);
  return (
    <div className="languageMenu" ref={rootRef}>
      <button ref={buttonRef} type="button" className="languageMenuButton" aria-haspopup="listbox" aria-expanded={open} aria-label={`${t.header.languageLabel}: ${labels[locale]}`} onClick={() => setOpen((value) => !value)}>{labels[locale]}<span aria-hidden="true">⌄</span></button>
      {open ? <div className="languageOptions" role="listbox" aria-label={t.header.languageLabel}>{options.map((option) => <button type="button" role="option" aria-selected={option === locale} aria-current={option === locale ? 'true' : undefined} key={option} onClick={() => { setLocale(option); setOpen(false); buttonRef.current?.focus(); }}>{labels[option]}</button>)}</div> : null}
    </div>
  );
}
