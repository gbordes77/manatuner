import { Box, CircularProgress } from '@mui/material'
// Loading component for PersistGate
export const PersistLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <CircularProgress size={48} sx={{ color: 'white' }} />
  </Box>
)

// Error boundary for production
export const ErrorFallback = ({ error: _error }: { error: Error }) => (
  <div
    style={{
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h1>🎯 ManaTuner</h1>
    <p>Something went wrong loading the application.</p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '10px 20px',
        background: 'white',
        color: '#667eea',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
      }}
    >
      Reload Page
    </button>
  </div>
)
