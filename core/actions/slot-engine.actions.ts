import {
  LineaPago,
  ResultadoTirada,
  Simbolo,
} from "@/infrastructure/interfaces";

// Probabilidad de ganar por tirada (0.25 = 25%). Modificable solo por código.
export const WIN_RATE = 0.25;

const COLORES_LINEAS = [
  "#ff4757",
  "#3742fa",
  "#2ed573",
  "#ffa502",
  "#ff6b81",
  "#5352ed",
  "#7bed9f",
  "#ff9ff3",
  "#70a1ff",
];

const MULTIPLICADOR_GIRO_GRATIS = 1.25;
const SCATTERS_PARA_BONUS = 3;
const GIROS_GRATIS_BASE = 10;

export const generarLineasPago = (reels: number, rows: number): LineaPago[] => {
  const lines: LineaPago[] = [];

  for (let row = 0; row < rows; row++) {
    const positions = Array.from({ length: reels }, (_, reel) => ({
      reel,
      row,
    }));
    lines.push({
      id: `horizontal_${row}`,
      name: `Línea ${row + 1}`,
      positions,
      color: COLORES_LINEAS[lines.length % COLORES_LINEAS.length],
    });
  }

  if (rows >= 3 && reels >= 3) {
    lines.push(
      {
        id: "diagonal_tlbr",
        name: "Diagonal ↘",
        positions: Array.from({ length: Math.min(reels, rows) }, (_, i) => ({
          reel: i,
          row: i,
        })),
        color: COLORES_LINEAS[lines.length % COLORES_LINEAS.length],
      },
      {
        id: "diagonal_trbl",
        name: "Diagonal ↙",
        positions: Array.from({ length: Math.min(reels, rows) }, (_, i) => ({
          reel: i,
          row: rows - 1 - i,
        })),
        color: COLORES_LINEAS[lines.length % COLORES_LINEAS.length],
      },
    );
  }

  if (rows >= 3 && reels >= 5) {
    lines.push(
      {
        id: "v_shape",
        name: "Línea V",
        positions: [
          { reel: 0, row: 0 },
          { reel: 1, row: 1 },
          { reel: 2, row: 2 },
          { reel: 3, row: 1 },
          { reel: 4, row: 0 },
        ],
        color: COLORES_LINEAS[lines.length % COLORES_LINEAS.length],
      },
      {
        id: "inv_v_shape",
        name: "Línea V Inv.",
        positions: [
          { reel: 0, row: 2 },
          { reel: 1, row: 1 },
          { reel: 2, row: 0 },
          { reel: 3, row: 1 },
          { reel: 4, row: 2 },
        ],
        color: COLORES_LINEAS[lines.length % COLORES_LINEAS.length],
      },
    );
  }

  return lines;
};

export const obtenerSimboloAleatorio = (symbols: Simbolo[]): Simbolo => {
  const totalProb = symbols.reduce((acc, s) => acc + s.probability, 0);
  const rand = Math.random() * totalProb;

  let acumulado = 0;
  for (const simbolo of symbols) {
    acumulado += simbolo.probability;
    if (rand <= acumulado) {
      return { ...simbolo };
    }
  }

  return { ...symbols[0] };
};

export const generarGrilla = (
  symbols: Simbolo[],
  reels: number,
  rows: number,
): Simbolo[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: reels }, () => obtenerSimboloAleatorio(symbols)),
  );
};

// Genera la grilla final respetando el WIN_RATE configurado por código
export const generarGrillaTirada = (
  symbols: Simbolo[],
  reels: number,
  rows: number,
  lineas: LineaPago[],
): Simbolo[][] => {
  const debeGanar = Math.random() < WIN_RATE;

  if (debeGanar && lineas.length > 0) {
    const grilla = generarGrilla(symbols, reels, rows);
    const lineaElegida = lineas[Math.floor(Math.random() * lineas.length)];
    const comunes = symbols.filter((s) => !s.isWild && !s.isScatter);
    const simboloGanador = obtenerSimboloAleatorio(comunes);
    const cantidad = Math.min(
      lineaElegida.positions.length,
      Math.random() < 0.7 ? 3 : Math.random() < 0.85 ? 4 : 5,
    );

    for (let i = 0; i < cantidad; i++) {
      const { row, reel } = lineaElegida.positions[i];
      grilla[row][reel] = { ...simboloGanador };
    }
    return grilla;
  }

  // Si no toca ganar, generamos una grilla sin combinaciones ganadoras
  for (let intento = 0; intento < 20; intento++) {
    const grilla = generarGrilla(symbols, reels, rows);
    const evalTest = evaluarTirada(grilla, lineas, symbols, 1, false);
    if (evalTest.premioTotal === 0 && evalTest.girosGratisGanados === 0) {
      return grilla;
    }
  }

  return generarGrilla(symbols, reels, rows);
};

