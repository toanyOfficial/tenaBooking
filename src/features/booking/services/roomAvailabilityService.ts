import type { RowDataPacket } from 'mysql2';
import { getDatabasePool } from '@/lib/db';

const BOOKING_BUILDING_ID = 1;

type RoomAvailabilityRow = RowDataPacket & {
  room_no: string | number;
  available_nights: number | string;
};

export type RoomAvailability = {
  availableRooms: Array<{ roomNo: string }>;
  partiallyAvailableRooms: Array<{ roomNo: string; availableNights: number; requestedNights: number }>;
};

/**
 * Reads the daily availability snapshot for building 1. Checkout is excluded
 * because a room can be occupied by a new guest after the prior guest leaves.
 */
export async function getRoomAvailability(checkIn: string, checkOut: string, requestedNights: number): Promise<RoomAvailability> {
  const [rows] = await getDatabasePool().execute<RoomAvailabilityRow[]>(
    `SELECT room_no,
            COUNT(DISTINCT CASE WHEN is_available = 1 THEN stay_date END) AS available_nights
       FROM reservation_calendar_snapshot
      WHERE building_id = ?
        AND stay_date >= ?
        AND stay_date < ?
      GROUP BY room_no
     HAVING available_nights > 0
      ORDER BY available_nights DESC, room_no ASC`,
    [BOOKING_BUILDING_ID, checkIn, checkOut],
  );

  const availability = rows.map((row) => ({ roomNo: String(row.room_no), availableNights: Number(row.available_nights) }));

  return {
    availableRooms: availability
      .filter((room) => room.availableNights === requestedNights)
      .map(({ roomNo }) => ({ roomNo })),
    partiallyAvailableRooms: availability
      .filter((room) => room.availableNights > 0 && room.availableNights < requestedNights)
      .map((room) => ({ ...room, requestedNights })),
  };
}

export async function isRoomAvailable(roomNo: string, checkIn: string, checkOut: string, requestedNights: number): Promise<boolean> {
  const availability = await getRoomAvailability(checkIn, checkOut, requestedNights);
  return availability.availableRooms.some((room) => room.roomNo === roomNo);
}
