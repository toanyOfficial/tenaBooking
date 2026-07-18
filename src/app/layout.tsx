import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;
const metaImage = '/images/meta.png';

export const metadata: Metadata = {
  metadataBase,
  title: 'Practical Medical Stay',
  description: 'Hospital-connected accommodation booking prototype',
  icons: {
    icon: '/images/favicon.png'
  },
  openGraph: {
    type: 'website',
    title: 'Practical Medical Stay',
    description: 'Hospital-connected accommodation booking prototype',
    images: [{ url: metaImage, width: 231, height: 231 }]
  },
  twitter: {
    card: 'summary',
    title: 'Practical Medical Stay',
    description: 'Hospital-connected accommodation booking prototype',
    images: [metaImage]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
