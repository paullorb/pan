"use client";
import React from "react";
import styles from "./context.module.css";
import { useContextContext } from "./contextContext";

const contextColors = {
  personal: { text: "#8e44ad", background: "#dcd6f7" },
  work: { text: "#16a085", background: "#d1f2eb" },
  social: { text: "#e67e22", background: "#f9e79f" }
};

const Context: React.FC = () => {
  const { selectedContext, setSelectedContext, contexts } = useContextContext();

  const handleClick = (ctx: string) => {
    setSelectedContext(ctx === selectedContext ? null : ctx);
  };

  return (
    <div className={styles.container}>
      {contexts.map((ctx) => {
        const isSelected = selectedContext === ctx;
        const style = isSelected ? { color: contextColors[ctx as keyof typeof contextColors].text, backgroundColor: contextColors[ctx as keyof typeof contextColors].background } : {};
        return (
          <span
            key={ctx}
            className={styles.contextBadge}
            onClick={() => handleClick(ctx)}
            style={style}
          >
            {ctx}
          </span>
        );
      })}
    </div>
  );
};

export default Context;
