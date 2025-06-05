import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { mark } from "../assets/mark";

export default function RadarPage() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    null
  );
  const markerRefs = useRef<any[]>([]);

  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    let subscriber: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Konum izni verilmedi!");
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // en az 3 saniyede bir
          distanceInterval: 5, // en az 5 metre hareket edince
        },
        (loc) => {
          setLocation(loc);
          // Harita kullanıcıyı takip etsin istersen buraya da ekleyebilirsin:
          // mapRef.current?.animateToRegion({...})
        }
      );
    })();

    return () => {
      subscriber?.remove(); // bileşen unmount olunca durdur
    };
  }, []);

  const goToMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
    }
  };

  const handleMarkerPress = (index: number) => {
    setSelectedMarkerIndex(index);
    // Marker’ın callout’unu aç
    markerRefs.current[index]?.showCallout();
  };

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Konum alınıyor lütfen bekleyin...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
          }}
          showsUserLocation={true}
          followsUserLocation={false}
        >
          {mark.map((item, index) => (
            <Marker
              key={index}
              ref={(ref) => {
                if (ref) markerRefs.current[index] = ref;
              }}
              coordinate={{
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lng),
              }}
              pinColor={selectedMarkerIndex === index ? "red" : "default"}
              onPress={() => handleMarkerPress(index)}
            >
              <Callout tooltip={false}>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: 6,
                    maxWidth: 250,
                  }}
                >
                  <Text style={{ color: "#333", fontSize: 13 }}>
                    {item.Aciklama}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {selectedMarkerIndex !== null && (
          <View style={styles.descriptionBox}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.descriptionText}>
                {mark[selectedMarkerIndex].Aciklama}
              </Text>
              <TouchableOpacity onPress={() => setSelectedMarkerIndex(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={goToMyLocation}>
          <Text style={styles.buttonText}>Konumuma Git</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  callout: {
    padding: 5,
    maxWidth: 250,
  },
  descriptionText: {
    fontSize: 13,
    textAlign: "left",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: Platform.OS === "android" ? 30 : 10, // alt boşluk
    backgroundColor: "white", // SafeAreaView arka planı
  },
  map: {
    flex: 1,
  },
  descriptionBox: {
    position: "absolute",
    top: Platform.OS === "android" ? 70 : 40,
    left: 10,
    right: 10,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 999,
  },

  button: {
    position: "absolute",
    bottom: 45,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    zIndex: 10, // açıklama kutusunun altında kalsın
    elevation: 2,
  },

  descriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
