import { BusinessInfo } from '@/components/BusinessInfo';
import { ContactSection } from '@/components/ContactSection';
import { Header } from '@/components/Header';
import { RoomGallery } from '@/components/RoomGallery';
import { RoomSummary } from '@/components/RoomSummary';
import { defaultLocale, messages } from '@/locales/messages';
import { AmenitiesSection } from '@/features/booking/AmenitiesSection';
import { GuideSection } from '@/features/booking/GuideSection';
import { BookingFlow } from '@/features/booking/BookingFlow';
import { roomAmenities, standardRoomImages } from '@/features/booking/roomData';
import { getKoreanHolidays } from '@/features/booking/services/holidayService';
import styles from './page.module.css';

export default async function Home() {
  const t = messages[defaultLocale];
  const featuredAmenities = roomAmenities.filter((amenity) => amenity.featured);
  const holidayResults = await Promise.all([2026, 2027].map((year) => getKoreanHolidays(year)));
  const holidays = holidayResults.flatMap((result) => result.holidays);

  return (
    <>
      <Header copy={t.header} />
      <main id="top" className={styles.shell}>
        <RoomGallery images={standardRoomImages} copy={t.room} />
        <RoomSummary copy={t.room} featuredAmenities={featuredAmenities} amenityLabels={t.amenities.items} />
        <BookingFlow locale={defaultLocale} copy={{ booking: t.booking, payment: t.payment, pricing: t.pricing }} holidays={holidays} />
        <AmenitiesSection copy={t.amenities} amenities={roomAmenities} />
        <GuideSection copy={t.guide} />
        <ContactSection copy={t.contact} />
        <BusinessInfo copy={t.business} />
      </main>
    </>
  );
}
