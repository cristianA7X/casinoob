import { obtenerJuegoPorId } from "@/core/data/slots.data";
import { useSlotMachine } from "@/presentation/hooks/useSlotMachine";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const SlotScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const juego = useMemo(() => obtenerJuegoPorId(id ?? "classic"), [id]);

  const {
    saldo,
    grilla,
    apuesta,
    girando,
    lineasGanadoras,
    mensaje,
    girosGratis,
    cambiarApuesta,
    girar,
  } = useSlotMachine(juego);

  const celdasGanadoras = useMemo(() => {
    const set = new Set<string>();
    lineasGanadoras.forEach((linea) => {
      linea.positions.forEach((pos) => {
        set.add(`${pos.row}-${pos.reel}`);
      });
    });
    return set;
  }, [lineasGanadoras]);

  const esCompacta = juego.reels >= 5;

  return (
    <>
      <Stack.Screen options={{ title: `${juego.icono} ${juego.nombre}` }} />

      <ScrollView
        className="flex-1 bg-fondo px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Saldo y giros gratis */}
        <View className="flex-row items-center justify-between bg-superficie border border-borde rounded-2xl px-4 py-3 mb-4">
          <View>
            <Text className="text-tenue text-xs">Saldo</Text>
            <Text className="text-dorado text-2xl font-bold">
              ${saldo.toFixed(2)}
            </Text>
          </View>

          {girosGratis > 0 && (
            <View className="bg-exito/20 border border-exito px-3 py-1.5 rounded-xl">
              <Text className="text-exito font-bold text-sm">
                Giros Gratis: {girosGratis}
              </Text>
            </View>
          )}
        </View>

        {/* Mensaje de estado */}
        <View className="bg-superficie/80 border border-borde rounded-xl px-4 py-3 mb-4">
          <Text className="text-texto text-center font-semibold text-sm">
            {mensaje}
          </Text>
        </View>

        {/* Grilla de rodillos */}
        <View
          className="bg-superficie rounded-2xl p-3 border-2 mb-5"
          style={{ borderColor: juego.colorAcento }}
        >
          <View className="gap-2">
            {grilla.map((fila, rowIndex) => (
              <View key={`row-${rowIndex}`} className="flex-row gap-2">
                {fila.map((simbolo, reelIndex) => {
                  const esGanadora = celdasGanadoras.has(
                    `${rowIndex}-${reelIndex}`,
                  );

                  return (
                    <View
                      key={`cell-${rowIndex}-${reelIndex}`}
                      className="flex-1 aspect-square rounded-xl items-center justify-center border-2"
                      style={{
                        backgroundColor: esGanadora
                          ? `${simbolo.color}40`
                          : "#131722",
                        borderColor: esGanadora
                          ? "#F5B82E"
                          : simbolo.isWild
                            ? "#E91E63"
                            : simbolo.isScatter
                              ? "#F5B82E"
                              : "#2A314A",
                      }}
                    >
                      <Text className={esCompacta ? "text-3xl" : "text-5xl"}>
                        {simbolo.name}
                      </Text>

                      {simbolo.isWild && (
                        <Text className="text-[9px] font-bold text-magenta mt-0.5">
                          WILD
                        </Text>
                      )}
                      {simbolo.isScatter && (
                        <Text className="text-[9px] font-bold text-dorado mt-0.5">
                          BONUS
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Apuesta simple */}
        <View className="bg-superficie border border-borde rounded-2xl p-3 mb-5 flex-row items-center justify-between px-5">
          <Text className="text-tenue text-sm font-semibold">Apuesta</Text>

          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => cambiarApuesta(-1)}
              disabled={girando}
              className="w-10 h-10 rounded-full bg-fondo border border-borde items-center justify-center active:opacity-70"
            >
              <Text className="text-texto text-xl font-bold">-</Text>
            </Pressable>

            <Text className="text-texto font-bold text-lg min-w-[50px] text-center">
              ${apuesta}
            </Text>

            <Pressable
              onPress={() => cambiarApuesta(1)}
              disabled={girando}
              className="w-10 h-10 rounded-full bg-fondo border border-borde items-center justify-center active:opacity-70"
            >
              <Text className="text-texto text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Botón principal de giro */}
        <Pressable
          onPress={girar}
          disabled={girando}
          className={`rounded-2xl py-4 items-center active:opacity-85 ${
            girando ? "bg-borde" : girosGratis > 0 ? "bg-exito" : "bg-magenta"
          }`}
        >
          <Text className="text-white text-xl font-bold tracking-wider">
            {girando
              ? "GIRANDO..."
              : girosGratis > 0
                ? `GIRO GRATIS (${girosGratis})`
                : `GIRAR · $${apuesta}`}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default SlotScreen;
