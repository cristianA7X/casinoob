import { RegistroHistorial } from "@/infrastructure/interfaces";
import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

const COOLDOWN_BONO_MS = 12 * 60 * 60 * 1000;

interface CasinoContextProps {
  saldo: number;
  historial: RegistroHistorial[];
  sonidoActivo: boolean;
  descontarSaldo: (monto: number) => boolean;
  sumarSaldo: (monto: number) => void;
  registrarTirada: (registro: Omit<RegistroHistorial, "id" | "fecha">) => void;
  toggleSonido: () => void;
  reiniciarHistorial: () => void;
  reclamarBono: () => void;
}

const SALDO_INICIAL = 100;
const MONTO_BONO = 50;

const CasinoContext = createContext<CasinoContextProps | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const CasinoProvider = ({ children }: Props) => {
  const [saldo, setSaldo] = useState<number>(SALDO_INICIAL);
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const [sonidoActivo, setSonidoActivo] = useState<boolean>(true);
  const [ultimoBono, setUltimoBono] = useState<number>(0);

  const redondear = (valor: number) => Math.round(valor * 100) / 100;

  const descontarSaldo = (monto: number): boolean => {
    if (saldo < monto) return false;
    setSaldo((prev) => redondear(prev - monto));
    return true;
  };

  const sumarSaldo = (monto: number) => {
    if (monto <= 0) return;
    setSaldo((prev) => redondear(prev + monto));
  };

  const registrarTirada = (
    registro: Omit<RegistroHistorial, "id" | "fecha">,
  ) => {
    const nuevo: RegistroHistorial = {
      ...registro,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fecha: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    // Guardamos las últimas 50 tiradas para no sobrecargar la lista
    setHistorial((prev) => [nuevo, ...prev].slice(0, 50));
  };

  const toggleSonido = () => setSonidoActivo((prev) => !prev);

  const reiniciarHistorial = () => {
    setHistorial([]);
  };

  const reclamarBono = () => {
    const ahora = Date.now();
    const tiempoRestante = COOLDOWN_BONO_MS - (ahora - ultimoBono);

    if (tiempoRestante > 0) {
      const horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
      const minutos = Math.ceil((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
      Alert.alert(
        "Bono no disponible",
        `Podés reclamar otro bono en ${horas}h ${minutos}m.`,
      );
      return;
    }

    setSaldo((prev) => redondear(prev + MONTO_BONO));
    setUltimoBono(ahora);
  };

  return (
    <CasinoContext.Provider
      value={{
        saldo,
        historial,
        sonidoActivo,
        descontarSaldo,
        sumarSaldo,
        registrarTirada,
        toggleSonido,
        reiniciarHistorial,
        reclamarBono,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = () => {
  const context = useContext(CasinoContext);
  if (!context) {
    throw new Error("useCasino debe usarse dentro de un CasinoProvider");
  }
  return context;
};
