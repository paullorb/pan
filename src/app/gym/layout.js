import { ExerciseProvider } from "./exercise/exerciseContext"

export default function GymLayout({
  children,
}) {
  return (
  <>
      <ExerciseProvider>
        {children}
      </ExerciseProvider>
  </>
)
}