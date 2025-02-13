"use client";
import React from "react";
import styles from "./context.module.css";
import { useContextContext } from "./contextContext";
import { contextColors, contexts, ContextType } from "./utils";
import { useItems } from "../item/itemContext";

const Context: React.FC = () => {
  const { selectedContext, setSelectedContext, contexts: headerContexts } = useContextContext();
  const { items } = useItems();
  const contextCount: Record<ContextType, number> = { personal: 0, work: 0, social: 0 };
  Object.values(items).forEach(dayItems => {
    dayItems.forEach(item => {
      if (item.context && item.context in contextCount) {
        contextCount[item.context as ContextType]++;
      }
    });
  });
  const handleClick = (ctx: ContextType) => {
    setSelectedContext(ctx === selectedContext ? null : ctx);
  };
  return (
    <div className={styles.container}>
      {headerContexts.map((ctx) => {
        const isSelected = selectedContext === ctx;
        const style = isSelected ? { color: contextColors[ctx].text, backgroundColor: contextColors[ctx].background } : {};
        return (
          <span key={ctx} className={styles.contextBadge} onClick={() => handleClick(ctx)} style={style}>
            {ctx} ({contextCount[ctx]})
          </span>
        );
      })}
    </div>
  );
};

export default Context;
