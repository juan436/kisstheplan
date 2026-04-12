export interface SeatAssignment {
  seatNumber: number;
  guestId?: string;
}

export interface TableSeat {
  id: string;
  name: string;
  shape: "round" | "rectangular" | "serpentine";
  capacity: number;
  posX: number;
  posY: number;
  physicalDiameter?: number; // metros (mesas redondas)
  physicalWidth?: number;    // metros (mesas rectangulares)
  physicalHeight?: number;   // metros (mesas rectangulares)
  rotation?: number;         // grados (0 | 90 | 180 | 270)
  assignments: SeatAssignment[];
}

export interface EmojiObject {
  id: string;
  emoji?: string;       // emoji character (objetos libres del usuario)
  objectType?: string;  // clave SVG de la librería
  label: string;
  physicalWidth: number;
  physicalHeight: number;
}

export type DecorationType = "tree" | "bar" | "speaker" | "photobooth" | "dancefloor" | "text" | "custom_emoji";

export interface DecorationObject {
  id: string;
  type: DecorationType;
  posX: number;
  posY: number;
  label?: string;
  physicalWidth?: number;  // metros
  physicalHeight?: number; // metros
  customEmoji?: string;    // solo cuando type === "custom_emoji" y es objeto del usuario
  objectType?: string;     // clave del icono SVG de la librería (chair, bench, bar, etc.)
  guestId?: string;        // asignación de invitado (solo para sillas funcionales)
}

export interface CalibZone {
  id: string;
  points: { x: number; y: number }[]; // exactly 4 world-space points
  physicalWidth: number;  // meters (width of the mapped area)
  physicalHeight: number; // meters (height of the mapped area)
  localScale: number;     // px per meter, computed from points + physical dims
}

export interface SeatingPlan {
  id: string;
  name: string;
  tables: TableSeat[];
  backgroundImageUrl?: string;
  scaleFactor?: number; // px por metro (legacy global calibration)
  decorations?: DecorationObject[];
  zones?: CalibZone[];           // multipunto scale zones (V2)
  customEmojis?: EmojiObject[];  // biblioteca de emojis personalizados
}
