import type { RowDataPacket } from 'mysql2';
import { fallbackKoreanHolidays } from '@/features/booking/data/holidays';
import type { Holiday } from '@/features/booking/types/holiday';
import { getDatabasePool, isDatabaseConfigured } from '@/lib/db';

type HolidaySource = 'database' | 'api' | 'fallback';
type HolidayResult = { holidays: Holiday[]; source: HolidaySource };
type HolidayRow = RowDataPacket & { holiday_date: string; holiday_name: string };

const holidayCache = new Map<number, Promise<HolidayResult>>();

function normalizeApiHoliday(item: unknown): Holiday | null {
  if (!item || typeof item !== 'object') return null;
  const source = item as Record<string, unknown>;
  const rawDate = String(source.locdate ?? '');
  if (!/^\d{8}$/.test(rawDate)) return null;
  return {
    date: `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`,
    name: String(source.dateName ?? '대한민국 공휴일'),
    isSubstitute: String(source.dateName ?? '').includes('대체'),
  };
}

function uniqueHolidays(holidays: Holiday[]): Holiday[] {
  const grouped = new Map<string, Holiday>();
  for (const holiday of holidays) {
    const existing = grouped.get(holiday.date);
    grouped.set(holiday.date, existing
      ? { date: holiday.date, name: `${existing.name}, ${holiday.name}`, isSubstitute: existing.isSubstitute || holiday.isSubstitute }
      : holiday);
  }
  return [...grouped.values()].sort((left, right) => left.date.localeCompare(right.date));
}

async function fetchDatabaseHolidays(year: number): Promise<Holiday[]> {
  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;
  const [rows] = await getDatabasePool().execute<HolidayRow[]>(
    `SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') AS holiday_date, holiday_name
       FROM korean_holiday
      WHERE is_holiday = 1
        AND holiday_date >= ?
        AND holiday_date < ?
      ORDER BY holiday_date ASC, id ASC`,
    [startDate, endDate],
  );
  return uniqueHolidays(rows.map((row) => ({
    date: row.holiday_date,
    name: row.holiday_name,
    isSubstitute: row.holiday_name.includes('대체'),
  })));
}

async function fetchApiHolidays(year: number): Promise<Holiday[] | null> {
  const apiKey = process.env.HOLIDAY_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL('https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo');
    url.searchParams.set('solYear', String(year));
    url.searchParams.set('ServiceKey', apiKey);
    url.searchParams.set('_type', 'json');
    url.searchParams.set('numOfRows', '100');
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) return null;
    const data = await response.json() as { response?: { body?: { items?: { item?: unknown[] | unknown } } } };
    const rawItems = data.response?.body?.items?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    return uniqueHolidays(items.map(normalizeApiHoliday).filter((holiday): holiday is Holiday => Boolean(holiday)));
  } catch {
    return null;
  }
}

async function loadKoreanHolidays(year: number): Promise<HolidayResult> {
  if (isDatabaseConfigured()) {
    try {
      return { holidays: await fetchDatabaseHolidays(year), source: 'database' };
    } catch (error) {
      console.error(`Failed to read ${year} holidays from korean_holiday.`, error);
    }
  }

  const apiHolidays = await fetchApiHolidays(year);
  return apiHolidays?.length
    ? { holidays: apiHolidays, source: 'api' }
    : { holidays: uniqueHolidays(fallbackKoreanHolidays[year] ?? []), source: 'fallback' };
}

export async function getKoreanHolidays(year: number): Promise<HolidayResult> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const result = loadKoreanHolidays(year).catch((error) => {
    holidayCache.delete(year);
    throw error;
  });
  holidayCache.set(year, result);
  return result;
}
