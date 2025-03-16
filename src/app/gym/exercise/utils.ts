export function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-')
}

export function daysBetween(a: Date, b: Date) {
  const diff = b.getTime() - a.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
