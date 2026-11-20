import { JUEGOS_SLOTS } from "@/core/data/slots.data";
import { useCasino } from "@/presentation/hooks/CasinoContext";
import { colores } from "@/presentation/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const LobbyScreen = () => {
  const { saldo, reclamarBono } = useCasino();

  return (
    <ScrollView
      className="flex-1 bg-fondo px-4 pt-5"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Tarjeta de saldo */}
      <View className="bg-superficie border border-borde rounded-2xl p-5 mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-tenue text-sm font-medium">Saldo disponible</Text>
          <Text className="text-dorado text-3xl font-bold mt-1">
            ${saldo.toFixed(2)}
          </Text>
        </View>

        <Pressable
          onPress={reclamarBono}
          className="bg-dorado px-4 py-3 rounded-xl active:opacity-80 flex-row items-center gap-2"
        >
          <Ionicons name="gift-outline" size={18} color={colores.fondo} />
          <Text className="text-fondo font-bold text-sm">Bono +$50</Text>
        </Pressable>
      </View>

      {/* Título de sección */}
      <Text className="text-texto text-xl font-bold mb-1">Elegí tu máquina</Text>
      <Text className="text-tenue text-sm mb-4">
        Tocá cualquiera de los 4 slots para empezar a girar.
      </Text>

      {/* Lista de los 4 juegos */}
      <View className="gap-4">
        {JUEGOS_SLOTS.map((juego) => (
          <Pressable
            key={juego.id}
            onPress={() => router.push(`/slot/${juego.id}`)}
            className="bg-superficie border border-borde rounded-2xl p-4 flex-row items-center active:opacity-85"
          >
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: `${juego.colorAcento}25` }}
            >
              <Text className="text-4xl">{juego.icono}</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-texto text-lg font-bold">
                  {juego.nombre}
                </Text>
                <View className="bg-fondo px-2.5 py-1 rounded-full border border-borde">
                  <Text className="text-dorado text-xs font-semibold">
                    {juego.reels}x{juego.rows}
                  </Text>
                </View>
              </View>

              <Text className="text-tenue text-sm mt-1">
                {juego.descripcion}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={colores.tenue}
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default LobbyScreen;
