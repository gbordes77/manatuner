import { useCallback, useEffect, useRef, useState } from 'react'
import { BoundedMap } from '../services/scryfall'

interface CardImageData {
  imageUrl: string | null
  loading: boolean
  error: boolean
}

// T13: bounded image URL cache (cap 200)
const imageCache = new BoundedMap<string, string>(200)

export const useCardImage = (cardName: string) => {
  const [data, setData] = useState<CardImageData>({
    imageUrl: imageCache.get(cardName) || null,
    loading: false,
    error: false,
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const abortControllerRef = useRef<AbortController>()
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  // Reset display when card name changes
  useEffect(() => {
    setData({
      imageUrl: imageCache.get(cardName) || null,
      loading: false,
      error: false,
    })
  }, [cardName])

  const fetchImage = useCallback(async () => {
    if (imageCache.has(cardName)) {
      if (mountedRef.current) {
        setData((prev) => ({ ...prev, imageUrl: imageCache.get(cardName)!, loading: false }))
      }
      return
    }

    if (mountedRef.current) {
      setData((prev) => ({ ...prev, loading: true, error: false }))
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`,
        { signal: abortControllerRef.current.signal }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const card = await response.json()
      const imageUrl =
        card.image_uris?.normal ||
        card.card_faces?.[0]?.image_uris?.normal ||
        card.image_uris?.small ||
        card.card_faces?.[0]?.image_uris?.small

      if (imageUrl) {
        imageCache.set(cardName, imageUrl)
        if (mountedRef.current) {
          setData({ imageUrl, loading: false, error: false })
        }
      } else {
        throw new Error('No image found')
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError' && mountedRef.current) {
        setData({ imageUrl: null, loading: false, error: true })
      }
    }
  }, [cardName])

  const startFetch = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      void fetchImage()
    }, 300)
  }, [fetchImage])

  const cancelFetch = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (abortControllerRef.current) abortControllerRef.current.abort()
  }, [])

  return {
    ...data,
    startFetch,
    cancelFetch,
  }
}
