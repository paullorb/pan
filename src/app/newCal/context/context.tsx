// context.tsx

"use client";
import React from "react";
import styles from "./context.module.css";
import { useContextContext } from "./contextContext";

const Context: React.FC = () => {
  const { selectedContext, setSelectedContext, contexts } = useContextContext();

  const handleClick = (ctx: string) => {
    setSelectedContext(ctx === selectedContext ? null : ctx);
  };

  const displayedContexts = selectedContext ? [selectedContext] : contexts;

  return (
    <div className={styles.container}>
      {displayedContexts.map((ctx) => (
        <span key={ctx} className={styles.contextBadge} onClick={() => handleClick(ctx)}>
          {ctx}
        </span>
      ))}
    </div>
  );
};

export default Context;
