'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/locales/messages';
import { addDays, calculateStayNights, formatDateForLocale, getTodayDateString, isDateBefore, isValidStayRange, MAX_STAY_NIGHTS, MIN_STAY_NIGHTS, parseDateString, toUtcDayNumber } from '@/lib/date';

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
  policyActionLabel: string;
};

export type BookingDateState = { checkIn: string; checkOut: string };

type CalendarDay = { date: string; label: number; inMonth: boolean };
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatNightCount(nights: number, copy: BookingCopy) {
  return nights === 1 ? copy.oneNight : copy.nights.replace('{count}', String(nights));
}

function monthTitle(monthDate: Date, locale: Locale) {
  const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH-u-ca-gregory', vi: 'vi-VN', ru: 'ru-RU' };
  return new Intl.DateTimeFormat(localeMap[locale], { timeZone: 'UTC', year: 'numeric', month: 'long' }).format(monthDate);
}

function toDateString(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function getMonthDays(monthDate: Date): CalendarDay[] {
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const first = new Date(Date.UTC(year, month, 1));
  const start = new Date(Date.UTC(year, month, 1 - first.getUTCDay()));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + index));
    return { date: toDateString(date), label: date.getUTCDate(), inMonth: date.getUTCMonth() === month };
  });
}

function getInitialMonth(checkIn: string, today: string) {
  const parsed = parseDateString(checkIn || today);
  return new Date(Date.UTC(parsed?.year ?? new Date().getUTCFullYear(), (parsed?.month ?? 1) - 1, 1));
}

