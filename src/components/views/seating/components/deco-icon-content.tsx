// Inline SVG content for decoration objects on the canvas.
// Shapes live in a 32×32 coordinate space — NO outer <svg> wrapper.
// Embed with: <g transform={`translate(${-w/2},${-h/2}) scale(${w/32},${h/32})`}>

const D = "rgba(90,68,52,0.9)";   // dark stroke / fill
const M = "rgba(90,68,52,0.5)";   // mid fill
const L = "rgba(90,68,52,0.22)";  // light fill

// ── Asientos ─────────────────────────────────────────────────────────────────
function Chair() {
  return (<><rect x="8" y="4" width="16" height="10" rx="3" fill={L} stroke={D} strokeWidth="1.5"/><rect x="6" y="14" width="20" height="14" rx="3" fill={M} stroke={D} strokeWidth="1.5"/></>);
}
function Bench() {
  return (<><rect x="3" y="9" width="26" height="8" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><rect x="3" y="17" width="26" height="6" rx="2" fill={M} stroke={D} strokeWidth="1.5"/></>);
}
function SillaTerraza() {
  return (<><rect x="7" y="3" width="18" height="12" rx="3" fill={L} stroke={D} strokeWidth="1.5"/><rect x="5" y="15" width="22" height="13" rx="3" fill={M} stroke={D} strokeWidth="1.5"/><rect x="3" y="17" width="4" height="9" rx="2" fill={D} opacity="0.5"/><rect x="25" y="17" width="4" height="9" rx="2" fill={D} opacity="0.5"/></>);
}
function Tumbona() {
  return (<><rect x="2" y="10" width="22" height="12" rx="3" fill={M} stroke={D} strokeWidth="1.5"/><rect x="24" y="8" width="6" height="16" rx="3" fill={L} stroke={D} strokeWidth="1.5"/><rect x="4" y="22" width="4" height="4" rx="1" fill={D} opacity="0.4"/><rect x="16" y="22" width="4" height="4" rx="1" fill={D} opacity="0.4"/></>);
}
function CamaBalinesa() {
  return (<><rect x="4" y="6" width="24" height="20" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><rect x="4" y="6" width="24" height="5" rx="1" fill={M}/><circle cx="4" cy="6" r="2" fill={D} opacity="0.6"/><circle cx="28" cy="6" r="2" fill={D} opacity="0.6"/><circle cx="4" cy="26" r="2" fill={D} opacity="0.6"/><circle cx="28" cy="26" r="2" fill={D} opacity="0.6"/></>);
}
function Hamaca() {
  return (<><rect x="2" y="13" width="4" height="10" rx="2" fill={D} opacity="0.6"/><rect x="26" y="13" width="4" height="10" rx="2" fill={D} opacity="0.6"/><path d="M6 15 Q16 22 26 15" stroke={D} strokeWidth="2.5" fill={L} strokeLinecap="round"/><path d="M6 19 Q16 26 26 19" stroke={D} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/></>);
}
function Pouf() {
  return (<><circle cx="16" cy="16" r="11" fill={M} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="16" r="6" fill={L} stroke={D} strokeWidth="1" strokeDasharray="3 2"/></>);
}
function Taburete() {
  return (<><circle cx="16" cy="13" r="8" fill={M} stroke={D} strokeWidth="1.5"/><line x1="10" y1="21" x2="8" y2="29" stroke={D} strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="21" x2="24" y2="29" stroke={D} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="21" x2="16" y2="29" stroke={D} strokeWidth="2" strokeLinecap="round"/></>);
}

