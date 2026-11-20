import { useCasino } from "@/presentation/hooks/CasinoContext";
import { colores } from "@/presentation/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";

const HistorialScreen = () => {
  const { historial } = useCasino();

  const mayorPremio = historial.reduce(
    (max, item) => (item.premio > max ? item.premio : max),
    0
  );

  const totalGanado = historial.reduce((acc, item) => acc + item.premio, 0);

  if (historial.length === 0) {
    return (
      <View className="flex-1 bg-fondo justify-center items-center px-8">
        <Ionicons name="receipt-outline" size={56} color={colores.tenue} />
        <Text className="text-texto text-xl font-bold text-center mt-4">
          Todavía no hay tiradas
        </Text>
        <Text className="text-tenue text-base text-center mt-2">
          Entrá a cualquiera de las máquinas desde el Lobby y probá tu suerte.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-fondo px-4 pt-5">
      {/* Resumen superior */}
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1 bg-superficie border border-borde rounded-2xl p-3.5 items-center">
          <Text className="text-tenue text-xs">Tiradas</Text>
          <Text className="text-texto text-xl font-bold mt-1">
            {historial.length}
          </Text>
        </View>

        <View className="flex-1 bg-superficie border border-borde rounded-2xl p-3.5 items-center">
          <Text className="text-tenue text-xs">Mayor premio</Text>
          <Text className="text-dorado text-xl font-bold mt-1">
            ${mayorPremio.toFixed(2)}
          </Text>
        </View>

        <View className="flex-1 bg-superficie border border-borde rounded-2xl p-3.5 items-center">
          <Text className="text-tenue text-xs">Total ganado</Text>
          <Text className="text-exito text-xl font-bold mt-1">
            ${totalGanado.toFixed(2)}
          </Text>
        </View>
      </View>

      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const gano = item.premio > 0;
          return (
            <View className="bg-superficie border border-borde rounded-xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-texto font-bold text-base">
                  {item.juegoNombre}
                </Text>
                <Text className="text-tenue text-xs mt-1">
                  {item.fecha} ·{" "}
                  {item.fueGiroGratis
                    ? "Giro gratis"
                    : `Apuesta: $${item.apuestaTotal.toFixed(2)}`}
                </Text>
              </View>

              <Text
                className={`text-base font-bold ${
                  gano ? "text-exito" : "text-error"
                }`}
              >
                {gano
                  ? `+$${item.premio.toFixed(2)}`
                  : `-$${item.apuestaTotal.toFixed(2)}`}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default HistorialScreen;
