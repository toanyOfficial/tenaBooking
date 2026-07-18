type ContactCopy = {
  title: string;
  items: Array<{ label: string; value: string }>;
};

export function ContactSection({ copy }: { copy: ContactCopy }) {
  return (
    <section className="card" aria-labelledby="contact-title">
      <h2 id="contact-title">{copy.title}</h2>
      <div className="contactList">
        {copy.items.map((item) => (
          <button className="contactButton" type="button" key={item.label} disabled>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