const buscarMejorCoincidencia = (
  simbolosLinea: Simbolo[],
  todosLosSimbolos: Simbolo[],
) => {
  const primero = simbolosLinea[0];
  if (!primero || primero.isScatter) {
    return { count: 0, symbol: null as Simbolo | null, wildsUsed: 0 };
  }

  let objetivo: Simbolo | undefined = primero;

  if (primero.isWild) {
    objetivo =
      simbolosLinea.find((s) => !s.isWild && !s.isScatter) ??
      [...todosLosSimbolos]
        .filter((s) => !s.isWild && !s.isScatter && s.value > 0)
        .sort((a, b) => b.value - a.value)[0];
  }

  if (!objetivo) {
    return { count: 0, symbol: null as Simbolo | null, wildsUsed: 0 };
  }

  let count = 0;
  let wildsUsed = 0;

  for (const actual of simbolosLinea) {
    if (actual.id === objetivo.id) {
      count++;
    } else if (actual.isWild) {
      count++;
      wildsUsed++;
    } else {
      break;
    }
  }

  return { count, symbol: objetivo, wildsUsed };
};

export const evaluarTirada = (
  grid: Simbolo[][],
  lineasActivas: LineaPago[],
  todosLosSimbolos: Simbolo[],
  apuesta: number,
  esGiroGratis: boolean,
  minWinLength = 3,
): ResultadoTirada => {
  let premioTotal = 0;
  let premioScatter = 0;
  let wildsUsados = 0;
  let girosGratisGanados = 0;
  const lineasGanadoras: LineaPago[] = [];

  let scattersEncontrados = 0;
  for (const fila of grid) {
    for (const celda of fila) {
      if (celda?.isScatter) scattersEncontrados++;
    }
  }

  if (scattersEncontrados >= 2) {
    premioScatter = scattersEncontrados * apuesta;
    if (esGiroGratis) {
      premioScatter =
        Math.round(premioScatter * MULTIPLICADOR_GIRO_GRATIS * 100) / 100;
    }
    premioTotal += premioScatter;
  }

  if (scattersEncontrados >= SCATTERS_PARA_BONUS) {
    const extra = scattersEncontrados - SCATTERS_PARA_BONUS;
    girosGratisGanados = GIROS_GRATIS_BASE + extra * 5;
  }

  for (const linea of lineasActivas) {
    const simbolosLinea = linea.positions.map((pos) => grid[pos.row][pos.reel]);
    const match = buscarMejorCoincidencia(simbolosLinea, todosLosSimbolos);

    if (match.symbol && match.symbol.value > 0 && match.count >= minWinLength) {
      let multiplicador = 1;
      if (match.count === 4) multiplicador = 3;
      else if (match.count >= 5) multiplicador = 5;

      if (match.wildsUsed > 0) multiplicador *= 1.5;

      let pago = (match.symbol.value / 5) * multiplicador * apuesta;
      if (esGiroGratis) pago *= MULTIPLICADOR_GIRO_GRATIS;

      pago = Math.max(1, Math.round(pago * 100) / 100);

      premioTotal += pago;
      wildsUsados += match.wildsUsed;
      lineasGanadoras.push(linea);
    }
  }

  return {
    premioTotal: Math.round(premioTotal * 100) / 100,
    premioScatter: Math.round(premioScatter * 100) / 100,
    lineasGanadoras,
    wildsUsados,
    scattersEncontrados,
    girosGratisGanados,
  };
};
