type PricingCopy = {
  title: string;
  rateTitle: string;
  rates: Array<{ label: string; price: string; description: string }>;
  refundTitle: string;
  refunds: Array<{ period: string; penalty: string }>;
};

export function PricingPolicySection({ copy }: { copy: PricingCopy }) {
  return (
    <section className="card" aria-labelledby="policy-title">
      <h2 id="policy-title">{copy.title}</h2>
      <div className="policyBlock">
        <h3>{copy.rateTitle}</h3>
        <div className="rateList">
          {copy.rates.map((rate) => (
            <article key={rate.label}>
              <div>
                <strong>{rate.label}</strong>
                <span>{rate.description}</span>
              </div>
              <b>{rate.price}</b>
            </article>
          ))}
        </div>
      </div>
      <div className="policyBlock">
        <h3>{copy.refundTitle}</h3>
        <dl className="refundList">
          {copy.refunds.map((refund) => (
            <div key={refund.period}>
              <dt>{refund.period}</dt>
              <dd>{refund.penalty}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
