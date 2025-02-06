import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'

type ThemeColors = {
  background: string
  text: string
  card: string
  primary: string
  border: string
}

type Theme = {
  dark: boolean
  colors: ThemeColors
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    card: '#F5F5F5',
    primary: '#007AFF',
    border: '#E5E5E5'
  }
}

const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#1A1A1A',
    text: '#FFFFFF',
    card: '#2A2A2A',
    primary: '#0A84FF',
    border: '#404040'
  }
}

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? darkTheme : lightTheme)

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme)
  }, [colorScheme])

  const toggleTheme = () => {
    setTheme(theme.dark ? lightTheme : darkTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
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