export function BookingDateSection({ copy, locale, value, onChange, policyActionLabel, onPolicyAction }: { copy: BookingCopy; locale: Locale; value: BookingDateState; onChange: (value: BookingDateState) => void; policyActionLabel?: string; onPolicyAction?: () => void }) {
  const dates = value;
  const today = useMemo(() => getTodayDateString(), []);
  const [open, setOpen] = useState(false);
  const [activeMonth, setActiveMonth] = useState(() => getInitialMonth(dates.checkIn, today));
  const [calendarMessage, setCalendarMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const nights = dates.checkIn && dates.checkOut ? calculateStayNights(dates.checkIn, dates.checkOut) : null;
  const isValidRange = dates.checkIn && dates.checkOut ? isValidStayRange(dates.checkIn, dates.checkOut) : false;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => { if (!dialogRef.current?.contains(event.target as Node)) setOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); openButtonRef.current?.focus(); } };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [open]);

  const error = useMemo(() => {
    if (calendarMessage) return calendarMessage;
    if (dates.checkIn && !parseDateString(dates.checkIn)) return copy.invalidDateError;
    if (dates.checkIn && isDateBefore(dates.checkIn, today)) return copy.checkInPastError;
    if (!dates.checkOut) return '';
    if (!dates.checkIn) return copy.selectCheckOut;
    if (!parseDateString(dates.checkOut)) return copy.invalidDateError;
    if (!nights || nights < MIN_STAY_NIGHTS) return copy.checkOutAfterCheckInError;
    if (nights > MAX_STAY_NIGHTS) return copy.maxStayError;
    return '';
  }, [calendarMessage, copy, dates.checkIn, dates.checkOut, nights, today]);

  const status = useMemo(() => {
    if (error) return error;
    if (!dates.checkIn && !dates.checkOut) return copy.selectSchedule;
    if (dates.checkIn && !dates.checkOut) return copy.selectCheckOut;
    if (nights && isValidRange) return '';
    return copy.selectSchedule;
  }, [copy, dates.checkIn, dates.checkOut, error, isValidRange, nights]);

  const formattedCheckIn = dates.checkIn ? formatDateForLocale(dates.checkIn, locale) : copy.selectDate;
  const formattedCheckOut = dates.checkOut ? formatDateForLocale(dates.checkOut, locale) : copy.selectDate;
  const startDay = toUtcDayNumber(dates.checkIn);
  const endDay = toUtcDayNumber(dates.checkOut);
  const currentDays = getMonthDays(activeMonth);
  const nextMonth = new Date(Date.UTC(activeMonth.getUTCFullYear(), activeMonth.getUTCMonth() + 1, 1));
  const nextDays = getMonthDays(nextMonth);

  const openCalendar = () => { setCalendarMessage(''); setActiveMonth(getInitialMonth(dates.checkIn, today)); setOpen(true); };
  const selectDate = (date: string) => {
    setCalendarMessage('');
    if (isDateBefore(date, today)) { setCalendarMessage(copy.checkInPastError); return; }
    if (!dates.checkIn || (dates.checkIn && dates.checkOut)) { onChange({ checkIn: date, checkOut: '' }); return; }
    const nextNights = calculateStayNights(dates.checkIn, date);
    if (!nextNights) { setCalendarMessage(copy.checkOutAfterCheckInError); onChange({ checkIn: date, checkOut: '' }); return; }
    onChange({ checkIn: dates.checkIn, checkOut: date });
    if (nextNights > MAX_STAY_NIGHTS) setCalendarMessage(copy.maxStayError);
    else setOpen(false);
  };

  const renderMonth = (monthDate: Date, days: CalendarDay[]) => (
    <div className="calendarMonth">
      <h3>{monthTitle(monthDate, locale)}</h3>
      <div className="calendarWeekdays" aria-hidden="true">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendarGrid" role="grid">
        {days.map((day) => {
          const dayNumber = toUtcDayNumber(day.date);
          const isPast = isDateBefore(day.date, today);
          const isStart = dates.checkIn === day.date;
          const isEnd = dates.checkOut === day.date;
          const isInside = startDay !== null && endDay !== null && dayNumber !== null && dayNumber > startDay && dayNumber < endDay;
          return (
            <button
              key={day.date}
              type="button"
              role="gridcell"
              disabled={isPast}
              aria-pressed={isStart || isEnd || isInside}
              className={[!day.inMonth ? 'mutedDay' : '', isStart ? 'rangeStart' : '', isEnd ? 'rangeEnd' : '', isInside ? 'rangeInside' : ''].filter(Boolean).join(' ')}
              onClick={() => selectDate(day.date)}
            >
              <span>{day.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="card bookingHero" aria-labelledby="booking-title">
      <div className="bookingHeaderRow">
        <h2 id="booking-title">{copy.title}</h2>
        {policyActionLabel && onPolicyAction ? <button type="button" className="policyLinkButton" onClick={onPolicyAction}>{policyActionLabel}</button> : null}
      </div>
      <div className="dateGrid">
        <button ref={openButtonRef} type="button" className="dateCard" aria-label={`${copy.checkInLabel}: ${formattedCheckIn}`} onClick={openCalendar}>
          <span>{copy.checkInLabel}</span><strong>{formattedCheckIn}</strong>
        </button>
        <button type="button" className="dateCard" aria-label={`${copy.checkOutLabel}: ${formattedCheckOut}`} onClick={openCalendar}>
          <span>{copy.checkOutLabel}</span><strong>{formattedCheckOut}</strong>
        </button>
      </div>
      {open ? (
        <div className="calendarOverlay" role="presentation">
          <div className="calendarDialog" role="dialog" aria-modal="true" aria-labelledby="booking-title" ref={dialogRef}>
            <div className="calendarHeader">
              <button type="button" aria-label="Previous month" onClick={() => setActiveMonth((month) => new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() - 1, 1)))}>‹</button>
              <strong>{monthTitle(activeMonth, locale)}</strong>
              <button type="button" aria-label="Next month" onClick={() => setActiveMonth((month) => new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1)))}>›</button>
            </div>
            <div className="calendarMonths">{renderMonth(activeMonth, currentDays)}{renderMonth(nextMonth, nextDays)}</div>
          </div>
        </div>
      ) : null}
      {status ? <p id="booking-date-status" className={error ? 'helperText errorText' : 'helperText'} aria-live="polite">{error ? `! ${error}` : status}</p> : null}
    </section>
  );
}
