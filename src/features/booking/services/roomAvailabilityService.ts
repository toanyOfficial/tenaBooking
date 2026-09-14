import type { RowDataPacket } from 'mysql2';
import { addDays } from '@/lib/date';
import { getDatabasePool } from '@/lib/db';

const BOOKING_BUILDING_ID = 1;

type RoomAvailabilityRow = RowDataPacket & {
  room_id: number;
  room_no: string;
  reservation_start: string | null;
  reservation_end: string | null;
};

export type AvailableDateBlock = { start: string; end: string };
export type RoomAvailability = {
  availableRooms: Array<{ roomNo: string }>;
  partiallyAvailableRooms: Array<{ roomNo: string; availableBlocks: AvailableDateBlock[] }>;
};

function getStayDates(checkIn: string, requestedNights: number) {
  return Array.from({ length: requestedNights }, (_, index) => addDays(checkIn, index));
}

function toAvailableBlocks(availableDates: string[]): AvailableDateBlock[] {
  return availableDates.reduce<AvailableDateBlock[]>((blocks, date) => {
    const previous = blocks.at(-1);
    if (previous?.end === date) {
      previous.end = addDays(date, 1);
    } else {
      blocks.push({ start: date, end: addDays(date, 1) });
    }
    return blocks;
  }, []);
}

/** Uses each room's newest ICS snapshot to find the exact available date blocks. */
export async function getRoomAvailability(checkIn: string, checkOut: string, requestedNights: number): Promise<RoomAvailability> {
  const [rows] = await getDatabasePool().execute<RoomAvailabilityRow[]>(
    `SELECT rooms.id AS room_id,
            rooms.room_no,
            DATE_FORMAT(reservations.start_at, '%Y-%m-%d') AS reservation_start,
            DATE_FORMAT(reservations.end_at, '%Y-%m-%d') AS reservation_end
       FROM client_rooms AS rooms
       LEFT JOIN (
         SELECT snapshot.room_id, snapshot.start_at, snapshot.end_at
           FROM reservation_calendar_snapshot AS snapshot
           INNER JOIN (
             SELECT room_id, MAX(snapshot_at) AS latest_snapshot_at
               FROM reservation_calendar_snapshot
              GROUP BY room_id
           ) AS latest
             ON latest.room_id = snapshot.room_id
            AND latest.latest_snapshot_at = snapshot.snapshot_at
       ) AS reservations
         ON reservations.room_id = rooms.id
        AND reservations.start_at < TIMESTAMP(?, rooms.checkout_time)
        AND reservations.end_at > TIMESTAMP(?, rooms.checkin_time)
      WHERE rooms.building_id = ?
        AND rooms.open_yn = 1
        AND rooms.facility_yn = 1
        AND rooms.start_date <= ?
        AND (rooms.end_date IS NULL OR rooms.end_date >= ?)
      ORDER BY rooms.weight DESC, rooms.room_no ASC, reservations.start_at ASC`,
    [checkOut, checkIn, BOOKING_BUILDING_ID, checkIn, checkOut],
  );

  const stayDates = getStayDates(checkIn, requestedNights);
  const rooms = new Map<number, { roomNo: string; occupiedDates: Set<string> }>();

  for (const row of rows) {
    const room = rooms.get(row.room_id) ?? { roomNo: row.room_no.trim(), occupiedDates: new Set<string>() };
    if (row.reservation_start && row.reservation_end) {
      for (const date of stayDates) {
        if (date >= row.reservation_start && date < row.reservation_end) room.occupiedDates.add(date);
      }
    }
    rooms.set(row.room_id, room);
  }

  const availability = [...rooms.values()].map((room) => {
    const availableDates = stayDates.filter((date) => !room.occupiedDates.has(date));
    return {
      roomNo: room.roomNo,
      availableBlocks: toAvailableBlocks(availableDates),
      availableNights: availableDates.length,
      overlappingNights: requestedNights - availableDates.length,
      requestedNights,
    };
  });

  return {
    availableRooms: availability.filter((room) => room.availableNights === requestedNights).map(({ roomNo }) => ({ roomNo })),
    partiallyAvailableRooms: availability
      .filter((room) => room.availableNights > 0 && room.availableNights < requestedNights)
      .sort((left, right) => right.overlappingNights - left.overlappingNights || left.roomNo.localeCompare(right.roomNo))
      .map(({ roomNo, availableBlocks }) => ({ roomNo, availableBlocks })),
  };
}

export async function isRoomAvailable(roomNo: string, checkIn: string, checkOut: string, requestedNights: number): Promise<boolean> {
  const availability = await getRoomAvailability(checkIn, checkOut, requestedNights);
  return availability.availableRooms.some((room) => room.roomNo === roomNo);
}