// ── Estructuras ───────────────────────────────────────────────────────────────
function Toldo() {
  return (<><rect x="2" y="8" width="28" height="16" rx="2" fill={L} stroke={D} strokeWidth="2"/><line x1="2" y1="12" x2="30" y2="12" stroke={D} strokeWidth="1" opacity="0.4"/><line x1="2" y1="16" x2="30" y2="16" stroke={D} strokeWidth="1" opacity="0.4"/><line x1="2" y1="20" x2="30" y2="20" stroke={D} strokeWidth="1" opacity="0.4"/><circle cx="4" cy="8" r="2" fill={D} opacity="0.6"/><circle cx="28" cy="8" r="2" fill={D} opacity="0.6"/><circle cx="4" cy="24" r="2" fill={D} opacity="0.6"/><circle cx="28" cy="24" r="2" fill={D} opacity="0.6"/></>);
}
function Carpa() {
  return (<><rect x="3" y="3" width="26" height="26" rx="2" fill={L} stroke={D} strokeWidth="2"/><line x1="3" y1="3" x2="16" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="29" y1="3" x2="16" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="3" y1="29" x2="16" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="29" y1="29" x2="16" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><circle cx="16" cy="16" r="3" fill={D} opacity="0.6"/></>);
}
function CarpaHex() {
  const verts: [number, number][] = [[16,2],[28,9],[28,23],[16,30],[4,23],[4,9]];
  return (<><polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill={L} stroke={D} strokeWidth="2"/>{verts.map(([x,y],i) => <line key={i} x1={x} y1={y} x2="16" y2="16" stroke={D} strokeWidth="1" opacity="0.4"/>)}<circle cx="16" cy="16" r="3" fill={D} opacity="0.6"/></>);
}
function Pergola() {
  return (<><rect x="3" y="3" width="26" height="26" rx="1" fill="none" stroke={D} strokeWidth="2"/><circle cx="3" cy="3" r="2.5" fill={D} opacity="0.7"/><circle cx="29" cy="3" r="2.5" fill={D} opacity="0.7"/><circle cx="3" cy="29" r="2.5" fill={D} opacity="0.7"/><circle cx="29" cy="29" r="2.5" fill={D} opacity="0.7"/><line x1="3" y1="10" x2="29" y2="10" stroke={D} strokeWidth="1.5" opacity="0.5"/><line x1="3" y1="16" x2="29" y2="16" stroke={D} strokeWidth="1.5" opacity="0.5"/><line x1="3" y1="22" x2="29" y2="22" stroke={D} strokeWidth="1.5" opacity="0.5"/></>);
}
function Tipi() {
  return (<><circle cx="16" cy="16" r="13" fill={L} stroke={D} strokeWidth="1.5"/>{[0,45,90,135,180,225,270,315].map((deg,i) => { const r = (deg*Math.PI)/180; return <line key={i} x1="16" y1="16" x2={16+Math.cos(r)*13} y2={16+Math.sin(r)*13} stroke={D} strokeWidth="1" opacity="0.4"/>; })}<circle cx="16" cy="16" r="3" fill={D} opacity="0.6"/></>);
}
function Glorieta() {
  const pts = Array.from({length:8},(_,i)=>{const a=(i*45-22.5)*Math.PI/180; return `${16+Math.cos(a)*13},${16+Math.sin(a)*13}`;}).join(" ");
  return (<><polygon points={pts} fill={L} stroke={D} strokeWidth="2"/>{Array.from({length:8},(_,i)=>{const a=(i*45-22.5)*Math.PI/180; return <line key={i} x1={16+Math.cos(a)*13} y1={16+Math.sin(a)*13} x2="16" y2="16" stroke={D} strokeWidth="1" opacity="0.35"/>;})}<circle cx="16" cy="16" r="4" fill={D} opacity="0.55"/></>);
}
function Parasol() {
  return (<>{[0,60,120,180,240,300].map((deg,i)=>{const a=deg*Math.PI/180,b=(deg+60)*Math.PI/180; return <path key={i} d={`M16 16 L${16+Math.cos(a)*13} ${16+Math.sin(a)*13} A13 13 0 0 1 ${16+Math.cos(b)*13} ${16+Math.sin(b)*13}Z`} fill={i%2===0?M:L} stroke={D} strokeWidth="1"/>;})}<circle cx="16" cy="16" r="3" fill={D}/></>);
}

