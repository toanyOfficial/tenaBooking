import { contactConfig } from '@/features/booking/businessConfig';

type ContactCopy = { title: string; notice: string; unavailable: string; items: Array<{ id: 'kakao' | 'email' | 'phone'; label: string; description: string; button: string; response: string }> };

function getHref(id: 'kakao' | 'email' | 'phone') {
  if (id === 'email' && contactConfig.email) return `mailto:${contactConfig.email}`;
  if (id === 'phone' && contactConfig.phone) return `tel:${contactConfig.phone}`;
  if (id === 'kakao' && contactConfig.kakaoUrl) return contactConfig.kakaoUrl;
  return '';
}

export function ContactSection({ copy }: { copy: ContactCopy }) {
  return (
    <section className="card" aria-labelledby="contact-title">
      <h2 id="contact-title">{copy.title}</h2>
      <div className="contactList">
        {copy.items.map((item) => {
          const href = getHref(item.id);
          return (
            <article className="contactCard" key={item.id}>
              <div><h3>{item.label}</h3><p>{item.description}</p><small>{contactConfig.businessHours || item.response}</small></div>
              {href ? <a className="contactButton" href={href} target={item.id === 'kakao' ? '_blank' : undefined} rel={item.id === 'kakao' ? 'noopener noreferrer' : undefined}>{item.button}</a> : <span className="contactButton disabled">{copy.unavailable}</span>}
            </article>
          );
        })}
      </div>
      <p className="helperText">{copy.notice}</p>
    </section>
  );
}
