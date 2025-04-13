import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Workercard = ({
  name,
  time,
  slot,
  address,
  phoneNumber,
  weight,
  cost,
  category,
  completed,
  canceled,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.workercard}>
        <View style={styles.workerheader}>
          <View style={styles.workerheader1}>
            <Image
              source={require("../../assets/images/Worker/headphone.png")}
              style={styles.personicon}
            />
            <Text style={styles.workername}>{name}</Text>
          </View>
          <View style={styles.workertime}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.slot}>{slot}</Text>
          </View>
        </View>

        <View style={styles.workerbody}>
          <View style={styles.workerRow}>
            <Image
              source={require("../../assets/images/Worker/pin.png")}
              style={styles.icon}
            />
            <Text style={styles.workerdetail}>{address}</Text>
          </View>
          <View style={styles.workerRow}>
            <Image
              source={require("../../assets/images/Worker/telephone.png")}
              style={styles.icon}
            />
            <Text style={styles.workerdetail}>{phoneNumber}</Text>
          </View>
          <View style={styles.workerRow}>
            <Image
              source={require("../../assets/images/Worker/weight-scale.png")}
              style={styles.icon}
            />
            <Text style={styles.workerdetail}>{weight}</Text>
          </View>
          <View style={styles.workerRow}>
            <Image
              source={require("../../assets/images/Worker/cash.png")}
              style={styles.icon}
            />
            <Text style={styles.workerdetail}>₹{cost}</Text>
          </View>
          <View style={styles.workerRow}>
            <Image
              source={require("../../assets/images/Worker/recycleicon.png")}
              style={styles.icon}
            />
            <Text style={styles.workerdetail}>{category}</Text>
          </View>
        </View>
        <View style={styles.workerbutton}>
          <TouchableOpacity style={styles.completed} onPress={completed}>
            <Text style={styles.buttonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={canceled}>
            <Text style={styles.buttonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faf5",
    marginHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  workercard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "rgb(20, 227, 96)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: "100%",
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "rgb(44, 182, 95)",
    alignSelf: "center",
    marginTop: 20,
  },
  workerheader: {
    borderBottomWidth: 1,
    borderBottomColor: "rgb(36, 187, 86)",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
  },
  workerheader1: {
    flexDirection: "row",
    alignItems: "center",
  },
  personicon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  workername: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(81, 80, 80)",
  },
  workertime: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  slot: {
    fontSize: 12,
    color: "#999",
  },
  workerbody: {
    marginTop: 10,
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  workerdetail: {
    fontSize: 16,
    color: "#333",
  },
  workerbutton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  completed: {
    backgroundColor: "rgb(49, 212, 120)",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  cancel: {
    backgroundColor: "rgb(240, 29, 29)",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default Workercard;
