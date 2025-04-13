import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [fontsLoaded] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoBold: Nunito_700Bold,
  });

  const slides = [
    { id: "1", name: "page1" },
    { id: "2", name: "page2" },
  ];

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>Loading fonts...</Text>
      </View>
    );
  }

  const renderItems = ({ item }) => {
    switch (item.name) {
      case "page1":
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Sell your recyclables online with</Text>
            <MaskedView
              style={styles.maskedView}
              maskElement={<Text style={styles.gradientText}>GreenLoop!</Text>}
            >
              <LinearGradient
                colors={["#00c853", "#2488bb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.7, y: 0 }}
                style={styles.gradient}
              />
            </MaskedView>
            <Image
              source={require("../../assets/images/Home/banner.png")}
              style={styles.bannerImage}
            />
            <Text style={styles.description}>
              Paper - Plastics - Metals - Appliances
            </Text>
          </View>
        );

      case "page2":
        return (
          <View style={styles.container}>
            <Text
              style={[styles.title, { fontWeight: "700", marginBottom: 10 }]}
            >
              How it works
            </Text>
            <Image
              source={require("../../assets/images/Home/work.png")}
              style={styles.workImage}
            />
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? "#2aa82a" : "#25bc25" },
              ]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Get Started →</Text>
            </Pressable>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItems}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6faf5",
  },
  title: {
    fontSize: 23,
    fontFamily: "NunitoRegular",
    color: "green",
    textAlign: "center",
    paddingHorizontal: 10,
    fontWeight: "600",
  },
  maskedView: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientText: {
    fontSize: 28,
    fontFamily: "NunitoBold",
    textAlign: "center",
    color: "black",
  },
  gradient: {
    height: 40,
    width: 200,
  },
  bannerImage: {
    width: 250,
    height: 250,
    marginTop: 10,
  },
  description: {
    color: "#656565",
    fontSize: 16,
    fontWeight: "700",
  },
  workImage: {
    width: 330,
    height: 400,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d7fcdc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#3af253",
    width: 12,
    height: 12,
  },
});
