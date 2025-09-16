import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function DetailLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Retour à Home",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/home")}
              style={{ paddingHorizontal: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Retour à Home"
            >
              <Ionicons name="arrow-back" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
