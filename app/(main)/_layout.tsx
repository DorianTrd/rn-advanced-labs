// app/(main)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp1-profile-card/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen name="detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="tp1-profile-card/components" options={{ href: null }} />
      <Tabs.Screen name="tp1-profile-card/components/ProfileCard" options={{ href: null }} />
      <Tabs.Screen name="detail" options={{ href: null }} />
    </Tabs>
  );
}
