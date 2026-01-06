export const SET_RANGES = {
  reps: Array.from({ length: 50 }, (_, i) => (i + 1).toString()),
  weight: Array.from({ length: 401 }, (_, i) => (i * 0.5).toString()),
  duration: Array.from({ length: 60 }, (_, i) => (i + 1).toString()),
  intensity: Array.from({ length: 50 }, (_, i) => (i + 1).toString())
}
