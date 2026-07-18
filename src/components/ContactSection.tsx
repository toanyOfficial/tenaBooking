type ContactCopy = { title: string; notice: string; unavailable: string; items: Array<{ id: 'kakao' | 'email' | 'phone'; label: string; description: string; button: string; response: string }> };

export function ContactSection({ copy }: { copy: ContactCopy }) {
  return (
    <section className="card" aria-labelledby="contact-title">
      <h2 id="contact-title">{copy.title}</h2>
      <button type="button" className="contactButton contactSingleButton" disabled>{copy.title}</button>
      <p className="helperText">{copy.notice}</p>
    </section>
  );
}
