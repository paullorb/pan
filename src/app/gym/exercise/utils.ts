export function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-')
}

export function daysBetween(a: Date, b: Date) {
  const diff = b.getTime() - a.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export const DEFAULT_SETS = [
  { reps: "", weight: "", duration: "", intensity: "", completed: false }
]

export function loadLocalSets(slug: string) {
  const key = `sets-${slug}`
  const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null
  return stored ? JSON.parse(stored) : null
}

export function storeLocalSets(slug: string, data: unknown) {
  const key = `sets_${slug}`
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function removeLocalSets(slug: string) {
  const key = `sets_${slug}`
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}