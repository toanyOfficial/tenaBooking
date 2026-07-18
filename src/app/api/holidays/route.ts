import { NextResponse } from 'next/server';
import { getKoreanHolidays } from '@/features/booking/services/holidayService';

export async function GET(request: Request) {
  const year = Number(new URL(request.url).searchParams.get('year'));
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ year: null, holidays: [], source: 'fallback' }, { status: 400 });
  }
  const result = await getKoreanHolidays(year);
  return NextResponse.json({ year, holidays: result.holidays, source: result.source });
}
