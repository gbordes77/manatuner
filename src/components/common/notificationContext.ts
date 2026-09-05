import { AlertColor } from '@mui/material'
import { createContext, useContext } from 'react'

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void
}

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

export interface CombinedContextType extends NotificationContextType, ThemeContextType {}

export const CombinedContext = createContext<CombinedContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(CombinedContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return {
    showNotification: context.showNotification,
  }
}

export const useTheme = () => {
  const context = useContext(CombinedContext)
  if (!context) {
    throw new Error('useTheme must be used within NotificationProvider')
  }
  return {
    isDark: context.isDark,
    toggleTheme: context.toggleTheme,
  }
}
