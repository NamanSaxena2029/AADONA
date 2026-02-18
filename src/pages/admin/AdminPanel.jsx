import { useState, useEffect } from "react";
import { storage, auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trash2, Edit, LogOut } from "lucide-react";
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
  "Servers and Workstations": {
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
  }
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load products from API
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

  // Auth Listener: Ensures we have a user before doing anything
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        load();
      } else {
        navigate("/admin-login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const save = async () => {
    if (!form.name || !form.type || !form.category || !form.subCategory) {
      alert("Please fill all required fields");
      return;
    }

    try {
      let imageUrl = form.image;
      if (form.image instanceof File) {
        imageUrl = await uploadImage(form.image);
      }

      const slug = form.name.toLowerCase().split(" ").join("-") + "-" + Date.now();
      const payload = { ...form, slug, image: imageUrl };

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
        setForm({});
        setEditingId(null);
        load();
        alert(editingId ? "Updated ✅" : "Added ✅");
      }
    } catch (error) {
      alert("Error saving product");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const edit = (p) => {
    setForm(p);
    setEditingId(p._id);
    window.scrollTo(0, 0);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  const inputStyle = "w-full border border-green-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition";

  if (loading) return <div className="h-screen flex items-center justify-center text-green-700">Loading Dashboard...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 pt-28 px-4 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
            <button onClick={logout} className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition">
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 mb-10">
            <div className="grid md:grid-cols-2 gap-5">
              <select className={inputStyle} value={form.type || ""} onChange={e => setForm({...form, type: e.target.value, category: "", subCategory: ""})}>
                <option value="">Select Type</option>
                <option value="active">Active</option>
                <option value="passive">Passive</option>
              </select>

              <select className={inputStyle} value={form.category || ""} disabled={!form.type} onChange={e => setForm({...form, category: e.target.value, subCategory: ""})}>
                <option value="">Category</option>
                {Object.keys(categories).map(c => <option key={c}>{c}</option>)}
              </select>

              <select className={inputStyle} value={form.subCategory || ""} disabled={!form.category} onChange={e => setForm({...form, subCategory: e.target.value})}>
                <option value="">Sub Category</option>
                {form.category && Object.keys(categories[form.category]).map(s => <option key={s}>{s}</option>)}
              </select>

              <input className={inputStyle} placeholder="Product Name" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} />
              
              <textarea className={`${inputStyle} md:col-span-2`} placeholder="Description" value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">Product Image</label>
                <input type="file" className={inputStyle} onChange={e => setForm({...form, image: e.target.files[0]})} />
              </div>
            </div>

            <button onClick={save} className="mt-6 bg-green-600 text-white px-10 py-3 rounded-full hover:bg-green-700 transition font-bold">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b hover:bg-green-50">
                    <td className="p-4"><img src={p.image} className="w-12 h-12 object-cover rounded" alt="" /></td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-sm text-gray-600">{p.category}</td>
                    <td className="p-4 flex gap-4">
                      <button onClick={() => edit(p)} className="text-blue-600 hover:scale-110 transition"><Edit size={20} /></button>
                      <button onClick={() => del(p._id)} className="text-red-600 hover:scale-110 transition"><Trash2 size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}