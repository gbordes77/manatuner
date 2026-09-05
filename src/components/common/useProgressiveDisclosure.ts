import { useState } from 'react'

export const useProgressiveDisclosure = (initialStates: Record<string, boolean> = {}) => {
  const [states, setStates] = useState(initialStates)

  const toggle = (key: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const open = (key: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: true,
    }))
  }

  const close = (key: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: false,
    }))
  }

  const openAll = () => {
    setStates((prev) =>
      Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      )
    )
  }

  const closeAll = () => {
    setStates((prev) =>
      Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      )
    )
  }

  return {
    states,
    toggle,
    open,
    close,
    openAll,
    closeAll,
    isOpen: (key: string) => !!states[key],
  }
}
