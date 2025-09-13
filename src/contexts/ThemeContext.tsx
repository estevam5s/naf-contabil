'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Detectar tema inicial do sistema ou localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('naf-theme') as Theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      const initialTheme = savedTheme || systemTheme
      setThemeState(initialTheme)
      setMounted(true)
    } catch (error) {
      // Fallback para server-side ou erro de localStorage
      setThemeState('light')
      setMounted(true)
    }
  }, [])

  // Aplicar tema ao DOM
  useEffect(() => {
    if (!mounted) return

    try {
      const root = document.documentElement
      const body = document.body

      if (theme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
        body.classList.add('dark')
        body.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
        body.classList.add('light')
        body.classList.remove('dark')
        // Force white background for light theme
        body.style.backgroundColor = 'white'
      }

      localStorage.setItem('naf-theme', theme)
    } catch (error) {
      console.warn('Erro ao aplicar tema:', error)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={mounted ? '' : 'opacity-0'}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}