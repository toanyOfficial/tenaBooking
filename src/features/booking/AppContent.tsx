'use client';

import { BusinessInfo } from '@/components/BusinessInfo';
import { ContactSection } from '@/components/ContactSection';
import { Header } from '@/components/Header';
import { RoomGallery } from '@/components/RoomGallery';
import { RoomSummary } from '@/components/RoomSummary';
import { AmenitiesSection } from '@/features/booking/AmenitiesSection';
import { BookingFlow } from '@/features/booking/BookingFlow';
import { GuideSection } from '@/features/booking/GuideSection';
import { useLocale } from '@/features/booking/LocaleProvider';
import { roomAmenities, standardRoomImages } from '@/features/booking/roomData';
import type { Holiday } from '@/features/booking/types/holiday';
import styles from '@/app/page.module.css';

export function AppContent({ holidays }: { holidays: Holiday[] }) {
  const { locale, t } = useLocale();
  const featuredAmenities = roomAmenities.filter((amenity) => amenity.featured);
  return (
    <>
      <Header copy={t.header} />
      <main id="top" className={styles.shell}>
        <RoomGallery images={standardRoomImages} copy={t.room} />
        <RoomSummary copy={t.room} featuredAmenities={featuredAmenities} amenityLabels={t.amenities.items} />
        <BookingFlow locale={locale} copy={{ booking: t.booking, payment: t.payment, pricing: t.pricing, room: t.room }} holidays={holidays} />
        <AmenitiesSection copy={t.amenities} amenities={roomAmenities} />
        <GuideSection copy={t.guide} />
        <ContactSection copy={t.contact} />
        <BusinessInfo copy={t.business} />
      </main>
    </>
  );
}
