// entryContext.tsx

"use client";
import React, { useState, useEffect } from "react";
import styles from "./context.module.css";
import { useContextContext } from "./contextContext";
import { ContextConfig } from "./utils";

interface EntryContextProps {
  entryContext: ContextConfig | null;
  onContextChange: (context: ContextConfig | null) => void;
}

const EntryContext: React.FC<EntryContextProps> = ({ entryContext, onContextChange }) => {
  const { contexts } = useContextContext();
  const [expanded, setExpanded] = useState<boolean>(entryContext === null);
  useEffect(() => {
    if (entryContext === null) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [entryContext]);
  const handleClick = (ctx: ContextConfig) => {
    if (entryContext && entryContext.id === ctx.id) {
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
      {displayedContexts.map((ctx: ContextConfig) => {
        const style = { color: ctx.textColor, backgroundColor: ctx.backgroundColor };
        return (
          <span
            key={ctx.id}
            className={styles.contextBadge}
            onClick={() => handleClick(ctx)}
            style={style}
          >
            {ctx.name}
          </span>
        );
      })}
    </div>
  );
};

export default EntryContext;
