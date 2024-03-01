import { useEffect, useState } from "react"
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import * as Location from "expo-location"
import weatherDescKo from "./weatherDesKo"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const array = [
  require("./assets/1.png"),
  require("./assets/2.png"),
  require("./assets/3.png"),
  require("./assets/4.png"),
  require("./assets/5.png"),
  require("./assets/6.png"),
]
export default function App() {
  const [city, setCity] = useState([])
  const [data, setData] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  //보통 API KEY 같은 경우는 서버에 보관 이건 무료라서 그냥 여기 작성
  const API_KEY = "70fd96fb9e7b509441cf3a605c2a7ca7"
  //icons url
  // const weatherIconsURL = `https://openweathermap.org/img/wn/${name}@2x.png`;

  useEffect(() => {
    const permission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("위치에 접근할 수 없습니다.")
          return
        }

        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 })
        const location = await Location.reverseGeocodeAsync(
          { latitude, longitude },
          { useGoogleMaps: false }
        )
        setCity([location[0].city, location[0].district])

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        )

        const json = await response.json()
        setData(json)
      } catch (err) {
        console.error("에러", err)
      }
    }
    permission()
  }, [])

  let imageSource = ""

  switch (true) {
    case data?.temp >= 28:
      imageSource = array[0]
      break
    case data?.temp >= 23 && data?.temp <= 27:
      imageSource = array[1]
      break
    case data?.temp >= 20 && data?.temp <= 22:
      imageSource = array[2]
      break
    case data?.temp >= 17 && data?.temp <= 19:
      imageSource = array[3]
      break
    case data?.temp >= 12 && data?.temp <= 16:
      imageSource = array[4]
      break
    default:
      imageSource = array[5]
      break
  }
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

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator="false"
        contentContainerStyle={styles.weather}
      >
        {data === null ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          <>
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
                  {Math.round(data.main.temp - 273.15)}°
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
            <View style={styles.day}>
              <View style={styles.weatherSecond}>
                <View style={styles.weatherSecondContents}>
                  <Text style={styles.temp}>최고 온도</Text>
                  <Text
                    style={
                      data.main.temp - 273.15 < 18
                        ? styles.tempCold2
                        : styles.tempHot2
                    }
                  >
                    {(data.main.temp_max - 273.15).toFixed(1)}°
                  </Text>
                </View>
                <View style={styles.weatherSecondContents}>
                  <Text style={styles.temp}>최저 온도</Text>
                  <Text
                    style={
                      data.main.temp - 273.15 < 18
                        ? styles.tempCold2
                        : styles.tempHot2
                    }
                  >
                    {(data.main.temp_min - 273.15).toFixed(1)}°
                  </Text>
                </View>
              </View>
              <View style={styles.weatherSecond}>
                <View style={styles.weatherSecondContents}>
                  <Text style={styles.temp}>습도</Text>
                  <Text style={styles.description}>{data.main.humidity}%</Text>
                </View>
                <View style={styles.weatherSecondContents}>
                  <Text style={styles.temp}>기압</Text>
                  <Text style={styles.description}>
                    {data.main.pressure}hPa
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.day}>
              <Text style={styles.recommendClothes}>오늘 추천 옷차림</Text>
              <Image
                style={styles.weatherImg}
                source={imageSource}
                alt="옷차림"
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  recommendClothes: {
    marginTop: 20,
    fontWeight: "600",
    fontSize: 30,
    textAlign: "center",
    color: "navy",
    marginBottom: 10,
    tintColor: "white",
  },
  weatherImg: {
    width: 300,
    height: 200,
    alignItems: "center",
  },
  container: { flex: 1, backgroundColor: "#99ccff" },
  city: {
    flex: 1,
    justifyContent: "flex-end",
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
    marginTop: 50,
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
  description: {
    marginTop: 20,
    fontSize: 25,
    color: "#41424c",
    textAlign: "center",
  },
  weatherSecond: {
    flexDirection: "row",
    width: SCREEN_WIDTH,
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  weatherSecondContents: {
    margin: 10,
    paddingTop: 20,
  },
  temp: {
    fontWeight: "500",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 10,
  },
  tempCold2: {
    fontSize: 25,
    color: "#02a4d3",
    textAlign: "center",
  },
  tempHot2: {
    fontSize: 25,
    color: "#d21404",
    textAlign: "center",
  },
})
