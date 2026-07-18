import { AmenityIcon } from '@/components/AmenityIcon';
import type { Amenity, AmenityKey } from '@/features/booking/roomData';

type AmenitiesCopy = {
  title: string;
  items: Record<AmenityKey, string>;
};

export function AmenitiesSection({ copy, amenities }: { copy: AmenitiesCopy; amenities: Amenity[] }) {
  return (
    <section className="card" aria-labelledby="amenities-title">
      <h2 id="amenities-title">{copy.title}</h2>
      <ul className="amenityGrid">
        {amenities.map((amenity) => (
          <li key={amenity.id}>
            <AmenityIcon name={amenity.icon} />
            <span>{copy.items[amenity.id]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
