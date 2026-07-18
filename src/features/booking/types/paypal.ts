import type { BookingSummary, RoomType } from '@/features/booking/bookingSummary';

export type CreatePayPalOrderRequest = { roomType: RoomType; checkIn: string; checkOut: string };
export type CreatePayPalOrderResponse =
  | { success: true; mode: 'paypal'; orderId: string; approvalUrl: string }
  | { success: true; mode: 'mock'; booking: BookingSummary }
  | { success: false; message: string };
