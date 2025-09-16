import { useRoutePersistence } from "@/utils/navigationPersistence";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  useRoutePersistence();

  return (
    <Stack>
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
  );
}