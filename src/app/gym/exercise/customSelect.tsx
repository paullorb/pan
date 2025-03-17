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
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const toggleOpen = () => setOpen(prev => !prev)
  const handleOptionClick = (option: string) => {
    onChange(option)
    setOpen(false)
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  useEffect(() => {
    if (open && containerRef.current) {
      const selectedIndex = options.indexOf(value)
      if (selectedIndex < 0) return
      const firstChild = containerRef.current.firstElementChild as HTMLElement
      if (!firstChild) return
      const itemHeight = firstChild.offsetHeight
      const containerHeight = containerRef.current.clientHeight
      const scrollTop = selectedIndex * itemHeight - (containerHeight / 2 - itemHeight / 2)
      containerRef.current.scrollTop = scrollTop
    }
  }, [open, options, value])
  return (
    <div className={`${styles.customSelect} ${className || ""}`} ref={wrapperRef}>
      <div className={styles.selected} onClick={toggleOpen} onKeyDown={onKeyDown} tabIndex={0}>
        {value}
      </div>
      {open && (
        <div className={styles.options} ref={containerRef} style={{ maxHeight: "150px", overflowY: "auto" }}>
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
