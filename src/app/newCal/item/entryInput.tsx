import React from "react"
import styles from "./entry.module.css"

interface EntryInputProps {
  input: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement>
}

const EntryInput: React.FC<EntryInputProps> = ({ input, onChange, onKeyDown, inputRef }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => onChange(e.target.value)}
        placeholder="new item"
        onKeyDown={onKeyDown}
        autoFocus
        className={styles.input}
      />
    </div>
  )
}

export default EntryInput
