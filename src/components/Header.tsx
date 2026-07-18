import { LanguageSelector } from '@/components/LanguageSelector';

type HeaderCopy = { brandPrefix: string; brandAccent: string };

export function Header({ copy }: { copy: HeaderCopy }) {
  return (
    <header className="appHeader">
      <a className="brand" href="#top" aria-label={`${copy.brandPrefix} ${copy.brandAccent}`}>
        <span>{copy.brandPrefix}</span><strong>{copy.brandAccent}</strong>
      </a>
      <LanguageSelector />
    </header>
  );
}
