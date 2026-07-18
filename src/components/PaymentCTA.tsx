import { formatWon } from '@/features/booking/pricing';
import type { Locale } from '@/locales/messages';

type PaymentCopy = { paypal: string; stickyTotalLabel: string };
const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };

export function PaymentCTA({ copy, totalAmount = 0, locale = 'ko', disabled = true, visible = false, onClick, label }: { copy: PaymentCopy; totalAmount?: number; locale?: Locale; disabled?: boolean; visible?: boolean; onClick?: () => void; label?: string }) {
  return (
    <aside className={visible ? 'paymentCta isVisible' : 'paymentCta'} aria-label={copy.paypal} aria-hidden={!visible}>
      <div><span>{copy.stickyTotalLabel}</span><strong>{formatWon(totalAmount, localeMap[locale])}</strong></div>
      <button className="primaryButton" type="button" disabled={disabled} onClick={onClick}>{label ?? copy.paypal}</button>
    </aside>
  );
}
