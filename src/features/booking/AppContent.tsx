'use client';

import { ContactSection } from '@/components/ContactSection';
import { Header } from '@/components/Header';
import { RoomGallery } from '@/components/RoomGallery';
import { RoomSummary } from '@/components/RoomSummary';
import { AmenitiesSection } from '@/features/booking/AmenitiesSection';
import { BookingFlow } from '@/features/booking/BookingFlow';
import { StayGuideSection } from '@/features/booking/StayGuideSection';
import { useLocale } from '@/features/booking/LocaleProvider';
import { roomAmenities, standardRoomImages } from '@/features/booking/roomData';
import type { Holiday } from '@/features/booking/types/holiday';
import styles from '@/app/page.module.css';

export function AppContent({ holidays }: { holidays: Holiday[] }) {
  const { locale, t } = useLocale();
  return (
    <>
      <Header copy={t.header} />
      <main id="top" className={styles.shell}>
        <BookingFlow locale={locale} copy={{ booking: t.booking, payment: t.payment, pricing: t.pricing, room: t.room, guide: t.guide }} holidays={holidays} />
        <RoomGallery images={standardRoomImages} copy={t.room} />
        <RoomSummary copy={t.room} />
        <AmenitiesSection copy={t.amenities} amenities={roomAmenities} />
        <StayGuideSection copy={t.stayGuide} />
        <ContactSection copy={t.contact} />
      </main>
    </>
  );
}
