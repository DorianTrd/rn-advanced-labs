import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deletePhoto, getPhoto, Photo } from "../lib/camera/storage";

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await getPhoto(id);
        setPhoto(data || null);
      }
    };
    load();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer cette photo ?",
      "Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!photo) return;
            await deletePhoto(photo.id);
            router.replace("/TP6-camera"); // ✅ redirige vers la galerie
          },
        },
      ]
    );
  };

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const formattedDate = new Date(photo.createdAt).toLocaleString();

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Détails de la photo</Text>
        <Text style={styles.info}>🆔 ID : {photo.id}</Text>
        <Text style={styles.info}>📅 Date : {formattedDate}</Text>
        <Text style={styles.info}>📏 Taille : {photo.size ? (photo.size / 1024).toFixed(1) : "?"} Ko</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2563EB" }]}
          onPress={() => router.replace("/TP6-camera")}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#DC2626" }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
    backgroundColor: "#E0E7FF",
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  info: {
    color: "#475569",
    fontSize: 16,
    marginVertical: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
