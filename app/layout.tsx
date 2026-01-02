import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bảng Xếp Hạng Pickleball',
  description: 'Quản Lý Giải Đấu Pickleball CLB Topaz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
