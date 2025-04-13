import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";

const Schedule = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [taluk, setTaluk] = useState("");
  const [pincode, setPincode] = useState("");
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState("");
  const { globalId, setGlobalId } = useContext(GlobalContext);

  async function handleSubmit() {
    if (!fullAddress || !taluk || !pincode || !weight || !category) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      console.log(globalId);
      const resget = await axios.get(
        `http://10.10.49.163:3000/api/v1/user/${globalId}`
      );
      const phoneNumber = resget.data.phone;
      const customerName = resget.data.name;
      const orders = Array.isArray(resget.data.order) ? resget.data.order : [];
      console.log(orders);

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      await axios.put(`http://10.10.49.163:3000/api/v1/user/${globalId}`, {
        order: [
          ...orders,
          {
            name: customerName,
            date: formattedDate,
            address: fullAddress,
            landmark: taluk,
            time: "pending",
            pincode,
            weight,
            category,
            price: 200,
            phone: phoneNumber,
            status: "pending",
          },
        ],
      });
      Alert.alert("Success", "Pickup Scheduled Successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to schedule pickup. Try again later.");
    }
  }

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
    if (cities.includes(fullAddress.trim())) setChooseWeigth(true);
    else setChooseWeigth(false);
  }, [fullAddress]);

  const [chooseWeigth, setChooseWeigth] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("User")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Schedule a PickUp</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Enter Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "default" : "spinner"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Full Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Address"
          value={fullAddress.trim()}
          onChangeText={setFullAddress}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Taluk *"
            value={taluk}
            onChangeText={setTaluk}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Pincode *"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />
        </View>

        <Text style={styles.label}>Estimated Weight *</Text>
        {chooseWeigth ? (
          <Picker
            selectedValue={weight}
            onValueChange={setWeight}
            style={styles.picker}
          >
            <Picker.Item label="Select Weight" value="0" />
            <Picker.Item label="Less than 5kg" value="5" />
            <Picker.Item label="5-10kg" value="10" />
            <Picker.Item label="10-20kg" value="20" />
          </Picker>
        ) : (
          <Picker
            selectedValue={weight}
            onValueChange={setWeight}
            style={styles.picker}
          >
            <Picker.Item label="20-25kg" value="25" />
            <Picker.Item label="More than 25kg" value="30" />
          </Picker>
        )}

        <Text style={styles.label}>Category of Waste *</Text>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Plastic" value="plastic" />
          <Picker.Item label="Glass" value="glass" />
          <Picker.Item label="Metal" value="metal" />
          <Picker.Item label="Electronics" value="electronics" />
          <Picker.Item label="Others" value="others" />
        </Picker>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>SCHEDULE A PICKUP</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          To view the scheduled pickups click{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("CheckStatus")}
          >
            Check My Pickups
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6faf5", padding: 20 },
  backButton: { marginBottom: 10, marginTop: 20, marginLeft: 20 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 15,
    marginRight: 10,
    color: "#2e7d32",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#2e7d32", marginTop: 15 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#1B5E20",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  picker: {
    backgroundColor: "#fff",
    borderColor: "#1B5E20",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footerText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },
  linkText: {
    color: "#2e7d32",
    fontWeight: "600",
  },
});

export default Schedule;
