'use client'
import { useState } from 'react'
import styles from './nav.module.css'
import { useAuth } from '../auth/authContext'
import AuthModal from '../auth/authModal'

type ModalType = 'login' | 'signup'

export default function Nav() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('login')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const { user, login, signup, logout } = useAuth()

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
        {user ? (
          <div className={styles.nav}>
            <div className={styles.side}>
              <span className={styles.email}>{user.email}</span>
              <button className={styles.logout} onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => openModal('login')}>Login</button>
            <button onClick={() => openModal('signup')}>Signup</button>
          </>
        )}
      </nav>
      {isModalOpen && (
        <AuthModal
          modalType={modalType}
          emailInput={emailInput}
          passwordInput={passwordInput}
          setEmailInput={setEmailInput}
          setPasswordInput={setPasswordInput}
          closeModal={closeModal}
          toggleModalType={toggleModalType}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  )
}
