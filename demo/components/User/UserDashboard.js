import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker"; // ✅ Updated Import
import axios from "axios";

const Dashboard = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderData, setOrderData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://10.10.49.163:3000/api/v1/user");
      setTotalUser(response.data.length);
      let revenue = 0;
      let tempData = {};

      response.data.forEach((user) => {
        user.order.forEach((order) => {
          revenue += order.price;

          // Extract month name
          const month = new Date(order.date).toLocaleString("default", {
            month: "long",
          });

          if (!tempData[month]) {
            tempData[month] = { metal: 0, plastic: 0, glass: 0, electronic: 0 };
          }

          if (order.category === "metal") tempData[month].metal += 1;
          else if (order.category === "plastic") tempData[month].plastic += 1;
          else if (order.category === "glass") tempData[month].glass += 1;
          else tempData[month].electronic += 1;
        });
      });

      setTotalRevenue(revenue);
      setOrderData(tempData);
      setSelectedMonth(Object.keys(tempData)[0]); // Default to first month
    }
    fetchData();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  const barData = {
    labels: ["Metal", "Plastic", "Glass", "Electronic"],
    datasets: [
      {
        data: selectedMonth
          ? [
              orderData[selectedMonth]?.metal || 0,
              orderData[selectedMonth]?.plastic || 0,
              orderData[selectedMonth]?.glass || 0,
              orderData[selectedMonth]?.electronic || 0,
            ]
          : [0, 0, 0, 0],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Revenue</Text>
          <Text style={styles.cardValue}>₹{totalRevenue}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Users</Text>
          <Text style={styles.cardValue}>{totalUser}</Text>
        </View>
      </View>

      {/* Month Picker */}
      <Text style={styles.chartTitle}>Select Month</Text>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        style={styles.picker}
      >
        {Object.keys(orderData).map((month) => (
          <Picker.Item key={month} label={month} value={month} />
        ))}
      </Picker>

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>Order Distribution ({selectedMonth})</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={250}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: "#f6faf5",
          backgroundGradientTo: "#f6faf5",
          decimalPlaces: 0,
          barPercentage: 0.6,
          color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 51, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForBackgroundLines: { strokeDasharray: "3" },
          propsForLabels: { fontWeight: "bold", fontSize: 14 },
        }}
        showValuesOnTopOfBars
        fromZero
        style={styles.chart}
      />

      <Text style={styles.pieTitle}>Sales Distribution</Text>
      <PieChart
        data={[
          {
            name: "Metal",
            population: orderData[selectedMonth]?.metal || 0,
            color: "#388E3C",
            legendFontColor: "#003300",
            legendFontSize: 14,
          },
          {
            name: "Plastic",
            population: orderData[selectedMonth]?.plastic || 0,
            color: "#66BB6A",
            legendFontColor: "#003300",
            legendFontSize: 14,
          },
          {
            name: "Glass",
            population: orderData[selectedMonth]?.glass || 0,
            color: "#A5D6A7",
            legendFontColor: "#003300",
            legendFontSize: 14,
          },
          {
            name: "Electronic",
            population: orderData[selectedMonth]?.electronic || 0,
            color: "#C8E6C9",
            legendFontColor: "#003300",
            legendFontSize: 14,
          },
        ]}
        width={screenWidth - 40}
        height={200}
        chartConfig={{ color: () => `rgba(0, 51, 0, 1)` }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faf5",
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  card: {
    backgroundColor: "#a5d6a7",
    padding: 20,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: "#003300",
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 20,
    color: "#1b5e20",
    fontWeight: "bold",
    marginTop: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003300",
    marginBottom: 10,
  },
  picker: {
    width: "90%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    paddingBottom: 10,
  },
  pieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003300",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Dashboard;
