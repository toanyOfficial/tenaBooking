import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Practical Medical Stay',
  description: 'Hospital-connected accommodation booking prototype',
  icons: {
    icon: '/images/favicon.png'
  },
  openGraph: {
    title: 'Practical Medical Stay',
    description: 'Hospital-connected accommodation booking prototype',
    images: [{ url: '/images/favicon.png' }]
  },
  twitter: {
    card: 'summary',
    title: 'Practical Medical Stay',
    description: 'Hospital-connected accommodation booking prototype',
    images: ['/images/favicon.png']
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
