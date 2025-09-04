import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NAF - Núcleo de Apoio Contábil Fiscal',
  description: 'Sistema de gestão e atendimento do Núcleo de Apoio Contábil Fiscal. Oferecemos orientação gratuita em questões fiscais e contábeis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
