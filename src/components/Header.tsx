import { LanguageSelector } from '@/components/LanguageSelector';

type HeaderCopy = { brandPrefix: string; brandAccent: string };

export function Header({ copy }: { copy: HeaderCopy }) {
  return (
    <header className="appHeader">
      <a className="brand" href="#top" aria-label={`${copy.brandAccent} ${copy.brandPrefix}`}>
        <strong>{copy.brandAccent}</strong><span>{copy.brandPrefix}</span>
      </a>
      <LanguageSelector />
    </header>
  );
}
