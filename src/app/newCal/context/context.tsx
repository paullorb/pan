"use client";
import React, { useState } from "react";
import styles from "./context.module.css";

const contexts = ["personal", "work", "social"];

const Context: React.FC = () => {
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  const handleClick = (ctx: string) => {
    setSelectedContext(ctx);
  };

  const displayedContexts = selectedContext ? [selectedContext] : contexts;

  return (
    <div className={styles.contextContainer}>
      {displayedContexts.map((ctx) => (
        <span key={ctx} className={styles.contextBadge} onClick={() => handleClick(ctx)}>
          {ctx}
        </span>
      ))}
    </div>
  );
};

export default Context;
