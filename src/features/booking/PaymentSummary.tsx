import { formatWon } from '@/features/booking/pricing';
import type { RateType, StayNight } from '@/features/booking/pricing';
import type { Locale } from '@/locales/messages';

type PaymentCopy = { title: string; roomCharge: string; extraCharge: string; total: string; paypal: string; disabledNotice: string };
type PricingCopy = { low: string; mid: string; high: string; rateDetails: string; selectDatesFirst: string; lowReason: string; midReason: string; highReason: string };

const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };
const rateLabel = (rate: RateType, copy: PricingCopy) => ({ low: copy.low, mid: copy.mid, high: copy.high })[rate];
const rateReason = (rate: RateType, copy: PricingCopy) => ({ low: copy.lowReason, mid: copy.midReason, high: copy.highReason })[rate];

export function PaymentSummary({ copy, pricingCopy, pricing, locale }: { copy: PaymentCopy; pricingCopy: PricingCopy; pricing: { nights: StayNight[]; totalAmount: number }; locale: Locale }) {
  const additionalFee = 0;
  const totalAmount = pricing.totalAmount + additionalFee;
  return (
    <section className="card" aria-labelledby="payment-title">
      <h2 id="payment-title">{copy.title}</h2>
      <dl className="paymentRows" aria-live="polite">
        <div><dt>{copy.roomCharge}</dt><dd>{formatWon(pricing.totalAmount, localeMap[locale])}</dd></div>
        <div><dt>{copy.extraCharge}</dt><dd>{formatWon(additionalFee, localeMap[locale])}</dd></div>
        <div className="totalRow"><dt>{copy.total}</dt><dd>{formatWon(totalAmount, localeMap[locale])}</dd></div>
      </dl>
      {pricing.nights.length ? (
        <div className="rateDetails" aria-labelledby="rate-details-title">
          <h3 id="rate-details-title">{pricingCopy.rateDetails}</h3>
          {pricing.nights.map((night) => (
            <article key={night.stayDate} className="rateDetailRow">
              <div><strong>{night.stayDate} - {night.nextDate}</strong><span>{rateReason(night.rateType, pricingCopy)}</span></div>
              <div><b className="rateBadge">{rateLabel(night.rateType, pricingCopy)}</b><strong>{formatWon(night.amount, localeMap[locale])}</strong></div>
            </article>
          ))}
        </div>
      ) : <p className="helperText">{pricingCopy.selectDatesFirst}</p>}
      <button className="primaryButton fullWidth" type="button" disabled>{copy.paypal}</button>
      <p className="helperText">{copy.disabledNotice}</p>
    </section>
  );
}
