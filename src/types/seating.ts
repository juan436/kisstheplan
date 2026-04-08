export interface SeatAssignment {
  seatNumber: number;
  guestId?: string;
}

export interface TableSeat {
  id: string;
  name: string;
  shape: "round" | "rectangular";
  capacity: number;
  posX: number;
  posY: number;
  physicalDiameter?: number; // metros (mesas redondas)
  physicalWidth?: number;    // metros (mesas rectangulares)
  physicalHeight?: number;   // metros (mesas rectangulares)
  assignments: SeatAssignment[];
}

export type DecorationType = "tree" | "bar" | "speaker" | "photobooth" | "dancefloor" | "text";

export interface DecorationObject {
  id: string;
  type: DecorationType;
  posX: number;
  posY: number;
  label?: string;
}

export interface SeatingPlan {
  id: string;
  name: string;
  tables: TableSeat[];
  backgroundImageUrl?: string;
  scaleFactor?: number;
  calibrationScale?: number; // px por metro
}
