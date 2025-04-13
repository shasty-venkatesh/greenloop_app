import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateName = (text) => {
    if (!text.trim()) {
      setNameError("Name is required");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email format");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePhone = (text) => {
    const phoneRegex = /^[0-9]{10}$/; // Ensures a 10-digit phone number
    if (!text.trim()) {
      setPhoneError("Phone number is required");
      return false;
    } else if (!phoneRegex.test(text)) {
      setPhoneError("Invalid phone number (must be 10 digits)");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const validatePassword = (text) => {
    if (!text.trim()) {
      setPasswordError("Password is required");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = (text) => {
    if (!text.trim()) {
      setConfirmPasswordError("Confirm Password is required");
      return false;
    } else if (text !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleRegister = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    try {
      const response = await axios.post("http://10.10.49.163:3000/api/v1/user", {
        name: name,
        email:email,
        password: password,
        phone: phone,
      });
      console.log(response);
      alert("Successfully registered");
    } catch (err) {
      alert("Error in Register");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started.</Text>

      <TextInput
        style={[styles.input, nameError ? styles.inputError : null]}
        placeholder="Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          validateName(text);
        }}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, phoneError ? styles.inputError : null]}
        placeholder="Phone Number"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          validatePhone(text);
        }}
        keyboardType="phone-pad"
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text);
        }}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TextInput
        style={[styles.input, confirmPasswordError ? styles.inputError : null]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          validateConfirmPassword(text);
        }}
        secureTextEntry
      />
      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Already have an account?
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}> Login here</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6faf5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#25bc25",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
    color: "grey",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#3ab34a",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 10,
  },
  link: {
    color: "green",
    fontWeight: "600",
  },
});

export default Register;
