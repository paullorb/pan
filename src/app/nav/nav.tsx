'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './nav.module.css'
import { useAuth } from '../auth/authContext'
import AuthModal from '../auth/authModal'
import EntryInput from 'app/entry/entryInput'
import { useCalendar } from 'app/cal/calendarContext'
import { useEntry } from 'app/entry/entryContext'
import { getDateKey } from 'app/entry/utils'

type ModalType = 'login' | 'signup'

export default function Nav() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('login')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const { user, login, signup, logout } = useAuth()

  // Entry input state and related functions
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { selectedDate } = useCalendar()
  const { addEntry } = useEntry()
  const keyDate = getDateKey(selectedDate)

  const handleAddEntry = () => {
    if (input.trim() === "") return
    addEntry(keyDate, input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddEntry()
  }

  // Auth modal functions
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
            <div className={styles.main}>
              <EntryInput
                input={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
              />
            </div>
            <div className={styles.side}></div>
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
