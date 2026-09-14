import type { RowDataPacket } from 'mysql2';
import { getDatabasePool } from '@/lib/db';

const BOOKING_BUILDING_ID = 1;

type RoomAvailabilityRow = RowDataPacket & {
  room_no: string;
  overlapping_nights: number | string;
};

export type RoomAvailability = {
  availableRooms: Array<{ roomNo: string }>;
  partiallyAvailableRooms: Array<{ roomNo: string; availableNights: number; overlappingNights: number; requestedNights: number }>;
};

/**
 * Returns active rooms in building 1 grouped by how much their reservations
 * overlap the requested stay. Only each room's newest ICS snapshot is used;
 * older snapshots must not make a currently available room look occupied.
 */
export async function getRoomAvailability(checkIn: string, checkOut: string, requestedNights: number): Promise<RoomAvailability> {
  const [rows] = await getDatabasePool().execute<RoomAvailabilityRow[]>(
    `SELECT rooms.room_no,
            COALESCE(SUM(
              GREATEST(
                0,
                DATEDIFF(
                  LEAST(DATE(reservations.end_at), ?),
                  GREATEST(DATE(reservations.start_at), ?)
                )
              )
            ), 0) AS overlapping_nights
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
      GROUP BY rooms.id, rooms.room_no, rooms.weight
      ORDER BY overlapping_nights DESC, rooms.weight DESC, rooms.room_no ASC`,
    [checkOut, checkIn, checkOut, checkIn, BOOKING_BUILDING_ID, checkIn, checkOut],
  );

  const rooms = rows.map((row) => ({
    roomNo: row.room_no.trim(),
    overlappingNights: Math.min(requestedNights, Number(row.overlapping_nights)),
  }));

  return {
    availableRooms: rooms.filter((room) => room.overlappingNights === 0).map(({ roomNo }) => ({ roomNo })),
    partiallyAvailableRooms: rooms
      .filter((room) => room.overlappingNights > 0 && room.overlappingNights < requestedNights)
      .map((room) => ({ ...room, availableNights: requestedNights - room.overlappingNights, requestedNights })),
  };
}

export async function isRoomAvailable(roomNo: string, checkIn: string, checkOut: string, requestedNights: number): Promise<boolean> {
  const availability = await getRoomAvailability(checkIn, checkOut, requestedNights);
  return availability.availableRooms.some((room) => room.roomNo === roomNo);
}
