import { ScrollView, Text, View } from "react-native";

const ReglasScreen = () => {
  return (
    <ScrollView
      className="flex-1 bg-fondo px-5 pt-5"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text className="text-dorado text-2xl font-bold mb-2">Cómo se juega</Text>
      <Text className="text-tenue text-base mb-5">
        Elegí cualquiera de las 4 máquinas del Lobby, ajustá tu apuesta y tocá
        GIRAR.
      </Text>

      <View className="bg-superficie border border-borde rounded-2xl p-4 mb-4">
        <Text className="text-texto text-lg font-bold mb-2">
          Combinaciones ganadoras
        </Text>
        <View className="gap-1">
          <Text className="text-tenue text-sm">
            • 3 símbolos iguales de izquierda a derecha: pago base x1
          </Text>
          <Text className="text-tenue text-sm">
            • 4 símbolos iguales: pago base x3
          </Text>
          <Text className="text-tenue text-sm">
            • 5 símbolos iguales: pago base x5
          </Text>
        </View>
      </View>

      <View className="bg-superficie border border-borde rounded-2xl p-4 mb-4">
        <Text className="text-magenta text-lg font-bold mb-2">
          Símbolo WILD (Comodín)
        </Text>
        <Text className="text-tenue text-sm leading-6">
          Reemplaza a cualquier símbolo común para completar una línea ganadora
          y aplica un multiplicador extra de x1.5 sobre esa línea.
        </Text>
      </View>

      <View className="bg-superficie border border-borde rounded-2xl p-4">
        <Text className="text-dorado text-lg font-bold mb-2">
          Símbolo BONUS (Scatter)
        </Text>
        <View className="gap-1">
          <Text className="text-tenue text-sm">
            • 2 o más en cualquier lugar de la grilla pagan un premio directo.
          </Text>
          <Text className="text-tenue text-sm">
            • 3 o más activan 10 Giros Gratis (más 5 extra por cada Scatter
            adicional) con multiplicador x1.25 en todos los premios.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReglasScreen;
