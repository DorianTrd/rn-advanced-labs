import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, usePathname, useRootNavigationState, useRouter } from "expo-router";
import React from "react";

const DEFAULT_PATH_KEY = "NAVIGATION_LAST_PATH_V1";

// Sauvegarde en continu le chemin courant et restaure au démarrage
export function useRoutePersistence(storageKey: string = DEFAULT_PATH_KEY) {
  const router = useRouter();
  const pathname = usePathname();
  const rootState = useRootNavigationState();
  const [restored, setRestored] = React.useState(false);

  // Restaurer au démarrage
  React.useEffect(() => {
    if (!rootState?.key || restored) return; // attendre que la nav soit prête
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved && saved !== pathname) {
          router.replace(saved as Href);
        }
      } catch {
        // ignore
      } finally {
        setRestored(true);
      }
    })();
  }, [rootState?.key, restored, router, pathname, storageKey]);

  // Sauvegarder à chaque changement de chemin
  React.useEffect(() => {
    if (!pathname) return;
    AsyncStorage.setItem(storageKey, pathname).catch(() => {});
  }, [pathname, storageKey]);
}

