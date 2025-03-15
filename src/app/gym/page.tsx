// app/gym/page.tsx
import Nav from "app/nav/nav"
import styles from "./page.module.css"
import Workout from "./workout/workout"

export default function Page() {
  return (
    <div className={styles.container}>
      <Nav />
      <Workout />
    </div>
  )
}
