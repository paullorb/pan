"use client"

export function addSet(sets: any[]) {
  if (!sets.length) {
    return [{ reps: "", weight: "", duration: "", intensity: "" }]
  }
  const lastSet = sets[sets.length - 1]
  return [...sets, { ...lastSet }]
}

export function deleteSet(sets: any[]) {
  if (sets.length <= 1) return sets
  return sets.slice(0, -1)
}
