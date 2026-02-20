const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");
const PDFDocument = require("pdfkit"); // ✅ ADDED
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
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log("✅ Token Verified:", decodedToken.email);
    next();
  } catch (error) {
    console.log("❌ TOKEN ERROR:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* =============================
   ADMIN CHECK MIDDLEWARE
============================= */

const requireAdmin = (req, res, next) => {
  if (!req.user.admin) {
    console.log("❌ Not Admin:", req.user.email);
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  console.log("✅ Admin Access Granted");
  next();
};

/* =============================
   MIDDLEWARE
============================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/* =============================
   DATABASE CONNECTION
============================= */

if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    console.log("📂 Connected Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
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
    datasheet: { type: String },

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

    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
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

/* -------- GET SINGLE PRODUCT -------- */

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

/* -------- GENERATE DATASHEET PDF -------- */

app.get("/products/:slug/datasheet", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${product.slug}-datasheet.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(22).font("Helvetica-Bold").text(product.name, {
      align: "center",
    });

    doc.moveDown(2);

    // Overview
    doc.fontSize(16).font("Helvetica-Bold").text("Product Overview");
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(product.overview?.content || product.description, {
        align: "justify",
      });

    doc.moveDown(1.5);

    // Features
    if (product.highlights?.length) {
      doc.fontSize(16).font("Helvetica-Bold").text("Features");
      doc.moveDown(0.5);

      product.highlights.forEach((item) => {
        doc.fontSize(12).font("Helvetica").text("• " + item);
      });

      doc.moveDown(1.5);
    }

    // Specifications
    if (product.specifications && Object.keys(product.specifications).length) {
      doc.fontSize(16).font("Helvetica-Bold").text("Specifications");
      doc.moveDown(0.5);

      Object.entries(product.specifications).forEach(
        ([category, specs]) => {
          doc.fontSize(14).font("Helvetica-Bold").text(category);
          doc.moveDown(0.3);

          Object.entries(specs || {}).forEach(([key, value]) => {
            doc.fontSize(12).font("Helvetica").text(`${key}: ${value}`);
          });

          doc.moveDown(1);
        }
      );
    }

    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Generated automatically from AADONA Product System", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.log("PDF ERROR ❌:", err.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

/* -------- CREATE PRODUCT -------- */

app.post("/products", verifyToken, requireAdmin, async (req, res) => {
  try {
    let baseSlug = generateSlug(req.body.name);
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProduct = await Product.create({
      ...req.body,
      slug,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- UPDATE PRODUCT -------- */

app.put("/products/:id", verifyToken, requireAdmin, async (req, res) => {
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

/* -------- DELETE PRODUCT -------- */

app.delete("/products/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- CREATE ADMIN -------- */

app.post("/create-admin", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    res.json({ message: "New Admin Created ✅" });
  } catch (error) {
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