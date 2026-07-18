import { formatWon } from '@/features/booking/pricing';
import type { RateType, StayNight } from '@/features/booking/pricing';
import type { Locale } from '@/locales/messages';

type PricingCopy = { low: string; mid: string; high: string; rateDetails: string; selectDatesFirst: string; lowReason: string; midReason: string; highReason: string };
type BookingCopy = { oneNight: string; nights: string };

const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };
const rateTypes: RateType[] = ['low', 'mid', 'high'];
const rateLabel = (rate: RateType, copy: PricingCopy) => ({ low: copy.low, mid: copy.mid, high: copy.high })[rate];
const rateReason = (rate: RateType, copy: PricingCopy) => ({ low: copy.lowReason, mid: copy.midReason, high: copy.highReason })[rate];
const formatNightCount = (count: number, copy: BookingCopy) => count === 1 ? copy.oneNight : copy.nights.replace('{count}', String(count));

export function PaymentSummary({ pricingCopy, bookingCopy, pricing, locale }: { pricingCopy: PricingCopy; bookingCopy: BookingCopy; pricing: { nights: StayNight[]; totalAmount: number }; locale: Locale }) {
  const rateGroups = rateTypes.map((rateType) => {
    const nights = pricing.nights.filter((night) => night.rateType === rateType);
    return { rateType, count: nights.length, amount: nights.reduce((sum, night) => sum + night.amount, 0) };
  }).filter((group) => group.count > 0);

  return (
    <section className="card" aria-labelledby="rate-details-title">
      <h2 id="rate-details-title">{pricingCopy.rateDetails}</h2>
      {rateGroups.length ? (
        <div className="rateDetails groupedRateDetails">
          {rateGroups.map((group) => (
            <article key={group.rateType} className="rateDetailRow groupedRateRow">
              <div><strong>{rateLabel(group.rateType, pricingCopy)}</strong><span>{rateReason(group.rateType, pricingCopy)}</span></div>
              <div><b className="rateBadge">{formatNightCount(group.count, bookingCopy)}</b><strong>{formatWon(group.amount, localeMap[locale])}</strong></div>
            </article>
          ))}
        </div>
      ) : <p className="helperText">{pricingCopy.selectDatesFirst}</p>}
    </section>
  );
}
