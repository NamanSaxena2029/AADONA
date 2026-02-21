import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { storage, auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trash2, Edit, LogOut, Plus, X, Upload, CheckCircle2, UserPlus, Save, PackagePlus, ArrowLeft } from "lucide-react";
import Navbar from "../../Components/Navbar";
import ProductDetailPage from "../../Components/ProductDetailPage";

const API = "http://localhost:5000/products";

const categories = {
  "Network Switches": {
    "Unmanaged Switches": [],
    "Web Smart Switches": ["Web Smart POE", "Web Smart Non POE"],
    "Fully Managed Switches": ["Managed POE", "Managed Non POE"],
    "Layer 3 Switches": ["POE Switches", "Non POE Switches"],
    "Core Switches": ["POE Switches", "Non POE Switches"],
    "Accessories": ["Essential", "Media Convertors", "Power Supply"]
  },
  "Industrial & Rugged Switches": {
    "Un-Managed PoE": [], "Un-Managed Non PoE": [], "Managed PoE": [], "Managed Non PoE": []
  },
  "Wireless Solutions": {
    "Indoor": ["Business", "Enterprise"], "Outdoor": ["Business", "Enterprise"], "Controller": ["Business", "Enterprise"]
  },
  "Server and Workstations": { "Servers": [], "Workstations": [] },
  "Network Attached Storage": { "Desktop NAS": [], "Rackmount NAS": [] },
  "Surveillance": { "Indoor": [], "Outdoor": [], "NVR": [], "Surveillance": [] }
};

const safeJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON response from server:", text);
    throw new Error(
      `Server returned an unexpected response (HTTP ${res.status}).  ` +
      `Make sure your backend is running on port 5000.`
    );
  }
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "", type: "", category: "", subCategory: "",
    description: "", features: [], extraCategory: "", imageFile: null,
    overview: {}, highlights: [], specifications: {}, datasheet: ""
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) load();
      else navigate("/admin-login");
    });
    return () => unsubscribe();
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

  const extraOptions = (form.category && form.subCategory)
    ? (categories[form.category]?.[form.subCategory] || [])
    : [];

  // ✅ Basic completed check
  const basicCompleted =
    form.name &&
    form.type &&
    form.category &&
    form.subCategory &&
    form.description &&
    (form.imageFile || form.image);

  // ✅ Auto-generate Datasheet PDF from form data
  const generateDatasheetPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const colRight = pageW - margin;
    let y = 20;

    const checkPageEnd = (needed = 10) => {
      if (y + needed > 280) { doc.addPage(); y = 20; }
    };

    // ── Header bar ──
    doc.setFillColor(22, 101, 52); // green-800
    doc.rect(0, 0, pageW, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PRODUCT DATASHEET", margin, 9);
    doc.text(form.category || "", colRight, 9, { align: "right" });

    y = 22;

    // ── Product Name ──
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(form.name || "Product Name", margin, y);
    y += 7;

    // ── Sub info ──
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    const subInfo = [form.subCategory, form.extraCategory, form.type?.toUpperCase()].filter(Boolean).join("  •  ");
    doc.text(subInfo, margin, y);
    y += 5;

    // ── Divider ──
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.line(margin, y, colRight, y);
    y += 8;

    // ── Description ──
    if (form.description) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Description", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(form.description, colRight - margin);
      descLines.forEach(line => { checkPageEnd(); doc.text(line, margin, y); y += 5; });
      y += 3;
    }

    // ── Overview ──
    if (form.overview?.content) {
      checkPageEnd(12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Product Overview", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const ovLines = doc.splitTextToSize(form.overview.content, colRight - margin);
      ovLines.forEach(line => { checkPageEnd(); doc.text(line, margin, y); y += 5; });
      y += 3;
    }

    // ── Key Features ──
    if (form.features?.length > 0) {
      checkPageEnd(12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Key Features", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      form.features.forEach(f => {
        checkPageEnd();
        doc.text(`• ${f}`, margin + 2, y);
        y += 5;
      });
      y += 3;
    }

    // ── Highlights ──
    if (form.highlights?.length > 0) {
      checkPageEnd(12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Highlights", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      form.highlights.forEach(h => {
        checkPageEnd();
        doc.text(`✦ ${h}`, margin + 2, y);
        y += 5;
      });
      y += 3;
    }

    // ── Specifications ──
    if (form.specifications && Object.keys(form.specifications).length > 0) {
      checkPageEnd(14);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Specifications", margin, y);
      y += 6;

      Object.entries(form.specifications).forEach(([catName, rows]) => {
        checkPageEnd(10);
        // Category heading bar
        doc.setFillColor(220, 252, 231); // green-100
        doc.rect(margin, y - 4, colRight - margin, 7, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 101, 52);
        doc.text(catName, margin + 2, y);
        y += 6;

        Object.entries(rows).forEach(([key, value]) => {
          if (!key) return;
          checkPageEnd();
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(40, 40, 40);
          doc.text(key, margin + 3, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          const valLines = doc.splitTextToSize(String(value || ""), 80);
          doc.text(valLines, pageW / 2, y);
          y += valLines.length * 5;
        });
        y += 3;
      });
    }

    // ── Footer ──
    doc.setFillColor(22, 101, 52);
    doc.rect(0, 287, pageW, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Generated Datasheet  |  " + new Date().getFullYear(), margin, 293);

    // Return as Blob
    return doc.output("blob");
  };

  const save = async () => {
    const hasExtraOptions = extraOptions.length > 0;

    if (
      !form.name ||
      !form.type ||
      !form.category ||
      !form.subCategory ||
      !form.description ||
      (hasExtraOptions && !form.extraCategory)
    ) {
      alert("Please fill all required fields");
      return;
    }

    setBtnLoading(true);

    try {
      let imageUrl = form.image;

      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
      }

      if (!imageUrl) {
        alert("Please upload an image");
        return;
      }

      // ✅ Auto-generate Datasheet PDF from form data & upload to Firebase
      let datasheetUrl = form.datasheet || "";
      const pdfBlob = await generateDatasheetPDF();
      const safeName = (form.name || "product").replace(/\s+/g, "_").toLowerCase();
      const pdfRef = ref(storage, `datasheets/${Date.now()}-${safeName}.pdf`);
      await uploadBytes(pdfRef, pdfBlob, { contentType: "application/pdf" });
      datasheetUrl = await getDownloadURL(pdfRef);

      // ✅ Payload with detailed fields included
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        features: form.features,
        image: imageUrl,
        type: form.type,
        category: form.category.trim(),
        subCategory: form.subCategory.trim(),
        extraCategory: hasExtraOptions
          ? form.extraCategory.trim()
          : null,

        // Detailed section
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await safeJson(res);

      if (res.ok) {
        setForm({
          name: "",
          type: "",
          category: "",
          subCategory: "",
          description: "",
          features: [],
          extraCategory: "",
          imageFile: null,
          datasheetFile: null,
          overview: {},
          highlights: [],
          specifications: {},
          datasheet: ""
        });

        setEditingId(null);
        load();

        alert(editingId ? "Updated ✅" : "Added ✅");
      } else {
        alert(
          "Server Error: " +
            (result.message || result.error || "Unknown error")
        );
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
      if (res.ok) {
        load();
      } else {
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
      datasheet: p.datasheet || ""
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createAdmin = async () => {
    if (!adminEmail || !adminPassword) {
      alert("Enter email & password");
      return;
    }
    setAdminBtnLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("http://localhost:5000/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await safeJson(res);
      if (res.ok) {
        alert(data.message || "Admin created ✅");
        setAdminEmail("");
        setAdminPassword("");
        setShowAdminForm(false);
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

  const inputStyle = "w-full border border-green-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition bg-white";

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-green-700 font-bold italic">
      Verifying Admin Access...
    </div>
  );

  // const ProductAdminForm = () => {
  //   const [formData, setFormData] = useState({
  //     model: '',
  //     fullName: '',
  //     category: '',
  //     series: '',
  //     description: '',
  //     mainImage: '',
  //     highlights: [''],
  //     overview: { title: 'Product Overview', content: '' },
  //     features: [{ iconType: 'wifi', title: '', description: '' }],
  //     specifications: {
  //       'Hardware Specifications': { '': '' }
  //     }
  //   });

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData(prev => ({ ...prev, [name]: value }));
  //   };

  //   const handleHighlightChange = (index, value) => {
  //     const newHighlights = [...formData.highlights];
  //     newHighlights[index] = value;
  //     setFormData(prev => ({ ...prev, highlights: newHighlights }));
  //   };

  //   const addHighlight = () => setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));

  //   const handleFeatureChange = (index, field, value) => {
  //     const newFeatures = [...formData.features];
  //     newFeatures[index][field] = value;
  //     setFormData(prev => ({ ...prev, features: newFeatures }));
  //   };

  //   const addFeatureDetail = () => setFormData(prev => ({
  //     ...prev,
  //     features: [...prev.features, { iconType: 'wifi', title: '', description: '' }]
  //   }));

  //   const handleSpecChange = (category, oldKey, newKey, value) => {
  //     const newSpecs = { ...formData.specifications };
  //     if (oldKey !== newKey) {
  //       delete newSpecs[category][oldKey];
  //     }
  //     newSpecs[category][newKey] = value;
  //     setFormData(prev => ({ ...prev, specifications: newSpecs }));
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     console.log('Final JSON for Backend:', JSON.stringify(formData, null, 2));
  //     alert('Data logged to console!');
  //   };

    // return (
  //     <div className="max-w-4xl mx-auto">
  //       <button 
  //         onClick={() => setShowProductForm(false)}
  //         className="flex items-center gap-2 text-green-700 font-bold hover:text-green-900 transition mb-6"
  //       >
  //         <ArrowLeft size={20} /> Back to Dashboard
  //       </button>

  //       <div className="p-8 bg-white shadow-xl rounded-xl border border-gray-100 mb-10">
  //         <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Detailed Product Specifications</h2>
  //         <form onSubmit={handleSubmit} className="space-y-8">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div>
  //               <label className="block text-sm font-semibold text-gray-700">Model Name (e.g., ASW-1200)</label>
  //               <input type="text" name="model" onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
  //             </div>
  //             <div>
  //               <label className="block text-sm font-semibold text-gray-700">Full Display Name</label>
  //               <input type="text" name="fullName" onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
  //             </div>
  //             <div>
  //               <label className="block text-sm font-semibold text-gray-700">Category</label>
  //               <input type="text" name="category" onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
  //             </div>
  //             <div>
  //               <label className="block text-sm font-semibold text-gray-700">Series Badge</label>
  //               <input type="text" name="series" onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
  //             </div>
  //           </div>

  //           <div className="bg-gray-50 p-6 rounded-lg">
  //             <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
  //               Key Highlights
  //               <button type="button" onClick={addHighlight} className="text-sm bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
  //                 <Plus size={14} /> Add
  //               </button>
  //             </h3>
  //             {formData.highlights.map((h, i) => (
  //               <input key={i} type="text" value={h} onChange={(e) => handleHighlightChange(i, e.target.value)} className="w-full mb-2 p-2 border rounded-md" placeholder="e.g. 1200Mbps Speed" />
  //             ))}
  //           </div>

  //           <div className="bg-gray-50 p-6 rounded-lg">
  //             <h3 className="font-bold text-gray-800 mb-4">Features</h3>
  //             {formData.features.map((feature, i) => (
  //               <div key={i} className="grid grid-cols-3 gap-3 mb-4 p-3 border rounded-md bg-white">
  //                 <select value={feature.iconType} onChange={(e) => handleFeatureChange(i, 'iconType', e.target.value)} className="p-2 border rounded">
  //                   <option value="wifi">Wifi Icon</option>
  //                   <option value="zap">Zap Icon</option>
  //                   <option value="shield">Shield Icon</option>
  //                 </select>
  //                 <input type="text" placeholder="Feature Title" value={feature.title} onChange={(e) => handleFeatureChange(i, 'title', e.target.value)} className="p-2 border rounded" />
  //                 <input type="text" placeholder="Description" value={feature.description} onChange={(e) => handleFeatureChange(i, 'description', e.target.value)} className="p-2 border rounded" />
  //               </div>
  //             ))}
  //             <button type="button" onClick={addFeatureDetail} className="text-green-600 font-semibold flex items-center gap-1 text-sm"><Plus size={16} /> Add Feature</button>
  //           </div>

  //           <div className="bg-gray-50 p-6 rounded-lg">
  //             <h3 className="font-bold text-gray-800 mb-4">Specifications</h3>
  //             {Object.entries(formData.specifications).map(([category, specs]) => (
  //               <div key={category} className="mb-6">
  //                 <h4 className="text-sm font-bold text-green-700 underline mb-2">{category}</h4>
  //                 {Object.entries(specs).map(([key, value], idx) => (
  //                   <div key={idx} className="flex gap-2 mb-2">
  //                     <input type="text" placeholder="Key (e.g. Memory)" value={key} onChange={(e) => handleSpecChange(category, key, e.target.value, value)} className="w-1/2 p-2 border rounded" />
  //                     <input type="text" placeholder="Value (e.g. 128MB)" value={value} onChange={(e) => handleSpecChange(category, key, key, e.target.value)} className="w-1/2 p-2 border rounded" />
  //                   </div>
  //                 ))}
  //               </div>
  //             ))}
  //           </div>

  //           <button type="submit" className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-800 transition-all">
  //             <Save /> Save Product to Database
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // };


  // Related Product Logic
       const saveRelatedProducts = async () => {
  if (!form.relatedCategory || !form.relatedSubCategory) {
    alert("Please select category and subcategory");
    return;
  }

  if (!form.relatedProducts || form.relatedProducts.length === 0) {
    alert("Please select at least one related product");
    return;
  }

  try {
    const token = await auth.currentUser.getIdToken();

    const payload = {
      type: form.relatedType || null,
      category: form.relatedCategory,
      subCategory: form.relatedSubCategory,
      extraCategory: form.relatedExtraCategory || null,
      relatedProducts: form.relatedProducts
    };

    const res = await fetch("http://localhost:5000/save-related-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await safeJson(res);

    if (res.ok) {
      alert("Related products saved successfully ✅");
    } else {
      alert(data.message || "Failed to save related products");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Error saving related products");
  }
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 pt-28 px-4 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-green-800 tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition shadow-md font-semibold"
              >
                <PackagePlus size={18} /> Add New Product
              </button> */}
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition shadow-md font-semibold"
              >
                <UserPlus size={18} /> {showAdminForm ? "Cancel" : "Create Admin"}
              </button>
              <button onClick={() => signOut(auth)} className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition shadow-md font-semibold">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {showProductForm ? (
            <ProductAdminForm />
          ) : (
            <>
              {showAdminForm && (
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-100 mb-8">
                  <h2 className="text-lg font-bold text-green-800 mb-4">Create New Admin</h2>
                  <div className="flex flex-wrap gap-3">
                    <input type="email" placeholder="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className={`${inputStyle} flex-1 min-w-[200px]`} />
                    <input type="password" placeholder="Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={`${inputStyle} flex-1 min-w-[200px]`} />
                    <button onClick={createAdmin} disabled={adminBtnLoading} className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition font-semibold disabled:bg-gray-300">
                      {adminBtnLoading ? "Creating..." : "Create Admin"}
                    </button>
                  </div>
                </div>
              )}

              {/* ===== BASIC PRODUCT FORM ===== */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <select className={inputStyle} value={form.type || ""} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="">Select Type</option>
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </select>
                  <select className={inputStyle} value={form.category || ""} disabled={!form.type} onChange={e => setForm({ ...form, category: e.target.value, subCategory: "", extraCategory: "" })}>
                    <option value="">Category</option>
                    {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className={inputStyle} value={form.subCategory || ""} disabled={!form.category} onChange={e => setForm({ ...form, subCategory: e.target.value, extraCategory: "" })}>
                    <option value="">Sub Category</option>
                    {form.category && Object.keys(categories[form.category]).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {extraOptions.length > 0 && (
                    <select className={`${inputStyle} border-blue-300 bg-blue-50/30`} value={form.extraCategory || ""} onChange={e => setForm({ ...form, extraCategory: e.target.value })}>
                      <option value="">Select Specification</option>
                      {extraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                  <input className={inputStyle} placeholder="Product Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <textarea className={`${inputStyle} md:col-span-2`} rows="2" placeholder="Description" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
                  
                  <div className="md:col-span-2 bg-green-50/50 p-6 rounded-2xl border border-green-200">
                    <label className="block text-sm font-bold text-green-800 mb-3">Key Features (Bullet Points)</label>
                    <div className="flex gap-2 mb-4">
                      <input className={inputStyle} placeholder="Type a feature and press Enter" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
                      <button type="button" onClick={addFeature} className="bg-green-600 text-white px-5 rounded-xl hover:bg-green-700 transition"><Plus /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.features?.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-medium shadow-sm">
                          <span>• {f}</span>
                          <X size={14} className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => removeFeature(i)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-green-800 mb-2">Product Image</label>
                    <input type="file" id="product-img" className="hidden" onChange={e => setForm({ ...form, imageFile: e.target.files[0] })} />
                    <label htmlFor="product-img" className={`flex items-center justify-between w-full border-2 border-dashed rounded-2xl px-5 py-4 cursor-pointer transition-all ${form.imageFile ? "border-green-500 bg-green-50" : "border-green-300 bg-white hover:border-green-500"}`}>
                      <div className="flex items-center gap-3">
                        {form.imageFile ? <CheckCircle2 className="text-green-600" /> : <Upload className="text-gray-400" />}
                        <span className={form.imageFile ? "text-green-800 font-semibold" : "text-gray-400"}>{form.imageFile ? form.imageFile.name : "Click to upload product image"}</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-md">Browse</span>
                    </label>
                  </div>
                </div>

                {/* ===== DETAILED PRODUCT SECTION (shows only when basic is filled) ===== */}
                {basicCompleted && (
                  <div className="mt-12 bg-white p-8 rounded-2xl border border-green-200 shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Step 2</span>
                      Detailed Product Information (New Tab Page)
                    </h2>

                    {/* Overview */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Product Overview (Full Description)
                      </label>
                      <textarea
                        rows="4"
                        className={inputStyle}
                        value={form.overview?.content || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            overview: {
                              title: "Product Overview",
                              content: e.target.value
                            }
                          })
                        }
                        placeholder="Write a detailed product overview..."
                      />
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
                            <X
                              size={14}
                              className="cursor-pointer text-red-400 hover:text-red-600"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  highlights: form.highlights.filter((_, idx) => idx !== i)
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <input
                        className={inputStyle}
                        placeholder="Type highlight and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            e.preventDefault();
                            setForm({
                              ...form,
                              highlights: [
                                ...(form.highlights || []),
                                e.target.value.trim()
                              ]
                            });
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>

                    {/* Specifications — Dynamic Table Builder */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-green-700 mb-4">
                        Specifications (Category Wise)
                      </label>

                      {Object.entries(form.specifications || {}).map(([category, specs], catIndex) => (
                        <div key={catIndex} className="mb-6 border border-green-200 p-5 rounded-xl bg-green-50/60">
                          
                          {/* Category Title Row */}
                          <div className="flex items-center gap-3 mb-4">
                            <input
                              className="flex-1 font-bold text-green-800 bg-white border border-green-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
                              value={category}
                              placeholder="Category Name (e.g. Hardware Specifications)"
                              onChange={(e) => {
                                const newSpecs = { ...form.specifications };
                                const val = newSpecs[category];
                                delete newSpecs[category];
                                newSpecs[e.target.value] = val;
                                setForm({ ...form, specifications: newSpecs });
                              }}
                            />
                            <button
                              type="button"
                              className="text-red-400 hover:text-red-600 transition"
                              title="Remove this category"
                              onClick={() => {
                                const newSpecs = { ...form.specifications };
                                delete newSpecs[category];
                                setForm({ ...form, specifications: newSpecs });
                              }}
                            >
                              <X size={18} />
                            </button>
                          </div>

                          {/* Key-Value Rows */}
                          {Object.entries(specs).map(([key, value], rowIndex) => (
                            <div key={rowIndex} className="flex gap-2 mb-2">
                              <input
                                className="w-5/12 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                                placeholder="Key (e.g. CPU)"
                                value={key}
                                onChange={(e) => {
                                  const newSpecs = { ...form.specifications };
                                  const oldVal = newSpecs[category][key];
                                  // Rebuild preserving order
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
                                placeholder="Value (e.g. Intel Xeon)"
                                value={value}
                                onChange={(e) => {
                                  const newSpecs = { ...form.specifications };
                                  newSpecs[category][key] = e.target.value;
                                  setForm({ ...form, specifications: newSpecs });
                                }}
                              />
                              <button
                                type="button"
                                className="text-red-400 hover:text-red-600 transition"
                                title="Remove row"
                                onClick={() => {
                                  const newSpecs = { ...form.specifications };
                                  delete newSpecs[category][key];
                                  setForm({ ...form, specifications: newSpecs });
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}

                          {/* Add Row Button */}
                          <button
                            type="button"
                            className="mt-3 text-sm text-green-700 font-semibold flex items-center gap-1 hover:text-green-900 transition"
                            onClick={() => {
                              const newSpecs = { ...form.specifications };
                              const newKey = `Key ${Object.keys(newSpecs[category]).length + 1}`;
                              newSpecs[category][newKey] = "";
                              setForm({ ...form, specifications: newSpecs });
                            }}
                          >
                            <Plus size={14} /> Add Row
                          </button>
                        </div>
                      ))}

                      {/* Add Category Button */}
                      <button
                        type="button"
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-sm"
                        onClick={() => {
                          const newCatName = `New Category ${Object.keys(form.specifications || {}).length + 1}`;
                          setForm({
                            ...form,
                            specifications: {
                              ...(form.specifications || {}),
                              [newCatName]: { "": "" }
                            }
                          });
                        }}
                      >
                        <Plus size={16} /> Add Specification Category
                      </button>
                    </div>

                    {/* Datasheet — Auto Generated */}
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
                      <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-bold text-green-800">Datasheet PDF — Auto Generated</p>
                        <p className="text-xs text-gray-500 mt-0.5">When you save this product, a professional PDF datasheet will be automatically created from the information above and stored in Firebase.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== SAVE BUTTON ===== */}
                <div className="flex items-center gap-4 mt-10">
                  <button onClick={save} disabled={btnLoading} className="bg-green-600 text-white px-12 py-3.5 rounded-full hover:bg-green-700 transition font-bold shadow-lg disabled:bg-gray-300">
                    {btnLoading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                  </button>
                  {editingId && (
                    <button onClick={() => { setEditingId(null); setForm({ name: "", type: "", category: "", subCategory: "", description: "", features: [], extraCategory: "", imageFile: null, overview: {}, highlights: [], specifications: {}, datasheet: "" }); }} className="text-gray-400 font-medium hover:text-red-500 transition">Cancel</button>
                  )}
                </div>
              </div>


        {/* Related Product Form */}
<div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 mb-12">
  <h2 className="text-xl font-bold text-green-800 mb-6">
    Related Products Configuration
  </h2>

  <div className="grid md:grid-cols-4 gap-6 mb-6">

    {/* Type (Active / Passive) */}
    <select
      className={inputStyle}
      onChange={(e) =>
        setForm({
          ...form,
          relatedType: e.target.value
        })
      }
      value={form.relatedType || ""}
    >
      <option value="">Select Type</option>
      <option value="active">Active</option>
      <option value="passive">Passive</option>
    </select>

    {/* Category */}
    <select
      className={inputStyle}
      onChange={(e) => {
        setForm({
          ...form,
          relatedCategory: e.target.value,
          relatedSubCategory: "",
          relatedExtraCategory: ""
        });
      }}
      value={form.relatedCategory || ""}
    >
      <option value="">Select Category</option>
      {Object.keys(categories).map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>

    {/* SubCategory */}
    <select
      className={inputStyle}
      disabled={!form.relatedCategory}
      onChange={(e) =>
        setForm({
          ...form,
          relatedSubCategory: e.target.value,
          relatedExtraCategory: ""
        })
      }
      value={form.relatedSubCategory || ""}
    >
      <option value="">Select Sub Category</option>
      {form.relatedCategory &&
        Object.keys(categories[form.relatedCategory]).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
    </select>

    {/* Extra Category */}
    {form.relatedCategory &&
      form.relatedSubCategory &&
      categories[form.relatedCategory][form.relatedSubCategory]?.length > 0 && (
        <select
          className={inputStyle}
          onChange={(e) =>
            setForm({ ...form, relatedExtraCategory: e.target.value })
          }
          value={form.relatedExtraCategory || ""}
        >
          <option value="">Select Extra Category</option>
          {categories[form.relatedCategory][form.relatedSubCategory].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
  </div>

  {/* Product Multi Select */}
  <div>
    <label className="block text-sm font-semibold text-green-700 mb-3">
      Select Related Products
    </label>

    <div className="grid md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-green-200 rounded-xl p-4 bg-green-50/40">
      {products.map((product) => (
        <div
          key={product._id}
          onClick={() => {
            const current = form.relatedProducts || [];
            const exists = current.includes(product._id);
            setForm({
              ...form,
              relatedProducts: exists
                ? current.filter((id) => id !== product._id)
                : [...current, product._id]
            });
          }}
          className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium border transition ${
            (form.relatedProducts || []).includes(product._id)
              ? "bg-green-600 text-white border-green-600"
              : "bg-white hover:bg-green-100 border-green-200"
          }`}
        >
          {product.name}
        </div>
      ))}
    </div>
  </div>

  {/* Save Button */}
<div className="mt-6 flex justify-center">
  <button
    type="button"
    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
    onClick={saveRelatedProducts}
  >
    Save Related Products
  </button>
</div>
</div>
              {/* ===== PRODUCTS TABLE ===== */}
              <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
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
                    <tbody className="divide-y divide-gray-50">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-green-50/40 transition group">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <img src={p.image} alt={p.name} className="h-14 w-14 object-contain rounded-xl border p-1 bg-white shadow-sm" />
                              <div>
                                <div className="font-bold text-green-900 group-hover:text-green-600">{p.name}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{p.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="text-sm font-semibold text-gray-700">{p.category}</div>
                            <div className="text-xs text-gray-400 italic">{p.subCategory}</div>
                          </td>
                          <td className="p-5 text-center">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-100">
                              {p.features?.length || 0} Bullets
                            </span>
                          </td>
                          <td className="p-5 text-center">
                            <div className="flex justify-center gap-3">
                              <button onClick={() => edit(p)} className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition shadow-sm"><Edit size={18} /></button>
                              <button onClick={() => del(p._id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition shadow-sm"><Trash2 size={18} /></button>
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
        </div>
      </div>
    </>
  );
}