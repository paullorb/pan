'use client'
import { ReactNode } from 'react'
import styles from './table.module.css'

type Props = { open: boolean; onClose(): void; children: ReactNode }

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {children}
        <button className={styles.close} onClick={onClose}>×</button>
      </div>
    </div>
  )
}
