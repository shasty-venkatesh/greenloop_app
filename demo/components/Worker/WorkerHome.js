import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Workercard from "./WorkerCard";
import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../GlobalContext.js";
import axios from "axios";

function WorkerHome({ navigation }) {
  const [scrapData, setScrapData] = useState([]);
  const [scrapDatafordb, setScrapDatafordb] = useState([]);
  const { globalId } = useContext(GlobalContext);

  const village = [
    "Perur",
    "Thondamuthur",
    "Madukkarai",
    "Kinathukadavu",
    "Karamadai",
    "Sulur",
    "Annur",
    "Valparai",
    "Vedapatti",
    "Naraseepuram",
  ];

  const cities = [
    "Gandhipuram",
    "RS Puram",
    "Peelamedu",
    "Singanallur",
    "Hope College",
    "Ukkadam",
  ];

  useEffect(() => {
    async function handleScrapData() {
      try {
        const res = await axios.get("http://10.10.49.163:3000/api/v1/user");
        const users = res.data;

        let orders = [];
        users.forEach((user) => {
          user.order.forEach((order) => {
            orders.push({ ...order, phone: user.phone });
          });
        });

        const resWorker = await axios.get(
          `http://10.10.49.163:3000/api/v1/worker/${globalId}`
        );
        const workerAddress = resWorker.data.landmark.trim().toLowerCase();

        let filteredOrders = orders.filter(
          (order) => order.landmark.trim().toLowerCase() === workerAddress
        );

        const landmarkOrder = [...filteredOrders];
        filteredOrders = filteredOrders.filter(
          (item) => item.status === "pending"
        );

        const villageOrder = filteredOrders.filter((item) =>
          village.includes(item.address.trim())
        );

        const citiesOrder = filteredOrders.filter((item) =>
          cities.includes(item.address.trim())
        );

        let citiesTotal = 0;
        let confirmCitiesOrder = [];
        citiesOrder.forEach((item) => {
          if (cities.includes(item.address.trim()) && citiesTotal <= 25) {
            citiesTotal += item.weight;
            confirmCitiesOrder = [...confirmCitiesOrder, item];
          }
        });

        const maxWeightVillage = villageOrder.length
          ? villageOrder.reduce(
              (max, item) => (item.weight > max.weight ? item : max),
              villageOrder[0]
            )
          : null;

        if (maxWeightVillage && maxWeightVillage.weight > citiesTotal) {
          setScrapData([maxWeightVillage]);
        } else {
          setScrapData(confirmCitiesOrder);
        }

        setScrapDatafordb(landmarkOrder);

        const resWorkerCompleted = await axios.get(
          `http://10.10.49.163:3000/api/v1/worker/${globalId}`
        );

        const ordersData = resWorkerCompleted.data.order;
        const incompleteOrders = ordersData.filter(
          (item) => item.status !== "completed"
        );
        const completedOrders = ordersData.filter(
          (item) => item.status === "completed"
        );

        const updatedOrders = [...incompleteOrders, ...completedOrders];

        // console.log(JSON.stringify(updatedOrders, null, 2));

        // setScrapDatafordb(updatedOrders);
        // console.log("hello12", JSON.stringify(scrapDatafordb, null, 2));

        await axios.put(
          `http://10.10.49.163:3000/api/v1/worker/${globalId}`,
          {
            order: updatedOrders,
          }
        );
      } catch (error) {
        console.error("Error fetching scrap data:", error);
      }
    }

    handleScrapData();
  }, [globalId]);

  async function handleStatus(id, status) {
    try {
      const resWorkerCompleted = await axios.get(
        `http://10.10.49.163:3000/api/v1/worker/${globalId}`
      );

      const ordersData = resWorkerCompleted.data.order || []; // Ensure it's an array

      let targetOrder = scrapDatafordb.find((item) => item._id === id);

      if (!targetOrder) {
        console.error("Order not found in scrapDatafordb for ID:", id);
        return;
      }

      targetOrder = { ...targetOrder, status: status }; // No need for [0]
      console.log("Updated Order:", targetOrder);

      const updatedScrapData = scrapDatafordb.map((item) =>
        item._id === id ? { ...item, status } : item
      );

      setScrapData(updatedScrapData);
      setScrapDatafordb(updatedScrapData);

      // Ensure immutability when updating orders
      const updatedOrders1 = [...ordersData, targetOrder];

      await axios.put(`http://10.10.49.163:3000/api/v1/worker/${globalId}`, {
        order: updatedOrders1,
      });
      const completedOrder = updatedScrapData.find((item) => item._id === id);
      if (!completedOrder) return;

      const resUsers = await axios.get(
        "http://10.10.49.163:3000/api/v1/user"
      );
      const users = resUsers.data;

      const user = users.find((u) => u.phone === completedOrder.phone);
      if (!user) {
        console.error("User not found for phone:", completedOrder.phone);
        return;
      }

      const updatedOrders = user.order.map((order) =>
        order.date === completedOrder.date &&
        order.time === completedOrder.time &&
        order.price === completedOrder.price
          ? { ...order, status }
          : order
      );

      await axios.put(
        `http://10.10.49.163:3000/api/v1/user/worker/${user.phone}`,
        { order: updatedOrders }
      );

      setScrapData(
        updatedScrapData.filter((item) => item.status === "pending")
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.workerHeader}>
        <Text style={styles.title}>Hi Worker</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {scrapData.length === 0 ? (
          <View>
            <Text style={styles.message}>No order!</Text>
            <Text style={[styles.message, { marginVertical: -14 }]}>
              Better luck next time
            </Text>
          </View>
        ) : (
          scrapData.map((item, index) => (
            <Workercard
              key={index}
              name={item.name}
              address={item.address}
              cost={item.price}
              phoneNumber={item.phone}
              slot={item.time}
              time={item.date}
              weight={item.weight}
              category={item.category}
              index={index}
              completed={() => handleStatus(item._id, "completed")}
              canceled={() => handleStatus(item._id, "canceled")}
            />
          ))
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("WorkerDashboard")}
        >
          <Text style={styles.actionText}>Worker Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faf5",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  workerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 25,
    marginTop: 5,
  },
  logoutText: {
    color: "#d7fcdc",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  message: {
    marginVertical: 40,
    textAlign: "center",
    fontSize: 20,
  },
  actionButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:30,
    width: "80%",
    marginLeft:30,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WorkerHome;
