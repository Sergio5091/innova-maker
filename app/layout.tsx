import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: 'INOVA Makers | "Vous avez l\'idée. Nous avons l\'ingénierie."',
  description: "De l'esquisse au prototype fonctionnel, INOVA Makers matérialise vos innovations. Conseil stratégie, conception fabrication et R&D IoT.",
  generator: 'v0.app',
  openGraph: {
    title: 'INOVA Makers | "Vous avez l\'idée. Nous avons l\'ingénierie."',
    description: "De l'esquisse au prototype fonctionnel, INOVA Makers matérialise vos innovations. Conseil stratégie, conception fabrication et R&D IoT.",
    type: 'website',
    siteName: 'INOVA Makers',
    images: [
      {
        url: '/logo_inova_couleur.svg',
        width: 1200,
        height: 630,
        alt: 'INOVA Makers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INOVA Makers | "Vous avez l\'idée. Nous avons l\'ingénierie."',
    description: "De l'esquisse au prototype fonctionnel, INOVA Makers matérialise vos innovations. Conseil stratégie, conception fabrication et R&D IoT.",
    images: ['/logo_inova_couleur.svg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '//logo_inova_couleur.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
