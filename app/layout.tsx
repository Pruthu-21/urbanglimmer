import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Urban Glimmer — Little details. Lasting impressions.',
  description: 'Discover considered jewellery and everyday accessories at Urban Glimmer.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
