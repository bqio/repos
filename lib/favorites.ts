export function getFavorites(): string[] {
  if (typeof window === "undefined") return []
  const favorites = localStorage.getItem("favorites")
  return favorites ? JSON.parse(favorites) : []
}

export function addToFavorites(hash: string): void {
  const favorites = getFavorites()
  if (!favorites.includes(hash)) {
    favorites.push(hash)
    localStorage.setItem("favorites", JSON.stringify(favorites))
    window.dispatchEvent(new CustomEvent("favoritesChange"))
  }
}

export function removeFromFavorites(hash: string): void {
  const favorites = getFavorites()
  const updated = favorites.filter((h) => h !== hash)
  localStorage.setItem("favorites", JSON.stringify(updated))
  window.dispatchEvent(new CustomEvent("favoritesChange"))
}

export function isFavorite(hash: string): boolean {
  const favorites = getFavorites()
  return favorites.includes(hash)
}
