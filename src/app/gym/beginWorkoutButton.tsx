// app/gym/beginWorkoutButton.tsx
"use client"
import { useRouter } from "next/navigation"
import exercises from "./[exerciseId]/exercises"

const slugify = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-')

export default function BeginWorkoutButton() {
  const router = useRouter()
  const handleClick = () => {
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)]
    const slug = slugify(randomExercise.name)
    router.push(`/gym/${slug}`)
  }
  return <button onClick={handleClick}>Begin Workout</button>
}
