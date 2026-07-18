type StayGuideCard = {
  id: string;
  title: string;
  benefitDescription: string;
  noteLabel: string;
  noteDescription: string;
  icon: 'price' | 'home' | 'cleaning';
};

type StayGuideCopy = {
  title: string;
  description: string;
  cards: StayGuideCard[];
};

function StayGuideIcon({ name }: { name: StayGuideCard['icon'] }) {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (name === 'price') return <svg {...common}><path d="M7 4h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" /><path d="M10 8h4" /><path d="M10 12h4" /></svg>;
  if (name === 'home') return <svg {...common}><path d="M4 11 12 5l8 6" /><path d="M6 10.5V19h12v-8.5" /><path d="M9 19v-5h6v5" /></svg>;
  return <svg {...common}><path d="M7 8h10" /><path d="M8 8l1 11h6l1-11" /><path d="M9 5h6l1 3H8l1-3Z" /><path d="M10 13h4" /></svg>;
}

export function StayGuideSection({ copy }: { copy: StayGuideCopy }) {
  return (
    <section className="card stayGuideSection" aria-labelledby="stay-guide-title">
      <h2 id="stay-guide-title">{copy.title}</h2>
      <p className="sectionIntro">{copy.description}</p>
      <div className="stayGuideGrid">
        {copy.cards.map((card) => (
          <article className="stayGuideCard" key={card.id}>
            <div className="stayGuideBenefit">
              <span className="stayGuideIcon"><StayGuideIcon name={card.icon} /></span>
              <h3>{card.title}</h3>
              <p>{card.benefitDescription}</p>
            </div>
            <div className="stayGuideNote">
              <strong>{card.noteLabel}</strong>
              <p>{card.noteDescription}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
