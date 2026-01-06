// app/gym/page.tsx
import Nav from "app/nav/nav"
import styles from "./page.module.css"
import Card from "./exercise/card"

export default function Page() {
  return (
    <div className={styles.container}>
      <Nav />
      <Card />
    </div>
  )
}
