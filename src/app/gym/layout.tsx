import { ExerciseProvider } from "./[exerciseId]/exerciseContext"

export default function GymLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <section>
    <ExerciseProvider>
      {children}
    </ExerciseProvider>
  </section>)
}