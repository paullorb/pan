"use client";
import React, { useState, useEffect } from "react";
import styles from "./context.module.css";

const contexts = ["personal", "work", "social"];
const contextColors = {
  personal: { text: "#8e44ad", background: "#dcd6f7" },
  work: { text: "#16a085", background: "#d1f2eb" },
  social: { text: "#e67e22", background: "#f9e79f" }
};

interface EntryContextProps {
  entryContext: string | null;
  onContextChange: (context: string) => void;
}

const EntryContext: React.FC<EntryContextProps> = ({ entryContext, onContextChange }) => {
  const [expanded, setExpanded] = useState<boolean>(entryContext === null);

  useEffect(() => {
    if (entryContext === null) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [entryContext]);

  const handleClick = (ctx: string) => {
    if (!expanded) {
      setExpanded(true);
    } else {
      onContextChange(ctx);
      setExpanded(false);
    }
  };

  const displayAll = expanded || entryContext === null;
  const displayedContexts = displayAll ? contexts : [entryContext!];

  return (
    <div className={styles.container}>
      {displayedContexts.map((ctx) => {
        const style = { color: contextColors[ctx as keyof typeof contextColors].text, backgroundColor: contextColors[ctx as keyof typeof contextColors].background };
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

export default EntryContext;
