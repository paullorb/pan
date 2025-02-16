'use client'
import { useState } from 'react'
import styles from './nav.module.css'
import { useAuth } from './authContext'

type ModalType = 'login' | 'signup'

export default function Nav() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('login')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  const { email, login, signup } = useAuth()

  const openModal = (type: ModalType) => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEmailInput('')
    setPasswordInput('')
  }

  const toggleModalType = () => {
    setModalType(modalType === 'login' ? 'signup' : 'login')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (modalType === 'login') {
        await login(emailInput, passwordInput)
      } else {
        await signup(emailInput, passwordInput)
      }
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <nav className={styles.container}>
        {email ? (
          <span>Logged in as: {email}</span>
        ) : (
          <>
            <button onClick={() => openModal('login')}>Login</button>
            <button onClick={() => openModal('signup')}>Signup</button>
          </>
        )}
      </nav>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={closeModal}>Close</button>
            <h2>{modalType === 'login' ? 'Login' : 'Signup'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <button type="submit">
                {modalType === 'login' ? 'Login' : 'Signup'}
              </button>
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
