const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =============================
   MIDDLEWARE
============================= */

app.use(cors());
app.use(express.json());

/* =============================
   DATABASE
============================= */

// 🔥 Atlas Connection (Preferred)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/minicms";

mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected ✅");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB Error ❌:", err);
});

/* =============================
   MODEL
============================= */

const Product = mongoose.model("Product", {
  name: String,
  description: String,
  slug: String,
  image: String,      
  type: String,
  category: String,
  subCategory: String
});

/* =============================
   ROUTES
============================= */

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// GET ALL
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE
app.get("/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
app.post("/products", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   START
============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});