// ── Servicio ──────────────────────────────────────────────────────────────────
function Bar() {
  return (<><rect x="2" y="10" width="28" height="12" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><line x1="2" y1="16" x2="30" y2="16" stroke="white" strokeWidth="1" opacity="0.4"/></>);
}
function CandyBar() {
  return (<><rect x="4" y="14" width="24" height="12" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><circle cx="10" cy="11" r="4" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="9" r="4" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="22" cy="11" r="4" fill={L} stroke={D} strokeWidth="1.5"/></>);
}
function GiftTable() {
  return (<><rect x="4" y="12" width="24" height="14" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><line x1="16" y1="12" x2="16" y2="26" stroke="white" strokeWidth="1.5" opacity="0.5"/><line x1="4" y1="19" x2="28" y2="19" stroke="white" strokeWidth="1.5" opacity="0.5"/><path d="M13 12 Q16 6 19 12" stroke={D} strokeWidth="1.5" fill="none" opacity="0.7"/></>);
}
function CoatCheck() {
  return (<><rect x="4" y="12" width="24" height="14" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><path d="M16 6 Q16 4 18 4 Q20 4 20 6 Q20 10 14 10 Q8 10 8 6" stroke={D} strokeWidth="2" fill="none" strokeLinecap="round"/><line x1="16" y1="10" x2="16" y2="12" stroke={D} strokeWidth="2"/></>);
}
function Bathroom() {
  return (<><rect x="2" y="6" width="13" height="20" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><rect x="17" y="6" width="13" height="20" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><text x="8.5" y="21" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" style={{userSelect:"none"}}>♂</text><text x="23.5" y="21" textAnchor="middle" fontSize="10" fontWeight="700" fill={D} style={{userSelect:"none"}}>♀</text></>);
}
function Entrance() {
  return (<><rect x="4" y="4" width="24" height="24" rx="2" fill="none" stroke={D} strokeWidth="2"/><path d="M11 16 L21 16 M17 12 L21 16 L17 20" stroke={D} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>);
}
function Mostrador() {
  return (<><rect x="2" y="9" width="28" height="14" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><rect x="2" y="9" width="8" height="14" rx="1" fill={L}/><rect x="22" y="9" width="8" height="14" rx="1" fill={L}/></>);
}
function Carrito() {
  return (<><rect x="5" y="7" width="22" height="18" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><line x1="5" y1="16" x2="27" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><circle cx="9" cy="25" r="2.5" fill={D} opacity="0.5"/><circle cx="23" cy="25" r="2.5" fill={D} opacity="0.5"/></>);
}
function Nevera() {
  return (<><rect x="8" y="4" width="16" height="24" rx="3" fill={L} stroke={D} strokeWidth="1.5"/><line x1="8" y1="16" x2="24" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><circle cx="16" cy="11" r="1.5" fill={D} opacity="0.4"/><circle cx="16" cy="22" r="1.5" fill={D} opacity="0.4"/></>);
}

// ── Piscina / Terraza ─────────────────────────────────────────────────────────
function MesaBaja() {
  return (<><ellipse cx="16" cy="16" rx="12" ry="8" fill={L} stroke={D} strokeWidth="1.5"/><ellipse cx="16" cy="16" rx="7" ry="4" fill={M} stroke={D} strokeWidth="1" opacity="0.6"/></>);
}
function Piscina() {
  return (<><ellipse cx="16" cy="16" rx="13" ry="10" fill="rgba(74,144,226,0.2)" stroke="rgba(74,144,226,0.8)" strokeWidth="2"/><ellipse cx="16" cy="16" rx="9" ry="6" fill="rgba(74,144,226,0.15)" stroke="rgba(74,144,226,0.5)" strokeWidth="1" strokeDasharray="3 2"/></>);
}

// ── Decoración ────────────────────────────────────────────────────────────────
function Arch() {
  return (<><rect x="4" y="10" width="5" height="18" rx="2" fill={M}/><rect x="23" y="10" width="5" height="18" rx="2" fill={M}/><path d="M9 10 Q16 2 23 10" stroke={D} strokeWidth="3" fill="none" strokeLinecap="round"/></>);
}
function Runner() {
  return (<><rect x="12" y="2" width="8" height="28" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><line x1="16" y1="4" x2="16" y2="28" stroke={D} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/></>);
}
function Flowers() {
  return (<>{[0,60,120,180,240,300].map((deg,i)=>{const r=deg*Math.PI/180; return <circle key={i} cx={16+Math.cos(r)*9} cy={16+Math.sin(r)*9} r="4" fill={L}/>;})}<circle cx="16" cy="16" r="5" fill={M}/></>);
}
function Tree() {
  return (<><circle cx="16" cy="16" r="12" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="16" r="6" fill={M}/></>);
}
function Sofa() {
  return (<><rect x="6" y="12" width="20" height="14" rx="3" fill={M} stroke={D} strokeWidth="1.5"/><rect x="2" y="15" width="6" height="11" rx="3" fill={D} opacity="0.5" stroke={D} strokeWidth="1.5"/><rect x="24" y="15" width="6" height="11" rx="3" fill={D} opacity="0.5" stroke={D} strokeWidth="1.5"/><rect x="6" y="8" width="20" height="6" rx="2" fill={L} stroke={D} strokeWidth="1.5"/></>);
}
function Candelabra() {
  return (<><line x1="8" y1="16" x2="16" y2="16" stroke={D} strokeWidth="1.5"/><line x1="16" y1="16" x2="24" y2="16" stroke={D} strokeWidth="1.5"/><line x1="8" y1="8" x2="8" y2="16" stroke={D} strokeWidth="1.5"/><line x1="24" y1="8" x2="24" y2="16" stroke={D} strokeWidth="1.5"/><circle cx="16" cy="16" r="3" fill={D}/><circle cx="8" cy="16" r="2.5" fill={M}/><circle cx="24" cy="16" r="2.5" fill={M}/><circle cx="8" cy="8" r="2" fill={L}/><circle cx="24" cy="8" r="2" fill={L}/></>);
}
function Carpet() {
  return (<><rect x="4" y="8" width="24" height="16" rx="2" fill={L} stroke={D} strokeWidth="2"/><rect x="8" y="12" width="16" height="8" rx="1" fill={M}/></>);
}
function Fuente() {
  return (<><circle cx="16" cy="16" r="13" fill="rgba(74,144,226,0.15)" stroke="rgba(74,144,226,0.7)" strokeWidth="1.5"/><circle cx="16" cy="16" r="8" fill="rgba(74,144,226,0.2)" stroke="rgba(74,144,226,0.6)" strokeWidth="1.5"/><circle cx="16" cy="16" r="3" fill="rgba(74,144,226,0.8)"/>{[0,90,180,270].map((deg,i)=>{const r=deg*Math.PI/180;return <line key={i} x1={16+Math.cos(r)*3} y1={16+Math.sin(r)*3} x2={16+Math.cos(r)*8} y2={16+Math.sin(r)*8} stroke="rgba(74,144,226,0.5)" strokeWidth="1"/>;})}</>);
}
function Brasero() {
  return (<><circle cx="16" cy="16" r="12" fill={L} stroke={D} strokeWidth="2"/><circle cx="16" cy="16" r="7" fill="rgba(230,100,30,0.25)" stroke="rgba(230,100,30,0.7)" strokeWidth="1.5"/><path d="M14 17 Q15 13 16 15 Q17 11 18 14 Q19 16 16 19 Q13 16 14 17Z" fill="rgba(230,100,30,0.7)"/></>);
}
function Jardinera() {
  return (<><rect x="3" y="10" width="26" height="12" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="9" cy="16" r="4" fill={M} stroke={D} strokeWidth="1"/><circle cx="16" cy="16" r="4" fill={M} stroke={D} strokeWidth="1"/><circle cx="23" cy="16" r="4" fill={M} stroke={D} strokeWidth="1"/></>);
}
function Columna() {
  return (<><circle cx="16" cy="16" r="11" fill={L} stroke={D} strokeWidth="2"/><circle cx="16" cy="16" r="7" fill={M} stroke={D} strokeWidth="1"/><circle cx="16" cy="16" r="3" fill={D} opacity="0.4"/></>);
}
function Seto() {
  return (<><ellipse cx="8" cy="16" rx="6" ry="7" fill={M} stroke={D} strokeWidth="1.5"/><ellipse cx="16" cy="14" rx="6" ry="7" fill={M} stroke={D} strokeWidth="1.5"/><ellipse cx="24" cy="16" rx="6" ry="7" fill={M} stroke={D} strokeWidth="1.5"/></>);
}
function Farola() {
  return (<><circle cx="16" cy="8" r="5" fill="rgba(255,220,50,0.4)" stroke={D} strokeWidth="1.5"/><line x1="16" y1="13" x2="16" y2="28" stroke={D} strokeWidth="2"/><line x1="10" y1="28" x2="22" y2="28" stroke={D} strokeWidth="2" strokeLinecap="round"/></>);
}

// ── Pista y Música ────────────────────────────────────────────────────────────
function DanceFloor() {
  return (<><rect x="3" y="3" width="26" height="26" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><rect x="3" y="3" width="13" height="13" rx="1" fill={M}/><rect x="16" y="16" width="13" height="13" rx="1" fill={M}/></>);
}
function Stage() {
  return (<><rect x="2" y="8" width="28" height="18" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><rect x="2" y="24" width="28" height="4" rx="1" fill={L}/></>);
}
function DjBooth() {
  return (<><path d="M4 28 Q4 8 16 8 Q28 8 28 28Z" fill={M} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="20" r="4" fill="white" opacity="0.5"/><circle cx="16" cy="20" r="1.5" fill={D}/></>);
}
function Photocall() {
  return (<><rect x="3" y="3" width="26" height="26" rx="2" fill="none" stroke={D} strokeWidth="2.5"/><rect x="9" y="9" width="14" height="14" rx="1" fill={L} stroke={M} strokeWidth="1.5" strokeDasharray="3 2"/></>);
}
function Piano() {
  return (<><rect x="3" y="8" width="26" height="16" rx="3" fill={M} stroke={D} strokeWidth="1.5"/>{[6,10,14,18,22].map((x,i)=><rect key={i} x={x} y="8" width="2.5" height="9" rx="1" fill="white" opacity="0.55"/>)}</>);
}

// ── Técnica ───────────────────────────────────────────────────────────────────
function Speaker() {
  return (<><rect x="9" y="5" width="14" height="22" rx="3" fill={M} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="13" r="4" fill="white" opacity="0.3"/><circle cx="16" cy="13" r="2" fill={D}/><circle cx="16" cy="24" r="2" fill="white" opacity="0.35"/></>);
}
function Screen() {
  return (<><rect x="2" y="8" width="28" height="18" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><rect x="6" y="12" width="20" height="10" rx="1" fill="white" opacity="0.3"/></>);
}
function Outlet() {
  return (<><circle cx="16" cy="16" r="12" fill={L} stroke={D} strokeWidth="2"/><rect x="12" y="10" width="3" height="6" rx="1" fill={D}/><rect x="17" y="10" width="3" height="6" rx="1" fill={D}/></>);
}

// ── Ceremonial ────────────────────────────────────────────────────────────────
function Kuppah() {
  return (<><rect x="5" y="5" width="22" height="22" rx="1" fill={L} stroke={D} strokeWidth="1.5" strokeDasharray="4 2"/><circle cx="5" cy="5" r="2.5" fill={D}/><circle cx="27" cy="5" r="2.5" fill={D}/><circle cx="5" cy="27" r="2.5" fill={D}/><circle cx="27" cy="27" r="2.5" fill={D}/></>);
}
function Atril() {
  return (<><polygon points="6,8 26,8 28,26 4,26" fill={M} stroke={D} strokeWidth="1.5"/><rect x="12" y="11" width="8" height="5" rx="1" fill={L} opacity="0.5"/><line x1="16" y1="5" x2="16" y2="8" stroke={D} strokeWidth="2" strokeLinecap="round"/></>);
}
function MesaFirma() {
  return (<><rect x="4" y="10" width="24" height="12" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><line x1="9" y1="16" x2="21" y2="16" stroke={D} strokeWidth="1.5" strokeLinecap="round"/><path d="M19 13 L23 16 L19 19" stroke={D} strokeWidth="1" fill="none" strokeLinecap="round"/></>);
}
function AltarCeremonia() {
  return (<><rect x="4" y="6" width="24" height="20" rx="2" fill={M} stroke={D} strokeWidth="2"/><rect x="8" y="9" width="16" height="14" rx="1" fill={L} stroke={D} strokeWidth="1"/><line x1="16" y1="9" x2="16" y2="23" stroke={D} strokeWidth="1" opacity="0.4"/><line x1="8" y1="16" x2="24" y2="16" stroke={D} strokeWidth="1" opacity="0.4"/></>);
}
function VelasAltar() {
  return (<>{[6,11,16,21,26].map((x,i)=><g key={i}><rect x={x-1.5} y="12" width="3" height="14" rx="1" fill={M} stroke={D} strokeWidth="1"/><circle cx={x} cy="10" r="2.5" fill="rgba(255,200,50,0.5)" stroke={D} strokeWidth="0.8"/></g>)}</>);
}

// ── Buffet / Servicio extra ───────────────────────────────────────────────────
function MesaBuffet() {
  return (<><rect x="2" y="8" width="28" height="16" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><line x1="10" y1="8" x2="10" y2="24" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="18" y1="8" x2="18" y2="24" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="2" y1="16" x2="30" y2="16" stroke={D} strokeWidth="0.5" opacity="0.3"/></>);
}
function FuenteChocolate() {
  return (<><circle cx="16" cy="16" r="13" fill="rgba(101,67,33,0.12)" stroke="rgba(101,67,33,0.55)" strokeWidth="1.5"/><circle cx="16" cy="16" r="9" fill="rgba(101,67,33,0.18)" stroke="rgba(101,67,33,0.6)" strokeWidth="1.5"/><circle cx="16" cy="16" r="5" fill="rgba(101,67,33,0.3)" stroke="rgba(101,67,33,0.7)" strokeWidth="1.5"/><circle cx="16" cy="16" r="2" fill="rgba(101,67,33,0.85)"/></>);
}
function MesaVienesa() {
  return (<><circle cx="16" cy="16" r="13" fill={L} stroke={D} strokeWidth="1.5"/>{[0,45,90,135,180,225,270,315].map((deg,i)=>{const r=deg*Math.PI/180;return <line key={i} x1="16" y1="16" x2={16+Math.cos(r)*13} y2={16+Math.sin(r)*13} stroke={D} strokeWidth="1" opacity="0.3"/>;})}<circle cx="16" cy="16" r="4" fill={M}/></>);
}
function MesaQuesos() {
  return (<><ellipse cx="16" cy="16" rx="13" ry="9" fill={L} stroke={D} strokeWidth="1.5"/>{[[10,13],[16,11],[22,13],[12,20],[20,20]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="3" fill={M} opacity="0.7"/>)}</>);
}
function BarraMovil() {
  return (<><rect x="4" y="8" width="24" height="14" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><line x1="4" y1="14" x2="28" y2="14" stroke="white" strokeWidth="1" opacity="0.4"/><circle cx="8" cy="24" r="2.5" fill={D} opacity="0.5"/><circle cx="24" cy="24" r="2.5" fill={D} opacity="0.5"/><circle cx="8" cy="6" r="2.5" fill={D} opacity="0.5"/><circle cx="24" cy="6" r="2.5" fill={D} opacity="0.5"/></>);
}

// ── Muebles extra ─────────────────────────────────────────────────────────────
function Sillon() {
  return (<><rect x="8" y="5" width="16" height="10" rx="3" fill={L} stroke={D} strokeWidth="1.5"/><rect x="6" y="15" width="20" height="13" rx="3" fill={M} stroke={D} strokeWidth="1.5"/><rect x="3" y="15" width="5" height="10" rx="2" fill={D} opacity="0.45"/><rect x="24" y="15" width="5" height="10" rx="2" fill={D} opacity="0.45"/></>);
}
function Otomana() {
  return (<><rect x="4" y="8" width="24" height="16" rx="8" fill={M} stroke={D} strokeWidth="1.5"/><rect x="8" y="12" width="16" height="8" rx="4" fill={L} stroke={D} strokeWidth="1" opacity="0.6"/></>);
}
function MesaOval() {
  return (<><ellipse cx="16" cy="16" rx="13" ry="8" fill={L} stroke={D} strokeWidth="1.5"/><ellipse cx="16" cy="16" rx="8" ry="4" fill={M} stroke={D} strokeWidth="1" opacity="0.55"/></>);
}
function MesaCock() {
  return (<><circle cx="16" cy="16" r="9" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="16" r="4" fill={M}/></>);
}
function MesaNovios() {
  return (<><rect x="2" y="9" width="28" height="14" rx="2" fill={M} stroke={D} strokeWidth="2"/><path d="M12 16 Q16 11 20 16" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="9" cy="16" r="2" fill="white" opacity="0.5"/><circle cx="23" cy="16" r="2" fill="white" opacity="0.5"/></>);
}

// ── Exterior / Naturaleza extra ───────────────────────────────────────────────
function Palmera() {
  return (<>{[0,45,90,135,180,225,270,315].map((deg,i)=>{const r=deg*Math.PI/180;return <path key={i} d={`M16 16 Q${16+Math.cos(r)*8} ${16+Math.sin(r)*8} ${16+Math.cos(r)*13} ${16+Math.sin(r)*13}`} stroke={D} strokeWidth="2" fill="none" strokeLinecap="round"/>;})}<circle cx="16" cy="16" r="3" fill={M}/></>);
}
function Pino() {
  return (<><circle cx="16" cy="16" r="12" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="16" cy="16" r="7" fill={M} stroke={D} strokeWidth="1"/><circle cx="16" cy="16" r="3" fill={D} opacity="0.6"/></>);
}
function Arbusto() {
  return (<>{[[9,11],[16,8],[23,11],[11,19],[21,19],[16,22]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="5.5" fill={M} stroke={D} strokeWidth="1" opacity="0.8"/>)}</>);
}
function Lago() {
  return (<><path d="M4 16 Q5 6 16 4 Q27 6 28 16 Q27 26 16 28 Q5 26 4 16Z" fill="rgba(74,144,226,0.2)" stroke="rgba(74,144,226,0.7)" strokeWidth="1.5"/><path d="M8 16 Q9 10 16 8 Q23 10 24 16 Q23 22 16 24 Q9 22 8 16Z" fill="rgba(74,144,226,0.12)" stroke="rgba(74,144,226,0.35)" strokeWidth="1" opacity="0.6"/></>);
}
function Parrilla() {
  return (<><rect x="5" y="8" width="22" height="14" rx="3" fill={M} stroke={D} strokeWidth="1.5"/><line x1="5" y1="12" x2="27" y2="12" stroke={D} strokeWidth="1" opacity="0.45"/><line x1="5" y1="16" x2="27" y2="16" stroke={D} strokeWidth="1" opacity="0.45"/><line x1="5" y1="20" x2="27" y2="20" stroke={D} strokeWidth="1" opacity="0.45"/><circle cx="16" cy="25" r="3" fill={D} opacity="0.3"/></>);
}
function MacetaGrande() {
  return (<><rect x="5" y="12" width="22" height="16" rx="3" fill={L} stroke={D} strokeWidth="1.5"/><circle cx="12" cy="10" r="5" fill={M} stroke={D} strokeWidth="1"/><circle cx="20" cy="10" r="5" fill={M} stroke={D} strokeWidth="1"/><circle cx="16" cy="6" r="4" fill={M} stroke={D} strokeWidth="1"/></>);
}

// ── Evento / Especiales ───────────────────────────────────────────────────────
function ArcoGlobos() {
  const pts: [number,number][] = [[8,28],[6,21],[7,14],[11,9],[16,7],[21,9],[25,14],[26,21],[24,28]];
  return (<>{pts.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="4" fill={M} stroke={D} strokeWidth="1" opacity="0.85"/>)}</>);
}
function UrnaRegalos() {
  return (<><rect x="6" y="13" width="20" height="15" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><line x1="16" y1="13" x2="16" y2="28" stroke="white" strokeWidth="1.5" opacity="0.5"/><path d="M12 10 Q16 5 16 10" stroke={D} strokeWidth="1.5" fill="none"/><path d="M20 10 Q16 5 16 10" stroke={D} strokeWidth="1.5" fill="none"/><line x1="6" y1="13" x2="26" y2="13" stroke={D} strokeWidth="1.5"/></>);
}
function SeatingChart() {
  return (<><rect x="6" y="3" width="20" height="20" rx="2" fill={L} stroke={D} strokeWidth="1.5"/><line x1="10" y1="8" x2="22" y2="8" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="10" y1="12" x2="22" y2="12" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="10" y1="16" x2="18" y2="16" stroke={D} strokeWidth="1" opacity="0.5"/><line x1="16" y1="23" x2="16" y2="28" stroke={D} strokeWidth="2"/><line x1="12" y1="28" x2="20" y2="28" stroke={D} strokeWidth="2" strokeLinecap="round"/></>);
}
function ZonaKids() {
  return (<><rect x="3" y="3" width="26" height="26" rx="4" fill={L} stroke={D} strokeWidth="1.5" strokeDasharray="4 2"/><circle cx="12" cy="13" r="4" fill={M} opacity="0.5"/><circle cx="20" cy="13" r="4" fill={M} opacity="0.5"/><path d="M10 21 Q16 26 22 21" stroke={D} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>);
}
function AreaLounge() {
  return (<><rect x="2" y="2" width="28" height="28" rx="5" fill="rgba(230,216,200,0.3)" stroke={D} strokeWidth="1.5" strokeDasharray="5 3"/><rect x="5" y="18" width="22" height="8" rx="3" fill={M} opacity="0.6"/><rect x="5" y="10" width="22" height="6" rx="2" fill={L} opacity="0.7"/></>);
}
function Biombo() {
  return (<><path d="M4 6 L4 26 L12 18 L12 26 L20 18 L20 26 L28 18 L28 26" stroke={D} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/></>);
}
function EspejoGrande() {
  return (<><ellipse cx="16" cy="16" rx="10" ry="13" fill={L} stroke={D} strokeWidth="2"/><ellipse cx="16" cy="16" rx="7" ry="10" fill="rgba(200,220,240,0.3)" stroke={D} strokeWidth="1" opacity="0.6"/><line x1="16" y1="5" x2="16" y2="8" stroke={D} strokeWidth="1.5" opacity="0.5"/></>);
}
function CabinaFoto() {
  return (<><rect x="5" y="3" width="22" height="26" rx="2" fill={L} stroke={D} strokeWidth="2"/><rect x="9" y="7" width="14" height="12" rx="1" fill={M} stroke={D} strokeWidth="1"/><path d="M5 20 Q11 24 16 20 Q21 16 27 20 L27 29 L5 29Z" fill={M} opacity="0.4"/></>);
}
function Proyector() {
  return (<><rect x="5" y="9" width="18" height="14" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><circle cx="25" cy="16" r="4" fill={L} stroke={D} strokeWidth="1.5"/><path d="M23 14 L29 11 M23 18 L29 21" stroke={D} strokeWidth="1" opacity="0.4"/></>);
}
function Tarima() {
  return (<><rect x="3" y="7" width="26" height="18" rx="2" fill={M} stroke={D} strokeWidth="2"/><rect x="6" y="10" width="20" height="12" rx="1" fill={L} stroke={D} strokeWidth="1"/><line x1="3" y1="24" x2="29" y2="24" stroke={D} strokeWidth="2" opacity="0.5"/></>);
}
function Generador() {
  return (<><rect x="4" y="8" width="24" height="16" rx="2" fill={M} stroke={D} strokeWidth="2"/><line x1="4" y1="13" x2="28" y2="13" stroke={D} strokeWidth="1" opacity="0.4"/><line x1="4" y1="19" x2="28" y2="19" stroke={D} strokeWidth="1" opacity="0.4"/><circle cx="24" cy="16" r="3" fill={L} stroke={D} strokeWidth="1"/><rect x="7" y="15" width="4" height="2" rx="1" fill={D} opacity="0.4"/></>);
}
function Inflable() {
  return (<><ellipse cx="16" cy="16" rx="13" ry="11" fill={L} stroke={D} strokeWidth="1.5"/><ellipse cx="9" cy="14" rx="4" ry="5" fill={M} stroke={D} strokeWidth="1" opacity="0.6"/><ellipse cx="16" cy="11" rx="4" ry="5" fill={M} stroke={D} strokeWidth="1" opacity="0.6"/><ellipse cx="23" cy="14" rx="4" ry="5" fill={M} stroke={D} strokeWidth="1" opacity="0.6"/><ellipse cx="16" cy="20" rx="6" ry="4" fill={M} stroke={D} strokeWidth="1" opacity="0.5"/></>);
}
function Fogon() {
  return (<><rect x="3" y="7" width="26" height="16" rx="2" fill={M} stroke={D} strokeWidth="1.5"/><circle cx="11" cy="15" r="5" fill={D} opacity="0.25" stroke={D} strokeWidth="1"/><circle cx="21" cy="15" r="5" fill={D} opacity="0.25" stroke={D} strokeWidth="1"/><circle cx="16" cy="20" r="3.5" fill={D} opacity="0.2" stroke={D} strokeWidth="1"/><line x1="3" y1="23" x2="29" y2="23" stroke={D} strokeWidth="1.5" opacity="0.4"/></>);
}

