type StayTimeInfoProps = { title: string; checkInLabel: string; checkIn: string; checkOutLabel: string; checkOut: string };
export function StayTimeInfo({ title, checkInLabel, checkIn, checkOutLabel, checkOut }: StayTimeInfoProps) {
  return (
    <div className="stayTime" aria-label={title}>
      <div><span>{checkInLabel}</span><strong>{checkIn}</strong></div>
      <div><span>{checkOutLabel}</span><strong>{checkOut}</strong></div>
    </div>
  );
}
