import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { usePhotoStorage } from "./lib/hooks/usePhotoStorage";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { addPhoto } = usePhotoStorage();

  // Pendant le chargement de la permission
  if (!permission) return null;

  // Permission non accordée
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();

    // Sauvegarde locale de la photo
    await addPhoto(photo.uri);

    // ✅ Redirection vers la galerie (TP6 index)
    router.replace("/TP6-camera");
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      <View style={styles.buttonsContainer}>
        <Button
          title="Basculer"
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
        />
        <Button title="Prendre photo" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
