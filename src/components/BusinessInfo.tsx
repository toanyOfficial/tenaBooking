import { businessInfo } from '@/features/booking/businessConfig';

type BusinessCopy = { title: string; ready: string; labels: Record<string, string>; links: Array<{ label: string; href: string }>; footerLanguage: string; copyright: string };
const fields = ['companyName', 'representative', 'businessRegistrationNumber', 'ecommerceRegistrationNumber', 'address', 'email', 'phone', 'privacyOfficer', 'hostingProvider'] as const;

export function BusinessInfo({ copy, locale }: { copy: BusinessCopy; locale: string }) {
  return (
    <footer className="businessInfo" aria-labelledby="business-title">
      <h2 id="business-title">{copy.title}</h2>
      <dl>{fields.map((field) => <div key={field}><dt>{copy.labels[field]}</dt><dd>{businessInfo[field] || copy.ready}</dd></div>)}</dl>
      <nav aria-label={copy.title}>{copy.links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
      <div className="siteFooter"><strong>TOANY Medical Stay</strong><span>{copy.footerLanguage}: {locale}</span><span>{copy.copyright}</span></div>
    </footer>
  );
}
