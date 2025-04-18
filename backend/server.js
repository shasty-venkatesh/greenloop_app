const express = require("express");
const cors = require("cors");
const db = require("./db/db");
const userSchema = require("./model/userSchema");
const workerSchema = require("./model/workerSchema");
const companySchema = require("./model/companySchema.js");

// require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());


db()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.post("/api/v1/user", async (req, res) => {
  try {
    const user = await userSchema.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

app.get("/api/v1/user", async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/v1/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const users = await userSchema.findById(id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.put("/api/v1/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    console.log(body);

    const userExists = await userSchema.findById(id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await userSchema.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Server error", error });
  }
});

app.get("/api/v1/worker", async (req, res) => {
  try {
    const workers = await workerSchema.find();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/v1/worker/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const workers = await workerSchema.findById(id);
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.put("/api/v1/worker/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    console.log(body);

    const workerExists = await workerSchema.findById(id);
    if (!workerExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedWorker = await workerSchema.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedWorker);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.put("/api/v1/user/worker/:phone", async (req, res) => {
  try {
    let phone = req.params.phone;
    phone = phone.trim().replace(/:/g, "");
    const { order } = req.body;
    console.log(phone);
    if (!phone || !order) {
      return res.status(400).json({ message: "Phone and order data required" });
    }
    console.log("hello world");
    const user = await userSchema.findOne({ phone: phone.trim() });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.order = order;
    await user.save();

    res.status(200).json({ message: "Order updated successfully", user });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/v1/company", async (req, res) => {
  try {
    const company = await companySchema.find();
    // console.log(company);
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
});

app.get("/api/v1/company/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const company = await companySchema.findById(id);
    // console.log(company);
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
});

app.put("/api/v1/company/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const company = await companySchema.findByIdAndUpdate(id, body);
    // console.log(company);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.put("/api/v1/user/worker/company/:phone", async (req, res) => {
  try {
    let phone = req.params.phone.trim().replace(/:/g, "");
    const { grouporder } = req.body;

    console.log("Received phone:", phone);
    console.log("Received grouporder data:", grouporder);

    // Find user by phone
    const user = await workerSchema.findOne({ phone: phone });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's grouporder
    user.grouporder = grouporder;
    await user.save();

    res.status(200).json({ message: "Group order updated successfully", user });
  } catch (error) {
    console.error("Error updating group order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));