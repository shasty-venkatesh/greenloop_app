import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";

const SellingProduct = () => {
  const { globalId } = useContext(GlobalContext);
  const [scrapData, setScrapData] = useState([]);

  useEffect(() => {
    async function fetchAndUseScrapData() {
      try {
        console.log("hello");
        const resworker = await axios.get(
          `http://10.10.49.163:3000/api/v1/worker/${globalId}`
        );

        const name = resworker.data.name;
        const email = resworker.data.email;
        const phone = resworker.data.phone;
        let filteredOrders = resworker.data.order.filter(
          (item) => item.status === "completed"
        );

        const groupedScrapData = filteredOrders.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.category === item.category);

          if (existingItem) {
            existingItem.weight =
              Number(existingItem.weight) + Number(item.weight);
            existingItem.price =
              Number(existingItem.price) + Number(item.price) + 20;
          } else {
            acc.push({
              name: name,
              email: email,
              phone: phone,
              category: item.category,
              weight: item.weight,
              price: item.price,
              sellingStatus: item.sellingStatus,
              companydata: item.companydata,
            });
          }
          return acc;
        }, []);
        console.log("test12", groupedScrapData);
        setScrapData(groupedScrapData);
      } catch (error) {
        console.error("Error fetching scrap data:", error);
      }
    }

    if (globalId) {
      fetchAndUseScrapData();
    }
  }, [globalId]);

  const handleSell = async (category) => {
    const updatedData = scrapData.map((item) =>
      item.category === category ? { ...item, sellingStatus: "pending" } : item
    );
    console.log(updatedData);

    const resCategory = await axios.get(
      `http://10.10.49.163:3000/api/v1/worker/${globalId}`
    );
    const order = resCategory.data.order;

    const categoryOrder = order.map((item) =>
      item.category === category ? { ...item, sellingStatus: "pending" } : item
    );
    try {
      const res1 = await axios.put(
        `http://10.10.49.163:3000/api/v1/worker/${globalId}`,
        {
          order: categoryOrder,
        }
      );
      console.log(res1.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }

    setScrapData(updatedData);

    try {
      await axios.put(`http://10.10.49.163:3000/api/v1/worker/${globalId}`, {
        grouporder: updatedData,
      });
      alert("Ready to Sell");
    } catch (error) {
      alert("Sorry!!!");
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("yet_to_sell");

  const filteredData = scrapData.filter((item) => {
    if (selectedCategory === "yet_to_sell")
      return item.sellingStatus === undefined;
    return item.sellingStatus === selectedCategory;
  });

  function handleCompany(item) {
    const companyData = item.companydata[0];
    console.log(companyData);
    alert(
      "Name: \t" +
        companyData.name +
        "\n" +
        "Email: \t" +
        companyData.email +
        "\n" +
        "Address: \t" +
        `${companyData.address}, ${companyData.landmark}, Pincode :${companyData.pincode}` +
        "\n" +
        "Phone Number : " +
        companyData.phone
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Sales</Text>

      <View style={styles.categoryButtons}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "yet_to_sell"
              ? styles.activeYetToSell
              : styles.inactiveButton,
          ]}
          onPress={() => setSelectedCategory("yet_to_sell")}
        >
          <Text
            style={
              selectedCategory === "yet_to_sell"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            Yet to Sell
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "pending"
              ? styles.activePending
              : styles.inactiveButton,
          ]}
          onPress={() => setSelectedCategory("pending")}
        >
          <Text
            style={
              selectedCategory === "pending"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "confirm"
              ? styles.activeCompleted
              : styles.inactiveButton,
          ]}
          onPress={() => setSelectedCategory("confirm")}
        >
          <Text
            style={
              selectedCategory === "confirm"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listContainer}>
        {filteredData.length === 0 ? (
          <Text style={styles.emptyMessage}>No items in this category</Text>
        ) : (
          filteredData.map((item) => (
            <View
              key={item.id}
              style={[styles.listItem, styles[selectedCategory]]}
            >
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.details}>
                {item.weight} - {item.price}
              </Text>

              {item.sellingStatus === undefined && (
                <TouchableOpacity
                  style={styles.sellButton}
                  onPress={() => handleSell(item.category)}
                >
                  <Text style={styles.buttonText}>Sell</Text>
                </TouchableOpacity>
              )}

              {item.sellingStatus === "pending" && (
                <TouchableOpacity style={styles.completeButton}>
                  <Text style={styles.buttonText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}

              {item.sellingStatus === "confirm" && (
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => handleCompany(item)}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6faf5", paddingTop: 30 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 20,
    textAlign: "left",
    marginLeft: 20,
    marginTop: 30,
  },

  categoryButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  activeYetToSell: { backgroundColor: "#770b26" },
  activePending: { backgroundColor: "#ffcc00" },
  activeCompleted: { backgroundColor: "#42b342" },

  inactiveButton: { backgroundColor: "#ddd" },
  activeText: { color: "#fff", fontWeight: "bold" },
  inactiveText: { color: "#333" },

  listContainer: { paddingHorizontal: 15 },
  listItem: { padding: 15, borderRadius: 8, marginBottom: 10 },
  category: { fontSize: 18, fontWeight: "bold" },
  details: { fontSize: 16, marginVertical: 5 },

  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },

  // Status-based Colors
  yet_to_sell: { backgroundColor: "#decece" },
  pending: { backgroundColor: "#fff4cc" },
  completed: { backgroundColor: "#d7f9d7" },

  sellButton: {
    backgroundColor: "#770b26",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  viewDetailsButton: {
    backgroundColor: "#42b342",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default SellingProduct;
