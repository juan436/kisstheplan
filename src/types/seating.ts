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
  assignments: SeatAssignment[];
}

export interface SeatingPlan {
  id: string;
  name: string;
  tables: TableSeat[];
  backgroundImageUrl?: string;
  scaleFactor?: number;
}
