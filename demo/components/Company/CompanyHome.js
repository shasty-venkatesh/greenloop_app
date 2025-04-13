import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import axios from "axios";
import { GlobalContext } from "../GlobalContext";
import ScrapRates from "./Scraprate";
import debounce from "lodash/debounce";
function CompanyHome({ navigation }) {
  const title = [
    "Name",
    "Email",
    "Phone Number",
    "Category",
    "Price",
    "Status",
  ];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { globalId } = useContext(GlobalContext);

  const fetchGroupOrder = useCallback(
    debounce(async () => {
      try {
        const res = await axios.get("http://10.10.49.163:3000/api/v1/worker");
        let grouporder = res.data.flatMap((item) => item.grouporder || []);

        setUsers((prevUsers) =>
          JSON.stringify(prevUsers) !== JSON.stringify(grouporder)
            ? grouporder
            : prevUsers
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchGroupOrder();
    return () => fetchGroupOrder.cancel();
  }, [fetchGroupOrder]);

  const handleOrder = useCallback(
    async (order) => {
      setLoading(true);
      try {
        const resorder = await axios.get(
          `http://10.10.49.163:3000/api/v1/company/${globalId}`
        );
        const remainingOrder =
          resorder.data.order === undefined ? [] : resorder.data.order;
        const confirmOrder = { ...order, sellingStatus: "confirm" };

        await fetchGroupOrder();

        await axios.put(`http://10.10.49.163:3000/api/v1/company/${globalId}`, {
          order: [...remainingOrder, confirmOrder],
        });

        const resworker = await axios.get(
          "http://10.10.49.163:3000/api/v1/worker"
        );
        let worker = resworker.data.find((item) => item.phone === order.phone);

        if (!worker) {
          console.error("Worker not found");
          return;
        }

        const groupOrder = worker.grouporder || [];
        const categoryOrder = groupOrder.filter(
          (item) => item.category === order.category
        );

        if (categoryOrder.length === 0) {
          console.error("Category not found in worker's group order");
          return;
        }

        const categoryOrderPlaced = {
          ...categoryOrder[0],
          sellingStatus: "confirm",
        };
        const remainingGroupOrder = groupOrder.filter(
          (item) => item.category !== order.category
        );
        const groupOrderDetail = [categoryOrderPlaced, ...remainingGroupOrder];

        const sanitizedPhone = categoryOrderPlaced.phone
          .trim()
          .replace(/\s+/g, "")
          .replace(/:/g, "");

        const resworkercompany = await axios.put(
          `http://10.10.49.163:3000/api/v1/user/worker/company/${sanitizedPhone}`,
          {
            grouporder: groupOrderDetail,
          }
        );

        const id = worker._id;
        const response = await axios.get(
          `http://10.10.49.163:3000/api/v1/worker/${id}`
        );

        const companydata = {
          name: resorder.data.name,
          email: resorder.data.email,
          phone: resorder.data.phone,
          address: resorder.data.address,
          landmark: resorder.data.landmark,
          pincode: resorder.data.pincode,
        };

        const groupcompany = response.data.grouporder.map((item) =>
          item.sellingStatus === "confirm"
            ? { ...item, companydata: companydata }
            : item
        );
        console.log(groupcompany);
        await axios.put(`http://10.10.49.163:3000/api/v1/worker/${id}`, {
          grouporder: groupcompany,
        });
        const confirmorderworkerconfirm = response.data.order.map((item) =>
          item.category === order.category
            ? { ...item, companydata: companydata, sellingStatus: "confirm" }
            : item
        );
        await axios.put(`http://10.10.49.163:3000/api/v1/worker/${id}`, {
          order: confirmorderworkerconfirm,
        });
        toast.success("Order Successfull");
      } catch (error) {
        toast.error("Order Failed");
      } finally {
        setLoading(false);
      }
    },
    [globalId, fetchGroupOrder]
  );

  return (
    <View style={styles.container}>
      <View style={styles.workerHeader}>
        <Text style={styles.title}>Hi Company</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.title,
          { fontSize: 20, fontWeight: "500", marginBottom: 10 },
        ]}
      >
        The list of Products
      </Text>
      <ScrollView horizontal style={{width:"100%"}}>
        <ScrollView style={styles.listContainer}>
          <View style={styles.titleRow}>
            {title.map((header, index) => (
              <Text key={index} style={[styles.cell, styles.titleCell]}>
                {header}
              </Text>
            ))}
          </View>

          <FlatList
            data={users}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.userList}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.email}</Text>
                <Text style={styles.cell}>{item.phone}</Text>
                <Text style={styles.cell}>{item.category}</Text>
                <Text style={styles.cell}>₹{item.price}</Text>
                {item.sellingStatus === "pending" ? (
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handleOrder(item)}
                  >
                    <Text style={styles.buyText}>Buy</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.orderText}>Order Placed</Text>
                )}
              </View>
            )}
          />
        </ScrollView>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate("ScrapRates")}>
        <Text>Scrap Rates</Text>
      </TouchableOpacity>
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
  workerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2e7d32",
  },
  logoutButton: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 30,
    justifyContent: "center",
  },
  logoutText: {
    color: "#d7fcdc",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    width: "200%",
  },
  titleRow: {
    flexDirection: "row",
    backgroundColor: "#e8f5e9",
    paddingVertical: 10,
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbb",
  },
  cell: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    marginLeft:-30
  },
  titleCell: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft:50,
  },
  buyButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft:50,
  },
  buyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderText: {
    fontWeight: "600",
    fontSize: 17,
    color: "green",
  },
  userList: {
    paddingBottom: 20,
  },
});

export default CompanyHome;
