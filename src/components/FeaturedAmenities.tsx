import { AmenityIcon } from '@/components/AmenityIcon';
import type { Amenity, AmenityKey } from '@/features/booking/roomData';

type FeaturedAmenitiesProps = { title: string; amenities: Amenity[]; labels: Record<AmenityKey, string> };
export function FeaturedAmenities({ title, amenities, labels }: FeaturedAmenitiesProps) {
  return (
    <div className="featuredAmenities" aria-label={title}>
      {amenities.map((amenity) => (
        <div key={amenity.id}>
          <AmenityIcon name={amenity.icon} />
          <span>{labels[amenity.id]}</span>
        </div>
      ))}
    </div>
  );
}
