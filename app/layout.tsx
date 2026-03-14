import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PixelScript } from '@/components/PixelScript'
import { GTMScript } from '@/components/GTMScript'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LOAD MAIS | Marketing que é Engenharia',
  description:
    'Estruturamos empresas com IA, automação e inteligência humana. Marketing não precisa ser tentativa — pode ser engenharia.',
  openGraph: {
    title: 'LOAD MAIS | Marketing que é Engenharia',
    description: 'Estruturamos empresas com IA, automação e inteligência humana.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <PixelScript />
      </head>
      <body className={inter.className}>
        <GTMScript />
        {children}
      </body>
    </html>
  )
}
