import { Stack } from 'expo-router';

export default function TP5Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Robots SQLite',
          headerShown: false, // On utilise notre propre header
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Nouveau Robot',
          headerShown: false, // On utilise notre propre header
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Modifier Robot',
          headerShown: false, // On utilise notre propre header
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
