import { ExerciseProvider } from "./[exerciseId]/exerciseContext"
import { WorkoutProvider } from "./workout/workoutContext"

export default function GymLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <>
    <WorkoutProvider>
      <ExerciseProvider>
        {children}
      </ExerciseProvider>
    </WorkoutProvider>
  </>
)
}