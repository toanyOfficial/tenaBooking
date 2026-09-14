'use client';

import { useEffect, useRef } from 'react';
import type { PartiallyAvailableRoom } from '@/features/booking/types/roomAvailability';
import type { Locale } from '@/locales/messages';

type Props = {
  open: boolean;
  loading: boolean;
  locale: Locale;
  availableRooms: Array<{ roomNo: string }>;
  partiallyAvailableRooms: PartiallyAvailableRoom[];
  selectedRoomNo: string;
  onSelect: (roomNo: string) => void;
  onClose: () => void;
  onContinue: () => void;
};

const copies = {
  ko: { title: '투숙 가능한 객실을 선택해 주세요', description: '선택한 기간 전체에 투숙 가능한 객실입니다.', loading: '객실 일정을 확인하고 있습니다.', empty: '선택한 기간 전체에 투숙 가능한 객실이 없습니다.', partialTitle: '예약 기간이 일부 겹치는 객실', partialDescription: '기존 예약과 많이 겹치는 객실부터 표시합니다.', overlap: '{overlap}박 겹침 · {available}박 가능', cancel: '취소', continue: '선택한 객실로 계속하기' },
  en: { title: 'Select an available room', description: 'These rooms are available for your entire stay.', loading: 'Checking room availability.', empty: 'No room is available for the entire selected stay.', partialTitle: 'Rooms with partial reservation overlap', partialDescription: 'Rooms with more overlapping reserved nights are shown first.', overlap: '{overlap} nights overlap · {available} nights available', cancel: 'Cancel', continue: 'Continue with selected room' },
} as const;

export function RoomAvailabilitySheet({ open, loading, locale, availableRooms, partiallyAvailableRooms, selectedRoomNo, onSelect, onClose, onContinue }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const copy = locale === 'ko' ? copies.ko : copies.en;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !loading) onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [loading, onClose, open]);

  if (!open) return null;

  return (
    <div className="sheetBackdrop" onClick={() => { if (!loading) onClose(); }}>
      <section className="paymentSheet roomAvailabilitySheet" role="dialog" aria-modal="true" aria-labelledby="room-availability-title" aria-describedby="room-availability-description" onClick={(event) => event.stopPropagation()}>
        <div className="modalTitleRow">
          <h2 id="room-availability-title">{copy.title}</h2>
          <button ref={closeButtonRef} type="button" className="policyCloseButton" aria-label={copy.cancel} onClick={onClose} disabled={loading}>×</button>
        </div>
        <p id="room-availability-description">{copy.description}</p>

        {loading ? <p className="roomAvailabilityState" role="status">{copy.loading}</p> : (
          <>
            {availableRooms.length ? (
              <fieldset className="availableRoomList">
                <legend className="srOnly">{copy.title}</legend>
                {availableRooms.map((room) => (
                  <label key={room.roomNo} className={selectedRoomNo === room.roomNo ? 'roomOption selected' : 'roomOption'}>
                    <input type="radio" name="available-room" value={room.roomNo} checked={selectedRoomNo === room.roomNo} onChange={() => onSelect(room.roomNo)} />
                    <span>{room.roomNo}</span>
                  </label>
                ))}
              </fieldset>
            ) : <p className="roomAvailabilityState">{copy.empty}</p>}

            {partiallyAvailableRooms.length ? (
              <aside className="partialRoomSection" aria-labelledby="partial-room-title">
                <h3 id="partial-room-title">{copy.partialTitle}</h3>
                <p>{copy.partialDescription}</p>
                <ul>{partiallyAvailableRooms.map((room) => <li key={room.roomNo}><strong>{room.roomNo}</strong><span>{copy.overlap.replace('{overlap}', String(room.overlappingNights)).replace('{available}', String(room.availableNights))}</span></li>)}</ul>
              </aside>
            ) : null}
          </>
        )}

        <div className="sheetActions">
          <button type="button" className="secondaryButton" onClick={onClose} disabled={loading}>{copy.cancel}</button>
          <button type="button" className="primaryButton" onClick={onContinue} disabled={loading || !selectedRoomNo}>{copy.continue}</button>
        </div>
      </section>
    </div>
  );
}
