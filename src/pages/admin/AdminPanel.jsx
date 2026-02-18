import { useState, useEffect } from "react";
import { storage, auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trash2, Edit, LogOut, Plus, X, Upload, CheckCircle2 } from "lucide-react";
import Navbar from "../../Components/Navbar";

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
  "Industrial and Rugged Switches": {
    "Un-Managed PoE": [], "Un-Managed Non PoE": [], "Managed PoE": [], "Managed Non PoE": []
  },
  "Wireless Solutions": {
    "Indoor": ["Business", "Enterprise"], "Outdoor": ["Business", "Enterprise"], "Controller": ["Business", "Enterprise"]
  },
  "Servers and Workstations": { "Servers": [], "Workstations": [] },
  "Network Attached Storage": { "Desktop NAS": [], "Rackmount NAS": [] },
  "Surveillance": { "Indoor": [], "Outdoor": [], "NVR": [], "Surveillance": [] }
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    name: "", type: "", category: "", subCategory: "", description: "", features: [] 
  });
  const [featureInput, setFeatureInput] = useState(""); 
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { load(); } 
      else { navigate("/admin-login"); }
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
    const updatedFeatures = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updatedFeatures });
  };

  const save = async () => {
    const hasExtraOptions = form.category && form.subCategory && categories[form.category][form.subCategory]?.length > 0;

    if (!form.name || !form.type || !form.category || !form.subCategory || !form.description || (hasExtraOptions && !form.extraCategory)) {
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
        setBtnLoading(false);
        return;
      }

      const slug = form.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + "-" + Date.now();
      
      const payload = { 
        ...form,
        image: imageUrl,
        slug: editingId ? form.slug : slug,
        extraCategory: form.extraCategory || null,
      };

      const token = await auth.currentUser.getIdToken();

      const res = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setForm({ name: "", type: "", category: "", subCategory: "", description: "", features: [] });
        setEditingId(null);
        load();
        alert(editingId ? "Updated ✅" : "Added ✅");
      } else {
        const result = await res.json();
        alert("Server Error: " + (result.message || result.error));
      }
    } catch (error) {
      console.error(error);
      alert("Error saving product");
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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if(res.ok) load();
    } catch (err) {
      console.error(err);
    }
  };

  const edit = (p) => {
    setForm({ ...p, imageFile: null, features: p.features || [] }); 
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputStyle = "w-full border border-green-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition bg-white";
  const extraOptions = (form.category && form.subCategory) ? categories[form.category][form.subCategory] : [];

  if (loading) return <div className="h-screen flex items-center justify-center text-green-700 font-bold italic">Verifying Admin Access...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 pt-28 px-4 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-extrabold text-green-800 tracking-tight">Admin Dashboard</h1>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition shadow-md font-semibold">
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <select className={inputStyle} value={form.type || ""} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="">Select Type</option>
                <option value="active">Active</option>
                <option value="passive">Passive</option>
              </select>

              <select className={inputStyle} value={form.category || ""} disabled={!form.type} onChange={e => setForm({...form, category: e.target.value, subCategory: "", extraCategory: ""})}>
                <option value="">Category</option>
                {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select className={inputStyle} value={form.subCategory || ""} disabled={!form.category} onChange={e => setForm({...form, subCategory: e.target.value, extraCategory: ""})}>
                <option value="">Sub Category</option>
                {form.category && Object.keys(categories[form.category]).map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {extraOptions.length > 0 && (
                <select className={`${inputStyle} border-blue-300 bg-blue-50/30`} value={form.extraCategory || ""} onChange={e => setForm({...form, extraCategory: e.target.value})}>
                  <option value="">Select Specification</option>
                  {extraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              <input className={inputStyle} placeholder="Product Name" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} />
              
              <textarea className={`${inputStyle} md:col-span-2`} rows="2" placeholder="Description" value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />

              {/* Bullet Features */}
              <div className="md:col-span-2 bg-green-50/50 p-6 rounded-2xl border border-green-200">
                <label className="block text-sm font-bold text-green-800 mb-3">Key Features (Bullet Points)</label>
                <div className="flex gap-2 mb-4">
                  <input className={inputStyle} placeholder="Type a feature and press Enter" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
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

              {/* Custom Image Upload (Hides "No file chosen") */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-green-800 mb-2">Product Image</label>
                <input type="file" id="product-img" className="hidden" onChange={e => setForm({...form, imageFile: e.target.files[0]})} />
                <label htmlFor="product-img" className={`flex items-center justify-between w-full border-2 border-dashed rounded-2xl px-5 py-4 cursor-pointer transition-all ${form.imageFile ? "border-green-500 bg-green-50" : "border-green-300 bg-white hover:border-green-500"}`}>
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

            <div className="flex items-center gap-4 mt-10">
              <button onClick={save} disabled={btnLoading} className="bg-green-600 text-white px-12 py-3.5 rounded-full hover:bg-green-700 transition font-bold shadow-lg disabled:bg-gray-300">
                {btnLoading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && <button onClick={() => {setEditingId(null); setForm({name:"", type:"", category:"", subCategory:"", description:"", features:[]})}} className="text-gray-400 font-medium hover:text-red-500 transition">Cancel</button>}
            </div>
          </div>

          {/* Tabular List Section */}
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
                          <img src={p.image} className="h-14 w-14 object-contain rounded-xl border p-1 bg-white shadow-sm" />
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
                      <td className="p-5">
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
            {products.length === 0 && <div className="p-20 text-center text-gray-400 font-medium italic">No products available in the database.</div>}
          </div>
        </div>
      </div>
    </>
  );
}