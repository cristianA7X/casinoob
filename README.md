# 🎰 Casino Slots (casinoob)

Aplicación móvil de tragamonedas desarrollada con **React Native**, **Expo** y **TypeScript** para la materia *Desarrollo de Aplicativos Móviles* (Entrega Práctica Nº 6).

## 📋 Características principales

### Máquinas temáticas

| Máquina | Grilla |
|---|---|
| Frutas Clásico | 3×3 |
| Egipto Antiguo | 5×3 |
| Explorador Espacial | 5×3 |
| Gemas Preciosas | 5×3 |

### Premios y bonificaciones

- **Combinaciones ganadoras** de 3, 4 y 5 símbolos.
- **WILD:** comodín que aplica un multiplicador de ×1.5.
- **SCATTER:** activa giros gratis con un multiplicador de ×1.25.
- **Bono de cortesía:** $50 con recarga cada 12 horas.

### Estado y navegación

- **Estado global centralizado:** saldo virtual (inicial de $100), historial de hasta 50 tiradas recientes y configuración de efectos de sonido.
- **Navegación híbrida:** *Drawer*, *Tabs* inferiores y rutas dinámicas con *Expo Router*.

## 🏗️ Arquitectura del proyecto

El código está organizado por separación de responsabilidades:

```text
casinoob/
├── app/              # Rutas y pantallas (Expo Router): Lobby, Historial, Reglas y /slot/[id]
├── core/             # Lógica pura del juego: datos de máquinas (slots.data.ts) y motor de cálculo (slot-engine.actions.ts)
├── presentation/     # Estado global (CasinoContext.tsx), hooks personalizados y paleta de colores
├── infrastructure/   # Tipos e interfaces de TypeScript
└── assets/           # Recursos gráficos y efectos de audio (.mp3 / .wav)
```

## 🛠️ Stack tecnológico

| Área | Tecnología |
|---|---|
| Framework | React Native + Expo (SDK 58) |
| Lenguaje | TypeScript |
| Enrutamiento | Expo Router |
| Estilos | NativeWind / Tailwind CSS |
| Audio | `expo-audio` |

## 🚀 Instalación y ejecución

1. Clonar el repositorio e ingresar a la carpeta del proyecto:

   ```bash
   cd casinoob
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo de Expo:

   ```bash
   npx expo start
   ```

Una vez iniciado, podés presionar `a` para abrir el emulador Android, `w` para la versión web, o escanear el código QR con **Expo Go**.

## 👥 Equipo de desarrollo

- Arispe Franco
- López Cristian
- Loza Valentina
- Lucero Germán
- Zárate Benito Elías