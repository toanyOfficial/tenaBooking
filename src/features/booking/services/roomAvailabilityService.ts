import type { RowDataPacket } from 'mysql2';
import { getDatabasePool } from '@/lib/db';

const BOOKING_BUILDING_ID = 1;
const dateColumnCandidates = ['stay_date', 'reservation_date', 'reserved_date', 'calendar_date', 'calendar_day', 'snapshot_date', 'date'] as const;
const availableColumnCandidates = ['is_available', 'available', 'available_yn', 'availability_status', 'status', 'is_reserved', 'reserved', 'is_booked', 'is_occupied'] as const;

type ColumnRow = RowDataPacket & { Field: string };
type RoomAvailabilityRow = RowDataPacket & { room_no: string | number; available_nights: number | string };
type SnapshotSchema = { dateColumn: string; availableExpression: string };

export type RoomAvailability = {
  availableRooms: Array<{ roomNo: string }>;
  partiallyAvailableRooms: Array<{ roomNo: string; availableNights: number; requestedNights: number }>;
};

let snapshotSchemaPromise: Promise<SnapshotSchema> | undefined;

function quoteIdentifier(identifier: string) {
  return `\`${identifier.replaceAll('`', '``')}\``;
}

async function readSnapshotSchema(): Promise<SnapshotSchema> {
  const [columnRows] = await getDatabasePool().query<ColumnRow[]>('SHOW COLUMNS FROM reservation_calendar_snapshot');
  const columns = new Set(columnRows.map((column) => column.Field));

  if (!columns.has('building_id') || !columns.has('room_no')) {
    throw new RoomAvailabilityError('DB_SCHEMA_MISMATCH', 'reservation_calendar_snapshot 테이블에 building_id와 room_no 컬럼이 필요합니다.');
  }

  const dateColumn = dateColumnCandidates.find((candidate) => columns.has(candidate));
  const availableColumn = availableColumnCandidates.find((candidate) => columns.has(candidate));
  if (!dateColumn || !availableColumn) {
    throw new RoomAvailabilityError(
      'DB_SCHEMA_MISMATCH',
      `reservation_calendar_snapshot의 날짜 또는 가용 상태 컬럼을 찾지 못했습니다. 확인된 컬럼: ${[...columns].join(', ')}`,
    );
  }

  const quotedAvailability = quoteIdentifier(availableColumn);
  const availableExpression = availableColumn === 'is_reserved' || availableColumn === 'reserved' || availableColumn === 'is_booked' || availableColumn === 'is_occupied'
    ? `${quotedAvailability} = 0`
    : availableColumn === 'status' || availableColumn === 'availability_status'
      ? `LOWER(${quotedAvailability}) IN ('available', 'vacant', 'open', 'true', '1')`
      : availableColumn === 'available_yn'
        ? `LOWER(${quotedAvailability}) IN ('y', 'yes', 'true', '1')`
        : `${quotedAvailability} = 1`;

  return { dateColumn, availableExpression };
}

async function getSnapshotSchema() {
  snapshotSchemaPromise ??= readSnapshotSchema().catch((error) => {
    snapshotSchemaPromise = undefined;
    throw error;
  });
  return snapshotSchemaPromise;
}

export class RoomAvailabilityError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'RoomAvailabilityError';
  }
}

/**
 * Reads the daily availability snapshot for building 1. Common legacy names
 * for the date and availability columns are detected before issuing the query.
 */
export async function getRoomAvailability(checkIn: string, checkOut: string, requestedNights: number): Promise<RoomAvailability> {
  const { dateColumn, availableExpression } = await getSnapshotSchema();
  const quotedDate = quoteIdentifier(dateColumn);
  const [rows] = await getDatabasePool().execute<RoomAvailabilityRow[]>(
    `SELECT room_no,
            COUNT(DISTINCT CASE WHEN ${availableExpression} THEN ${quotedDate} END) AS available_nights
       FROM reservation_calendar_snapshot
      WHERE building_id = ?
        AND ${quotedDate} >= ?
        AND ${quotedDate} < ?
      GROUP BY room_no
     HAVING available_nights > 0
      ORDER BY available_nights DESC, room_no ASC`,
    [BOOKING_BUILDING_ID, checkIn, checkOut],
  );

  const availability = rows.map((row) => ({ roomNo: String(row.room_no), availableNights: Number(row.available_nights) }));
  return {
    availableRooms: availability.filter((room) => room.availableNights === requestedNights).map(({ roomNo }) => ({ roomNo })),
    partiallyAvailableRooms: availability
      .filter((room) => room.availableNights > 0 && room.availableNights < requestedNights)
      .map((room) => ({ ...room, requestedNights })),
  };
}

export async function isRoomAvailable(roomNo: string, checkIn: string, checkOut: string, requestedNights: number): Promise<boolean> {
  const availability = await getRoomAvailability(checkIn, checkOut, requestedNights);
  return availability.availableRooms.some((room) => room.roomNo === roomNo);
}
