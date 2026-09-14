import { NextResponse } from 'next/server';
import { getRoomAvailability } from '@/features/booking/services/roomAvailabilityService';
import type { RoomAvailabilityResponse } from '@/features/booking/types/roomAvailability';
import { calculateStayNights, getTodayDateString, isDateBefore, isValidStayRange, parseDateString } from '@/lib/date';

const errorMessage = '객실 예약 가능 여부를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.';

type DatabaseError = Error & { code?: string };

function getAvailabilityError(error: unknown): { message: string; errorCode: string } {
  const databaseError = error as DatabaseError;
  if (databaseError.message?.startsWith('Missing required database environment variable:')) {
    const variable = databaseError.message.split(':').at(-1)?.trim();
    return { message: `데이터베이스 환경변수 ${variable ?? ''} 설정을 확인해 주세요.`, errorCode: 'DB_CONFIG_MISSING' };
  }

  if (databaseError.code === 'ER_NO_SUCH_TABLE') return { message: 'client_rooms 또는 reservation_calendar_snapshot 테이블을 찾을 수 없습니다.', errorCode: databaseError.code };
  if (databaseError.code === 'ER_ACCESS_DENIED_ERROR') return { message: '데이터베이스 계정 또는 비밀번호가 올바르지 않습니다.', errorCode: databaseError.code };
  if (databaseError.code === 'ECONNREFUSED' || databaseError.code === 'ETIMEDOUT') return { message: '데이터베이스 서버에 연결할 수 없습니다. 호스트, 포트 및 네트워크 설정을 확인해 주세요.', errorCode: databaseError.code };
  if (databaseError.code === 'ER_BAD_FIELD_ERROR') return { message: 'client_rooms 또는 reservation_calendar_snapshot 테이블의 컬럼 구성을 확인해 주세요.', errorCode: databaseError.code };

  return { message: errorMessage, errorCode: databaseError.code ?? 'DB_QUERY_FAILED' };
}

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
    const responseError = getAvailabilityError(error);
    return NextResponse.json<RoomAvailabilityResponse>({ success: false, ...responseError }, { status: 503 });
  }
}
