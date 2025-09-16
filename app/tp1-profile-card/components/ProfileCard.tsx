import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileCardScreen() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0); // nombre initial de followers

  // Effet pour augmenter automatiquement le nombre de followers toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setFollowers((prev) => prev + 1);
    }, 1000);

    // Nettoyage quand l'écran est quitté
    return () => clearInterval(interval);
  }, []);

  // Gestion du bouton Follow/Unfollow
  const handleFollow = () => {
    if (isFollowing) {
      setFollowers((prev) => prev - 1);
    } else {
      setFollowers((prev) => prev + 1);
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Avatar */}
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/men/32.jpg",
          }}
          style={styles.avatar}
        />

        {/* Nom & Fonction */}
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Software Engineer</Text>

        {/* Followers */}
        <Text style={styles.followers}>{followers} Followers</Text>

        {/* Bouton Follow */}
        <TouchableOpacity
          style={[styles.button, isFollowing ? styles.unfollowButton : styles.followButton]}
          onPress={handleFollow}
        >
          <Text style={styles.buttonText}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    fontSize: 16,
    color: "#777",
    marginBottom: 8,
  },
  followers: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  followButton: {
    backgroundColor: "#007bff",
  },
  unfollowButton: {
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
