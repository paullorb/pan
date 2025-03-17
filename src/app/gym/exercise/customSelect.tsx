"use client"
import React, { useState, useRef, useEffect } from "react"
import styles from "./customSelect.module.css"

type CustomSelectProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
  className?: string
}

export default function CustomSelect({
  options,
  value,
  onChange,
  onKeyDown,
  className
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const toggleOpen = () => setOpen(prev => !prev)
  const handleOptionClick = (option: string) => {
    onChange(option)
    setOpen(false)
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <div className={`${styles.customSelect} ${className || ""}`} ref={ref}>
      <div className={styles.selected} onClick={toggleOpen} onKeyDown={onKeyDown} tabIndex={0}>
        {value}
      </div>
      {open && (
        <div className={styles.options} style={{ maxHeight: "150px", overflowY: "auto" }}>
          {options.map(opt => (
            <div key={opt} className={styles.option} onClick={() => handleOptionClick(opt)}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
