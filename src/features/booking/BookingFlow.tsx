'use client';

import { useMemo, useState } from 'react';
import { BookingDateSection } from '@/components/BookingDateSection';
import { PaymentCTA } from '@/components/PaymentCTA';
import { PaymentSummary } from '@/features/booking/PaymentSummary';
import { PricingPolicySection } from '@/features/booking/PricingPolicySection';
import { calculateStayPricing } from '@/features/booking/pricing';
import type { Holiday } from '@/features/booking/types/holiday';
import type { Locale } from '@/locales/messages';

type BookingDateState = { checkIn: string; checkOut: string };

type BookingFlowProps = {
  locale: Locale;
  copy: {
    booking: Parameters<typeof BookingDateSection>[0]['copy'];
    payment: Parameters<typeof PaymentSummary>[0]['copy'];
    pricing: Parameters<typeof PricingPolicySection>[0]['copy'];
  };
  holidays: Holiday[];
};

export function BookingFlow({ locale, copy, holidays }: BookingFlowProps) {
  const [dates, setDates] = useState<BookingDateState>({ checkIn: '', checkOut: '' });
  const pricing = useMemo(() => calculateStayPricing(dates.checkIn, dates.checkOut, holidays), [dates.checkIn, dates.checkOut, holidays]);

  return (
    <>
      <BookingDateSection copy={copy.booking} locale={locale} value={dates} onChange={setDates} />
      <PaymentSummary copy={copy.payment} pricingCopy={copy.pricing} pricing={pricing} locale={locale} />
      <PricingPolicySection copy={copy.pricing} pricing={pricing} checkIn={dates.checkIn} locale={locale} />
      <PaymentCTA copy={copy.payment} totalAmount={pricing.totalAmount} locale={locale} />
    </>
  );
}
