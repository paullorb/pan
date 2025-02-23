'use client'
import React from 'react'
import styles from './auth.module.css'

type ModalType = 'login' | 'signup'

interface AuthModalProps {
  modalType: ModalType
  emailInput: string
  passwordInput: string
  setEmailInput: (value: string) => void
  setPasswordInput: (value: string) => void
  closeModal: () => void
  toggleModalType: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function AuthModal({
  modalType,
  emailInput,
  passwordInput,
  setEmailInput,
  setPasswordInput,
  closeModal,
  toggleModalType,
  handleSubmit,
}: AuthModalProps) {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <button onClick={closeModal}>Close</button>
        <h2>{modalType === 'login' ? 'Login' : 'Signup'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
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
  )
}
