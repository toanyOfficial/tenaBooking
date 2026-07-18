type HeaderCopy = {
  brandPrefix: string;
  brandAccent: string;
  languageCode: string;
  languageLabel: string;
};

export function Header({ copy }: { copy: HeaderCopy }) {
  return (
    <header className="appHeader">
      <a className="brand" href="#top" aria-label={`${copy.brandPrefix} ${copy.brandAccent}`}>
        <span>{copy.brandPrefix}</span>
        <strong>{copy.brandAccent}</strong>
      </a>
      <button className="languageButton" type="button" aria-label={copy.languageLabel} disabled>
        {copy.languageCode}
        <span aria-hidden="true">⌄</span>
      </button>
    </header>
  );
}
