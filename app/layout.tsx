import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from "../hooks/useLanguage";
import LanguageClientProvider from "../components/LanguageClientProvider";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Consent Management Dashboard',
  generator: 'Prasad',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/shield-favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <LanguageClientProvider>
          {children}
        </LanguageClientProvider>
      </body>
    </html>
  );
}
