import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WorkerHome from "./WorkerHome";
import WorkerStatus from "./WorkerStatus";
import SellingProduct from "./SellingProduct";
import ShortestRouteMap from "../User/ShortestRouteMap";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={WorkerHome} />
    </Stack.Navigator>
  );
}

function StatusStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StatusMain" component={WorkerStatus} />
    </Stack.Navigator>
  );
}

function SellStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellMain" component={SellingProduct} />
    </Stack.Navigator>
  );
}

function WorkerTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Status") iconName = "clipboard-text";
          else if (route.name === "Sell") iconName = "cart";
          else if (route.name === "Map") iconName = "map";

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
        tabBarActiveTintColor: "rgb(5, 126, 32)",
        tabBarInactiveTintColor: "rgb(62, 62, 62)",
        tabBarStyle: {
          backgroundColor: "rgba(129, 232, 134, 0.99)",
          borderRadius: 10,
          height: 70,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Status" component={StatusStack} />
      <Tab.Screen name="Sell" component={SellStack} />
      <Tab.Screen name="Map" component={ShortestRouteMap} />
    </Tab.Navigator>
  );
}

export default WorkerTab;
