type BusinessCopy = {
  title: string;
  rows: Array<{ label: string; value: string }>;
  terms: string;
  privacy: string;
};

export function BusinessInfo({ copy }: { copy: BusinessCopy }) {
  return (
    <footer className="businessInfo" aria-labelledby="business-title">
      <h2 id="business-title">{copy.title}</h2>
      <dl>
        {copy.rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <nav aria-label="정책 링크">
        <a href="#terms">{copy.terms}</a>
        <a href="#privacy">{copy.privacy}</a>
      </nav>
    </footer>
  );
}
