"use client"
import React, { useState, useRef, useEffect } from "react"
import styles from "./customSelect.module.css"

type CustomSelectProps = {
  options: string[]
  value: string
  unit?: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
  className?: string
  disabled?: boolean
}

export default function CustomSelect({
  options,
  value,
  unit,
  onChange,
  onKeyDown,
  className,
  disabled
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    if (!disabled) setOpen(prev => !prev)
  }

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

  useEffect(() => {
    if (open && containerRef.current) {
      const selectedIndex = options.indexOf(value)
      const firstChild = containerRef.current.firstElementChild as HTMLElement
      if (!firstChild) return
      const optionHeight = firstChild.offsetHeight
      const containerHeight = containerRef.current.clientHeight
      const scrollTop =
        selectedIndex * optionHeight - (containerHeight / 2 - optionHeight / 2)
      containerRef.current.scrollTop = scrollTop
    }
  }, [open, options, value])

  return (
    <div className={`${styles.customSelect} ${className || ""}`} ref={wrapperRef}>
      <div
        className={`${styles.selectTrigger} ${disabled ? styles.disabled : ""}`}
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {value}{unit ? ` ${unit}` : ""}
      </div>
      {open && !disabled && (
        <div className={styles.optionsWrapper}>
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
          {unit && <div className={styles.fixedUnit}>{unit}</div>}
        </div>
      )}
    </div>
  )
}
