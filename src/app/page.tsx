import { BookingDateSection } from '@/components/BookingDateSection';
import { BusinessInfo } from '@/components/BusinessInfo';
import { ContactSection } from '@/components/ContactSection';
import { Header } from '@/components/Header';
import { PaymentCTA } from '@/components/PaymentCTA';
import { RoomGalleryPlaceholder } from '@/components/RoomGalleryPlaceholder';
import { RoomSummary } from '@/components/RoomSummary';
import { defaultLocale, messages } from '@/locales/messages';
import { AmenitiesSection } from '@/features/booking/AmenitiesSection';
import { GuideSection } from '@/features/booking/GuideSection';
import { PaymentSummary } from '@/features/booking/PaymentSummary';
import { PricingPolicySection } from '@/features/booking/PricingPolicySection';
import styles from './page.module.css';

export default function Home() {
  const t = messages[defaultLocale];

  return (
    <>
      <Header copy={t.header} />
      <main id="top" className={styles.shell}>
        <RoomGalleryPlaceholder copy={t.room} />
        <RoomSummary copy={t.room} />
        <BookingDateSection copy={t.booking} />
        <PaymentSummary copy={t.payment} />
        <AmenitiesSection copy={t.amenities} />
        <PricingPolicySection copy={t.pricing} />
        <GuideSection copy={t.guide} />
        <ContactSection copy={t.contact} />
        <BusinessInfo copy={t.business} />
      </main>
      <PaymentCTA copy={t.payment} />
    </>
  );
}
