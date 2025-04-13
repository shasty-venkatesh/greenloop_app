import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const { globalId, setGlobalId } = useContext(GlobalContext);

  const roleOptions = [
    {
      id: "customer",
      label: "Customer",
      value: "Customer",
      size: 20,
      labelStyle: { marginHorizontal: -10, fontSize: 14 },
    },
    {
      id: "shopkeeper",
      label: "Shopkeeper",
      value: "Shopkeeper",
      size: 20,
      labelStyle: { marginHorizontal: -10, fontSize: 14 },
    },
    {
      id: "company",
      label: "Company",
      value: "Company",
      size: 20,
      labelStyle: { marginHorizontal: -10, fontSize: 14 },
    },
  ];

  async function handleCustomer() {
    try {
      const res = await axios.get("http://10.10.49.163:3000/api/v1/user");
      const data = res.data;
      console.log(data);
      const matchedCustomer = data.find(
        (user) => user.email === email && user.password === password
      );
      if (!matchedCustomer) {
        alert("Invalid Email and password for customer");
      } else {
        alert("Login successfully for customer");
        await setGlobalId(matchedCustomer._id);
        navigation.navigate("User");
      }
    } catch (err) {
      alert("Login failed for customer");
    }
  }

  async function handleWorker() {
    try {
      console.log("hello world");
      const res = await axios.get("http://10.10.49.163:3000/api/v1/worker");
      const data = res.data;
      console.log(data);
      const matchedWorker = data.find(
        (user) => user.email === email && user.password === password
      );
      if (!matchedWorker) {
        alert("Invalid Email and password for worker");
      } else {
        alert("Login successfully for worker");
        await setGlobalId(matchedWorker._id);
        navigation.navigate("WorkerTab");
      }
    } catch (err) {
      alert("Login failed for worker");
    }
  }

  async function handleCompany() {
    try {
      const res = await axios.get("http://10.10.49.163:3000/api/v1/company");
      const data = res.data;
      console.log(data);
      const matchedCompany = data.find(
        (user) => user.email === email && user.password === password
      );
      if (!matchedCompany) {
        alert("Invalid Email and password for Company");
      } else {
        alert("Login successfully for Company");
        await setGlobalId(matchedCompany._id);
        navigation.navigate("CompanyHome");
      }
    } catch (err) {
      alert("Login failed for Company");
    }
  }

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
    setEmail(text);
  };

  const validatePassword = (text) => {
    if (!text) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
    setPassword(text);
  };

  const handleLogin = () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!role) {
      setRoleError("Role selection is required");
      valid = false;
    }

    if (!valid) return;

    if (role === "Customer") {
      handleCustomer();
    } else if (role === "Shopkeeper") {
      handleWorker();
    } else if (role === "Company") {
      handleCompany();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Please enter your details to login.</Text>

      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Password"
        value={password}
        onChangeText={validatePassword}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <RadioGroup
        radioButtons={roleOptions}
        onPress={(selectedRole) => {
          const selectedValue = roleOptions.find(
            (option) => option.id === selectedRole
          )?.value;
          setRole(selectedValue);
          setRoleError("");
        }}
        selectedId={roleOptions.find((option) => option.value === role)?.id}
        containerStyle={styles.radioGroup}
      />
      {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        New to One! Just
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}> Register only for user</Text>
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
    marginTop: 10,
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
    paddingTop: 23,
  },
});

export default Login;
