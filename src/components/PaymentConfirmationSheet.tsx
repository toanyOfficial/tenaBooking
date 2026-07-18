'use client';

import { Fragment, useEffect, useRef } from 'react';
import { BookingSummary } from '@/components/BookingSummary';
import { PayPalPaymentButton } from '@/components/PayPalPaymentButton';
import type { BookingSummary as BookingSummaryType } from '@/features/booking/bookingSummary';
import type { Locale } from '@/locales/messages';

type Props = { open: boolean; summary: BookingSummaryType | null; locale: Locale; copy: { title: string; description: string; cancel: string; continue: string; refundAgreement: string }; roomCopy: { type: string }; paymentCopy: { total: string }; bookingCopy: { nights: string; oneNight: string }; onClose: () => void; onContinue: () => void; busy: boolean };

function highlightRefundPolicy(value: string) {
  const patterns = ['환불 정책', '환불정책'];
  const pattern = patterns.find((item) => value.includes(item));
  if (!pattern) return value;
  return value.split(pattern).map((part, index, list) => (
    <Fragment key={`${part}-${index}`}>{part}{index < list.length - 1 ? <span className="refundKeyword">{pattern}</span> : null}</Fragment>
  ));
}

export function PaymentConfirmationSheet({ open, summary, locale, copy, roomCopy, paymentCopy, bookingCopy, onClose, onContinue, busy }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [open, onClose]);
  if (!open || !summary) return null;
  return (
    <div className="sheetBackdrop" onClick={onClose}>
      <section className="paymentSheet" role="dialog" aria-modal="true" aria-labelledby="payment-confirm-title" aria-describedby="payment-confirm-description" onClick={(event) => event.stopPropagation()}>
        <h2 id="payment-confirm-title">{copy.title}</h2>
        <p id="payment-confirm-description">{copy.description}</p>
        <BookingSummary summary={summary} roomCopy={roomCopy} paymentCopy={paymentCopy} bookingCopy={bookingCopy} locale={locale} />
        <p className="helperText refundAgreementText">{highlightRefundPolicy(copy.refundAgreement)}</p>
        <div className="sheetActions">
          <button ref={closeButtonRef} type="button" className="secondaryButton" onClick={onClose} disabled={busy}>{copy.cancel}</button>
          <PayPalPaymentButton label={copy.continue} disabled={busy} onClick={onContinue} />
        </div>
      </section>
    </div>
  );
}
