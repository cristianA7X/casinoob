import { Text, View } from "react-native";

const AboutScreen = () => {
  return (
    <View className="flex-1 bg-fondo px-5 pt-6">
      <View className="bg-superficie border border-borde rounded-2xl p-5 mb-4">
        <Text className="text-dorado text-2xl font-bold">Casino Slots</Text>
        <Text className="text-tenue text-sm mt-2 leading-6">
          Aplicación móvil de máquinas tragamonedas desarrollada para la Entrega
          Práctica Nº6 de Desarrollo de Aplicativos Móviles (CRUI).
        </Text>
      </View>

      <View className="bg-superficie border border-borde rounded-2xl p-5 mb-4">
        <Text className="text-texto text-base font-bold mb-2">
          Tecnologías utilizadas
        </Text>
        <View className="gap-1">
          <Text className="text-tenue text-sm">
            • React Native con Expo y TypeScript
          </Text>
          <Text className="text-tenue text-sm">
            • Expo Router (Drawer, Tabs y Stack)
          </Text>
          <Text className="text-tenue text-sm">
            • NativeWind (Tailwind CSS)
          </Text>
          <Text className="text-tenue text-sm">
            • expo-audio para efectos de sonido
          </Text>
        </View>
      </View>

      <View className="bg-superficie border border-borde rounded-2xl p-5">
        <Text className="text-texto text-base font-bold mb-2">
          Integrantes del grupo
        </Text>
        <Text className="text-tenue text-sm">
          • Completar con los nombres del grupo
        </Text>
      </View>
    </View>
  );
};

export default AboutScreen;
