import "../global.css";
import { CasinoProvider } from "@/presentation/hooks/CasinoContext";
import { colores } from "@/presentation/theme/colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CasinoProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colores.fondo },
          }}
        >
          <Stack.Screen name="(drawer)" />
          <Stack.Screen
            name="slot/[id]"
            options={{
              headerShown: true,
              title: "Slot",
              headerStyle: { backgroundColor: colores.superficie },
              headerTintColor: colores.dorado,
              headerTitleStyle: { fontWeight: "bold" },
            }}
          />
        </Stack>
      </CasinoProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
