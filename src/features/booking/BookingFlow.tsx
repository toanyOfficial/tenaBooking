'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PaymentConfirmationSheet } from '@/components/PaymentConfirmationSheet';
import { PaymentCTA } from '@/components/PaymentCTA';
import { PaymentStatusMessage } from '@/components/PaymentStatusMessage';
import { PayPalPaymentButton } from '@/components/PayPalPaymentButton';
import { BookingDateSection } from '@/components/BookingDateSection';
import { PaymentSummary } from '@/features/booking/PaymentSummary';
import { PricingPolicySection } from '@/features/booking/PricingPolicySection';
import { createBookingSummary } from '@/features/booking/bookingSummary';
import { calculateStayPricing, formatWon } from '@/features/booking/pricing';
import type { Holiday } from '@/features/booking/types/holiday';
import type { CreatePayPalOrderResponse } from '@/features/booking/types/paypal';
import type { Locale } from '@/locales/messages';

type BookingDateState = { checkIn: string; checkOut: string };
type PaymentState = 'idle' | 'confirming' | 'creating' | 'redirecting' | 'error';

const localeMap: Record<Locale, string> = { en: 'en-US', ko: 'ko-KR', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', th: 'th-TH', vi: 'vi-VN', ru: 'ru-RU' };
const formatNightCount = (count: number, copy: { oneNight: string; nights: string }) => count === 1 ? copy.oneNight : copy.nights.replace('{count}', String(count));

type BookingFlowProps = {
  locale: Locale;
  copy: {
    booking: Parameters<typeof BookingDateSection>[0]['copy'];
    payment: { paypal: string; total: string; stickyTotalLabel: string; selectDates: string; calculating: string; checkSchedule: string; creating: string; redirecting: string; error: string; mockNotice: string; confirmation: Parameters<typeof PaymentConfirmationSheet>[0]['copy'] };
    pricing: Parameters<typeof PricingPolicySection>[0]['copy'] & Parameters<typeof PaymentSummary>[0]['pricingCopy'];
    room: { type: string };
  };
  holidays: Holiday[];
};

export function BookingFlow({ locale, copy, holidays }: BookingFlowProps) {
  const [dates, setDates] = useState<BookingDateState>({ checkIn: '', checkOut: '' });
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [showStickyPayment, setShowStickyPayment] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const primaryPaymentRef = useRef<HTMLDivElement>(null);
  const pricing = useMemo(() => calculateStayPricing(dates.checkIn, dates.checkOut, holidays), [dates.checkIn, dates.checkOut, holidays]);
  const summary = useMemo(() => createBookingSummary({ roomType: 'standard', checkIn: dates.checkIn, checkOut: dates.checkOut, stayNights: pricing.nights }), [dates.checkIn, dates.checkOut, pricing.nights]);
  const canPay = Boolean(summary && pricing.nights.length && pricing.totalAmount > 0 && paymentState !== 'creating' && paymentState !== 'redirecting');
  const disabledMessage = !summary ? copy.payment.selectDates : copy.payment.checkSchedule;
  const buttonLabel = paymentState === 'creating' ? copy.payment.creating : paymentState === 'redirecting' ? copy.payment.redirecting : canPay ? copy.payment.paypal : disabledMessage;

  useEffect(() => {
    const target = primaryPaymentRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyPayment(!entry.isIntersecting), { threshold: 0.12 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const requestPayment = async () => {
    if (!summary || paymentState === 'creating') return;
    setPaymentState('creating');
    setStatusMessage(copy.payment.creating);
    try {
      const response = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roomType: 'standard', checkIn: summary.checkIn, checkOut: summary.checkOut }) });
      const data = await response.json() as CreatePayPalOrderResponse;
      if (!data.success) throw new Error('create-order-failed');
      if (data.mode === 'mock') { setPaymentState('idle'); setStatusMessage(copy.payment.mockNotice); return; }
      setPaymentState('redirecting');
      setStatusMessage(copy.payment.redirecting);
      window.location.assign(data.approvalUrl);
    } catch {
      setPaymentState('error');
      setStatusMessage(copy.payment.error);
    }
  };

  return (
    <>
      <BookingDateSection copy={copy.booking} locale={locale} value={dates} onChange={setDates} policyActionLabel={copy.booking.policyActionLabel} onPolicyAction={() => setPolicyOpen(true)} />
      <div className="bookingQuickTotal" aria-live="polite">
        <span>{summary ? formatNightCount(summary.nights, copy.booking) : copy.booking.nightsValue}</span>
        <strong>{formatWon(pricing.totalAmount, localeMap[locale])}</strong>
      </div>
      <div ref={primaryPaymentRef}>
        <PayPalPaymentButton label={buttonLabel} disabled={!canPay} onClick={() => setPaymentState('confirming')} describedBy={statusMessage ? "payment-status" : undefined} />
      </div>
      <PaymentSummary pricingCopy={copy.pricing} bookingCopy={copy.booking} pricing={pricing} locale={locale} />
      {statusMessage ? <div id="payment-status"><PaymentStatusMessage message={statusMessage} tone={paymentState === 'error' ? 'error' : statusMessage === copy.payment.mockNotice ? 'success' : 'neutral'} /></div> : null}
      <PaymentCTA copy={copy.payment} totalAmount={pricing.totalAmount} locale={locale} disabled={!canPay} visible={showStickyPayment} onClick={() => setPaymentState('confirming')} label={buttonLabel} />
      {policyOpen ? (
        <div className="sheetBackdrop policyBackdrop" onClick={() => setPolicyOpen(false)}>
          <section className="paymentSheet policySheet" role="dialog" aria-modal="true" aria-labelledby="policy-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="modalTitleRow"><h2 id="policy-modal-title">{copy.pricing.title}</h2><button type="button" className="policyCloseButton" aria-label={copy.payment.confirmation.cancel} onClick={() => setPolicyOpen(false)}>×</button></div>
            <PricingPolicySection copy={copy.pricing} pricing={pricing} checkIn={dates.checkIn} locale={locale} />
          </section>
        </div>
      ) : null}
      <PaymentConfirmationSheet open={paymentState === 'confirming'} summary={summary} locale={locale} copy={copy.payment.confirmation} roomCopy={copy.room} paymentCopy={copy.payment} bookingCopy={copy.booking} onClose={() => setPaymentState('idle')} onContinue={requestPayment} busy={paymentState === 'creating'} />
    </>
  );
}
