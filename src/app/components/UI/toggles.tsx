"use client";

import React from "react";
import styles from "./toggles.module.css";

export default function Toggles () {
  return (
    <div className={styles.container}>
      <div className={styles.toggle}>
        <label className={styles.label}>Toggle 1</label>
        </div>
      <div className={styles.toggle}>
        <label className={styles.label}>Toggle 2</label>
      </div>
      <div className={styles.toggle}>
        <label className={styles.label}>Toggle 3</label>
      </div>
      <div className={styles.toggle}>
        <label className={styles.label}>Toggle 1</label>
      </div>
    </div>
  )
}