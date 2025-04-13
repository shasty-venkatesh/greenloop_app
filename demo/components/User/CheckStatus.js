import { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";
import { GlobalContext } from "../GlobalContext";
import axios from "axios";

function CheckStatus({ navigation }) {
  const [checkStatus, setCheckStatus] = useState([true, false, false]);
  const [scheduleDate, setScheduleDate] = useState([]);
  const [canceledDate, setCanceledDate] = useState([]);
  const [completedDate, setCompletedDate] = useState([]);
  const { globalId, setGlobalId } = useContext(GlobalContext);

  useEffect(() => {
    async function handleSchedule() {
      const res = await axios.get(
        `http://10.10.49.163:3000/api/v1/user/${globalId}`
      );
      const order = res.data.order;
      console.log(order);
      const filteredOrdersforschedue = order.filter(
        (item) => item.status === "pending"
      );
      setScheduleDate(filteredOrdersforschedue);
      const filteredOrdersforcancel = order.filter(
        (item) => item.status === "canceled"
      );
      setCanceledDate(filteredOrdersforcancel);
      const filteredOrdersforcompleted = order.filter(
        (item) => item.status === "completed"
      );
      setCompletedDate(filteredOrdersforcompleted);
    }
    handleSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("User")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Check Status</Text>
      <View style={styles.checkstatus}>
        <TouchableOpacity
          style={[
            styles.checkstatusButton,
            checkStatus[0] ? styles.activeSchedule : styles.inactiveSchedule,
          ]}
          onPress={() => setCheckStatus([true, false, false])}
        >
          <Text
            style={[
              styles.checkstatusButtonLabel,
              checkStatus[0] ? styles.activeLabel : styles.inactiveLabel,
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.checkstatusButton,
            checkStatus[1] ? styles.activeCompleted : styles.inactiveCompleted,
          ]}
          onPress={() => setCheckStatus([false, true, false])}
        >
          <Text
            style={[
              styles.checkstatusButtonLabel,
              checkStatus[1] ? styles.activeLabel : styles.inactiveLabel,
            ]}
          >
            Canceled
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.checkstatusButton,
            checkStatus[2] ? styles.activeCanceled : styles.inactiveCanceled,
          ]}
          onPress={() => setCheckStatus([false, false, true])}
        >
          <Text
            style={[
              styles.checkstatusButtonLabel,
              checkStatus[2] ? styles.activeLabel : styles.inactiveLabel,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {checkStatus[0] &&
        (scheduleDate.length > 0 ? (
          <FlatList
            data={scheduleDate}
            keyExtractor={(_, index) => index}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Icon name="calendar-alt" size={24} color="#2e7d32" />
                <View style={styles.address}>
                  <Text>{item.address}</Text>
                  <View style={styles.category}>
                    <Text>{item.category}</Text>
                    <Text style={styles.price}>Price: {item.price}</Text>
                  </View>
                </View>
                <View style={styles.time}>
                  <Text>
                    {item.date} {item.time}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyMessage}>No scheduled items available.</Text>
        ))}

      {checkStatus[1] &&
        (canceledDate.length > 0 ? (
          <FlatList
            data={canceledDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.listItem, { backgroundColor: "#f5dbdb" }]}>
                <Icon name="times-circle" size={24} color="#ef5252" />
                <View style={styles.address}>
                  <Text>{item.address}</Text>
                  <View style={styles.category}>
                    <Text>{item.category}</Text>
                    <Text style={styles.price}>Price: {item.price}</Text>
                  </View>
                </View>
                <View style={styles.time}>
                  <Text>{item.date}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyMessage}>No canceled items available.</Text>
        ))}

      {checkStatus[2] &&
        (completedDate.length > 0 ? (
          <FlatList
            data={completedDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.listItem, { backgroundColor: "#decece" }]}>
                <Icon name="check-circle" size={24} color="#770b26" />
                <View style={styles.address}>
                  <Text>{item.address}</Text>
                  <View style={styles.category}>
                    <Text>{item.category}</Text>
                    <Text style={styles.price}>Price: {item.price}</Text>
                  </View>
                </View>
                <View style={styles.time}>
                  <Text>{item.date}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyMessage}>No completed items available.</Text>
        ))}
      <TouchableOpacity onPress={() => navigation.navigate("Schedule")}>
        <Text style={styles.scheduleButton}>Schedule a Pickup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faf5",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  backButton: {
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: "NunitoBold",
    color: "#2e7d32",
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 15,
    marginRight: 10,
  },
  checkstatus: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  checkstatusButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  activeSchedule: { backgroundColor: "#42b342" },
  inactiveSchedule: { backgroundColor: "#d7f9d7" },
  activeCompleted: { backgroundColor: "#ef5252" },
  inactiveCompleted: { backgroundColor: "#f5dbdb" },
  activeCanceled: { backgroundColor: "#770b26" },
  inactiveCanceled: { backgroundColor: "#decece" },
  checkstatusButtonLabel: {
    fontSize: 18,
  },
  activeLabel: { color: "#ffffff" },
  inactiveLabel: { color: "#333" },
  listItem: {
    marginHorizontal: 20,
    backgroundColor: "#d7f9d7",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  address: {
    marginLeft: 10,
    flex: 1,
  },
  time: {
    marginLeft: 20,
    marginTop: -15,
  },
  category: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    marginLeft: 20,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  scheduleButton: {
    textAlign: "center",
    marginBottom: 50,
    backgroundColor: "#42b342",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 40,
    borderRadius: 10,
    fontSize: 18,
    color: "#fff",
    marginTop: 30,
  },
});

export default CheckStatus;
