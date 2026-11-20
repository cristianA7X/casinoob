import {
  evaluarTirada,
  generarGrilla,
  generarGrillaTirada,
  generarLineasPago,
  obtenerSimboloAleatorio,
} from "@/core/actions/slot-engine.actions";
import {
  JuegoSlot,
  LineaPago,
  Simbolo,
} from "@/infrastructure/interfaces";
import { useCasino } from "@/presentation/hooks/CasinoContext";
import { useSonidos } from "@/presentation/hooks/useSonidos";
import { useEffect, useMemo, useRef, useState } from "react";

const APUESTA_MIN = 5;
const APUESTA_MAX = 50;
const PASO_APUESTA = 5;

export const useSlotMachine = (juego: JuegoSlot) => {
  const { saldo, descontarSaldo, sumarSaldo, registrarTirada } = useCasino();
  const sonidos = useSonidos();

  const todasLasLineas = useMemo(
    () => generarLineasPago(juego.reels, juego.rows),
    [juego.reels, juego.rows],
  );

  const [grilla, setGrilla] = useState<Simbolo[][]>(() =>
    generarGrilla(juego.symbols, juego.reels, juego.rows),
  );
  const [apuesta, setApuesta] = useState<number>(APUESTA_MIN);
  const [girando, setGirando] = useState<boolean>(false);
  const [lineasGanadoras, setLineasGanadoras] = useState<LineaPago[]>([]);
  const [mensaje, setMensaje] = useState<string>(
    "Tocá GIRAR para probar suerte",
  );
  const [girosGratis, setGirosGratis] = useState<number>(0);

  const intervalosRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      intervalosRef.current.forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
      sonidos.stopSpin();
    };
  }, []);

  const cambiarApuesta = (delta: number) => {
    if (girando) return;
    const nueva = apuesta + delta * PASO_APUESTA;
    if (nueva >= APUESTA_MIN && nueva <= APUESTA_MAX) {
      setApuesta(nueva);
      sonidos.playCoin();
    }
  };

  const girar = () => {
    if (girando) return;

    const esGiroGratis = girosGratis > 0;

    if (esGiroGratis) {
      setGirosGratis((prev) => prev - 1);
      setMensaje(`Giro gratis en curso (${girosGratis - 1} restantes)`);
    } else {
      if (!descontarSaldo(apuesta)) {
        setMensaje("No tenés saldo suficiente. Reclamá el bono en el Lobby.");
        return;
      }
      sonidos.playCoin();
      setMensaje("Girando rodillos...");
    }

    setGirando(true);
    setLineasGanadoras([]);
    sonidos.playSpin();

    const grillaFinal = generarGrillaTirada(
      juego.symbols,
      juego.reels,
      juego.rows,
      todasLasLineas,
    );

    intervalosRef.current = [];
    timeoutsRef.current = [];

    for (let reel = 0; reel < juego.reels; reel++) {
      const intervalo = setInterval(() => {
        setGrilla((prev) =>
          prev.map((fila) => {
            const nuevaFila = [...fila];
            nuevaFila[reel] = obtenerSimboloAleatorio(juego.symbols);
            return nuevaFila;
          }),
        );
      }, 75);

      intervalosRef.current.push(intervalo);

      const tiempoFrenado = 700 + reel * 280;
      const timeout = setTimeout(() => {
        clearInterval(intervalo);

        setGrilla((prev) =>
          prev.map((fila, rowIndex) => {
            const nuevaFila = [...fila];
            nuevaFila[reel] = grillaFinal[rowIndex][reel];
            return nuevaFila;
          }),
        );

        sonidos.playReelStop();

        if (reel === juego.reels - 1) {
          sonidos.stopSpin();
          const resultado = evaluarTirada(
            grillaFinal,
            todasLasLineas,
            juego.symbols,
            apuesta,
            esGiroGratis,
          );

          setLineasGanadoras(resultado.lineasGanadoras);
          setGirando(false);

          if (resultado.premioTotal > 0) {
            sumarSaldo(resultado.premioTotal);
            if (resultado.girosGratisGanados > 0) {
              sonidos.playBonus();
            } else if (resultado.premioTotal >= apuesta * 5) {
              sonidos.playWinBig();
            } else {
              sonidos.playWinSmall();
            }
          }

          if (resultado.girosGratisGanados > 0) {
            setGirosGratis((prev) => prev + resultado.girosGratisGanados);
            setMensaje(
              `¡BONUS! +${resultado.girosGratisGanados} giros gratis y $${resultado.premioTotal.toFixed(2)}`,
            );
          } else if (resultado.premioTotal > 0) {
            setMensaje(`¡Ganaste $${resultado.premioTotal.toFixed(2)}!`);
          } else {
            setMensaje("Sin premio esta vez. ¡Seguí probando!");
          }

          registrarTirada({
            juegoId: juego.id,
            juegoNombre: juego.nombre,
            apuestaTotal: esGiroGratis ? 0 : apuesta,
            premio: resultado.premioTotal,
            fueGiroGratis: esGiroGratis,
          });
        }
      }, tiempoFrenado);

      timeoutsRef.current.push(timeout);
    }
  };

  return {
    saldo,
    grilla,
    apuesta,
    girando,
    lineasGanadoras,
    mensaje,
    girosGratis,
    cambiarApuesta,
    girar,
  };
};
