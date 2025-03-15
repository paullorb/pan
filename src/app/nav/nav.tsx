'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './nav.module.css'
import { useAuth } from '../auth/authContext'
import AuthModal from '../auth/authModal'

type ModalType = 'login' | 'signup'

export default function Nav() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('login')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showEmail, setShowEmail] = useState(false)
  const { user, login, signup, logout } = useAuth()
  const pathname = usePathname()

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
        <div className={styles.nav}>
          <div className={styles.links}>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>Pansito</Link>
            <Link href="/gym" className={pathname === '/gym' ? styles.active : ''}>Gym</Link>
          </div>
          {user ? (
            <div className={styles.side}>
              <span onClick={() => setShowEmail(!showEmail)} className={styles.loggedIn}>logged in</span>
              <button className={styles.logout} onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button onClick={() => openModal('login')}>Login</button>
              <button onClick={() => openModal('signup')}>Signup</button>
            </div>
          )}
        </div>
      </nav>
      {showEmail && user && (
        <div className={styles.emailWindow} onClick={() => setShowEmail(false)}>
          {user.email}
        </div>
      )}
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
