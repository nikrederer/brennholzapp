import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Brennholz App',
  description: 'Verwaltung von Bestellungen und Lagerbeständen für Brennholz'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <h1 className="text-lg font-semibold">Brennholz Management</h1>
            <nav className="space-x-4 text-sm">
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
              <a href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </a>
              <a href="/orders" className="text-blue-600 hover:underline">
                Bestellungen
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
