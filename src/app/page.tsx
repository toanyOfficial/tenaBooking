import { BookingDateSection } from '@/components/BookingDateSection';
import { BusinessInfo } from '@/components/BusinessInfo';
import { ContactSection } from '@/components/ContactSection';
import { Header } from '@/components/Header';
import { PaymentCTA } from '@/components/PaymentCTA';
import { RoomGallery } from '@/components/RoomGallery';
import { RoomSummary } from '@/components/RoomSummary';
import { defaultLocale, messages } from '@/locales/messages';
import { AmenitiesSection } from '@/features/booking/AmenitiesSection';
import { GuideSection } from '@/features/booking/GuideSection';
import { PaymentSummary } from '@/features/booking/PaymentSummary';
import { PricingPolicySection } from '@/features/booking/PricingPolicySection';
import { roomAmenities, standardRoomImages } from '@/features/booking/roomData';
import styles from './page.module.css';

export default function Home() {
  const t = messages[defaultLocale];
  const featuredAmenities = roomAmenities.filter((amenity) => amenity.featured);

  return (
    <>
      <Header copy={t.header} />
      <main id="top" className={styles.shell}>
        <RoomGallery images={standardRoomImages} copy={t.room} />
        <RoomSummary copy={t.room} featuredAmenities={featuredAmenities} amenityLabels={t.amenities.items} />
        <BookingDateSection copy={t.booking} locale={defaultLocale} />
        <PaymentSummary copy={t.payment} />
        <AmenitiesSection copy={t.amenities} amenities={roomAmenities} />
        <PricingPolicySection copy={t.pricing} />
        <GuideSection copy={t.guide} />
        <ContactSection copy={t.contact} />
        <BusinessInfo copy={t.business} />
      </main>
      <PaymentCTA copy={t.payment} />
    </>
  );
}
