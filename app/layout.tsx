// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Contact Snapshot',
  description: 'Extract contacts from images or business cards.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 dark:bg-neutral-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
