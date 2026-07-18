import { fallbackKoreanHolidays } from '@/features/booking/data/holidays';
import type { Holiday } from '@/features/booking/types/holiday';

type HolidaySource = 'api' | 'fallback';
const holidayCache = new Map<number, { holidays: Holiday[]; source: HolidaySource }>();

function normalizeApiHoliday(item: unknown): Holiday | null {
  if (!item || typeof item !== 'object') return null;
  const source = item as Record<string, unknown>;
  const rawDate = String(source.locdate ?? '');
  if (!/^\d{8}$/.test(rawDate)) return null;
  return {
    date: `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`,
    name: String(source.dateName ?? '대한민국 공휴일'),
    isSubstitute: String(source.dateName ?? '').includes('대체')
  };
}

function uniqueHolidays(holidays: Holiday[]): Holiday[] {
  return Array.from(new Map(holidays.map((holiday) => [holiday.date, holiday])).values()).sort((a, b) => a.date.localeCompare(b.date));
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

export async function getKoreanHolidays(year: number): Promise<{ holidays: Holiday[]; source: HolidaySource }> {
  const cached = holidayCache.get(year);
  if (cached) return cached;
  const apiHolidays = await fetchApiHolidays(year);
  const result = apiHolidays?.length ? { holidays: apiHolidays, source: 'api' as const } : { holidays: uniqueHolidays(fallbackKoreanHolidays[year] ?? []), source: 'fallback' as const };
  holidayCache.set(year, result);
  return result;
}
