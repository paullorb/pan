import Title from '../../UI/shared/title'
import styles from './connections.module.scss'

export default function Connections () {
  return (
    <div className={styles.container}>
      <Title title='Connections' />
      <p>Name</p>
      <p>Remark</p>
    </div>
  )
}