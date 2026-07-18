type PaymentCopy = {
  title: string;
  roomCharge: string;
  extraCharge: string;
  total: string;
  paypal: string;
  disabledNotice: string;
};

export function PaymentSummary({ copy }: { copy: PaymentCopy }) {
  const rows = [
    { label: copy.roomCharge, value: '₩0' },
    { label: copy.extraCharge, value: '₩0' }
  ];

  return (
    <section className="card" aria-labelledby="payment-title">
      <h2 id="payment-title">{copy.title}</h2>
      <dl className="paymentRows">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
        <div className="totalRow">
          <dt>{copy.total}</dt>
          <dd>₩0</dd>
        </div>
      </dl>
      <button className="primaryButton fullWidth" type="button" disabled>
        {copy.paypal}
      </button>
      <p className="helperText">{copy.disabledNotice}</p>
    </section>
  );
}
