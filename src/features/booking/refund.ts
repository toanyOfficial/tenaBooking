import { toUtcDayNumber } from '@/lib/date';

export function getCancellationPenaltyRate(checkIn: string, cancellationDate: string): number {
  const checkInDay = toUtcDayNumber(checkIn);
  const cancelDay = toUtcDayNumber(cancellationDate);
  if (checkInDay === null || cancelDay === null) return 1;
  const daysBeforeCheckIn = checkInDay - cancelDay;
  if (daysBeforeCheckIn >= 6) return 0;
  if (daysBeforeCheckIn >= 4) return 0.1;
  if (daysBeforeCheckIn >= 2) return 0.3;
  if (daysBeforeCheckIn >= 1) return 0.5;
  return 1;
}

export function getDaysBeforeCheckIn(checkIn: string, cancellationDate: string): number | null {
  const checkInDay = toUtcDayNumber(checkIn);
  const cancelDay = toUtcDayNumber(cancellationDate);
  if (checkInDay === null || cancelDay === null) return null;
  return checkInDay - cancelDay;
}

export function calculateRefund(totalAmount: number, penaltyRate: number): { penaltyAmount: number; refundAmount: number } {
  const penaltyAmount = Math.round(totalAmount * penaltyRate);
  return { penaltyAmount, refundAmount: Math.max(0, totalAmount - penaltyAmount) };
}
