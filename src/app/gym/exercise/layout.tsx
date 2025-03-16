import { ExerciseProvider } from "./exerciseContext"

export default function exerciseLayout({
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