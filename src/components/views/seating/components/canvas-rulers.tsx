"use client";

export const RULER_SIZE = 20; // px

const BG    = "#1E1E24";
const TICK  = "rgba(255,255,255,0.28)";
const LABEL = "rgba(255,255,255,0.45)";

function niceInterval(zoom: number): number {
  const worldPerTick = 80 / zoom;
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(worldPerTick, 1))));
  const n = worldPerTick / mag;
  if (n < 2) return mag;
  if (n < 5) return 2 * mag;
  return 5 * mag;
}

/** Corner square that covers the intersection of the two rulers. */
export function RulerCorner() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0,
      width: RULER_SIZE, height: RULER_SIZE,
      background: BG, zIndex: 2, flexShrink: 0,
    }} />
  );
}

interface TopProps {
  zoom: number;
  panOffset: { x: number; y: number };
  /** offsetX already adjusted for ruler position: pass (canvasOffsetX - RULER_SIZE). */
  offsetX: number;
  canvasW: number;
  onMouseDown: (worldX: number) => void;
}

/** Horizontal ruler — overlaid absolutely at the top of the canvas container. */
export function RulerTop({ zoom, panOffset, offsetX, canvasW, onMouseDown }: TopProps) {
  const iv   = niceInterval(zoom);
  const wMin = (-offsetX - panOffset.x) / zoom;
  const wMax = (canvasW - offsetX - panOffset.x) / zoom;

  const ticks: number[] = [];
  for (let t = Math.ceil(wMin / iv) * iv; t <= wMax; t += iv) ticks.push(t);

  const sxOf = (wx: number) => offsetX + panOffset.x + wx * zoom;

  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    onMouseDown((e.clientX - r.left - offsetX - panOffset.x) / zoom);
  };

  return (
    <div onMouseDown={handle} style={{
      position: "absolute", top: 0, left: RULER_SIZE, right: 0, height: RULER_SIZE,
      background: BG, overflow: "hidden", cursor: "col-resize", userSelect: "none", zIndex: 1,
    }}>
      {ticks.map((wx) => (
        <div key={wx} style={{ position: "absolute", left: sxOf(wx), top: 0 }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 1, height: 7, background: TICK }} />
          <span style={{ position: "absolute", left: 2, top: 3, fontSize: 8, color: LABEL, whiteSpace: "nowrap" }}>
            {Math.round(wx)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface LeftProps {
  zoom: number;
  panOffset: { x: number; y: number };
  /** offsetY relative to the canvas top (ruler starts at top:0, same as canvas). */
  offsetY: number;
  canvasH: number;
  onMouseDown: (worldY: number) => void;
}

/** Vertical ruler — overlaid absolutely on the left of the canvas container. */
export function RulerLeft({ zoom, panOffset, offsetY, canvasH, onMouseDown }: LeftProps) {
  const iv   = niceInterval(zoom);
  const wMin = (-offsetY - panOffset.y) / zoom;
  const wMax = (canvasH - offsetY - panOffset.y) / zoom;

  const ticks: number[] = [];
  for (let t = Math.ceil(wMin / iv) * iv; t <= wMax; t += iv) ticks.push(t);

  const syOf = (wy: number) => offsetY + panOffset.y + wy * zoom;

  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    onMouseDown((e.clientY - r.top - offsetY - panOffset.y) / zoom);
  };

  return (
    <div onMouseDown={handle} style={{
      position: "absolute", top: 0, left: 0, width: RULER_SIZE, bottom: 0,
      background: BG, overflow: "hidden", cursor: "row-resize", userSelect: "none", zIndex: 1,
    }}>
      {ticks.map((wy) => (
        <div key={wy} style={{ position: "absolute", top: syOf(wy), left: 0, width: RULER_SIZE }}>
          <div style={{ position: "absolute", right: 0, top: 0, width: 7, height: 1, background: TICK }} />
          <span style={{
            position: "absolute", top: 2, left: 2, fontSize: 8, color: LABEL,
            writingMode: "vertical-rl", transform: "rotate(180deg)", transformOrigin: "50% 50%",
            whiteSpace: "nowrap",
          }}>
            {Math.round(wy)}
          </span>
        </div>
      ))}
    </div>
  );
}
