"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Star } from "lucide-react"
import type { RepositoryItem } from "@/types/repository"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favorites"
import { translations, type Language } from "@/lib/i18n"

interface PosterGridProps {
  items: RepositoryItem[]
  showFavoriteButton?: boolean
}

const ITEMS_PER_PAGE = 100

export function PosterGrid({ items, showFavoriteButton = true }: PosterGridProps) {
  const [displayedItems, setDisplayedItems] = useState<RepositoryItem[]>([])
  const [page, setPage] = useState(1)
  const [imageCache, setImageCache] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [language, setLanguage] = useState<Language>("ru")
  const loaderRef = useRef<HTMLDivElement>(null)

  // Initialize with first batch of items
  useEffect(() => {
    setDisplayedItems(items.slice(0, ITEMS_PER_PAGE))
    setPage(1)
  }, [items])

  useEffect(() => {
    const cached = localStorage.getItem("imageCache")
    if (cached) {
      setImageCache(new Set(JSON.parse(cached)))
    }
  }, [])

  useEffect(() => {
    if (imageCache.size > 0) {
      localStorage.setItem("imageCache", JSON.stringify(Array.from(imageCache)))
    }
  }, [imageCache])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedItems.length < items.length) {
          const nextPage = page + 1
          const newItems = items.slice(0, nextPage * ITEMS_PER_PAGE)
          setDisplayedItems(newItems)
          setPage(nextPage)
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [displayedItems.length, items, page])

  useEffect(() => {
    const syncFavorites = () => {
      const favs = localStorage.getItem("favorites")
      if (favs) {
        setFavorites(new Set(JSON.parse(favs)))
      }
    }

    syncFavorites()
    window.addEventListener("favoritesChange", syncFavorites)
    return () => window.removeEventListener("favoritesChange", syncFavorites)
  }, [])

  useEffect(() => {
    const syncLanguage = () => {
      const lang = (localStorage.getItem("language") || "ru") as Language
      setLanguage(lang)
    }

    syncLanguage()
    window.addEventListener("languageChange", syncLanguage)
    return () => window.removeEventListener("languageChange", syncLanguage)
  }, [])

  const handlePosterClick = (item: RepositoryItem) => {
    const magnetLink = `magnet:?xt=urn:btih:${item.hash}&tr=${encodeURIComponent(item.tracker)}`
    window.open(magnetLink, "_blank")
  }

  const handleImageLoad = (url: string) => {
    if (url && !imageCache.has(url)) {
      setImageCache((prev) => new Set(prev).add(url))
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation()
    if (isFavorite(hash)) {
      removeFromFavorites(hash)
    } else {
      addToFavorites(hash)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return ""

    const gb = bytes / (1024 * 1024 * 1024)
    if (gb >= 1) {
      return `${gb.toFixed(1)} GB`
    }

    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(0)} MB`
  }

  const t = translations[language]

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {displayedItems.map((item, index) => (
          <div key={item.hash || index} className="group cursor-pointer" onClick={() => handlePosterClick(item)}>
            <div className="aspect-[2/3] relative mb-2">
              <Image
                src={item.poster || "/placeholder.svg?height=600&width=400"}
                alt={item.title || "Постер"}
                fill
                className="object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                loading={index < 20 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(item.poster)}
              />

              {item.size && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatFileSize(item.size)}
                </div>
              )}

              {showFavoriteButton && (
                <button
                  onClick={(e) => handleFavoriteClick(e, item.hash)}
                  className="absolute top-2 left-2 bg-black/70 text-white p-1.5 rounded hover:bg-black/90 transition-colors"
                  aria-label={favorites.has(item.hash) ? "Убрать из избранного" : "Добавить в избранное"}
                >
                  <Star
                    className={`h-4 w-4 ${favorites.has(item.hash) ? "fill-yellow-400 text-yellow-400" : "text-white"}`}
                  />
                </button>
              )}
            </div>

            <h3 className="text-sm font-medium truncate text-foreground px-1">{item.title || "Без названия"}</h3>
          </div>
        ))}
      </div>

      {displayedItems.length < items.length && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="text-muted-foreground">{t.loading}</div>
        </div>
      )}
    </div>
  )
}
