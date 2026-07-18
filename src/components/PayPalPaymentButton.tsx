function PayPalMark() {
  return <span className="paypalMark" aria-hidden="true">P</span>;
}

export function PayPalPaymentButton({ label, disabled, onClick, describedBy }: { label: string; disabled: boolean; onClick: () => void; describedBy?: string }) {
  return <button className="paypalButton fullWidth" type="button" disabled={disabled} onClick={onClick} aria-describedby={describedBy}><PayPalMark /><span>{label}</span></button>;
}
