"use client";

import React from "react";
import styles from "./toggles.module.css";

export default function Toggles () {
  return (
    <div className={styles.container}>
      <div className={styles.toggles}>
        <button className={styles.label}>Toggles</button>
      </div>
    </div>
  )
}