type AmenitiesCopy = {
  title: string;
  items: string[];
};

export function AmenitiesSection({ copy }: { copy: AmenitiesCopy }) {
  return (
    <section className="card" aria-labelledby="amenities-title">
      <h2 id="amenities-title">{copy.title}</h2>
      <ul className="amenityGrid">
        {copy.items.map((item) => (
          <li key={item}>
            <span aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
