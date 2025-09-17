import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
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

      <Tabs.Screen
        name="TP3-forms/formik/index"
        options={{
          title: "Formik",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-foursquare" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="TP3-forms/rhf/index"
        options={{
          title: "RHF",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="american-football" color={color} size={size} />
          ),
        }}
      />
   <Tabs.Screen
        name="TP4-robots/index"
        options={{
          title: "Robots",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="desktop" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen name="detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="detail" options={{ href: null }} />
      <Tabs.Screen name="tp1-profile-card/components/ProfileCard" options={{ href: null }} />
   <Tabs.Screen name="TP4-robots/edit/[id]" options={{ href: null }} />
     <Tabs.Screen name="TP4-robots/create" options={{ href: null }} />
    
    </Tabs>
  );
}
