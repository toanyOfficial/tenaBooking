'use client';

import { useMemo } from 'react';
import type { Locale } from '@/locales/messages';
import { addDays, calculateStayNights, formatDateForLocale, getTodayDateString, isDateBefore, isValidStayRange, MAX_STAY_NIGHTS, MIN_STAY_NIGHTS, parseDateString } from '@/lib/date';

type BookingCopy = {
  title: string;
  checkInLabel: string;
  checkOutLabel: string;
  selectDate: string;
  nightsLabel: string;
  nightsValue: string;
  selectSchedule: string;
  selectCheckOut: string;
  totalNights: string;
  oneNight: string;
  nights: string;
  minStayError: string;
  maxStayError: string;
  invalidDateError: string;
  checkOutAfterCheckInError: string;
  checkInPastError: string;
};

export type BookingDateState = {
  checkIn: string;
  checkOut: string;
};

function formatNightCount(nights: number, copy: BookingCopy) {
  return nights === 1 ? copy.oneNight : copy.nights.replace('{count}', String(nights));
}

export function BookingDateSection({ copy, locale, value, onChange }: { copy: BookingCopy; locale: Locale; value: BookingDateState; onChange: (value: BookingDateState) => void }) {
  const dates = value;
  const setDates = (updater: BookingDateState | ((previous: BookingDateState) => BookingDateState)) => {
    onChange(typeof updater === 'function' ? updater(dates) : updater);
  };
  const today = useMemo(() => getTodayDateString(), []);
  const minCheckOut = dates.checkIn ? addDays(dates.checkIn, MIN_STAY_NIGHTS) : '';
  const maxCheckOut = dates.checkIn ? addDays(dates.checkIn, MAX_STAY_NIGHTS) : '';
  const nights = dates.checkIn && dates.checkOut ? calculateStayNights(dates.checkIn, dates.checkOut) : null;
  const isValidRange = dates.checkIn && dates.checkOut ? isValidStayRange(dates.checkIn, dates.checkOut) : false;

  const error = useMemo(() => {
    if (dates.checkIn && !parseDateString(dates.checkIn)) return copy.invalidDateError;
    if (dates.checkIn && isDateBefore(dates.checkIn, today)) return copy.checkInPastError;
    if (!dates.checkOut) return '';
    if (!dates.checkIn) return copy.selectCheckOut;
    if (!parseDateString(dates.checkOut)) return copy.invalidDateError;
    if (!nights || nights < MIN_STAY_NIGHTS) return copy.checkOutAfterCheckInError;
    if (nights > MAX_STAY_NIGHTS) return copy.maxStayError;
    return '';
  }, [copy, dates.checkIn, dates.checkOut, nights, today]);

  const status = useMemo(() => {
    if (error) return error;
    if (!dates.checkIn && !dates.checkOut) return copy.selectSchedule;
    if (dates.checkIn && !dates.checkOut) return copy.selectCheckOut;
    if (nights && isValidRange) return copy.totalNights.replace('{nights}', formatNightCount(nights, copy));
    return copy.selectSchedule;
  }, [copy, dates.checkIn, dates.checkOut, error, isValidRange, nights]);

  const formattedCheckIn = dates.checkIn ? formatDateForLocale(dates.checkIn, locale) : copy.selectDate;
  const formattedCheckOut = dates.checkOut ? formatDateForLocale(dates.checkOut, locale) : copy.selectDate;

  return (
    <section className="card" aria-labelledby="booking-title">
      <h2 id="booking-title">{copy.title}</h2>
      <div className="dateGrid">
        <label className="dateCard" htmlFor="check-in-date">
          <span>{copy.checkInLabel}</span>
          <strong>{formattedCheckIn}</strong>
          <input
            id="check-in-date"
            type="date"
            value={dates.checkIn}
            min={today}
            aria-invalid={Boolean(error && dates.checkIn && !dates.checkOut)}
            aria-describedby="booking-date-status"
            onChange={(event) => {
              const nextCheckIn = event.target.value;
              setDates((previous) => ({
                checkIn: nextCheckIn,
                checkOut: previous.checkOut && isValidStayRange(nextCheckIn, previous.checkOut) ? previous.checkOut : ''
              }));
            }}
          />
        </label>
        <label className="dateCard" htmlFor="check-out-date" aria-disabled={!dates.checkIn}>
          <span>{copy.checkOutLabel}</span>
          <strong>{formattedCheckOut}</strong>
          <input
            id="check-out-date"
            type="date"
            value={dates.checkOut}
            min={minCheckOut}
            max={maxCheckOut}
            disabled={!dates.checkIn}
            aria-invalid={Boolean(error && dates.checkOut)}
            aria-describedby="booking-date-status"
            onChange={(event) => setDates((previous) => ({ ...previous, checkOut: event.target.value }))}
          />
        </label>
      </div>
      {dates.checkIn && dates.checkOut && nights && isValidRange ? (
        <div className="selectedSchedule" aria-live="polite">
          <span>{formattedCheckIn} - {formattedCheckOut}</span>
          <strong>{formatNightCount(nights, copy)}</strong>
        </div>
      ) : null}
      <div className="nightsRow">
        <span>{copy.nightsLabel}</span>
        <strong>{nights && isValidRange ? formatNightCount(nights, copy) : copy.nightsValue}</strong>
      </div>
      <p id="booking-date-status" className={error ? 'helperText errorText' : 'helperText'} aria-live="polite">
        {error ? `! ${error}` : status}
      </p>
    </section>
  );
}