// ─────────────────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.FC> = {
  // Asientos
  chair: Chair, bench: Bench, silla_terraza: SillaTerraza,
  tumbona: Tumbona, cama_balinesa: CamaBalinesa, hamaca: Hamaca,
  pouf: Pouf, taburete: Taburete,
  // Estructuras
  toldo: Toldo, carpa: Carpa, carpa_hex: CarpaHex,
  pergola: Pergola, tipi: Tipi, glorieta: Glorieta, parasol: Parasol,
  // Servicio
  bar: Bar, candybar: CandyBar, gifttable: GiftTable, coatcheck: CoatCheck,
  bathroom: Bathroom, entrance: Entrance, mostrador: Mostrador,
  carrito: Carrito, nevera: Nevera,
  // Piscina / Terraza
  mesa_baja: MesaBaja, piscina: Piscina,
  // Decoración
  arch: Arch, runner: Runner, flowers: Flowers, tree: Tree,
  sofa: Sofa, candelabra: Candelabra, carpet: Carpet,
  fuente: Fuente, brasero: Brasero, jardinera: Jardinera,
  columna: Columna, seto: Seto, farola: Farola,
  // Pista y Música
  dancefloor: DanceFloor, stage: Stage, djbooth: DjBooth,
  photocall: Photocall, piano: Piano,
  // Técnica
  speaker: Speaker, screen: Screen, outlet: Outlet,
  // Ceremonial
  kuppah: Kuppah, atril: Atril, mesa_firma: MesaFirma,
  altar_ceremonia: AltarCeremonia, velas_altar: VelasAltar,
  // Buffet / Servicio extra
  mesa_buffet: MesaBuffet, fuente_chocolate: FuenteChocolate,
  mesa_vienesa: MesaVienesa, mesa_quesos: MesaQuesos, barra_movil: BarraMovil,
  // Muebles extra
  sillon: Sillon, otomana: Otomana, mesa_oval: MesaOval,
  mesa_cock: MesaCock, mesa_novios: MesaNovios,
  // Exterior
  palmera: Palmera, pino: Pino, arbusto: Arbusto,
  lago: Lago, parrilla: Parrilla, maceta_grande: MacetaGrande,
  // Evento / Especiales
  arco_globos: ArcoGlobos, urna_regalos: UrnaRegalos,
  seating_chart: SeatingChart, zona_kids: ZonaKids,
  area_lounge: AreaLounge, biombo: Biombo,
  espejo_grande: EspejoGrande, cabina_foto: CabinaFoto,
  proyector: Proyector, tarima: Tarima,
  generador: Generador, inflable: Inflable, fogon: Fogon,
};

export function hasDecoIcon(objectType?: string): boolean {
  return !!objectType && objectType in ICON_MAP;
}

/** SVG shapes in 32×32 space — embed inside a scaled <g>. */
export function DecoIconContent({ objectType }: { objectType: string }) {
  const Icon = ICON_MAP[objectType];
  return Icon ? <Icon /> : null;
}

/** Standalone SVG preview — use in panels and modals. */
export function DecoIconPreview({ objectType, size = 28 }: { objectType: string; size?: number }) {
  const Icon = ICON_MAP[objectType];
  if (!Icon) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: "block" }}>
      <Icon />
    </svg>
  );
}
