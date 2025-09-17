import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

export async function SuccessPopup(message: string = "Compte créé avec succès ✅") {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Alert.alert("Succès", message);
}

export async function ErrorPopup(message: string = "Une erreur est survenue") {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  Alert.alert("Erreur", message);
}
