export type ContextType = "personal" | "work" | "social";
export const contexts: ContextType[] = ["personal", "work", "social"];
export const contextColors: Record<ContextType, { text: string; background: string }> = {
  personal: { text: "#8e44ad", background: "#dcd6f7" },
  work: { text: "#16a085", background: "#d1f2eb" },
  social: { text: "#e67e22", background: "#f9e79f" }
};
