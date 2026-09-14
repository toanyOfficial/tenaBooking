import { NextResponse } from 'next/server';
import { getRoomAvailability } from '@/features/booking/services/roomAvailabilityService';
import type { RoomAvailabilityResponse } from '@/features/booking/types/roomAvailability';
import { calculateStayNights, getTodayDateString, isDateBefore, isValidStayRange, parseDateString } from '@/lib/date';

const errorMessage = '객실 예약 가능 여부를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';
  const requestedNights = calculateStayNights(checkIn, checkOut);

  if (!parseDateString(checkIn) || !parseDateString(checkOut) || !requestedNights || isDateBefore(checkIn, getTodayDateString()) || !isValidStayRange(checkIn, checkOut)) {
    return NextResponse.json<RoomAvailabilityResponse>({ success: false, message: errorMessage }, { status: 400 });
  }

  try {
    const availability = await getRoomAvailability(checkIn, checkOut, requestedNights);
    return NextResponse.json<RoomAvailabilityResponse>({ success: true, ...availability });
  } catch (error) {
    console.error('Failed to read room availability.', error);
    return NextResponse.json<RoomAvailabilityResponse>({ success: false, message: errorMessage }, { status: 503 });
  }
}
