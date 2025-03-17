import { ExerciseProvider } from "./exercise/exerciseContext"
import { WorkoutProvider } from "./workout/workoutContext"

export default function GymLayout({
  children,
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