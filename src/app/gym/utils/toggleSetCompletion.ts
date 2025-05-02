export function toggleSetCompletion(sets: any[], index: number) {
  return sets.map((set, i) =>
    i === index ? { ...set, completed: !set.completed } : set
  )
}
