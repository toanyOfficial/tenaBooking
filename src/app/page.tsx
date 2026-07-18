import { AppContent } from '@/features/booking/AppContent';
import { LocaleProvider } from '@/features/booking/LocaleProvider';
import { getKoreanHolidays } from '@/features/booking/services/holidayService';

export default async function Home() {
  const holidayResults = await Promise.all([2026, 2027].map((year) => getKoreanHolidays(year)));
  const holidays = holidayResults.flatMap((result) => result.holidays);
  return (
    <LocaleProvider>
      <AppContent holidays={holidays} />
    </LocaleProvider>
  );
}
