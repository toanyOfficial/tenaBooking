export type AvailableRoom = { roomNo: string };

export type PartiallyAvailableRoom = AvailableRoom & { availableNights: number; overlappingNights: number; requestedNights: number };

export type RoomAvailabilityResponse =
  | { success: true; availableRooms: AvailableRoom[]; partiallyAvailableRooms: PartiallyAvailableRoom[] }
  | { success: false; message: string; errorCode?: string };
