type RoomGalleryCopy = {
  galleryLabel: string;
  galleryDescription: string;
  indicator: string;
};

export function RoomGalleryPlaceholder({ copy }: { copy: RoomGalleryCopy }) {
  return (
    <section className="gallery" aria-label={copy.galleryLabel}>
      <div className="galleryPanel" role="img" aria-label={copy.galleryDescription}>
        <div className="galleryLines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>{copy.galleryDescription}</p>
        <span className="galleryIndicator">{copy.indicator}</span>
      </div>
    </section>
  );
}
