"use client"

type ModifierProps = {
  onAdd: () => void
  onRemove: () => void
}

export default function Modifier({ onAdd, onRemove }: ModifierProps) {
  return (
    <div style={{ marginTop: "0.3rem" }}>
      <button type="button" onClick={onAdd} style={{ marginRight: "0.3rem" }}>
        +
      </button>
      <button type="button" onClick={onRemove}>
        -
      </button>
    </div>
  )
}
