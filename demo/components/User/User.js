import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

function User({ navigation }) {
  const [activeButton, setActiveButton] = useState([true, false]); 
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const apiUrl = "http://10.10.49.163:8000/predict/";
  
  const handleImageProcessing = async (imageUri) => {
      setLoading(true);
      setResult(null);
    
      let formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "uploaded.jpg",
        type: "image/jpeg",
      });
    
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
    
        if (!response.ok) throw new Error("Server Error");
    
        const data = await response.json();
        console.log("Prediction result:", data);
        setResult(data.prediction); 
      } catch (error) {
        console.error("Error while uploading image:", error);
        Alert.alert("Error", "Failed to analyze the image. Please check the server and try again.");
      } finally {
        setLoading(false);
      }
    };
    const pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, 
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
  
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setImage(uri);
          await handleImageProcessing(uri);
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Could not open gallery. Try again.");
      }
    };
  
    const openCamera = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
        return;
      }
  
      try {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, 
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
  
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setImage(uri);
          await handleImageProcessing(uri);
        }
      } catch (error) {
        console.error("Error opening camera:", error);
        Alert.alert("Error", "Could not open camera. Try again.");
      }
    };
  
  return (
    <View style={styles.container}>
      <View style={styles.userHeader}>
        <Text style={styles.title}>User Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.choice}>
        <TouchableOpacity
           style={[styles.button, activeButton[0] ? styles.activeButton : styles.inactiveButton]}
           onPress={() => setActiveButton([true, false])}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton[0] ? styles.activeText : styles.inactiveText,
            ]}
          >
            Sell Scrap
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, activeButton[1] ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setActiveButton([false, true])}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton[1] ? styles.activeText : styles.inactiveText,
            ]}
          >
            Assist You
          </Text>
        </TouchableOpacity>
      </View>

      {activeButton[0] && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.subtitle}>Nice to meet you</Text>
          <Text style={styles.impactText}>Impact made by GreenLoop</Text>
          <Image
            source={require("../../assets/images/User/background.png")}
            style={styles.image}
          />
          <Text style={styles.questionText}>Wish to recycle more?</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Schedule")}
          >
            <Text style={styles.actionText}>Schedule a Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("CheckStatus")}
          >
            <Text style={styles.actionText}>Check my Pickups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("UserDashboard")}
          >
            <Text style={styles.actionText}>User Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
 {activeButton[1] && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.assistTitle}>
            Upload an image, and our AI system will analyze it to suggest disposal methods.
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>Upload Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.uploadButton, { marginTop: 20 }]} onPress={openCamera}>
            <Text style={styles.uploadText}>Open Camera</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}

{image && !loading && (
  <Image source={{ uri: image }} style={styles.uploadedImage} />
)}

{result && (
  <View style={styles.resultContainer}>
    <Text style={styles.resultText}>Prediction: {result.category || "Unknown"}</Text>
    <Text style={styles.resultText}>Suggestion: {result.suggestion || "No suggestion available"}</Text>
  </View>
)}

        </View>
      )}
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
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: "NunitoBold",
    color: "#2e7d32",
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 15,
  },
  choice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 25,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  inactiveButton: {
    backgroundColor: "#d7fcdc",
    borderWidth: 1,
    borderColor: "#1B5E20",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    textAlign: "center",
  },
  activeText: {
    color: "#d7fcdc",
  },
  inactiveText: {
    color: "#2e7d32",
  },
  scheduleContainer: {
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 0,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2e7d32",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  impactText: {
    fontSize: 16,
    color: "#4a4a4a",
    marginBottom: 12,
    textAlign: "left",
    alignSelf: "flex-start",
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#4a4a4a",
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#1B5E20",
    borderWidth: 1,
    borderColor: "#1B5E20",
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
  assistTitle: {
    fontSize: 18,
    color: "#1B5E20",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 30,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadButton: {
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#42b342",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 40,
    borderRadius: 10,
  },
  uploadText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default User;
