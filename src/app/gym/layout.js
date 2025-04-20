import { ExerciseProvider } from "./exercise/exerciseContext"
import { SessionProvider } from "./exercise/sessionContext"

export default function GymLayout({
  children,
}) {
  return (
  <>
    <SessionProvider>
      <ExerciseProvider>
        {children}
      </ExerciseProvider>
    </SessionProvider>
  </>
)
}