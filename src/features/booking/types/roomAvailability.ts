export type AvailableRoom = { roomNo: string };

export type AvailableDateBlock = { start: string; end: string };

export type PartiallyAvailableRoom = AvailableRoom & { availableBlocks: AvailableDateBlock[] };

export type RoomAvailabilityResponse =
  | { success: true; availableRooms: AvailableRoom[]; partiallyAvailableRooms: PartiallyAvailableRoom[] }
  | { success: false; message: string; errorCode?: string };
