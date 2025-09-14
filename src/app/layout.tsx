import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import ToastContainer from '@/components/ToastContainer'
import ScrollToTop from '@/components/ScrollToTop'
import ChatWidget from '@/components/chat/ChatWidget'

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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <ChatWidget />
          <ScrollToTop />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
