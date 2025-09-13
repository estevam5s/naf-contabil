'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import UserOnboarding from './UserOnboarding'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        {children}
        <UserOnboarding />
      </SessionProvider>
    </ThemeProvider>
  )
}
