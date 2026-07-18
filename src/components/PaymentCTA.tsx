import { formatWon } from '@/features/booking/pricing';
import type { Locale } from '@/locales/messages';

type PaymentCopy = { paypal: string; stickyTotalLabel: string };
const localeMap: Record<Locale, string> = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', 'zh-CN': 'zh-CN' };

export function PaymentCTA({ copy, totalAmount = 0, locale = 'ko' }: { copy: PaymentCopy; totalAmount?: number; locale?: Locale }) {
  return (
    <aside className="paymentCta" aria-label={copy.paypal}>
      <div>
        <span>{copy.stickyTotalLabel}</span>
        <strong>{formatWon(totalAmount, localeMap[locale])}</strong>
      </div>
      <button className="primaryButton" type="button" disabled>{copy.paypal}</button>
    </aside>
  );
}
