"use client"

import style from './print.module.css';

export default function Print () {
  
  function print () {
    window.print()
  }
  return (
    <div>
      <button onClick={print} className={style.button}>
        <h1 className={style.pansito}>🍞</h1>
      </button>
    </div>
  )
}