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
  const [showAll, setShowAll] = useState<boolean>(entryContext === null);
  useEffect(() => {
    setShowAll(entryContext === null);
  }, [entryContext]);
  const handleClick = (ctx: ContextConfig) => {
    if (entryContext && entryContext.id === ctx.id) {
      onContextChange(null);
      setShowAll(true);
      return;
    }
    if (showAll) {
      onContextChange(ctx);
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  };
  const displayedContexts = showAll ? contexts : [entryContext!];
  return (
    <div className={styles.container}>
      {displayedContexts.map(ctx => {
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
