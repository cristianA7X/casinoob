import { Simbolo } from "./simbolo.interface";

export interface JuegoSlot {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  colorAcento: string;
  reels: number;
  rows: number;
  symbols: Simbolo[];
}
