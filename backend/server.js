const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("./firebaseAdmin");
const PDFDocument = require("pdfkit");
const multer = require("multer");
const transporter = require("./mailer");
require("dotenv").config();

const app = express();

/* =============================
   MULTER SETUP FOR FILE UPLOADS
============================= */

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

/* =============================
   FIREBASE STORAGE HELPER
============================= */

const getFirebasePath = (url) => {
  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/\/o\/(.+?)\?/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

const deleteFromFirebase = async (url) => {
  if (!url) return;
  const path = getFirebasePath(url);
  if (!path) return;
  try {
    await admin.storage().bucket().file(path).delete();
    console.log("🗑️ Firebase file deleted:", path);
  } catch (e) {
    console.log("⚠️ Firebase delete failed:", e.message);
  }
};

/* =============================
   VERIFY TOKEN MIDDLEWARE (with admin check inside)
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

    if (decodedToken.admin !== true) {
      console.log("❌ Not Admin:", decodedToken.email);
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.user = decodedToken;
    console.log("✅ Admin Verified:", decodedToken.email);
    next();
  } catch (error) {
    console.log("❌ TOKEN ERROR:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* =============================
   MIDDLEWARE
============================= */

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/* =============================
   DATABASE CONNECTION
============================= */

if (!process.env.MONGO_URL) {
  console.log("❌ MONGO_URL not found in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    console.log("📂 Connected Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
  });

/* =============================
   MODELS
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

const RelatedProductSchema = new mongoose.Schema(
  {
    type: { type: String, default: null },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    extraCategory: { type: String, default: null },
    relatedProducts: { type: [String], default: [] },
  },
  { timestamps: true }
);

const RelatedProduct = mongoose.model("RelatedProduct", RelatedProductSchema);

/* =============================
   BLOG SCHEMA — ✅ likes + comments added
============================= */

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    author: { type: String, default: "Pinakii Chatterje" },
    date: { type: String },
    readTime: { type: String, default: "3 min read" },
    image: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },                    // ✅ NEW
    published: { type: Boolean, default: true },
    blocks: [
      {
        type: { type: String, enum: ["text", "image"], required: true },
        content: { type: String },
        url: { type: String },
        caption: { type: String },
      },
    ],
    comments: [                                              // ✅ NEW
      {
        name: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

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
  res.send("API Running AUTO DEPLOY TEST 🚀");
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
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- GENERATE DATASHEET PDF -------- */

app.get("/products/:slug/datasheet", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${product.slug}-datasheet.pdf`);
    doc.pipe(res);

    doc.fontSize(22).font("Helvetica-Bold").text(product.name, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(16).font("Helvetica-Bold").text("Product Overview");
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica").text(product.overview?.content || product.description, { align: "justify" });
    doc.moveDown(1.5);

    if (product.highlights?.length) {
      doc.fontSize(16).font("Helvetica-Bold").text("Features");
      doc.moveDown(0.5);
      product.highlights.forEach((item) => {
        doc.fontSize(12).font("Helvetica").text("• " + item);
      });
      doc.moveDown(1.5);
    }

    if (product.specifications && Object.keys(product.specifications).length) {
      doc.fontSize(16).font("Helvetica-Bold").text("Specifications");
      doc.moveDown(0.5);
      Object.entries(product.specifications).forEach(([category, specs]) => {
        doc.fontSize(14).font("Helvetica-Bold").text(category);
        doc.moveDown(0.3);
        Object.entries(specs || {}).forEach(([key, value]) => {
          doc.fontSize(12).font("Helvetica").text(`${key}: ${value}`);
        });
        doc.moveDown(1);
      });
    }

    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray").text("Generated automatically from AADONA Product System", { align: "center" });
    doc.end();
  } catch (err) {
    console.log("PDF ERROR ❌:", err.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

/* -------- CREATE PRODUCT -------- */

app.post("/products", verifyToken, async (req, res) => {
  try {
    let baseSlug = generateSlug(req.body.name);
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProduct = await Product.create({ ...req.body, slug });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- UPDATE PRODUCT -------- */

app.put("/products/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- DELETE PRODUCT -------- */

app.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await deleteFromFirebase(product.image);
    await deleteFromFirebase(product.datasheet);

    await Product.findByIdAndDelete(req.params.id);

    console.log("🗑️ Product deleted:", product.name);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- CREATE ADMIN -------- */

app.post("/create-admin", verifyToken, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    res.json({ message: "New Admin Created ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------- SAVE RELATED PRODUCTS -------- */

app.post("/save-related-products", verifyToken, async (req, res) => {
  console.log("📦 /save-related-products HIT");

  try {
    const { type, category, subCategory, extraCategory, relatedProducts } = req.body;

    if (!category || !subCategory) {
      return res.status(400).json({ message: "category and subCategory are required" });
    }

    if (!relatedProducts || relatedProducts.length === 0) {
      return res.status(400).json({ message: "Select at least one related product" });
    }

    const filter = {
      category,
      subCategory,
      extraCategory: extraCategory || null,
      type: type || null,
    };

    const result = await RelatedProduct.findOneAndUpdate(
      filter,
      {
        $set: {
          type: type || null,
          category,
          subCategory,
          extraCategory: extraCategory || null,
          relatedProducts,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Saved successfully:", result._id);
    res.json({ message: "Related products saved successfully ✅", result });
  } catch (err) {
    console.log("❌ Save Related Products Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* -------- GET RELATED PRODUCTS -------- */

app.get("/related-products", async (req, res) => {
  try {
    const { category, subCategory, extraCategory, type } = req.query;

    const query = { category, subCategory };
    if (extraCategory) query.extraCategory = extraCategory;
    if (type) query.type = type;

    const related = await RelatedProduct.findOne(query);
    if (!related) return res.json({ relatedProducts: [] });

    const products = await Product.find({ _id: { $in: related.relatedProducts } });
    res.json({ relatedProducts: products });
  } catch (err) {
    console.log("❌ Get Related Products Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   BLOG ROUTES
============================= */

/* -------- GET ALL BLOGS (Public) -------- */
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- GET BLOG BY SLUG (Public) -------- */
app.get("/blogs/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- ✅ LIKE BLOG (Public) -------- */
app.post("/blogs/slug/:slug/like", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Email admin
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `❤️ New Like on: "${blog.title}"`,
      html: `<p>Someone liked your blog <b>"${blog.title}"</b>.</p><p>Total likes now: <b>${blog.likes}</b></p>`,
    }).catch(() => {});

    res.json({ likes: blog.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- ✅ ADD COMMENT (Public) -------- */
app.post("/blogs/slug/:slug/comment", async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) return res.status(400).json({ error: "Name and text required" });

    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $push: { comments: { name, text, createdAt: new Date() } } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Email admin
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `💬 New Comment on: "${blog.title}"`,
      html: `
        <h3>New comment on <b>"${blog.title}"</b></h3>
        <p><b>From:</b> ${name}</p>
        <p><b>Comment:</b> ${text}</p>
        <p><small>Total comments: ${blog.comments.length}</small></p>
      `,
    }).catch(() => {});

    res.json({ comments: blog.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- GET BLOG BY ID (Admin) -------- */
app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- CREATE BLOG (Admin) -------- */
app.post("/blogs", verifyToken, async (req, res) => {
  try {
    let baseSlug = generateSlug(req.body.title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await Blog.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const blog = await Blog.create({ ...req.body, slug: finalSlug });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- UPDATE BLOG (Admin) -------- */
app.put("/blogs/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- DELETE BLOG (Admin) -------- */
app.delete("/blogs/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await deleteFromFirebase(blog.image);

    await Blog.findByIdAndDelete(req.params.id);

    console.log("🗑️ Blog deleted:", blog.title);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- SUBMIT PARTNER FORM -------- */

app.post("/submit-partner", async (req, res) => {
  const form = req.body;
  console.log("📧 Partner form received:", form.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Partner Application - ${form.companyName || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New Partner Application</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Company</b></td><td>${form.companyName || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Website</b></td><td>${form.websiteAddress || "-"}</td></tr>
          <tr><td><b>Address</b></td><td>${form.companyAddress || "-"}, ${form.companyCity || ""}, ${form.regionStateProvince || ""}, ${form.postalZip || ""}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Country</b></td><td>${form.country || "-"}</td></tr>
          <tr><td><b>Primary Interest</b></td><td>${form.primaryInterest || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Geographies Served</b></td><td>${form.geographiesServed || "-"}</td></tr>
          <tr><td><b>Annual Revenue</b></td><td>${form.revenueAnnual || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Verticals</b></td><td>${form.verticals || "-"}</td></tr>
          <tr><td><b>Revenue - Private Projects</b></td><td>${form.revenuePrivateProjects || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Revenue - Government</b></td><td>${form.revenueFromGovt || "-"}</td></tr>
          <tr><td><b>Best Describe You</b></td><td>${form.bestDescribeYou || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Details</b></td><td>${form.details || "-"}</td></tr>
        </table>
      `,
    });

    console.log("✅ Partner email sent");
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT PROJECT LOCKING FORM -------- */

app.post("/submit-project-locking", async (req, res) => {
  const form = req.body;
  console.log("📧 Project Locking form received:", form.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Project Locking Request - ${form.projectName || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New Project Locking Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Company</b></td><td>${form.company || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Address</b></td><td>${form.streetAddress || "-"}, ${form.streetAddress2 || ""}, ${form.city || ""}, ${form.regionState || ""}, ${form.postalZip || ""}</td></tr>
          <tr><td><b>Country</b></td><td>${form.country || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Model</b></td><td>${form.modelName || "-"}</td></tr>
          <tr><td><b>Quantity</b></td><td>${form.quantity || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>AADONA Sales</b></td><td>${form.aadonaSales || "-"}</td></tr>
          <tr><td><b>Project Name</b></td><td>${form.projectName || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Project / Tender Name</b></td><td>${form.projectTenderName || "-"}</td></tr>
          <tr><td><b>End Customer Name</b></td><td>${form.endCustomerName || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>End Customer Contact</b></td><td>${form.endCustomerContact || "-"}</td></tr>
          <tr><td><b>Expected Closure</b></td><td>${form.expectedClosure || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>SI Partner Involved</b></td><td>${form.siPartner ? "Yes" : "No"}</td></tr>
        </table>
      `,
    });

    console.log("✅ Project Locking email sent");
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT DEMO REQUEST -------- */

app.post("/submit-demo", async (req, res) => {
  const form = req.body;
  console.log("📧 Demo request received:", form.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Demo Request - ${form.firstName} ${form.lastName}`,
      html: `
        <h2 style="color:#166534">New Demo Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Address</b></td><td>${form.streetAddress || "-"}, ${form.streetAddress2 || ""}, ${form.city || ""}, ${form.regionStateProvince || ""}, ${form.postalZipCode || ""}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Country</b></td><td>${form.country || "-"}</td></tr>
          <tr><td><b>Model Name</b></td><td>${form.modelName || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Customer Type</b></td><td>${(form.customerType || []).join(", ") || "-"}</td></tr>
          <tr><td><b>Comments</b></td><td>${form.comment || "-"}</td></tr>
        </table>
      `,
    });

    console.log("✅ Demo request email sent");
    res.json({ success: true, message: "Demo request submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT TRAINING REQUEST -------- */

app.post("/submit-training", async (req, res) => {
  const form = req.body;
  console.log("📧 Training request received:", form.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Training Request - ${form.firstName} ${form.lastName}`,
      html: `
        <h2 style="color:#166534">New Training Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Company</b></td><td>${form.company || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Number of Participants</b></td><td>${form.numberOfParticipants || "-"}</td></tr>
          <tr><td><b>Training Location</b></td><td>${form.streetAddress || "-"}, ${form.streetAddress2 || ""}, ${form.city || ""}, ${form.regionStateProvince || ""}, ${form.postalZipCode || ""}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Country</b></td><td>${form.country || "-"}</td></tr>
          <tr><td><b>Customer Type</b></td><td>${(form.customerType || []).join(", ") || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Comments</b></td><td>${form.comment || "-"}</td></tr>
        </table>
      `,
    });

    console.log("✅ Training request email sent");
    res.json({ success: true, message: "Training request submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT WARRANTY CHECK (WITH FILE UPLOAD) -------- */

app.post("/submit-warranty", upload.single("invoiceFile"), async (req, res) => {
  const form = req.body;
  console.log("📧 Warranty check received:", form.email);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Warranty Check - Serial: ${form.serialNumber || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New Warranty Check Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Serial Number</b></td><td>${form.serialNumber || "-"}</td></tr>
          <tr><td><b>Purchase Date</b></td><td>${form.purchaseDate || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Place of Purchase</b></td><td>${form.placeOfPurchase || "-"}</td></tr>
        </table>
      `,
    };

    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
      console.log("📎 Attachment added:", req.file.originalname);
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Warranty check email sent");
    res.json({ success: true, message: "Warranty check submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT TECH SQUAD REQUEST (WITH FILE UPLOAD) -------- */

app.post("/submit-techsquad", upload.single("invoiceFile"), async (req, res) => {
  const form = req.body;
  console.log("📧 Tech Squad request received:", form.email);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Tech Squad Request - ${form.firstName} ${form.lastName}`,
      html: `
        <h2 style="color:#166534">New Tech Squad Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Address</b></td><td>${form.address || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Purchase Date</b></td><td>${form.purchaseDate || "-"}</td></tr>
          <tr><td><b>Service Type</b></td><td>${form.serviceType || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Issue Description</b></td><td>${form.issue || "-"}</td></tr>
        </table>
      `,
    };

    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
      console.log("📎 Attachment added:", req.file.originalname);
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Tech Squad email sent");
    res.json({ success: true, message: "Tech Squad request submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT DOA REQUEST (WITH FILE UPLOAD) -------- */

app.post("/submit-doa", upload.single("invoiceFile"), async (req, res) => {
  const form = req.body;
  console.log("📧 DOA request received:", form.email);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New DOA Request - Serial: ${form.serialNumber || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New DOA Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Address</b></td><td>${form.address || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Product Type</b></td><td>${form.productType || "-"}</td></tr>
          <tr><td><b>Purchase Date</b></td><td>${form.purchaseDate || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Warranty Year</b></td><td>${form.warrantyYear || "-"}</td></tr>
          <tr><td><b>Serial Number</b></td><td>${form.serialNumber || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Invoice Number</b></td><td>${form.invoiceNumber || "-"}</td></tr>
          <tr><td><b>DOA Auth Code</b></td><td>${form.doaAuthCode || "-"}</td></tr>
        </table>
      `,
    };

    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
      console.log("📎 Attachment added:", req.file.originalname);
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ DOA request email sent");
    res.json({ success: true, message: "DOA request submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT PRODUCT SUPPORT -------- */

app.post("/submit-product-support", async (req, res) => {
  const form = req.body;
  console.log("📧 Product Support request received:", form.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Product Support Request - ${form.productModel || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New Product Support Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Product Model</b></td><td>${form.productModel || "-"}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Issue / Question</b></td><td>${form.details || "-"}</td></tr>
        </table>
      `,
    });

    console.log("✅ Product Support email sent");
    res.json({ success: true, message: "Support request submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT PRODUCT REGISTRATION (WITH FILE UPLOAD) -------- */

app.post("/submit-product-registration", upload.single("invoiceFile"), async (req, res) => {
  const form = req.body;
  console.log("📧 Product Registration received:", form.email);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Product Registration - Serial: ${form.serialNumber || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New Product Registration</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>City</b></td><td>${form.companyCity || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Region/State</b></td><td>${form.regionStateProvince || "-"}</td></tr>
          <tr><td><b>Postal Code</b></td><td>${form.postalZipCode || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Country</b></td><td>${form.country || "-"}</td></tr>
          <tr><td><b>Serial Number</b></td><td>${form.serialNumber || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Invoice Number</b></td><td>${form.invoiceNumber || "-"}</td></tr>
          <tr><td><b>Purchased From</b></td><td>${form.purchasedFrom || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Purchase Date</b></td><td>${form.purchaseDate || "-"}</td></tr>
        </table>
      `,
    };

    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
      console.log("📎 Attachment added:", req.file.originalname);
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Product Registration email sent");
    res.json({ success: true, message: "Product registered successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT CONTACT FORM -------- */

app.post("/submit-contact", async (req, res) => {
  const form = req.body;
  console.log("📧 Contact form received:", form.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Contact Message - ${form.subject || "Unknown"}`,
      html: `
        <h2 style="color:#166534">New Contact Message</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Subject</b></td><td>${form.subject || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Nature of Business</b></td><td>${form.natureOfBusiness || "-"}</td></tr>
          <tr><td><b>Message</b></td><td>${form.message || "-"}</td></tr>
        </table>
      `,
    });

    console.log("✅ Contact email sent");
    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT APPLY NOW FORM (WITH FILE UPLOAD) -------- */

app.post("/submit-apply", upload.single("resumeFile"), async (req, res) => {
  const form = req.body;
  console.log("📧 Job application received:", form.email);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Job Application - ${form.firstName} ${form.lastName}`,
      html: `
        <h2 style="color:#166534">New Job Application</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.firstName} ${form.lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${form.email}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Phone</b></td><td>${form.phone || "-"}</td></tr>
          <tr><td><b>Availability</b></td><td>${(form.availability || []).join(", ") || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>About</b></td><td>${form.about || "-"}</td></tr>
        </table>
      `,
    };

    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
      console.log("📎 Attachment added:", req.file.originalname);
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Job application email sent");
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* -------- SUBMIT WHISTLE BLOWER FORM (WITH FILE UPLOAD) -------- */

app.post("/submit-whistleblower", upload.single("attachmentFile"), async (req, res) => {
  const form = req.body;
  console.log("📧 Whistle blower report received:", form.name || "Anonymous");

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Whistle Blower Report - ${form.name || "Anonymous"}`,
      html: `
        <h2 style="color:#166534">New Whistle Blower Report</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
          <tr style="background:#f0fdf4"><td><b>Name</b></td><td>${form.name || "-"}</td></tr>
          <tr><td><b>Telephone</b></td><td>${form.telephone || "-"}</td></tr>
          <tr style="background:#f0fdf4"><td><b>Comment</b></td><td>${form.comment || "-"}</td></tr>
        </table>
      `,
    };

    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
      console.log("📎 Attachment added:", req.file.originalname);
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Whistle blower email sent");
    res.json({ success: true, message: "Report submitted successfully" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

/* =============================
   START
============================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});