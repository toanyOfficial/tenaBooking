import { formatWon } from '@/features/booking/pricing';
import { formatDateForLocale } from '@/lib/date';
import type { BookingSummary as BookingSummaryType } from '@/features/booking/bookingSummary';
import type { Locale } from '@/locales/messages';

type Copy = { type: string };
type PaymentCopy = { roomCharge: string; extraCharge: string; total: string };
type BookingCopy = { nights: string; oneNight: string };
const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };

export function BookingSummary({ summary, roomCopy, paymentCopy, bookingCopy, locale }: { summary: BookingSummaryType; roomCopy: Copy; paymentCopy: PaymentCopy; bookingCopy: BookingCopy; locale: Locale }) {
  const nightsLabel = summary.nights === 1 ? bookingCopy.oneNight : bookingCopy.nights.replace('{count}', String(summary.nights));
  return (
    <div className="bookingSummaryBox">
      <h3>{roomCopy.type}</h3>
      <p>{formatDateForLocale(summary.checkIn, locale)} - {formatDateForLocale(summary.checkOut, locale)}</p>
      <strong>{nightsLabel}</strong>
      <dl>
        <div><dt>{paymentCopy.roomCharge}</dt><dd>{formatWon(summary.accommodationAmount, localeMap[locale])}</dd></div>
        <div><dt>{paymentCopy.extraCharge}</dt><dd>{formatWon(summary.additionalAmount, localeMap[locale])}</dd></div>
        <div><dt>{paymentCopy.total}</dt><dd>{formatWon(summary.totalAmount, localeMap[locale])}</dd></div>
      </dl>
    </div>
  );
}
