// cal/utils.ts

export interface ContextConfig {
  id: string;
  name: string;
  textColor: string;
  backgroundColor: string;
}

export const defaultContexts: ContextConfig[] = [
  { id: "personal", name: "personal", textColor: "#8e44ad", backgroundColor: "#dcd6f7" },
  { id: "work", name: "work", textColor: "#16a085", backgroundColor: "#d1f2eb" },
  { id: "social", name: "social", textColor: "#e67e22", backgroundColor: "#f9e79f" }
];
