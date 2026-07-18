import { calculateStayNights } from '@/lib/date';
import type { StayNight } from '@/features/booking/pricing';

export const BOOKING_CURRENCY = 'KRW' as const;
export type RoomType = 'standard';
export type BookingSummary = {
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  nights: number;
  currency: typeof BOOKING_CURRENCY;
  accommodationAmount: number;
  additionalAmount: number;
  totalAmount: number;
};

export function createBookingSummary(params: { roomType: RoomType; checkIn: string; checkOut: string; stayNights: StayNight[]; additionalAmount?: number }): BookingSummary | null {
  const nights = calculateStayNights(params.checkIn, params.checkOut);
  if (!nights || nights !== params.stayNights.length) return null;
  const additionalAmount = params.additionalAmount ?? 0;
  const accommodationAmount = params.stayNights.reduce((sum, night) => sum + night.amount, 0);
  const totalAmount = accommodationAmount + additionalAmount;
  if (totalAmount <= 0) return null;
  return { roomType: params.roomType, checkIn: params.checkIn, checkOut: params.checkOut, nights, currency: BOOKING_CURRENCY, accommodationAmount, additionalAmount, totalAmount };
}
