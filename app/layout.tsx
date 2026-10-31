import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#603A46',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Urban Glimmer — Little details. Lasting impressions.',
  description: 'Considered gold-tone jewellery and everyyear accessories. Thoughtfully chosen, endlessly worn.',
  keywords: ['jewellery', 'gold earrings', 'layered necklaces', 'pendants', 'signet rings', 'cuffs', 'urban glimmer'],
  openGraph: {
    title: 'Urban Glimmer — Little details. Lasting impressions.',
    description: 'Jewellery for real life — considered, characterful, and always a little extra.',
    siteName: 'Urban Glimmer',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
