// Top-view floor plan icons for tables and seating (viewBox 0 0 32 32).
const s: React.CSSProperties = { display: "block" };

export function IconRoundTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.55"/>
    </svg>
  );
}
export function IconRectTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="10" width="24" height="12" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
export function IconLongTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="2" y="12" width="28" height="8" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
export function IconCocktailTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="8" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}
export function IconSerpentineTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <path d="M4 16 C4 6 16 6 16 16 C16 26 28 26 28 16" stroke="currentColor" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}
export function IconChair({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="8" y="4" width="16" height="10" rx="3" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="6" y="14" width="20" height="14" rx="3" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
export function IconBench({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="3" y="9" width="26" height="8" rx="2" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="17" width="26" height="6" rx="2" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
export function IconSofa({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="6" y="12" width="20" height="14" rx="3" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="15" width="6" height="11" rx="3" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="24" y="15" width="6" height="11" rx="3" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="6" y="8" width="20" height="6" rx="2" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
