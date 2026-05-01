// SVG icons for the seating plan object library.
// All icons are top-view floor plan symbols at viewBox="0 0 32 32".

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

export function IconFlowers({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.7"/>
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 16 + Math.cos(rad) * 9;
        const cy = 16 + Math.sin(rad) * 9;
        return <circle key={i} cx={cx} cy={cy} r="4" fill="currentColor" opacity="0.35"/>;
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

export function IconSerpentineTable({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      {/* Horizontal S: left half curves up, right half curves down */}
      <path d="M4 16 C4 6 16 6 16 16 C16 26 28 26 28 16"
        stroke="currentColor" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function IconPiano({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={s}>
      <rect x="3" y="8" width="26" height="16" rx="3" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.5"/>
      {[6,10,14,18,22].map((x, i) => (
        <rect key={i} x={x} y="8" width="2.5" height="9" rx="1" fill="white" opacity="0.5"/>
      ))}
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
