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
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
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
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  // When open, scroll the container so that the selected option is centered.
  useEffect(() => {
    if (open && containerRef.current) {
      const selectedIndex = options.indexOf(value)
      const firstChild = containerRef.current.firstElementChild as HTMLElement
      if (!firstChild) return
      const optionHeight = firstChild.offsetHeight
      const containerHeight = containerRef.current.clientHeight
      const scrollTop = selectedIndex * optionHeight - (containerHeight / 2 - optionHeight / 2)
      containerRef.current.scrollTop = scrollTop
    }
  }, [open, options, value])
  
  return (
    <div className={`${styles.customSelect} ${className || ""}`} ref={wrapperRef}>
      <div
        className={styles.selectTrigger}
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {value}
      </div>
      {open && (
        <div className={styles.optionsContainer} ref={containerRef}>
          {options.map(opt => (
            <div
              key={opt}
              className={`${styles.option} ${opt === value ? styles.selectedOption : ""}`}
              onClick={() => handleOptionClick(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
