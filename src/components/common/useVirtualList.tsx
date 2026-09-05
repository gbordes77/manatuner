import { Box } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { VirtualList } from './VirtualList'
// Hook for easy integration with existing lists
export const useVirtualList = <T,>(
  items: T[],
  itemHeight: number = 60,
  containerHeight: number = 400
) => {
  const [isVirtualized, setIsVirtualized] = useState(false)

  useEffect(() => {
    // Enable virtualization for lists with more than 50 items
    setIsVirtualized(items.length > 50)
  }, [items.length])

  const VirtualizedList = useCallback(
    ({
      renderItem,
      className,
    }: {
      renderItem: (item: T, index: number) => React.ReactNode
      className?: string
    }) => {
      if (!isVirtualized) {
        return (
          <Box className={className}>
            {items.map((item, index) => (
              <Box key={index} sx={{ height: itemHeight }}>
                {renderItem(item, index)}
              </Box>
            ))}
          </Box>
        )
      }

      return (
        <VirtualList
          items={items}
          itemHeight={itemHeight}
          containerHeight={containerHeight}
          renderItem={renderItem}
          className={className}
        />
      )
    },
    [items, itemHeight, containerHeight, isVirtualized]
  )

  return {
    isVirtualized,
    VirtualizedList,
    itemCount: items.length,
  }
}
