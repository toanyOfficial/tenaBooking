'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { CarouselControls } from '@/components/CarouselControls';
import { CarouselIndicators } from '@/components/CarouselIndicators';
import type { RoomImage, RoomImageKey } from '@/features/booking/roomData';

type RoomGalleryProps = {
  images: RoomImage[];
  copy: {
    galleryLabel: string;
    imageCounter: string;
    previousImage: string;
    nextImage: string;
    goToImage: string;
    images: Record<RoomImageKey, string>;
  };
};

const swipeThreshold = 48;

export function RoomGallery({ images, copy }: RoomGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fallbackIds, setFallbackIds] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const total = images.length;
  const currentImage = images[currentIndex];
  const hasMultipleImages = total > 1;

  const counter = useMemo(
    () => copy.imageCounter.replace('{current}', String(total === 0 ? 0 : currentIndex + 1)).replace('{total}', String(total)),
    [copy.imageCounter, currentIndex, total]
  );

  const goTo = (index: number) => {
    if (total === 0) return;
    setCurrentIndex((index + total) % total);
  };

  const handleSwipeEnd = (x: number, y: number) => {
    if (!touchStart || !hasMultipleImages) return;
    const deltaX = x - touchStart.x;
    const deltaY = y - touchStart.y;

    setTouchStart(null);
    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    goTo(currentIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <section className="gallery" aria-label={copy.galleryLabel}>
      <div
        className="galleryPanel"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') goTo(currentIndex - 1);
          if (event.key === 'ArrowRight') goTo(currentIndex + 1);
        }}
        onPointerDown={(event) => setTouchStart({ x: event.clientX, y: event.clientY })}
        onPointerUp={(event) => handleSwipeEnd(event.clientX, event.clientY)}
        onPointerCancel={() => setTouchStart(null)}
      >
        {currentImage && !fallbackIds.has(currentImage.id) ? (
          <Image
            src={currentImage.src}
            alt={copy.images[currentImage.id]}
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 520px) 100vw, 500px"
            className="roomImage"
            onError={() => setFallbackIds((previous) => new Set(previous).add(currentImage.id))}
          />
        ) : (
          <div className="galleryFallback" role="img" aria-label={currentImage ? copy.images[currentImage.id] : copy.galleryLabel}>
            <span>{copy.galleryLabel}</span>
          </div>
        )}
        <span className="galleryIndicator" aria-live="polite">{counter}</span>
        {hasMultipleImages ? <CarouselControls previousLabel={copy.previousImage} nextLabel={copy.nextImage} onPrevious={() => goTo(currentIndex - 1)} onNext={() => goTo(currentIndex + 1)} /> : null}
      </div>
      {hasMultipleImages ? <CarouselIndicators total={total} currentIndex={currentIndex} labelTemplate={copy.goToImage} groupLabel={copy.galleryLabel} onSelect={goTo} /> : null}
    </section>
  );
}
