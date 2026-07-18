type RoomSummaryCopy = {
  name: string;
  description: string;
  bedTypeLabel: string;
  bedType: string;
  checkInLabel: string;
  checkIn: string;
  checkOutLabel: string;
  checkOut: string;
};

export function RoomSummary({ copy }: { copy: RoomSummaryCopy }) {
  const details = [
    { label: copy.bedTypeLabel, value: copy.bedType },
    { label: copy.checkInLabel, value: copy.checkIn },
    { label: copy.checkOutLabel, value: copy.checkOut }
  ];

  return (
    <section className="roomSummary" aria-labelledby="room-title">
      <h1 id="room-title">{copy.name}</h1>
      <p>{copy.description}</p>
      <dl className="summaryGrid">
        {details.map((detail) => (
          <div className="summaryItem" key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
