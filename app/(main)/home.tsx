import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Welcome Home!</Text>

      <View style={styles.buttonWrapper}>
        <Button
          title="Detail 1"
          onPress={() =>
            router.push({
              pathname: "/detail/[id]",
              params: { id: "1" },
            })
          }
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Detail 2"
          onPress={() =>
            router.push({
              pathname: "/detail/[id]",
              params: { id: "2" },
            })
          }
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Detail 3"
          onPress={() =>
            router.push({
              pathname: "/detail/[id]",
              params: { id: "3" },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    marginVertical: 8, 
    width: 100,      
  },
});
