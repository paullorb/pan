import Nav from "app/nav/nav"
import Card from "./[exerciseId]/card"
import styles from "./page.module.css"

export default function Page() {
  return (
    <div className={styles.container}>
      <Nav />
      <Card />
    </div>
  )
}
