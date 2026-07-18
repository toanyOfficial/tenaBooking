export function PaymentStatusMessage({ message, tone = 'neutral' }: { message: string; tone?: 'neutral' | 'error' | 'success' }) {
  return <p className={`paymentStatus ${tone}`} aria-live="polite">{message}</p>;
}
