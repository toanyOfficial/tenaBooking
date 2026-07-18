import { FeaturedAmenities } from '@/components/FeaturedAmenities';
import { IndependentStayNotice } from '@/components/IndependentStayNotice';
import { StayTimeInfo } from '@/components/StayTimeInfo';
import type { Amenity, AmenityKey } from '@/features/booking/roomData';

type RoomSummaryCopy = {
  type: string;
  description: string;
  bedTypeLabel: string;
  bedType: string;
  stayTimeTitle: string;
  checkInLabel: string;
  checkIn: string;
  checkOutLabel: string;
  checkOut: string;
  featuredAmenitiesTitle: string;
  independence: { title: string; description: string };
};

export function RoomSummary({ copy, featuredAmenities, amenityLabels }: { copy: RoomSummaryCopy; featuredAmenities: Amenity[]; amenityLabels: Record<AmenityKey, string> }) {
  return (
    <section className="roomSummary" aria-labelledby="room-title">
      <h1 id="room-title">{copy.type}</h1>
      <p>{copy.description}</p>
      <div className="bedBadge"><span>{copy.bedTypeLabel}</span><strong>{copy.bedType}</strong></div>
      <StayTimeInfo title={copy.stayTimeTitle} checkInLabel={copy.checkInLabel} checkIn={copy.checkIn} checkOutLabel={copy.checkOutLabel} checkOut={copy.checkOut} />
      <FeaturedAmenities title={copy.featuredAmenitiesTitle} amenities={featuredAmenities} labels={amenityLabels} />
      <IndependentStayNotice title={copy.independence.title} description={copy.independence.description} />
    </section>
  );
}
