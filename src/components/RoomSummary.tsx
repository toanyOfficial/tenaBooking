import { IndependentStayNotice } from '@/components/IndependentStayNotice';
import { StayTimeInfo } from '@/components/StayTimeInfo';

type RoomSummaryCopy = {
  type: string;
  description: string;
  stayTimeTitle: string;
  checkInLabel: string;
  checkIn: string;
  checkOutLabel: string;
  checkOut: string;
  independence: { title: string; description: string };
};

export function RoomSummary({ copy }: { copy: RoomSummaryCopy }) {
  return (
    <section className="roomSummary" aria-labelledby="room-title">
      <h1 id="room-title">{copy.type}</h1>
      <p>{copy.description}</p>
      <StayTimeInfo title={copy.stayTimeTitle} checkInLabel={copy.checkInLabel} checkIn={copy.checkIn} checkOutLabel={copy.checkOutLabel} checkOut={copy.checkOut} />
      <IndependentStayNotice title={copy.independence.title} description={copy.independence.description} />
    </section>
  );
}
