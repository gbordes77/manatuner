import { Box } from '@mui/material'
import React, { Suspense } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  const isActive = value === index

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`analyzer-tabpanel-${index}`}
      aria-labelledby={`analyzer-tab-${index}`}
      data-testid={`analyzer-tabpanel-${index}`}
      {...other}
    >
      {isActive && (
        <Box sx={{ p: 3 }}>
          <Suspense
            fallback={
              <Box role="status" data-testid="analysis-panel-loading">
                Loading analysis panel…
              </Box>
            }
          >
            {children}
          </Suspense>
        </Box>
      )}
    </div>
  )
}
