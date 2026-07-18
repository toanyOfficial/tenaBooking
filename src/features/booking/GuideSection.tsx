type GuideCopy = {
  title: string;
  items: Array<{ title: string; description: string }>;
};

export function GuideSection({ copy }: { copy: GuideCopy }) {
  return (
    <section className="card" aria-labelledby="guide-title">
      <h2 id="guide-title">{copy.title}</h2>
      <div className="guideList">
        {copy.items.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
