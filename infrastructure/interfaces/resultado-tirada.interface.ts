import { LineaPago } from "./linea-pago.interface";

export interface ResultadoTirada {
  premioTotal: number;
  premioScatter: number;
  lineasGanadoras: LineaPago[];
  wildsUsados: number;
  scattersEncontrados: number;
  girosGratisGanados: number;
}
