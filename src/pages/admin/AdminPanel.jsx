import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { storage, auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trash2, Edit, LogOut, Plus, X, Upload, CheckCircle2, UserPlus, Save, PackagePlus, ArrowLeft } from "lucide-react";
import Navbar from "../../Components/Navbar";
import ProductDetailPage from "../../Components/ProductDetailPage";
import Footer from "../../Components/Footer";

const API = `${import.meta.env.VITE_API_URL}/products`;
const BLOG_API = `${import.meta.env.VITE_API_URL}/blogs`;  // ✅ BLOG API

// ===== Utility: Generate URL-friendly slug =====
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const categories = {
  "Network Switches": {
    "Unmanaged Switches": [],
    "Web Smart Switches": ["Web Smart POE", "Web Smart Non POE"],
    "Fully Managed Switches": ["Managed POE", "Managed Non POE"],
    "Layer 3 Switches": ["POE Switches", "Non POE Switches"],
    "Core Switches": ["POE Switches", "Non POE Switches"],
    "Accessories": ["Essential", "Media Convertors", "Power Supply"]
  },
  "Industrial Switches": {
    "Un-Managed PoE": [],
    "Un-Managed Non PoE": [],
    "Managed PoE": [],
    "Managed Non PoE": []
  },
  "Wireless Solutions": {
    "Indoor": ["Business", "Enterprise"],
    "Outdoor": ["Business", "Enterprise"],
    "Controller": ["Business", "Enterprise"]
  },
  "Server and Workstations": {
    "Servers": [],
    "Workstations": []
  },
  "Network Attached Storage": {
    "Desktop NAS": [],
    "Rackmount NAS": []
  },
  "Surveillance": {
    "Indoor": [],
    "Outdoor": [],
    "NVR": [],
    "Surveillance": []
  },

  // 🔹 Passive Categories
  "Cables": {
    "Copper Cables": [],
    "Fiber Cables": []
  },
  "Racks": {
    "Wall Mount Racks": [],
    "Floor Standing Racks": []
  },
  "Network Accessories": {
    "Patch Panels": [],
    "Face Plates": [],
    "Keystone Jacks": []
  }
};

const safeJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON response from server:", text);
    throw new Error(
      `Server returned an unexpected response (HTTP ${res.status}). ` +
      `Make sure your backend is running on port 5000.`
    );
  }
};

