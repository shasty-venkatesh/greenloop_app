import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

const WorkerDashboard = () => {
  const screenWidth = Dimensions.get("window").width;

  // State for trips
  const [todayTrips, setTodayTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  useEffect(() => {
    fetch("http://10.10.49.163:3000/api/trips")
      .then((response) => response.json())
      .then((data) => {
        setTodayTrips(data.todayTrips);
        setUpcomingTrips(data.upcomingTrips);
      })
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);
  const [revenue, setRevenue] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [200, 150, 300, 250, 400, 350],
      },
    ],
  });

  const [salary, setSalary] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [10500, 10800, 11500, 11000, 12500, 12000],
        color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Worker Dashboard</Text>

      {/* Today's Trips */}
      <Card style={styles.card}>
        <Title style={styles.cardTitle}>Today's Trips</Title>
        <View style={styles.tripList}>
          {todayTrips.length > 0 ? (
            todayTrips.map((trip, index) => (
              <View key={index} style={styles.tripContainer}>
                <Text style={styles.tripTitle}>{trip.name}</Text>
                <Paragraph>Date: {trip.date}</Paragraph>
                <Paragraph>Time: {trip.time}</Paragraph>
                <Paragraph>Address: {trip.address}</Paragraph>
                <Paragraph>Landmark: {trip.landmark}</Paragraph>
                <Paragraph>Pincode: {trip.pincode}</Paragraph>
                <Paragraph>Weight: {trip.weight}</Paragraph>
                <Paragraph>Category: {trip.category}</Paragraph>
                <Paragraph>Phone: {trip.phone}</Paragraph>
                <Paragraph>Status: {trip.status}</Paragraph>
                <Paragraph>Price: ₹{trip.price}</Paragraph>
                <Paragraph>Selling Status: {trip.sellingStatus}</Paragraph>
              </View>
            ))
          ) : (
            <Paragraph>No trips today</Paragraph>
          )}
        </View>
      </Card>

      {/* Upcoming Trips */}
      <Card style={styles.card}>
        <Title style={styles.cardTitle}>Upcoming Trips</Title>
        <View style={styles.tripList}>
          {upcomingTrips.length > 0 ? (
            upcomingTrips.map((trip, index) => (
              <View key={index} style={styles.tripContainer}>
                <Text style={styles.tripTitle}>{trip.name}</Text>
                <Paragraph>Date: {trip.date}</Paragraph>
                <Paragraph>Time: {trip.time}</Paragraph>
                <Paragraph>Address: {trip.address}</Paragraph>
                <Paragraph>Landmark: {trip.landmark}</Paragraph>
                <Paragraph>Pincode: {trip.pincode}</Paragraph>
                <Paragraph>Weight: {trip.weight}</Paragraph>
                <Paragraph>Category: {trip.category}</Paragraph>
                <Paragraph>Phone: {trip.phone}</Paragraph>
                <Paragraph>Status: {trip.status}</Paragraph>
                <Paragraph>Price: ₹{trip.price}</Paragraph>
                <Paragraph>Selling Status: {trip.sellingStatus}</Paragraph>
              </View>
            ))
          ) : (
            <Paragraph>No upcoming trips</Paragraph>
          )}
        </View>
      </Card>

      {/* Revenue Chart */}
      <Card style={styles.card}>
        <Title style={styles.cardTitle}>Revenue Overview</Title>
        <LineChart
          data={revenue}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#c8e6c9",
            backgroundGradientTo: "#81c784",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={{ marginVertical: 8 }}
        />
        <Text style={styles.revenueText}>
          Total Revenue: ₹{revenue.datasets[0].data.reduce((acc, val) => acc + val, 0)}
        </Text>
      </Card>

      {/* Salary Chart */}
      <Card style={styles.card}>
        <Title style={styles.cardTitle}>Worker Salary Trend</Title>
        <LineChart
          data={salary}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#a5d6a7",
            backgroundGradientTo: "#66bb6a",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={{ marginVertical: 8 }}
        />
        <Text style={styles.salaryText}>
          Latest Salary: ₹{salary.datasets[0].data[salary.datasets[0].data.length - 1]}
        </Text>
      </Card>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8e9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2e7d32",
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "#dcedc8",
  },
  cardTitle: {
    color: "#1b5e20",
    fontSize: 18,
    fontWeight: "bold",
  },
  tripList: {
    marginTop: 10,
  },
  tripContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#81c784",
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  revenueText: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#1b5e20",
  },
  salaryText: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#2e7d32",
  },
});

export default WorkerDashboard;