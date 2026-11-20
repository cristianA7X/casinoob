import { colores } from "@/presentation/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colores.superficie },
        headerTintColor: colores.dorado,
        headerTitleStyle: { fontWeight: "bold" },
        drawerStyle: { backgroundColor: colores.fondo },
        drawerActiveTintColor: colores.dorado,
        drawerInactiveTintColor: colores.tenue,
        drawerActiveBackgroundColor: colores.superficie,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Casino",
          title: "Casino Slots",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="game-controller-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="reglas"
        options={{
          drawerLabel: "Reglas y Pagos",
          title: "Reglas y Pagos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="configuracion"
        options={{
          drawerLabel: "Configuración",
          title: "Configuración",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "Acerca de",
          title: "Acerca de",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
