import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Home/Home";
import Login from "./components/Home/Login";
import Register from "./components/Home/Register";
import User from "./components/User/User";
import Schedule from "./components/User/Schedule";
import CheckStatus from "./components/User/CheckStatus";
import { GlobalProvider } from "./components/GlobalContext";
import WorkerTab from "./components/Worker/WokerTab";
import CompanyHome from "./components/Company/CompanyHome";
import ShortestRouteMap from "./components/User/ShortestRouteMap";
import UserDashboard from "./components/User/UserDashboard";
import WorkerDashboard from "./components/Worker/WorkerDashboard";
import ScrapRates from "./components/Company/Scraprate";

const Stack = createStackNavigator();

function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="Schedule" component={Schedule} />
          <Stack.Screen name="CheckStatus" component={CheckStatus} />
          <Stack.Screen name="WorkerTab" component={WorkerTab} />
          <Stack.Screen name="CompanyHome" component={CompanyHome} />
          <Stack.Screen name="ShortestRouteMap" component={ShortestRouteMap} />
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
          <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
          <Stack.Screen name="ScrapRates" component={ScrapRates} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}

export default App;
