export interface PosicionGrilla {
  reel: number;
  row: number;
}

export interface LineaPago {
  id: string;
  name: string;
  positions: PosicionGrilla[];
  color: string;
}
