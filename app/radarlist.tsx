import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mark } from "../assets/mark";

const extractKarayolu = (aciklama: string) => {
  const match = aciklama.match(/([DE]\d{2,3})/); // D100, E80 gibi
  return match ? match[1] : "Diğer";
};

export default function RadarList() {
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    setLoading(true);
    Keyboard.dismiss();
    setTimeout(() => {
      setQuery(searchText);
      setLoading(false);
    }, 300); // küçük gecikme, büyük veri varsa artırabilirsin
  };

  const filteredData = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery === "") {
      return mark.filter((item) =>
        item.Aciklama.toLowerCase().includes("d100")
      );
    }
    return mark.filter((item) =>
      item.Aciklama.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: { [key: string]: typeof mark } = {};
    for (const item of filteredData) {
      const key = extractKarayolu(item.Aciklama);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  }, [filteredData]);

  const openInGoogleMaps = (lat: string, lng: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const renderItem = (item: (typeof mark)[0]) => (
    <View style={styles.item}>
      <Text style={styles.aciklama}>{item.Aciklama}</Text>
      <Text style={styles.coord}>
        📍 {item.lat}, {item.lng}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.googleBtn]}
          onPress={() => openInGoogleMaps(item.lat, item.lng)}
        >
          <Text style={styles.buttonText}>Google Haritalarda Aç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.mapBtn]}
          onPress={() => router.push("/radar")}
        >
          <Text style={styles.buttonText}>Haritada Gör</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const groupKeys = Object.keys(grouped);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Radar Noktaları</Text>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="🔍 Ara (örn. D100, Bakırköy...)"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Ara</Text>
            </TouchableOpacity>
          </View>
        </View>

        {query === "" && (
          <Text style={styles.infoText}>
            Şu an sadece D100 üzerindeki radarlar listeleniyor. Diğer radarları
            görmek için arama yapın.
          </Text>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF5722"
            style={{ marginTop: 30 }}
          />
        ) : groupKeys.length === 0 ? (
          <Text style={styles.noResult}>Eşleşen radar bulunamadı.</Text>
        ) : (
          groupKeys.map((key) => (
            <View key={key} style={styles.group}>
              <Text style={styles.groupTitle}>{key}</Text>
              {grouped[key].map((item, index) => (
                <View key={index}>{renderItem(item)}</View>
              ))}
            </View>
          ))
        )}

        <Text style={styles.footerText}>Orangehat Digital © Furkan Aslan</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#FF5722",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#FF5722",
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  item: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchButton: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },

  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  aciklama: {
    fontSize: 14,
    color: "#333",
  },
  coord: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  noResult: {
    marginTop: 20,
    textAlign: "center",
    color: "#999",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  googleBtn: {
    backgroundColor: "#1976D2",
  },
  mapBtn: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 30,
  },
});
