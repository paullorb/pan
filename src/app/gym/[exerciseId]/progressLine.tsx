"use client"
import { useWorkout } from "../workout/workoutContext"

export default function ProgressLine({ currentExercise }: { currentExercise: string }) {
  const { exercises } = useWorkout()
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
      {exercises.map((exercise) => (
        <div
          key={exercise}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: exercise === currentExercise ? "blue" : "gray"
            }}
          />
          <span style={{ fontSize: "0.8rem", marginTop: 4 }}>{exercise}</span>
        </div>
      ))}
    </div>
  )
}
