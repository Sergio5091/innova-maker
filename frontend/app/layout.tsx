import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const title = 'INOVA Makers — Écrans LED, énergie solaire, domotique et IoT au Bénin'
const description =
  "Depuis 2014, INOVA Makers conçoit, installe et maintient des écrans LED, des installations solaires, des systèmes domotiques et des solutions IoT pour les entreprises et les particuliers au Bénin."

export const metadata: Metadata = {
  metadataBase: new URL('https://inovamakers.io'),
  title: { default: title, template: '%s | INOVA Makers' },
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'fr_FR',
    siteName: 'INOVA Makers',
    images: [{ url: '/logoINOVAMakers.svg', alt: 'INOVA Makers' }],
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/logoINOVAMakers.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
