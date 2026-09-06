import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchJsonWithTimeout } from '../services/http'
import type { ScryfallCard } from '../types/scryfall'
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    abortControllerRef.current?.abort()
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
    const controller = new AbortController()
    abortControllerRef.current = controller
    const isCurrent = () =>
      mountedRef.current && abortControllerRef.current === controller && !controller.signal.aborted

    try {
      const { response, data: card } = await fetchJsonWithTimeout<ScryfallCard>(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`,
        {},
        { signal: controller.signal }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!isCurrent() || !card) return
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
      if (error instanceof Error && error.name !== 'AbortError' && isCurrent()) {
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
    if (mountedRef.current) setData((previous) => ({ ...previous, loading: false }))
  }, [])

  return {
    ...data,
    startFetch,
    cancelFetch,
  }
}
