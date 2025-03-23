"use client"
import { useRouter } from "next/navigation"

import styles from "./workout.module.css"

export default function Workout() {
  const router = useRouter()

  async function handleClick() {
        router.push("/gym/exercise")
  }
  
  return (
    <>
      <button type="button" onClick={handleClick} className={styles.submitButton}>
        Submit
      </button>
    </>
  )
}
