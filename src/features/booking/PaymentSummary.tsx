import { formatWon } from '@/features/booking/pricing';
import type { RateType, StayNight } from '@/features/booking/pricing';
import type { Locale } from '@/locales/messages';

type PaymentCopy = { title: string; roomCharge: string; extraCharge: string; total: string; paypal: string; disabledNotice: string };
type PricingCopy = { low: string; mid: string; high: string; rateDetails: string; selectDatesFirst: string; lowReason: string; midReason: string; highReason: string };
type BookingCopy = { oneNight: string; nights: string };

const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };
const rateTypes: RateType[] = ['low', 'mid', 'high'];
const rateLabel = (rate: RateType, copy: PricingCopy) => ({ low: copy.low, mid: copy.mid, high: copy.high })[rate];
const rateReason = (rate: RateType, copy: PricingCopy) => ({ low: copy.lowReason, mid: copy.midReason, high: copy.highReason })[rate];
const formatNightCount = (count: number, copy: BookingCopy) => count === 1 ? copy.oneNight : copy.nights.replace('{count}', String(count));

export function PaymentSummary({ copy, pricingCopy, bookingCopy, pricing, locale }: { copy: PaymentCopy; pricingCopy: PricingCopy; bookingCopy: BookingCopy; pricing: { nights: StayNight[]; totalAmount: number }; locale: Locale }) {
  const rateGroups = rateTypes.map((rateType) => {
    const nights = pricing.nights.filter((night) => night.rateType === rateType);
    return { rateType, count: nights.length, amount: nights.reduce((sum, night) => sum + night.amount, 0) };
  }).filter((group) => group.count > 0);

  return (
    <section className="card" aria-labelledby="payment-title">
      <h2 id="payment-title">{copy.title}</h2>
      <dl className="paymentRows compactPaymentRows" aria-live="polite">
        <div className="totalRow"><dt>{copy.total}</dt><dd>{formatWon(pricing.totalAmount, localeMap[locale])}</dd></div>
      </dl>
      {rateGroups.length ? (
        <div className="rateDetails" aria-labelledby="rate-details-title">
          <h3 id="rate-details-title">{pricingCopy.rateDetails}</h3>
          {rateGroups.map((group) => (
            <article key={group.rateType} className="rateDetailRow groupedRateRow">
              <div><strong>{rateLabel(group.rateType, pricingCopy)}</strong><span>{rateReason(group.rateType, pricingCopy)}</span></div>
              <div><b className="rateBadge">{formatNightCount(group.count, bookingCopy)}</b><strong>{formatWon(group.amount, localeMap[locale])}</strong></div>
            </article>
          ))}
        </div>
      ) : <p className="helperText">{pricingCopy.selectDatesFirst}</p>}
      <button className="primaryButton fullWidth" type="button" disabled>{copy.paypal}</button>
      <p className="helperText">{copy.disabledNotice}</p>
    </section>
  );
}
