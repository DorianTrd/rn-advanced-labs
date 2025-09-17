import { Link, useRouter } from "expo-router";
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

      <View style={styles.buttonWrapperWide}>
        <Link href="/TP3-forms/formik"  style={styles.linkBtn}>Formik</Link>
      </View>
      <View style={styles.buttonWrapperWide}>
        <Link href="/TP3-forms/rhf" style={styles.linkBtn}>RHF</Link>
      </View>
         <View style={styles.buttonWrapperWide}>
        <Link href="/TP4-robots" style={styles.linkBtn}>Robots</Link>
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
  buttonWrapperWide: {
    marginVertical: 8,
    width: 200,
  },
  linkBtn: {
    backgroundColor: "#007AFF",
    color: "white",
    textAlign: "center",
    padding: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
});
