'use client'
import { useState } from 'react'
import styles from './nav.module.css'

type ModalType = 'login' | 'signup'

export default function Nav() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('login')

  const openModal = (type: ModalType) => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const toggleModalType = () => {
    setModalType(modalType === 'login' ? 'signup' : 'login')
  }

  return (
    <>
      <nav className={styles.container}>
        <button onClick={() => openModal('login')}>Login</button>
        <button onClick={() => openModal('signup')}>Signup</button>
      </nav>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={closeModal}>Close</button>
            <h2>{modalType === 'login' ? 'Login' : 'Signup'}</h2>
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="submit">{modalType === 'login' ? 'Login' : 'Signup'}</button>
            </form>
            <button onClick={toggleModalType}>
              {modalType === 'login' ? 'Switch to Signup' : 'Switch to Login'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
