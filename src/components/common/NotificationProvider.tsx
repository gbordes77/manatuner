import { Alert, AlertColor, CssBaseline, Snackbar } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { darkTheme, lightTheme } from '../../theme'
import { CombinedContext, CombinedContextType } from './notificationContext'

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: AlertColor
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('manatuner-theme')
    if (saved) return saved === 'dark'

    // Force light theme by default for all users
    return false
  })

  useEffect(() => {
    localStorage.setItem('manatuner-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const showNotification = useCallback((message: string, severity: AlertColor = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      // Defer snackbar to after state commit
      queueMicrotask(() => {
        showNotification(`${next ? 'Dark' : 'Light'} theme enabled`, 'success')
      })
      return next
    })
  }, [showNotification])

  const handleClose = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }))
  }, [])

  // T13: stable context value
  const contextValue: CombinedContextType = useMemo(
    () => ({
      showNotification,
      isDark,
      toggleTheme,
    }),
    [showNotification, isDark, toggleTheme]
  )

  return (
    <CombinedContext.Provider value={contextValue}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            variant="filled"
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              '& .MuiAlert-icon': {
                fontSize: '1.2rem',
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </CombinedContext.Provider>
  )
}
