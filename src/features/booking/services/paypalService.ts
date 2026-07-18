import type { BookingSummary } from '@/features/booking/bookingSummary';

const paypalHosts = { sandbox: 'https://api-m.sandbox.paypal.com', live: 'https://api-m.paypal.com' } as const;

export function isPayPalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function getAccessToken() {
  const environment = process.env.PAYPAL_ENVIRONMENT === 'live' ? 'live' : 'sandbox';
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${paypalHosts[environment]}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!response.ok) return null;
  const data = await response.json() as { access_token?: string };
  return data.access_token ?? null;
}

export async function createPayPalOrder(summary: BookingSummary): Promise<{ orderId: string; approvalUrl: string } | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  const environment = process.env.PAYPAL_ENVIRONMENT === 'live' ? 'live' : 'sandbox';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const response = await fetch(`${paypalHosts[environment]}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: summary.currency, value: String(summary.totalAmount) }, description: `TOANY Medical Stay ${summary.checkIn} - ${summary.checkOut}` }],
      application_context: { return_url: `${siteUrl}/payment/return`, cancel_url: `${siteUrl}/payment/cancel` }
    })
  });
  if (!response.ok) return null;
  const data = await response.json() as { id?: string; links?: Array<{ rel?: string; href?: string }> };
  const approvalUrl = data.links?.find((link) => link.rel === 'approve')?.href;
  return data.id && approvalUrl ? { orderId: data.id, approvalUrl } : null;
}
