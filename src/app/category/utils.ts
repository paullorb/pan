export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = ((num >> 8) & 0x00ff) - amt;
  let B = (num & 0x0000ff) - amt;
  R = R < 0 ? 0 : R;
  G = G < 0 ? 0 : G;
  B = B < 0 ? 0 : B;
  return "#" + ((R << 16) | (G << 8) | B).toString(16).padStart(6, "0");
}
