import { addDays, calculateStayNights, toUtcDayNumber } from '@/lib/date';
import type { Holiday } from '@/features/booking/types/holiday';

export const ROOM_RATES = { low: 70000, mid: 90000, high: 110000 } as const;
export type RateType = keyof typeof ROOM_RATES;

export type StayNight = {
  stayDate: string;
  nextDate: string;
  stayDateHoliday: boolean;
  nextDateHoliday: boolean;
  rateType: RateType;
  amount: number;
  stayHolidayName?: string;
  nextHolidayName?: string;
};

export function isWeekend(date: string): boolean {
  const dayNumber = toUtcDayNumber(date);
  if (dayNumber === null) return false;
  const day = new Date(dayNumber * 24 * 60 * 60 * 1000).getUTCDay();
  return day === 0 || day === 6;
}

export function getHoliday(date: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find((holiday) => holiday.date === date);
}

export function isHoliday(date: string, holidays: Holiday[]): boolean {
  return isWeekend(date) || Boolean(getHoliday(date, holidays));
}

export function getRateType(stayDate: string, nextDate: string, holidays: Holiday[]): RateType {
  const stayDateHoliday = isHoliday(stayDate, holidays);
  const nextDateHoliday = isHoliday(nextDate, holidays);
  if (nextDateHoliday) return 'high';
  if (stayDateHoliday) return 'mid';
  return 'low';
}

export function getRateAmount(rateType: RateType): number {
  return ROOM_RATES[rateType];
}

export function createStayDates(checkIn: string, checkOut: string): string[] {
  const nights = calculateStayNights(checkIn, checkOut);
  if (!nights) return [];
  return Array.from({ length: nights }, (_, index) => addDays(checkIn, index));
}

export function calculateStayPricing(checkIn: string, checkOut: string, holidays: Holiday[]): { nights: StayNight[]; totalAmount: number } {
  const nights = createStayDates(checkIn, checkOut).map((stayDate) => {
    const nextDate = addDays(stayDate, 1);
    const rateType = getRateType(stayDate, nextDate, holidays);
    const stayHoliday = getHoliday(stayDate, holidays);
    const nextHoliday = getHoliday(nextDate, holidays);
    return {
      stayDate,
      nextDate,
      stayDateHoliday: isHoliday(stayDate, holidays),
      nextDateHoliday: isHoliday(nextDate, holidays),
      rateType,
      amount: getRateAmount(rateType),
      stayHolidayName: stayHoliday?.name,
      nextHolidayName: nextHoliday?.name
    };
  });
  return { nights, totalAmount: nights.reduce((sum, night) => sum + night.amount, 0) };
}

export function formatWon(amount: number, locale = 'ko-KR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);
}