export default function AdminPanel() {
  const navigate = useNavigate();
  
  // ===== TAB STATE =====
  const [activeTab, setActiveTab] = useState("products");
  
  // ===== PRODUCT STATE =====
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "", type: "", category: "", subCategory: "",
    description: "", features: [], extraCategory: "", imageFile: null,
    overview: {}, highlights: [], specifications: {}, datasheet: "",
    relatedType: "", relatedCategory: "", relatedSubCategory: "",
    relatedExtraCategory: "", relatedProducts: []
  });
  const [featureInput, setFeatureInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminBtnLoading, setAdminBtnLoading] = useState(false);
  const [relatedBtnLoading, setRelatedBtnLoading] = useState(false);
  const [relatedSearch, setRelatedSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [filterExtraCategory, setFilterExtraCategory] = useState("");

  // ===== BLOG STATE =====
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    author: "Pinakii Chatterje",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: "3 min read",
    image: "",
    blocks: [],
  });
  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const load = async () => {
    try {
      const res = await fetch(API);
      const data = await safeJson(res);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOAD BLOGS =====
  const loadBlogs = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(BLOG_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeJson(res);
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Blog load error:", err);
    }
  };

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        load();
        loadBlogs();  // ✅ LOAD BLOGS
      } else {
        navigate("/admin-login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ 5 Min Inactivity Logout
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await signOut(auth);
        navigate("/admin-login");
      }, 5 * 60 * 1000); // 5 minutes
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...(form.features || []), featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const extraOptions =
    form.category && form.subCategory
      ? (categories[form.category] || {})[form.subCategory] || []
      : [];

  const basicCompleted =
    form.name && form.type && form.category &&
    form.subCategory && form.description &&
    (form.imageFile || form.image);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(relatedSearch.toLowerCase())
  );

  const safeCategories = categories || {};

  const categoryFilteredProducts = products.filter((p) => {
    if (filterType && p.type !== filterType) return false;
    if (filterCategory && p.category !== filterCategory) return false;
    if (filterSubCategory && p.subCategory !== filterSubCategory) return false;
    if (filterExtraCategory && p.extraCategory !== filterExtraCategory) return false;
    return true;
  });

  const generateDatasheetPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const colRight = pageW - margin;
    let y = 20;

    const checkPageEnd = (needed = 10) => {
      if (y + needed > 280) { doc.addPage(); y = 20; }
    };

    doc.setFillColor(22, 101, 52);
    doc.rect(0, 0, pageW, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PRODUCT DATASHEET", margin, 9);
    doc.text(form.category || "", colRight, 9, { align: "right" });
    y = 22;

    doc.setTextColor(22, 101, 52);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(form.name || "Product Name", margin, y);
    y += 7;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    const subInfo = [form.subCategory, form.extraCategory, form.type?.toUpperCase()].filter(Boolean).join("  •  ");
    doc.text(subInfo, margin, y);
    y += 5;

    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.line(margin, y, colRight, y);
    y += 8;

    if (form.description) {
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30);
      doc.text("Description", margin, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(form.description, colRight - margin);
      descLines.forEach(line => { checkPageEnd(); doc.text(line, margin, y); y += 5; });
      y += 3;
    }

    if (form.overview?.content) {
      checkPageEnd(12);
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30);
      doc.text("Product Overview", margin, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      const ovLines = doc.splitTextToSize(form.overview.content, colRight - margin);
      ovLines.forEach(line => { checkPageEnd(); doc.text(line, margin, y); y += 5; });
      y += 3;
    }

    if (form.features?.length > 0) {
      checkPageEnd(12);
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30);
      doc.text("Key Features", margin, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      form.features.forEach(f => { checkPageEnd(); doc.text(`• ${f}`, margin + 2, y); y += 5; });
      y += 3;
    }

    if (form.highlights?.length > 0) {
      checkPageEnd(12);
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30);
      doc.text("Highlights", margin, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      form.highlights.forEach(h => { checkPageEnd(); doc.text(`✦ ${h}`, margin + 2, y); y += 5; });
      y += 3;
    }

    if (form.specifications && Object.keys(form.specifications).length > 0) {
      checkPageEnd(14);
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30);
      doc.text("Specifications", margin, y); y += 6;

      Object.entries(form.specifications).forEach(([catName, rows]) => {
        checkPageEnd(10);
        doc.setFillColor(220, 252, 231);
        doc.rect(margin, y - 4, colRight - margin, 7, "F");
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(22, 101, 52);
        doc.text(catName, margin + 2, y); y += 6;

        Object.entries(rows).forEach(([key, value]) => {
          if (!key) return;
          checkPageEnd();
          doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(40, 40, 40);
          doc.text(key, margin + 3, y);
          doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
          const valLines = doc.splitTextToSize(String(value || ""), 80);
          doc.text(valLines, pageW / 2, y);
          y += valLines.length * 5;
        });
        y += 3;
      });
    }

    doc.setFillColor(22, 101, 52);
    doc.rect(0, 287, pageW, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("Generated Datasheet  |  " + new Date().getFullYear(), margin, 293);

    return doc.output("blob");
  };

  const save = async () => {
    const hasExtraOptions = extraOptions.length > 0;

    if (!form.name || !form.type || !form.category || !form.subCategory ||
      !form.description || (hasExtraOptions && !form.extraCategory)) {
      alert("Please fill all required fields");
      return;
    }

    setBtnLoading(true);

    try {
      let imageUrl = form.image;
      if (form.imageFile) imageUrl = await uploadImage(form.imageFile);

      if (!imageUrl) { alert("Please upload an image"); return; }

      let datasheetUrl = form.datasheet || "";
      const pdfBlob = await generateDatasheetPDF();
      const safeName = (form.name || "product").replace(/\s+/g, "_").toLowerCase();
      const pdfRef = ref(storage, `datasheets/${Date.now()}-${safeName}.pdf`);
      await uploadBytes(pdfRef, pdfBlob, { contentType: "application/pdf" });
      datasheetUrl = await getDownloadURL(pdfRef);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        features: form.features,
        image: imageUrl,
        type: form.type,
        category: form.category.trim(),
        subCategory: form.subCategory.trim(),
        extraCategory: hasExtraOptions ? form.extraCategory.trim() : null,
        overview: form.overview || {},
        highlights: form.highlights || [],
        specifications: form.specifications || {},
        datasheet: datasheetUrl
      };

      const token = await auth.currentUser.getIdToken();

      const res = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        }
      );

      const result = await safeJson(res);

      if (res.ok) {
        setForm({
          name: "", type: "", category: "", subCategory: "",
          description: "", features: [], extraCategory: "", imageFile: null,
          overview: {}, highlights: [], specifications: {}, datasheet: "",
          relatedType: "", relatedCategory: "", relatedSubCategory: "",
          relatedExtraCategory: "", relatedProducts: []
        });
        setEditingId(null);
        load();
        alert(editingId ? "Updated ✅" : "Added ✅");
      } else {
        alert("Server Error: " + (result.message || result.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Error saving product");
    } finally {
      setBtnLoading(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) load();
      else {
        const result = await safeJson(res);
        alert("Delete failed: " + (result.message || result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting product");
    }
  };

  const edit = (p) => {
    setForm({
      ...p,
      imageFile: null,
      features: p.features || [],
      overview: p.overview || {},
      highlights: p.highlights || [],
      specifications: p.specifications || {},
      datasheet: p.datasheet || "",
      relatedType: "", relatedCategory: "", relatedSubCategory: "",
      relatedExtraCategory: "", relatedProducts: []
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createAdmin = async () => {
    if (!adminEmail || !adminPassword) { alert("Enter email & password"); return; }
    setAdminBtnLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await safeJson(res);
      if (res.ok) {
        alert(data.message || "Admin created ✅");
        setAdminEmail(""); setAdminPassword(""); setShowAdminForm(false);
      } else {
        alert(data.message || data.error || "Failed to create admin");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error creating admin");
    } finally {
      setAdminBtnLoading(false);
    }
  };

  const saveRelatedProducts = async () => {
    console.log("🔵 saveRelatedProducts clicked");
    console.log("📋 relatedCategory:", form.relatedCategory);
    console.log("📋 relatedSubCategory:", form.relatedSubCategory);
    console.log("📋 relatedProducts:", form.relatedProducts);

    if (!form.relatedCategory || !form.relatedSubCategory) {
      alert("Please select category and subcategory");
      return;
    }

    if (!form.relatedProducts || form.relatedProducts.length === 0) {
      alert("Please select at least one related product");
      return;
    }

    setRelatedBtnLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();

      const payload = {
        type: form.relatedType || null,
        category: form.relatedCategory,
        subCategory: form.relatedSubCategory,
        extraCategory: form.relatedExtraCategory || null,
        relatedProducts: form.relatedProducts
      };

      console.log("🚀 Sending payload:", payload);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/save-related-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log("📡 Response status:", res.status);

      const data = await safeJson(res);
      console.log("📡 Response data:", data);

      if (res.ok) {
        alert("Related products saved successfully ✅");
        setForm({
          ...form,
          relatedType: "", relatedCategory: "", relatedSubCategory: "",
          relatedExtraCategory: "", relatedProducts: []
        });
      } else {
        alert(data.message || "Failed to save related products");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert(err.message || "Error saving related products");
    } finally {
      setRelatedBtnLoading(false);
    }
  };

  // Duplicate Product Logic
  const duplicateProduct = async (product) => {
    const { _id, ...rest } = product;
    const duplicatedProduct = {
      ...rest,
      name: rest.name + " Copy",
    };
    edit(duplicatedProduct);
  };

  // ===== BLOG BLOCK MANAGEMENT =====
  const addTextBlock = () => {
    setBlogForm((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { type: "text", content: "" }],
    }));
  };

  const addImageBlock = () => {
    setBlogForm((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { type: "image", url: "", caption: "" }],
    }));
  };

  const updateBlock = (index, field, value) => {
    setBlogForm((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const deleteBlock = (index) => {
    setBlogForm((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...blogForm.blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlogForm((prev) => ({ ...prev, blocks: newBlocks }));
  };

  const uploadBlockImage = async (e, blockIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `blog-blocks/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      updateBlock(blockIndex, "url", url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const uploadHeroImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `blog-heroes/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setBlogForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Error uploading hero image:", error);
      alert("Failed to upload hero image");
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!blogForm.image) {
      alert("Hero image is required");
      return;
    }
    if (blogForm.blocks.length === 0) {
      alert("Add at least one content block");
      return;
    }

    const slug = generateSlug(blogForm.title);

    try {
      const token = await auth.currentUser?.getIdToken();
      const method = editingBlogId ? "PUT" : "POST";
      const url = editingBlogId ? `${BLOG_API}/${editingBlogId}` : BLOG_API;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...blogForm, slug, published: true }),
      });

      if (res.ok) {
        alert(editingBlogId ? "Blog updated!" : "Blog published!");
        resetBlogForm();
        loadBlogs();
      } else {
        alert("Failed to save blog");
      }
    } catch (err) {
      console.error("Blog submit error:", err);
      alert("Error saving blog");
    }
  };

  const resetBlogForm = () => {
    setBlogForm({
      title: "",
      excerpt: "",
      author: "Pinakii Chatterje",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      readTime: "3 min read",
      image: "",
      blocks: [],
    });
    setEditingBlogId(null);
  };

  const editBlog = (blog) => {
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime,
      image: blog.image,
      blocks: blog.blocks || [],
    });
    setEditingBlogId(blog._id);
    setActiveTab("blogs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`${BLOG_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadBlogs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const inputStyle = "w-full border border-green-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition bg-white";

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-green-700 font-bold italic">
      Verifying Admin Access...
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 pt-28 px-4 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto">

          <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-green-800 tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition shadow-md font-semibold"
              >
                <UserPlus size={18} /> {showAdminForm ? "Cancel" : "Create Admin"}
              </button>
              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition shadow-md font-semibold"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="flex gap-4 border-b mb-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "products"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Product Management
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "blogs"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Blog Management
            </button>
          </div>

          {/* ===== ADMIN FORM ===== */}
          {showAdminForm && (
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-100 mb-8">
              <h2 className="text-lg font-bold text-green-800 mb-4">Create New Admin</h2>
              <div className="flex flex-wrap gap-3">
                <input type="email" placeholder="Admin Email" value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`${inputStyle} flex-1 min-w-[200px]`} />
                <input type="password" placeholder="Password" value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`${inputStyle} flex-1 min-w-[200px]`} />
                <button onClick={createAdmin} disabled={adminBtnLoading}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition font-semibold disabled:bg-gray-300">
                  {adminBtnLoading ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </div>
          )}

          {/* ========================================
             PRODUCT MANAGEMENT TAB
          ======================================== */}
          {activeTab === "products" && (
            <>
              {/* ===== BASIC PRODUCT FORM ===== */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <select className={inputStyle} value={form.type || ""}
                    onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="">Select Type</option>
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </select>

                  <select className={inputStyle} value={form.category || ""} disabled={!form.type}
                    onChange={e => setForm({ ...form, category: e.target.value, subCategory: "", extraCategory: "" })}>
                    <option value="">Category</option>
                    {Object.keys(categories)
                      .filter((c) => {
                        const passiveCategories = ["Cables", "Racks", "Network Accessories"];
                        if (form.type === "passive") {
                          return passiveCategories.includes(c);
                        }
                        if (form.type === "active") {
                          return !passiveCategories.includes(c);
                        }
                        return false;
                      })
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>

                  <select className={inputStyle} value={form.subCategory || ""} disabled={!form.category}
                    onChange={e => setForm({ ...form, subCategory: e.target.value, extraCategory: "" })}>
                    <option value="">Sub Category</option>
                    {form.category &&
                      Object.keys(categories[form.category] || {}).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                  </select>

                  {extraOptions.length > 0 && (
                    <select className={`${inputStyle} border-blue-300 bg-blue-50/30`}
                      value={form.extraCategory || ""}
                      onChange={e => setForm({ ...form, extraCategory: e.target.value })}>
                      <option value="">Select Specification</option>
                      {extraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}

                  <input className={inputStyle} placeholder="Product Name" value={form.name || ""}
                    onChange={e => setForm({ ...form, name: e.target.value })} />

                  <textarea className={`${inputStyle} md:col-span-2`} rows="2" placeholder="Description"
                    value={form.description || ""}
                    onChange={e => setForm({ ...form, description: e.target.value })} />

                  <div className="md:col-span-2 bg-green-50/50 p-6 rounded-2xl border border-green-200">
                    <label className="block text-sm font-bold text-green-800 mb-3">Key Features (Bullet Points)</label>
                    <div className="flex gap-2 mb-4">
                      <input className={inputStyle} placeholder="Type a feature and press Enter"
                        value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
                      <button type="button" onClick={addFeature}
                        className="bg-green-600 text-white px-5 rounded-xl hover:bg-green-700 transition">
                        <Plus />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.features?.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-medium shadow-sm">
                          <span>• {f}</span>
                          <X size={14} className="cursor-pointer text-red-400 hover:text-red-600"
                            onClick={() => removeFeature(i)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-green-800 mb-2">Product Image</label>
                    <input type="file" id="product-img" className="hidden"
                      onChange={e => setForm({ ...form, imageFile: e.target.files[0] })} />
                    <label htmlFor="product-img"
                      className={`flex items-center justify-between w-full border-2 border-dashed rounded-2xl px-5 py-4 cursor-pointer transition-all ${form.imageFile ? "border-green-500 bg-green-50" : "border-green-300 bg-white hover:border-green-500"}`}>
                      <div className="flex items-center gap-3">
                        {form.imageFile ? <CheckCircle2 className="text-green-600" /> : <Upload className="text-gray-400" />}
                        <span className={form.imageFile ? "text-green-800 font-semibold" : "text-gray-400"}>
                          {form.imageFile ? form.imageFile.name : "Click to upload product image"}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-md">Browse</span>
                    </label>
                  </div>
                </div>

                {/* ===== DETAILED PRODUCT SECTION ===== */}
                {basicCompleted && (
                  <div className="mt-12 bg-white p-8 rounded-2xl border border-green-200 shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Step 2</span>
                      Detailed Product Information
                    </h2>

                    {/* Overview */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Product Overview (Full Description)
                      </label>
                      <textarea rows="4" className={inputStyle} value={form.overview?.content || ""}
                        onChange={(e) => setForm({ ...form, overview: { title: "Product Overview", content: e.target.value } })}
                        placeholder="Write a detailed product overview..." />
                    </div>

                    {/* Highlights */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Highlights (For Features Tab)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(form.highlights || []).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-medium shadow-sm">
                            <span>✦ {h}</span>
                            <X size={14} className="cursor-pointer text-red-400 hover:text-red-600"
                              onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) })} />
                          </div>
                        ))}
                      </div>
                      <input className={inputStyle} placeholder="Type highlight and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            e.preventDefault();
                            setForm({ ...form, highlights: [...(form.highlights || []), e.target.value.trim()] });
                            e.target.value = "";
                          }
                        }} />
                    </div>

                    {/* Specifications */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-green-700 mb-4">
                        Specifications (Category Wise)
                      </label>

                      {Object.entries(form.specifications || {}).map(([category, specs], catIndex) => (
                        <div key={catIndex} className="mb-6 border border-green-200 p-5 rounded-xl bg-green-50/60">
                          <div className="flex items-center gap-3 mb-4">
                            <input
                              className="flex-1 font-bold text-green-800 bg-white border border-green-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
                              value={category}
                              placeholder="Category Name"
                              onChange={(e) => {
                                const newSpecs = { ...form.specifications };
                                const val = newSpecs[category];
                                delete newSpecs[category];
                                newSpecs[e.target.value] = val;
                                setForm({ ...form, specifications: newSpecs });
                              }}
                            />
                            <button type="button" className="text-red-400 hover:text-red-600 transition"
                              onClick={() => {
                                const newSpecs = { ...form.specifications };
                                delete newSpecs[category];
                                setForm({ ...form, specifications: newSpecs });
                              }}>
                              <X size={18} />
                            </button>
                          </div>

                          {Object.entries(specs).map(([key, value], rowIndex) => (
                            <div key={rowIndex} className="flex gap-2 mb-2">
                              <input
                                className="w-5/12 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                                placeholder="Key (e.g. CPU)" value={key}
                                onChange={(e) => {
                                  const newSpecs = { ...form.specifications };
                                  const oldVal = newSpecs[category][key];
                                  const rebuilt = {};
                                  Object.entries(newSpecs[category]).forEach(([k, v]) => {
                                    if (k === key) rebuilt[e.target.value] = oldVal;
                                    else rebuilt[k] = v;
                                  });
                                  newSpecs[category] = rebuilt;
                                  setForm({ ...form, specifications: newSpecs });
                                }}
                              />
                              <input
                                className="w-6/12 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                                placeholder="Value (e.g. Intel Xeon)" value={value}
                                onChange={(e) => {
                                  const newSpecs = { ...form.specifications };
                                  newSpecs[category][key] = e.target.value;
                                  setForm({ ...form, specifications: newSpecs });
                                }}
                              />
                              <button type="button" className="text-red-400 hover:text-red-600 transition"
                                onClick={() => {
                                  const newSpecs = { ...form.specifications };
                                  delete newSpecs[category][key];
                                  setForm({ ...form, specifications: newSpecs });
                                }}>
                                <X size={16} />
                              </button>
                            </div>
                          ))}

                          <button type="button"
                            className="mt-3 text-sm text-green-700 font-semibold flex items-center gap-1 hover:text-green-900 transition"
                            onClick={() => {
                              const newSpecs = { ...form.specifications };
                              const newKey = `Key ${Object.keys(newSpecs[category]).length + 1}`;
                              newSpecs[category][newKey] = "";
                              setForm({ ...form, specifications: newSpecs });
                            }}>
                            <Plus size={14} /> Add Row
                          </button>
                        </div>
                      ))}

                      <button type="button"
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-sm"
                        onClick={() => {
                          const newCatName = `New Category ${Object.keys(form.specifications || {}).length + 1}`;
                          setForm({
                            ...form,
                            specifications: { ...(form.specifications || {}), [newCatName]: { "": "" } }
                          });
                        }}>
                        <Plus size={16} /> Add Specification Category
                      </button>
                    </div>

                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
                      <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-bold text-green-800">Datasheet PDF — Auto Generated</p>
                        <p className="text-xs text-gray-500 mt-0.5">When you save this product, a professional PDF datasheet will be automatically created and stored in Firebase.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== SAVE BUTTON ===== */}
                <div className="flex items-center gap-4 mt-10">
                  <button onClick={save} disabled={btnLoading}
                    className="bg-green-600 text-white px-12 py-3.5 rounded-full hover:bg-green-700 transition font-bold shadow-lg disabled:bg-gray-300">
                    {btnLoading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                  </button>
                  {editingId && (
                    <button onClick={() => {
                      setEditingId(null);
                      setForm({
                        name: "", type: "", category: "", subCategory: "",
                        description: "", features: [], extraCategory: "", imageFile: null,
                        overview: {}, highlights: [], specifications: {}, datasheet: "",
                        relatedType: "", relatedCategory: "", relatedSubCategory: "",
                        relatedExtraCategory: "", relatedProducts: []
                      });
                    }} className="text-gray-400 font-medium hover:text-red-500 transition">Cancel</button>
                  )}
                </div>
              </div>

              {/* ===== RELATED PRODUCTS FORM ===== */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 mb-12">
                <h2 className="text-xl font-bold text-green-800 mb-6">
                  Related Products Configuration
                </h2>

                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <select
                    className={inputStyle}
                    value={form.relatedType || ""}
                    onChange={(e) => setForm({ ...form, relatedType: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </select>

                  <select
                    className={inputStyle}
                    value={form.relatedCategory || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        relatedCategory: e.target.value,
                        relatedSubCategory: "",
                        relatedExtraCategory: "",
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {form.relatedType &&
                      Object.keys(categories)
                        .filter((c) => {
                          const passiveCategories = [
                            "Cables",
                            "Racks",
                            "Network Accessories",
                          ];

                          if (form.relatedType === "passive") {
                            return passiveCategories.includes(c);
                          }

                          if (form.relatedType === "active") {
                            return !passiveCategories.includes(c);
                          }

                          return false;
                        })
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                  </select>

                  <select
                    className={inputStyle}
                    disabled={!form.relatedCategory}
                    value={form.relatedSubCategory || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        relatedSubCategory: e.target.value,
                        relatedExtraCategory: "",
                      })
                    }
                  >
                    <option value="">Select Sub Category</option>
                    {form.relatedCategory &&
                      Object.keys(categories[form.relatedCategory]).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>

                  {form.relatedCategory &&
                    form.relatedSubCategory &&
                    categories[form.relatedCategory][form.relatedSubCategory]?.length > 0 && (
                      <select
                        className={inputStyle}
                        value={form.relatedExtraCategory || ""}
                        onChange={(e) =>
                          setForm({ ...form, relatedExtraCategory: e.target.value })
                        }
                      >
                        <option value="">Select Extra Category</option>
                        {categories[form.relatedCategory][form.relatedSubCategory].map(
                          (opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          )
                        )}
                      </select>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-3">
                    Select Related Products ({(form.relatedProducts || []).length} selected)
                  </label>

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={relatedSearch}
                    onChange={(e) => setRelatedSearch(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <div className="grid md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-green-200 rounded-xl p-4 bg-green-50/40">
                    {filteredProducts.map((product) => {
                      const isSelected = (form.relatedProducts || []).includes(product._id);
                      return (
                        <div
                          key={product._id}
                          onClick={() => {
                            const current = form.relatedProducts || [];
                            const exists = current.includes(product._id);
                            const updated = exists
                              ? current.filter((id) => id !== product._id)
                              : [...current, product._id];
                            console.log("🟢 Selected products:", updated);
                            setForm({ ...form, relatedProducts: updated });
                          }}
                          className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium border transition ${
                            isSelected
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white hover:bg-green-100 border-green-200"
                          }`}
                        >
                          {product.name}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    disabled={relatedBtnLoading}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md disabled:bg-gray-300"
                    onClick={saveRelatedProducts}
                  >
                    {relatedBtnLoading ? "Saving..." : "Save Related Products"}
                  </button>
                </div>
              </div>

              {/* ===== PRODUCTS TABLE ===== */}
              <div className="bg-white rounded-3xl shadow-lg border border-green-100 mb-8 overflow-hidden">
                <div className="p-6 border-b border-green-100">
                  <h3 className="text-lg font-bold text-green-800 mb-4">
                    Filter Listed Products
                  </h3>

                  <div className="grid md:grid-cols-4 gap-4">
                    <select
                      className={inputStyle}
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setFilterCategory("");
                        setFilterSubCategory("");
                        setFilterExtraCategory("");
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="active">Active</option>
                      <option value="passive">Passive</option>
                    </select>

                    <select
                      className={inputStyle}
                      disabled={!filterType}
                      value={filterCategory}
                      onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setFilterSubCategory("");
                        setFilterExtraCategory("");
                      }}
                    >
                      <option value="">Select Category</option>
                      {filterType &&
                        Object.keys(safeCategories || {})
                          .filter((c) => {
                            const passiveCategories = ["Cables", "Racks", "Network Accessories"];
                            if (filterType === "passive") {
                              return passiveCategories.includes(c);
                            }
                            if (filterType === "active") {
                              return !passiveCategories.includes(c);
                            }
                            return false;
                          })
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                    </select>

                    <select
                      className={inputStyle}
                      disabled={!filterCategory}
                      value={filterSubCategory}
                      onChange={(e) => {
                        setFilterSubCategory(e.target.value);
                        setFilterExtraCategory("");
                      }}
                    >
                      <option value="">Select Sub Category</option>
                      {filterCategory &&
                        safeCategories?.[filterCategory] &&
                        Object.keys(safeCategories[filterCategory] || {}).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>

                    {filterCategory &&
                      filterSubCategory &&
                      safeCategories?.[filterCategory]?.[filterSubCategory]?.length > 0 && (
                        <select
                          className={inputStyle}
                          value={filterExtraCategory}
                          onChange={(e) => setFilterExtraCategory(e.target.value)}
                        >
                          <option value="">Select Extra Category</option>
                          {(safeCategories?.[filterCategory]?.[filterSubCategory] || []).map(
                            (opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            )
                          )}
                        </select>
                      )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-green-700 text-white">
                      <tr>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest">Product</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest">Category</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-center">Features</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-300">
                      {categoryFilteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-gray-400 italic text-sm">
                            No products found for the selected filters.
                          </td>
                        </tr>
                      )}
                      {categoryFilteredProducts.map((p) => (
                        <tr key={p?._id} className="hover:bg-green-50/40 transition group">
                          <td className="p-5 border-r border-gray-200">
                            <div className="flex items-center gap-4">
                              <img
                                src={p?.image}
                                alt={p?.name}
                                className="h-14 w-14 object-contain rounded-xl border p-1 bg-white shadow-sm"
                              />
                              <div>
                                <div className="font-bold text-green-900 group-hover:text-green-600">
                                  {p?.name}
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  {p?.type}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-5 border-r border-gray-200">
                            <div className="text-sm font-semibold text-gray-700">
                              {p?.category}
                            </div>
                            <div className="text-xs text-gray-400 italic">
                              {p?.subCategory}
                            </div>
                          </td>

                          <td className="p-5 text-center border-r border-gray-200">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-100">
                              {p?.features?.length || 0} Bullets
                            </span>
                          </td>

                          <td className="p-5 text-center">
                            <div className="flex justify-center gap-3 relative">
                              <button
                                onClick={() => edit(p)}
                                className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition shadow-sm">
                                <Edit size={18} />
                              </button>

                              <button
                                onClick={() => del(p?._id)}
                                className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition shadow-sm">
                                <Trash2 size={18} />
                              </button>

                              <div className="relative group/dup">
                                <button
                                  onClick={() => duplicateProduct(p)}
                                  className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition shadow-sm">
                                  📄
                                </button>

                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[11px] px-3 py-1 rounded-lg opacity-0 invisible group-hover/dup:opacity-100 group-hover/dup:visible transition duration-200 whitespace-nowrap">
                                  Edit & Duplicate
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ========================================
             BLOG MANAGEMENT TAB
          ======================================== */}
          {activeTab === "blogs" && (
            <div className="space-y-8">
              {/* Blog Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">
                  {editingBlogId ? "Edit Blog" : "Create New Blog"}
                </h2>
                <form onSubmit={handleBlogSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, title: e.target.value })
                      }
                      className={inputStyle}
                      placeholder="Enter blog title"
                      required
                    />
                    {blogForm.title && (
                      <p className="mt-2 text-sm text-gray-500">
                        URL: /blog/{generateSlug(blogForm.title)}
                      </p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt (Short Description)
                    </label>
                    <textarea
                      value={blogForm.excerpt}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, excerpt: e.target.value })
                      }
                      className={`${inputStyle} h-24 resize-none`}
                      placeholder="Brief summary of the blog"
                      required
                    />
                  </div>

                  {/* Hero Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadHeroImage}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {blogForm.image && (
                      <img
                        src={blogForm.image}
                        alt="Hero preview"
                        className="mt-4 w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Author & Meta */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, author: e.target.value })
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        value={blogForm.date}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, date: e.target.value })
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Read Time -
                      </label>
                      <input
                        type="text"
                        value={blogForm.readTime}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, readTime: e.target.value })
                        }
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Content Blocks Editor */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Blog Content (Blocks)
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addTextBlock}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          + Add Text
                        </button>
                        <button
                          type="button"
                          onClick={addImageBlock}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                        >
                          + Add Image
                        </button>
                      </div>
                    </div>

                    {/* Render Blocks */}
                    <div className="space-y-4">
                      {blogForm.blocks.map((block, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">
                              {block.type === "text" ? "📝 Text Block" : "🖼️ Image Block"}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => moveBlock(index, "up")}
                                disabled={index === 0}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-xs"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBlock(index, "down")}
                                disabled={index === blogForm.blocks.length - 1}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-xs"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteBlock(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {block.type === "text" && (
                            <textarea
                              value={block.content}
                              onChange={(e) =>
                                updateBlock(index, "content", e.target.value)
                              }
                              className={`${inputStyle} h-32 resize-none`}
                              placeholder="Write your content here..."
                            />
                          )}

                          {block.type === "image" && (
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => uploadBlockImage(e, index)}
                                className="block w-full text-sm text-gray-500 mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                              />
                              {block.url && (
                                <img
                                  src={block.url}
                                  alt="Block preview"
                                  className="w-full h-48 object-cover rounded-lg mb-3"
                                />
                              )}
                              <input
                                type="text"
                                value={block.caption || ""}
                                onChange={(e) =>
                                  updateBlock(index, "caption", e.target.value)
                                }
                                className={inputStyle}
                                placeholder="Optional caption..."
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      {blogForm.blocks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No content blocks yet. Click "+ Add Text" or "+ Add Image" to
                          start building your blog.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      {editingBlogId ? "Update Blog" : "Publish Blog"}
                    </button>
                    {editingBlogId && (
                      <button
                        type="button"
                        onClick={resetBlogForm}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Published Blogs List */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Published Blogs</h2>
                <div className="space-y-4">
                  {blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{blog.author}</span>
                            <span>{blog.date}</span>
                            <span>{blog.views} views</span>
                            {blog.blocks && blog.blocks.length > 0 && (
                              <span className="text-green-600 font-medium">
                                ✓ {blog.blocks.length} blocks
                              </span>
                            )}
                          </div>
                          {blog.slug && (
                            <p className="text-xs text-blue-600 mt-2">
                              URL: /blog/{blog.slug}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editBlog(blog)}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No blogs published yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}