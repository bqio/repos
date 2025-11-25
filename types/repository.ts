export interface RepositoryItem {
  title: string
  hash: string
  tracker: string
  poster?: string
  size?: number
  published_date?: number
}

export interface Repository {
  id: string
  name: string
  author?: string
  description?: string
  version?: string
  items: RepositoryItem[]
  sourceUrl?: string
}
