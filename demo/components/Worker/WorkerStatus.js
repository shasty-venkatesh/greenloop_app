import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, StyleSheet } from "react-native";
import { Table, Row } from "react-native-table-component";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";

const WorkerStatus = () => {
  const [scrapData, setScrapData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    category: "",
    weight: "",
  });
  const { globalId } = useContext(GlobalContext);

  useEffect(() => {
    async function handleScrapData() {
      try {
        const resworker = await axios.get(
          `http://10.10.49.163:3000/api/v1/worker/${globalId}`
        );
        let filteredOrders = resworker.data.order.filter(
          (item) => item.status === "completed" || item.status === "canceled"
        );
        setScrapData(filteredOrders);
        setFilteredData(filteredOrders);
      } catch (error) {
        console.error("Error fetching scrap data:", error);
      }
    }
    if (globalId) {
      handleScrapData();
    }
  }, [globalId]);

  useEffect(() => {
    const filtered = scrapData.filter((item) =>
      Object.keys(filters).every((key) =>
        item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [filters, scrapData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const tableHead = [
    "ID",
    "Name",
    "Address",
    "Date",
    "Slot",
    "Cost",
    "Weight",
    "Phone",
    "Category",
    "Status",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Status </Text>

      <View style={styles.filterContainer}>
        {Object.keys(filters).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={`Filter by ${key}`}
            value={filters[key]}
            onChangeText={(value) => handleFilterChange(key, value)}
          />
        ))}
      </View>

      <ScrollView horizontal>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#383838" }}>
            <Row
              data={tableHead}
              style={styles.head}
              textStyle={styles.headerText}
            />
            {filteredData.map((item, index) => {
              const isCompleted = item.status === "completed";
              const isCanceled = item.status === "canceled";

              return (
                <Row
                  key={index}
                  data={[
                    index + 1,
                    item.name,
                    item.address,
                    item.date,
                    item.time,
                    "₹" + item.price,
                    item.weight,
                    item.phone,
                    item.category,
                    item.status,
                  ]}
                  style={[
                    styles.row,
                    isCompleted
                      ? styles.completedRow
                      : isCanceled
                      ? styles.canceledRow
                      : {},
                  ]}
                  textStyle={[
                    styles.text,
                    isCompleted
                      ? styles.completedText
                      : isCanceled
                      ? styles.canceledText
                      : {},
                  ]}
                />
              );
            })}
          </Table>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 70, backgroundColor: "#f6faf5" },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    marginLeft: 10,
    color: "#1B5E20",
  },
  head: { height: 40, backgroundColor: "#f2fcf0", width: 1200 },
  row: { height: 40 },
  text: { margin: 6, textAlign: "center", width: 100 },
  headerText: { fontWeight: "bold", textAlign: "center" },
  completedRow: { backgroundColor: "#d4edda" },
  completedText: { color: "green", fontWeight: "bold" },
  canceledRow: { backgroundColor: "#f8d7da" },
  canceledText: { color: "red", fontWeight: "bold" },
  filterContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    margin: 5,
    width: 120,
    borderRadius: 5,
    textAlign: "center",
  },
});

export default WorkerStatus;
