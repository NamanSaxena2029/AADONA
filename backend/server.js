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
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("TOKEN ERROR:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* =============================
   ADMIN CHECK MIDDLEWARE
============================= */

const requireAdmin = (req, res, next) => {
  if (req.user.admin !== true) {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  next();
};

/* =============================
   MIDDLEWARE
============================= */

app.use(cors());
app.use(express.json());

/* =============================
   DATABASE
============================= */

if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌:", err);
  });

/* =============================
   MODEL
============================= */

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    extraCategory: { type: String, default: null },

    model: { type: String },
    fullName: { type: String },
    series: { type: String },
    highlights: { type: [String], default: [] },
    overview: {
      title: { type: String, default: "Product Overview" },
      content: { type: String },
    },
    featuresDetail: [
      {
        iconType: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    specifications: { type: Map, of: Map },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

/* =============================
   SLUG GENERATOR
============================= */

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

/* =============================
   ROUTES
============================= */

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* -------- GET ALL PRODUCTS -------- */

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- GET SINGLE PRODUCT BY SLUG -------- */

app.get("/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- CREATE PRODUCT -------- */

app.post("/products", verifyToken, requireAdmin, async (req, res) => {
  try {
    console.log("➕ Creating Product:", req.body.name);

    // ✅ Generate slug
    let baseSlug = generateSlug(req.body.name);
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const productData = {
      ...req.body,
      slug,
      extraCategory: req.body.extraCategory ?? null,
      features: Array.isArray(req.body.features)
        ? req.body.features.filter((f) => f.trim() !== "")
        : [],
    };

    const newProduct = await Product.create(productData);

    console.log("✅ Product Saved:", newProduct.slug);
    res.status(201).json(newProduct);
  } catch (err) {
    console.log("CREATE ERROR ❌:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* -------- UPDATE PRODUCT -------- */

app.put("/products/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    console.log("✏️ Updating Product ID:", req.params.id);

    const updateData = {
      ...req.body,
      extraCategory: req.body.extraCategory ?? null,
      features: Array.isArray(req.body.features)
        ? req.body.features.filter((f) => f.trim() !== "")
        : [],
    };

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log("UPDATE ERROR ❌:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* -------- DELETE PRODUCT -------- */

app.delete("/products/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR ❌:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* -------- CREATE ADMIN -------- */

app.post("/create-admin", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    res.json({ message: "New Admin Created ✅" });
  } catch (error) {
    console.log("ADMIN CREATE ERROR ❌:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* =============================
   START
============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});