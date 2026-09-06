import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteForever'
import DownloadIcon from '@mui/icons-material/Download'
import InfoIcon from '@mui/icons-material/Info'
import StorageIcon from '@mui/icons-material/Storage'
import UploadIcon from '@mui/icons-material/Upload'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { PrivacyStorage } from '../lib/privacy'
import { persistor, store } from '../store'
import { clearAnalyzer } from '../store/slices/analyzerSlice'

export const PrivacySettings: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [showDataDialog, setShowDataDialog] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [showSnackbar, setShowSnackbar] = useState(false)

  const exportData = () => {
    let data: string
    try {
      data = PrivacyStorage.exportAnalyses()
    } catch (error) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Export failed.')
      setShowSnackbar(true)
      return
    }
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `manatuner-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setSnackbarMessage('Data exported successfully!')
    setShowSnackbar(true)
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target?.result as string
          try {
            const result = PrivacyStorage.importAnalyses(data)
            setSnackbarMessage(
              `Imported ${result.imported} analyses; ${result.duplicates} duplicate IDs kept unchanged; ${result.recovered} legacy decks require re-analysis. Import merges with existing history.`
            )
            setShowSnackbar(true)
          } catch (error) {
            setSnackbarMessage(
              error instanceof Error ? error.message : 'Import failed. No history was changed.'
            )
            setShowSnackbar(true)
          }
        }
        reader.onerror = () => {
          setSnackbarMessage('Could not read file. No history was changed.')
          setShowSnackbar(true)
        }
        if (file.size > 10_000_000) {
          setSnackbarMessage('Import exceeds 10 MB. No history was changed.')
          setShowSnackbar(true)
          return
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <>
      <Card
        elevation={3}
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          color: 'white',
          '& .MuiTypography-root': { color: 'white !important' },
        }}
      >
        <CardContent>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
            <StorageIcon />
            <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
              💾 Your Data
            </Typography>
          </Box>

          {/* Status Info */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              📱 All your analyses are stored locally in your browser
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            display="flex"
            gap={1}
            mt={2}
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportData}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'white' },
              }}
            >
              Export
            </Button>

            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={importData}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'white' },
              }}
            >
              Import (merge)
            </Button>

            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={() => setShowInfoDialog(true)}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'white' },
              }}
            >
              Info
            </Button>

            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setShowDataDialog(true)}
              sx={{
                color: '#ff6b6b',
                borderColor: '#ff6b6b',
                '&:hover': {
                  borderColor: '#ff5252',
                  backgroundColor: 'rgba(255,107,107,0.1)',
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Information Dialog */}
      <Dialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorageIcon color="primary" />
          How Your Data is Stored
          {isMobile && (
            <IconButton onClick={() => setShowInfoDialog(false)} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="primary" gutterBottom>
            ✅ Local Storage
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Saved analyses and the current deck stay in this browser only (no ManaTuner server)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Card names/images are resolved via Scryfall (public API) when you Analyze" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• No accounts, no tracking, no analytics, no crash reports" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Share links encode your deck in the URL hash — anyone with the link can open it" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Reset deletes all local ManaTuner data (analyses, deck, caches, prefs)" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" color="primary" gutterBottom>
            💡 Tips
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Backup regularly"
                secondary="Use Export to save your analyses as a JSON file"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Transfer between devices"
                secondary="Export from one device, Import on another"
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Privacy:</strong> ManaTuner does not collect any data.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfoDialog(false)} variant="contained">
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Management Dialog */}
      <Dialog open={showDataDialog} onClose={() => setShowDataDialog(false)} maxWidth="sm">
        <DialogTitle color="error">⚠️ Delete all local data</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This permanently deletes saved analyses, the current deck in this browser, land/producer
            caches, library progress, and preferences.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action is irreversible! Consider exporting first.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDataDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              PrivacyStorage.clearAllLocalData()
              store.dispatch(clearAnalyzer())
              void persistor.purge()
              setShowDataDialog(false)
              setSnackbarMessage('All local ManaTuner data has been deleted')
              setShowSnackbar(true)
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

export default PrivacySettings
