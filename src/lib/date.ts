import type { Locale } from '@/locales/messages';

export const TIME_ZONE = 'Asia/Seoul';
export const MIN_STAY_NIGHTS = 1;
export const MAX_STAY_NIGHTS = 30;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const dayInMilliseconds = 24 * 60 * 60 * 1000;

export function getTodayDateString(timeZone = TIME_ZONE, date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) return '';
  return `${year}-${month}-${day}`;
}

export function parseDateString(value: string): { year: number; month: number; day: number } | null {
  if (!datePattern.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function toUtcDayNumber(value: string): number | null {
  const parsed = parseDateString(value);
  if (!parsed) return null;
  return Math.floor(Date.UTC(parsed.year, parsed.month - 1, parsed.day) / dayInMilliseconds);
}

export function addDays(value: string, days: number): string {
  const parsed = parseDateString(value);
  if (!parsed) return '';
  const date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStayNights(checkIn: string, checkOut: string): number | null {
  const start = toUtcDayNumber(checkIn);
  const end = toUtcDayNumber(checkOut);
  if (start === null || end === null) return null;
  const nights = end - start;
  return nights >= MIN_STAY_NIGHTS ? nights : null;
}

export function isDateBefore(left: string, right: string): boolean {
  const leftDay = toUtcDayNumber(left);
  const rightDay = toUtcDayNumber(right);
  return leftDay !== null && rightDay !== null && leftDay < rightDay;
}

export function isValidStayRange(checkIn: string, checkOut: string): boolean {
  const nights = calculateStayNights(checkIn, checkOut);
  return nights !== null && nights >= MIN_STAY_NIGHTS && nights <= MAX_STAY_NIGHTS;
}

export function formatDateForLocale(value: string, locale: Locale): string {
  const parsed = parseDateString(value);
  if (!parsed) return value;

  const localeMap: Record<Locale, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    'zh-CN': 'zh-CN'
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    timeZone: 'UTC',
    year: 'numeric',
    month: locale === 'en' ? 'short' : 'numeric',
    day: 'numeric'
  }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)));
}
