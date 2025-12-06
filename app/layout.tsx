// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Social Media App',
  description: 'A Next.js social media application',
};

/**
 * The application's RootLayout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}