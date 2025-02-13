"use client";
import React, { useState, useEffect } from "react";
import styles from "./context.module.css";
import { contexts, contextColors, ContextType } from "./utils";

interface EntryContextProps {
  entryContext: ContextType | null;
  onContextChange: (context: ContextType | null) => void;
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
  const handleClick = (ctx: ContextType) => {
    if (entryContext === ctx) {
      onContextChange(null);
      setExpanded(true);
      return;
    }
    if (expanded) {
      onContextChange(ctx);
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };
  const displayAll = expanded || entryContext === null;
  const displayedContexts = displayAll ? contexts : [entryContext!];
  return (
    <div className={styles.container}>
      {displayedContexts.map((ctx) => {
        const style = { color: contextColors[ctx].text, backgroundColor: contextColors[ctx].background };
        return (
          <span key={ctx} className={styles.contextBadge} onClick={() => handleClick(ctx)} style={style}>
            {ctx}
          </span>
        );
      })}
    </div>
  );
};

export default EntryContext;
