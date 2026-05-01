// Top-view icons for service / venue / tech elements (viewBox 0 0 32 32).
const s: React.CSSProperties = { display: "block" };

export function IconBar({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="2" y="10" width="28" height="12" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="2" y1="16" x2="30" y2="16" stroke="white" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}
export function IconCandyBar({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="14" width="24" height="12" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="11" r="4" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="9" r="4" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="22" cy="11" r="4" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
export function IconGiftTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="12" width="24" height="14" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="16" y1="12" x2="16" y2="26" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      <line x1="4" y1="19" x2="28" y2="19" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      <path d="M13 12 Q16 6 19 12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7"/>
    </svg>
  );
}
export function IconCoatCheck({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="12" width="24" height="14" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 6 Q16 4 18 4 Q20 4 20 6 Q20 10 14 10 Q8 10 8 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
export function IconBathroom({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="2" y="6" width="13" height="20" rx="2" fill="currentColor" opacity="0.45" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="17" y="6" width="13" height="20" rx="2" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.5"/>
      <text x="8" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" opacity="0.9">♂</text>
      <text x="24" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" opacity="0.9">♀</text>
    </svg>
  );
}
export function IconEntrance({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="4" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 16 L22 16 M18 12 L22 16 L18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function IconOutlet({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="10" width="3" height="6" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="17" y="10" width="3" height="6" rx="1" fill="currentColor" opacity="0.8"/>
    </svg>
  );
}
export function IconSpeaker({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="9" y="5" width="14" height="22" rx="3" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="13" r="4" fill="white" opacity="0.4"/>
      <circle cx="16" cy="13" r="2" fill="currentColor" opacity="0.7"/>
      <circle cx="16" cy="24" r="2" fill="white" opacity="0.4"/>
    </svg>
  );
}
export function IconScreen({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="2" y="8" width="28" height="18" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="6" y="12" width="20" height="10" rx="1" fill="white" opacity="0.3"/>
    </svg>
  );
}
