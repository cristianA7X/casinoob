import { useCasino } from "@/presentation/hooks/CasinoContext";
import { colores } from "@/presentation/theme/colors";
import { Alert, Pressable, Switch, Text, View } from "react-native";

const ConfiguracionScreen = () => {
  const { sonidoActivo, toggleSonido, reiniciarHistorial, reclamarBono } =
    useCasino();

  const confirmarReinicio = () => {
    Alert.alert(
      "Reiniciar historial",
      "Se borrará todo el historial de tiradas. Tu saldo no se verá afectado.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: reiniciarHistorial,
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-fondo px-5 pt-5 gap-4">
      <View className="bg-superficie border border-borde rounded-2xl p-4 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-texto text-base font-bold">
            Efectos de sonido
          </Text>
          <Text className="text-tenue text-sm mt-1">
            Reproducir audio al girar, frenar rodillos y ganar premios.
          </Text>
        </View>

        <Switch
          value={sonidoActivo}
          onValueChange={toggleSonido}
          trackColor={{ false: colores.borde, true: colores.dorado }}
          thumbColor={colores.texto}
        />
      </View>

      <Pressable
        onPress={reclamarBono}
        className="bg-superficie border border-dorado rounded-2xl p-4 items-center active:opacity-80"
      >
        <Text className="text-dorado font-bold text-base">
          Recargar bono de cortesía (+$50.00)
        </Text>
      </Pressable>

      <Pressable
        onPress={confirmarReinicio}
        className="bg-superficie border border-error rounded-2xl p-4 items-center active:opacity-80"
      >
        <Text className="text-error font-bold text-base">
          Reiniciar historial
        </Text>
      </Pressable>
    </View>
  );
};

export default ConfiguracionScreen;
