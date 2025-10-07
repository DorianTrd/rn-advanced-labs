import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { listPhotos, Photo } from "./lib/camera/storage";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadPhotos = async () => {
    setLoading(true);
    const data = await listPhotos();
    setPhotos(data);
    setLoading(false);
  };

  // 🔄 Recharge à chaque fois que l’écran revient en focus
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📷 Ma Galerie</Text>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push("/TP6-camera/camera")}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.cameraButtonText}>Nouvelle photo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Chargement des photos...</Text>
      ) : photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={60} color="#A0AEC0" />
          <Text style={styles.emptyText}>Aucune photo pour le moment</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.photoWrapper}
              onPress={() => router.push(`/TP6-camera/detail/${item.id}`)}
            >
              <Image source={{ uri: item.uri }} style={styles.photo} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    elevation: 2,
  },
  cameraButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  gallery: {
    paddingBottom: 20,
    justifyContent: "center",
  },
  photoWrapper: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loading: {
    textAlign: "center",
    marginTop: 50,
    color: "#64748B",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 16,
  },
});
