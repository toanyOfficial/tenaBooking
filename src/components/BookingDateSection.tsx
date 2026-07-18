type BookingCopy = {
  title: string;
  checkInLabel: string;
  checkOutLabel: string;
  placeholder: string;
  nightsLabel: string;
  nightsValue: string;
  helper: string;
};

export function BookingDateSection({ copy }: { copy: BookingCopy }) {
  return (
    <section className="card" aria-labelledby="booking-title">
      <h2 id="booking-title">{copy.title}</h2>
      <div className="dateGrid">
        <button className="dateCard" type="button">
          <span>{copy.checkInLabel}</span>
          <strong>{copy.placeholder}</strong>
        </button>
        <button className="dateCard" type="button">
          <span>{copy.checkOutLabel}</span>
          <strong>{copy.placeholder}</strong>
        </button>
      </div>
      <div className="nightsRow">
        <span>{copy.nightsLabel}</span>
        <strong>{copy.nightsValue}</strong>
      </div>
      <p className="helperText">{copy.helper}</p>
    </section>
  );
}
