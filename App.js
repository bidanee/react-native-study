import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import * as Location from "expo-location";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    const permission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치에 접근할 수 없습니다.");
        return;
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync(
        { latitude, longitude },
        { useGoogleMaps: false }
      );
      setCity([location[0].city, location[0].district]);
    };
    permission();
  }, []);
  console.log(city);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city[0]}</Text>
        <Text style={styles.districtName}>{city[1]}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator="false"
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>18</Text>
          <Text style={styles.description}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>20</Text>
          <Text style={styles.description}>Rainy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>24</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#99ccff" },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "teal",
    fontSize: 50,
    fontWeight: "500",
  },
  districtName: {
    marginTop: 20,
    color: "teal",
    fontSize: 50,
    fontWeight: "600",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 180,
    color: "teal",
  },
  description: {
    marginTop: -30,
    fontSize: 50,
    color: "teal",
  },
});
