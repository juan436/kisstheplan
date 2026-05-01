// Top-view icons for decoration / nature / performance elements (viewBox 0 0 32 32).
const s: React.CSSProperties = { display: "block" };

export function IconArch({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="10" width="5" height="18" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="23" y="10" width="5" height="18" rx="2" fill="currentColor" opacity="0.7"/>
      <path d="M9 10 Q16 2 23 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
export function IconRunner({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="12" y="2" width="8" height="28" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
    </svg>
  );
}
export function IconDanceFloor({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="3" y="3" width="26" height="26" rx="2" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="3" width="13" height="13" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="16" y="16" width="13" height="13" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  );
}
export function IconStage({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="2" y="8" width="28" height="18" rx="2" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="24" width="28" height="4" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}
export function IconDjBooth({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <path d="M4 28 Q4 8 16 8 Q28 8 28 28Z" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="20" r="4" fill="white" opacity="0.6"/>
      <circle cx="16" cy="20" r="1.5" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}
export function IconPhotocall({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="3" y="3" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="9" y="9" width="14" height="14" rx="1" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
    </svg>
  );
}
export function IconPiano({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="3" y="8" width="26" height="16" rx="3" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      {[6,10,14,18,22].map((x, i) => <rect key={i} x={x} y="8" width="2.5" height="9" rx="1" fill="white" opacity="0.5"/>)}
    </svg>
  );
}
export function IconFlowers({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.7"/>
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <circle key={i} cx={16 + Math.cos(rad) * 9} cy={16 + Math.sin(rad) * 9} r="4" fill="currentColor" opacity="0.35"/>;
      })}
    </svg>
  );
}
export function IconTree({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="6" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}
export function IconCandelabra({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.9"/>
      <circle cx="8" cy="16" r="2.5" fill="currentColor" opacity="0.6"/>
      <circle cx="24" cy="16" r="2.5" fill="currentColor" opacity="0.6"/>
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.4"/>
      <line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="16" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="24" y1="8" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
export function IconCarpet({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="4" y="8" width="24" height="16" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <rect x="8" y="12" width="16" height="8" rx="1" fill="currentColor" opacity="0.35"/>
    </svg>
  );
}
