import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";
import haversine from "haversine";

const locations = {

  Gandhipuram: { latitude: 11.0168, longitude: 76.9558 },
  "RS Puram": { latitude: 11.0086, longitude: 76.9345 },
  Peelamedu: { latitude: 11.0251, longitude: 77.0223 },
  Singanallur: { latitude: 11.0006, longitude: 76.9975 },
  "Hope College": { latitude: 11.0306, longitude: 77.0015 },
  Ukkadam: { latitude: 10.9966, longitude: 76.9674 },

  Perur: { latitude: 11.0056, longitude: 76.9158 },
  Thondamuthur: { latitude: 10.9975, longitude: 76.8956 },
  Madukkarai: { latitude: 10.9132, longitude: 76.9391 },
  Kinathukadavu: { latitude: 10.7820, longitude: 77.0080 },
  Karamadai: { latitude: 11.2560, longitude: 76.9551 },
  Sulur: { latitude: 11.0300, longitude: 77.1320 },
  Annur: { latitude: 11.2375, longitude: 77.1040 },
  Valparai: { latitude: 10.3204, longitude: 76.9512 },
  Vedapatti: { latitude: 10.9892, longitude: 76.8945 },
  Naraseepuram: { latitude: 10.9950, longitude: 76.8750 },
};

const roads = {
  
  Gandhipuram: { "RS Puram": 4, Peelamedu: 6, Singanallur: 10, Ukkadam: 8 },
  "RS Puram": { Gandhipuram: 4, Ukkadam: 6 },
  Peelamedu: { Gandhipuram: 6, Singanallur: 5 },
  Singanallur: { Gandhipuram: 10, Peelamedu: 5, Ukkadam: 7 },
  Ukkadam: { "RS Puram": 6, Singanallur: 7, Gandhipuram: 8 },

 
  Perur: { Vedapatti: 5, Thondamuthur: 7 },
  Thondamuthur: { Perur: 7, Naraseepuram: 6 },
  Madukkarai: { Kinathukadavu: 12 },
  Kinathukadavu: { Madukkarai: 12, Sulur: 15 },
  Karamadai: { Annur: 10 },
  Sulur: { Kinathukadavu: 15, Annur: 20 },
  Annur: { Karamadai: 10, Sulur: 20 },
  Valparai: { Naraseepuram: 30 },
  Vedapatti: { Perur: 5, Naraseepuram: 8 },
  Naraseepuram: { Vedapatti: 8, Valparai: 30, Thondamuthur: 6 },
};

const AVERAGE_SPEED_KMPH = 40;
const SECONDS_PER_HOUR = 3600;

const findBestRoute = (graph, start, stops) => {
  let unvisited = new Set(stops);
  let path = [start];
  let current = start;

  while (unvisited.size) {
    let nearest = null;
    let shortestDistance = Infinity;

    for (let stop of unvisited) {
      let distance = graph[current]?.[stop] || Infinity;
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = stop;
      }
    }

    if (nearest) {
      path.push(nearest);
      unvisited.delete(nearest);
      current = nearest;
    } else {
      break;
    }
  }

  return path;
};

const calculateETA = (route) => {
  let currentTime = new Date();
  let etaTimes = [];
  let totalDistance = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const start = locations[route[i]];
    const end = locations[route[i + 1]];

    if (!start || !end) continue;

    let distance = haversine(start, end, { unit: "km" });
    totalDistance += distance;

    let travelTimeSeconds = (distance / AVERAGE_SPEED_KMPH) * SECONDS_PER_HOUR;
    currentTime = new Date(currentTime.getTime() + travelTimeSeconds * 1000);

    etaTimes.push({
      location: route[i + 1],
      eta: currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });
  }

  return etaTimes;
};

const ShortestRouteMap = () => {
  const [route, setRoute] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [etaList, setEtaList] = useState([]);
  const { globalId, setGlobalId } = useContext(GlobalContext);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    async function handleLocation() {
      const response = await axios.get(
        `http://10.10.49.163:3000/api/v1/worker/${globalId}`
      );

      const completedOrders = response.data.order
        .filter((item) => item.status === "completed")
        .map((item) => item.address.trim());

      const start = response.data.address;
      setStops((prev) => [...prev, ...completedOrders]);
      const bestRoute = findBestRoute(roads, start, completedOrders);
      setRoute(bestRoute);

      const coordinates = bestRoute
        .map((loc) => locations[loc])
        .filter(Boolean);
      setRouteCoordinates(coordinates);

      const etaData = calculateETA(bestRoute);
      setEtaList(etaData);
      console.log(etaData);
    }
    handleLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 11.0168,
          longitude: 76.9558,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {Object.entries(locations).map(([key, coord]) => (
          <Marker key={key} coordinate={coord} title={key} />
        ))}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>

      <View style={styles.etaContainer}>
        <Text style={styles.etaTitle}>Estimated Arrival Times:</Text>
        {etaList.map((item, index) => (
          <Text key={index} style={styles.etaText}>
            {item.location}: {item.eta}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  etaContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  etaTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  etaText: { fontSize: 14, marginVertical: 2 },
});

export default ShortestRouteMap;
