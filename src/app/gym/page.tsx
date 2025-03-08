// app/gym/page.tsx
import Nav from "app/nav/nav"
import BeginWorkoutButton from "./beginWorkoutButton"
import styles from "./page.module.css"

export default function Page() {
  return (
    <div className={styles.container}>
      <Nav />
      <BeginWorkoutButton />
    </div>
  )
}
