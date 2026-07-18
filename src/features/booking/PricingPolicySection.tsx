import { calculateRefund, getCancellationPenaltyRate, getDaysBeforeCheckIn } from '@/features/booking/refund';
import { formatWon, ROOM_RATES } from '@/features/booking/pricing';
import type { StayNight } from '@/features/booking/pricing';
import { getTodayDateString } from '@/lib/date';
import type { Locale } from '@/locales/messages';

type PricingCopy = {
  title: string; rateTitle: string; low: string; mid: string; high: string; refundTitle: string;
  rates: Array<{ label: string; price: string; description: string }>;
  refunds: Array<{ period: string; penalty: string }>;
  refund: { cancelToday: string; daysBeforeCheckIn: string; penaltyRate: string; estimatedRefund: string; estimateNotice: string };
};

const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };

export function PricingPolicySection({ copy, pricing, checkIn, locale }: { copy: PricingCopy; pricing: { nights: StayNight[]; totalAmount: number }; checkIn: string; locale: Locale }) {
  const today = getTodayDateString();
  const penaltyRate = checkIn && pricing.totalAmount > 0 ? getCancellationPenaltyRate(checkIn, today) : null;
  const refund = penaltyRate === null ? null : calculateRefund(pricing.totalAmount, penaltyRate);
  const daysBefore = checkIn ? getDaysBeforeCheckIn(checkIn, today) : null;
  const refundEstimate =
    checkIn && pricing.totalAmount > 0 && penaltyRate !== null && daysBefore !== null && refund !== null
      ? { daysBefore, penaltyRate, refund }
      : null;

  return (
    <section className="card" aria-label={copy.title}>
      <div className="policyBlock policyBlockFirst">
        <h3>{copy.rateTitle}</h3>
        <div className="rateList">
          {copy.rates.map((rate, index) => (
            <article key={rate.label}>
              <div><strong>{rate.label}</strong><span>{rate.description}</span></div>
              <b>{formatWon([ROOM_RATES.low, ROOM_RATES.mid, ROOM_RATES.high][index], localeMap[locale])}</b>
            </article>
          ))}
        </div>
      </div>
      <div className="policyBlock">
        <h3 className="refundPolicyTitle">{copy.refundTitle}</h3>
        <dl className="refundList">
          {copy.refunds.map((refundRow) => (<div key={refundRow.period}><dt>{refundRow.period}</dt><dd>{refundRow.penalty}</dd></div>))}
        </dl>
      </div>
      {refundEstimate ? (
        <aside className="refundEstimate" aria-live="polite">
          <h3>{copy.refund.cancelToday}</h3>
          <dl>
            <div><dt>{copy.refund.daysBeforeCheckIn}</dt><dd>{Math.max(refundEstimate.daysBefore, 0)}</dd></div>
            <div><dt>{copy.refund.penaltyRate}</dt><dd>{Math.round(refundEstimate.penaltyRate * 100)}%</dd></div>
            <div><dt>{copy.refund.estimatedRefund}</dt><dd>{formatWon(refundEstimate.refund.refundAmount, localeMap[locale])}</dd></div>
          </dl>
          <p>{copy.refund.estimateNotice}</p>
        </aside>
      ) : null}
    </section>
  );
}
