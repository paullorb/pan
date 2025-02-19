"use client";
import React, { useMemo } from "react";
import styles from "./context.module.css";
import { useContextContext } from "./contextContext";
import { ContextConfig } from "./utils";
import { useItems } from "../item/entryContext";

const Context: React.FC = () => {
  const { selectedContext, setSelectedContext, contexts } = useContextContext();
  const { items } = useItems();
  const contextCount = useMemo(() => {
    const count: Record<string, number> = {};
    contexts.forEach(ctx => {
      count[ctx.id] = 0;
    });
    Object.values(items).forEach(dayItems => {
      dayItems.forEach(item => {
        if (item.context && count.hasOwnProperty(item.context)) {
          count[item.context]++;
        }
      });
    });
    return count;
  }, [items, contexts]);
  const handleClick = (ctx: ContextConfig) => {
    setSelectedContext(selectedContext && selectedContext.id === ctx.id ? null : ctx);
  };
  return (
    <div className={styles.container}>
      {contexts.map(ctx => {
        const isSelected = selectedContext && selectedContext.id === ctx.id;
        const style = isSelected
          ? { color: ctx.textColor, backgroundColor: ctx.backgroundColor }
          : {};
        return (
          <span
            key={ctx.id}
            className={styles.contextBadge}
            onClick={() => handleClick(ctx)}
            style={style}
          >
            {ctx.name} ({contextCount[ctx.id]})
          </span>
        );
      })}
    </div>
  );
};

export default Context;
