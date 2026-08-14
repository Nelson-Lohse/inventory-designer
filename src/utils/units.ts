/** Inches is the canonical stored unit (see ARCHITECTURE.md open decisions). */
export function formatInches(valueIn: number): string {
  return `${Math.round(valueIn * 100) / 100}"`;
}

export function inchesToFeetInches(valueIn: number): string {
  const feet = Math.floor(valueIn / 12);
  const inches = Math.round(valueIn % 12);
  if (feet === 0) return `${inches}"`;
  return inches === 0 ? `${feet}'` : `${feet}'${inches}"`;
}
