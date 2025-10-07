import { useRoutePersistence } from "@/utils/navigationPersistence";
import { Stack } from "expo-router";
import React from "react";
import { Provider } from 'react-redux';
import { store } from './(main)/TP4-robots-redux/app/store';

export default function RootLayout() {
  useRoutePersistence();

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}