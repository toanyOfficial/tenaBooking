import { AppContent } from '@/features/booking/AppContent';
import { LocaleProvider } from '@/features/booking/LocaleProvider';
import { getKoreanHolidays } from '@/features/booking/services/holidayService';
import { getTodayDateString } from '@/lib/date';

export default async function Home() {
  const currentYear = Number(getTodayDateString().slice(0, 4));
  const holidayResults = await Promise.all([currentYear, currentYear + 1].map((year) => getKoreanHolidays(year)));
  const holidays = holidayResults.flatMap((result) => result.holidays);
  return (
    <LocaleProvider>
      <AppContent holidays={holidays} />
    </LocaleProvider>
  );
}
