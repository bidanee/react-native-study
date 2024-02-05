import { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import weatherDescKo from "./weatherDesKo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState([]);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //보통 API KEY 같은 경우는 서버에 보관 이건 무료라서 그냥 여기 작성
  const API_KEY = "70fd96fb9e7b509441cf3a605c2a7ca7";
  //icons url
  // const weatherIconsURL = `https://openweathermap.org/img/wn/${name}@2x.png`;

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

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );

      const json = await response.json();
      setData(json);
    };
    permission();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        {city ? (
          <Text style={styles.cityName}>
            {city[0]} {city[1]}
          </Text>
        ) : (
          <Text style={styles.cityName}>Loading...</Text>
        )}
      </View>

      {data && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator="false"
          contentContainerStyle={styles.weather}
        >
          <View style={styles.day}>
            <Text style={styles.todayWeather}>현재 날씨</Text>
            <View style={styles.tempContainer}>
              <Text
                style={
                  data.main.temp - 273.15 < 18
                    ? styles.tempCold
                    : styles.tempHot
                }
              >
                {Math.round(data.main.temp - 273.15)}
              </Text>
              <Text
                style={
                  data.main.temp - 273.15 < 18
                    ? styles.tempCelsiusCold
                    : styles.tempCelsiusHot
                }
              >
                °
              </Text>
              <Image
                style={styles.icon}
                source={{
                  uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                }}
                alt={`${weatherDescKo[data.weather[0].id]}`}
              />
            </View>
            <Text style={styles.description}>
              {weatherDescKo[data.weather[0].id]}
            </Text>
          </View>
          {/* 여기서 맵돌려서 다음날 날씨 ,... */}
          <View style={styles.day}>
            <Text style={styles.temp}>최고 온도</Text>
            <Text style={styles.description}>
              {Math.round(data.main.temp_max - 273.15)}°
            </Text>
            <Text style={styles.temp}>최저 온도</Text>
            <Text style={styles.description}>
              {Math.round(data.main.temp_min - 273.15)}°
            </Text>
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
      )}
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
    fontSize: 40,
    fontWeight: "700",
  },
  todayWeather: {
    marginBottom: 40,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
  },
  weather: {
    alignItems: "stretch",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  tempContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    width: 100,
    height: 130,
    alignItems: "center",
    marginLeft: 10,
  },
  tempCold: {
    fontSize: 100,
    color: "#02a4d3",
  },
  tempHot: {
    fontSize: 100,
    color: "#d21404",
  },
  tempCelsiusCold: {
    fontSize: 100,
    color: "#02a4d3",
  },
  tempCelsiusHot: {
    fontSize: 100,
    color: "#d21404",
  },
  description: {
    marginTop: 20,
    fontSize: 30,
    color: "#41424c",
  },
});
