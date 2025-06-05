import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <>
      {/* Status bar'ı platforma göre ayarlıyoruz */}
      <StatusBar
        style="dark" // "light" da olabilir
        backgroundColor={Platform.OS === "android" ? "#ffffff" : undefined}
      />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff", // üst bar rengi
          },
          headerShown: false,
          headerTintColor: "#000", // başlıktaki yazı & ikon rengi
          headerTitleAlign: "center",
          animation: "slide_from_right", // sayfa geçiş animasyonu
        }}
      />
    </>
  );
}
