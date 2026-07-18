type CarouselControlsProps = {
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

export function CarouselControls({ previousLabel, nextLabel, onPrevious, onNext }: CarouselControlsProps) {
  return (
    <>
      <button className="carouselButton carouselButtonPrev" type="button" aria-label={previousLabel} onClick={onPrevious}>
        <span aria-hidden="true">‹</span>
      </button>
      <button className="carouselButton carouselButtonNext" type="button" aria-label={nextLabel} onClick={onNext}>
        <span aria-hidden="true">›</span>
      </button>
    </>
  );
}
