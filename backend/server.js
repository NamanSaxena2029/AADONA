const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();

/* =============================
   FIREBASE ADMIN SETUP
============================= */

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/* =============================
   VERIFY TOKEN MIDDLEWARE
============================= */

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (decodedToken.admin !== true) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("TOKEN ERROR:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* =============================
   MIDDLEWARE
============================= */

app.use(cors());
app.use(express.json());

/* =============================
   DATABASE (ONLY ATLAS)
============================= */

if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    console.log("Database Name:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌:", err);
  });

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected ✅");
  console.log("Database Name:", mongoose.connection.name);
  console.log("Host:", mongoose.connection.host);
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB Error ❌:", err);
});

/* =============================
   MODEL
============================= */
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] }, // ✅ ADDED THIS FOR POINT-WISE FEATURES
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    extraCategory: { type: String, default: null }, 
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

/* =============================
   ROUTES
============================= */

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", verifyToken, async (req, res) => {
  try {
    console.log("Incoming Product:", req.body);

    const newProduct = await Product.create(req.body);

    console.log("Saved Product:", newProduct);

    res.status(201).json(newProduct);
  } catch (err) {
    console.log("SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/products/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", verifyToken, async (req, res) => {
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