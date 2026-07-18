export function PayPalPaymentButton({ label, disabled, onClick, describedBy }: { label: string; disabled: boolean; onClick: () => void; describedBy?: string }) {
  return <button className="primaryButton fullWidth" type="button" disabled={disabled} onClick={onClick} aria-describedby={describedBy}>{label}</button>;
}
