import { Box } from '@mui/material'
import React from 'react'

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
      {isActive && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
