import { NextResponse } from 'next/server';
import { createBookingSummary } from '@/features/booking/bookingSummary';
import { calculateStayPricing } from '@/features/booking/pricing';
import { createPayPalOrder, isPayPalConfigured } from '@/features/booking/services/paypalService';
import { getKoreanHolidays } from '@/features/booking/services/holidayService';
import { isRoomAvailable } from '@/features/booking/services/roomAvailabilityService';
import type { CreatePayPalOrderRequest, CreatePayPalOrderResponse } from '@/features/booking/types/paypal';
import { addDays, calculateStayNights, getTodayDateString, isDateBefore, isValidStayRange, parseDateString } from '@/lib/date';

const errorMessage = '결제 요청을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.';

function yearsForRange(checkIn: string, checkOut: string) {
  return Array.from(new Set([checkIn, checkOut, addDays(checkOut, 1)].map((date) => Number(date.slice(0, 4))).filter(Boolean)));
}

export async function POST(request: Request) {
  let body: Partial<CreatePayPalOrderRequest>;
  try { body = await request.json() as Partial<CreatePayPalOrderRequest>; } catch { return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 400 }); }

  if (body.roomType !== 'standard' || !body.roomNo || !body.checkIn || !body.checkOut || !parseDateString(body.checkIn) || !parseDateString(body.checkOut)) {
    return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 400 });
  }
  if (isDateBefore(body.checkIn, getTodayDateString()) || !calculateStayNights(body.checkIn, body.checkOut) || !isValidStayRange(body.checkIn, body.checkOut)) {
    return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 400 });
  }

  const holidayResults = await Promise.all(yearsForRange(body.checkIn, body.checkOut).map((year) => getKoreanHolidays(year)));
  const holidays = holidayResults.flatMap((result) => result.holidays);
  const pricing = calculateStayPricing(body.checkIn, body.checkOut, holidays);
  const booking = createBookingSummary({ roomType: 'standard', checkIn: body.checkIn, checkOut: body.checkOut, stayNights: pricing.nights });
  if (!booking) return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 400 });

  try {
    if (!await isRoomAvailable(body.roomNo, body.checkIn, body.checkOut, booking.nights)) {
      return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 409 });
    }
  } catch (error) {
    console.error('Failed to confirm room availability before payment.', error);
    return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 503 });
  }

  if (!isPayPalConfigured()) return NextResponse.json<CreatePayPalOrderResponse>({ success: true, mode: 'mock', booking });
  const order = await createPayPalOrder(booking, body.roomNo);
  if (!order) return NextResponse.json<CreatePayPalOrderResponse>({ success: false, message: errorMessage }, { status: 502 });
  return NextResponse.json<CreatePayPalOrderResponse>({ success: true, mode: 'paypal', ...order });
}
