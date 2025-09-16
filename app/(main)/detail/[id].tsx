import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  if (!id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>ID missing – 404</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Detail Screen</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
