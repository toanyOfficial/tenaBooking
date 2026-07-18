type CarouselIndicatorsProps = {
  total: number;
  currentIndex: number;
  labelTemplate: string;
  groupLabel: string;
  onSelect: (index: number) => void;
};

export function CarouselIndicators({ total, currentIndex, labelTemplate, groupLabel, onSelect }: CarouselIndicatorsProps) {
  return (
    <div className="carouselDots" aria-label={groupLabel}>
      {Array.from({ length: total }, (_, index) => (
        <button
          className={index === currentIndex ? 'carouselDot active' : 'carouselDot'}
          type="button"
          key={index}
          aria-label={labelTemplate.replace('{index}', String(index + 1))}
          aria-current={index === currentIndex ? 'true' : undefined}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
