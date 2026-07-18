type PaymentCopy = {
  paypal: string;
  stickyTotalLabel: string;
};

export function PaymentCTA({ copy }: { copy: PaymentCopy }) {
  return (
    <aside className="paymentCta" aria-label={copy.paypal}>
      <div>
        <span>{copy.stickyTotalLabel}</span>
        <strong>₩0</strong>
      </div>
      <button className="primaryButton" type="button" disabled>
        {copy.paypal}
      </button>
    </aside>
  );
}
