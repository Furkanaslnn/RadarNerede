import { Link } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Radar Bilgilendirme</Text>

      <Link href="/radar" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Radar Haritasına Git</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/radarlist" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Radar Listesi</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© Orangehat Digital </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#FF5722", // deep orange
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF5722", // deep orange
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 20 : 30,
    alignItems: "center",
    padding: 10,
  },
  footerText: {
    color: "#999",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
