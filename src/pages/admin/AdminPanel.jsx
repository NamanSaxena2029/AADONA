import { useState, useEffect } from "react";
import { storage, auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trash2, Edit, LogOut } from "lucide-react";
import Navbar from "../../Components/Navbar";

const API = "http://localhost:5000/products";

const categories = {
  "Network Switches": [
    "Unmanaged Switches",
    "Web Smart Switches",
    "Fully Managed Switches",
    "Layer 3 Switches",
    "Core Switches",
    "Accessories"
  ],
  "Industrial & Rugged Switches": [
    "Un-Managed PoE",
    "Un-Managed Non PoE",
    "Managed PoE",
    "Managed Non PoE"
  ],
  "Wireless Solutions": ["Indoor", "Outdoor", "Controller"],
  "Server and Workstations": ["Servers", "Workstations"],
  "Network Attached Storage": ["Desktop NAS", "Rackmount NAS"],
  "Surveillance": ["Indoor", "Outdoor", "NVR"]
};

export default function AdminPanel() {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  /* 🔥 SAVE FUNCTION (FULLY SAFE VERSION) */
  const save = async () => {

    if (!form.name || !form.type || !form.category || !form.subCategory) {
      alert("Please fill all required fields");
      return;
    }

    if (!form.image && !editingId) {
      alert("Image is required");
      return;
    }

    try {
      let imageUrl = form.image;

      // Upload new file if selected
      if (form.image instanceof File) {
        imageUrl = await uploadImage(form.image);
      }

      // 🔥 Auto-generate slug from name
      const slug = form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") + "-" + Date.now();

      const payload = {
        ...form,
        slug,
        image: imageUrl
      };

      console.log("PAYLOAD:", payload);

      const token = await auth.currentUser.getIdToken(true);

      const res = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("SERVER ERROR:", data);
        alert(data.error || "Something went wrong");
        return;
      }

      setForm({});
      setEditingId(null);
      load();

      alert(editingId ? "Product Updated ✅" : "Product Added ✅");

    } catch (error) {
      console.error("SAVE ERROR:", error);
      alert("Unexpected error occurred");
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(
      storage,
      `products/${Date.now()}-${file.name}`
    );
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const del = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken(true);

      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Delete failed");
        return;
      }

      load();
      alert("Deleted ✅");

    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const edit = (p) => {
    setForm(p);
    setEditingId(p._id);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  const inputStyle =
    "w-full border border-green-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pt-28 px-10 pb-10">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-green-800">
            Admin Dashboard
          </h1>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 mb-10">

          <div className="grid md:grid-cols-2 gap-5">

            <select
              className={inputStyle}
              value={form.type || ""}
              onChange={e =>
                setForm({
                  ...form,
                  type: e.target.value,
                  category: "",
                  subCategory: ""
                })
              }
            >
              <option value="">Select Type</option>
              <option value="active">Active</option>
              <option value="passive">Passive</option>
            </select>

            <select
              disabled={!form.type}
              className={inputStyle}
              value={form.category || ""}
              onChange={e =>
                setForm({
                  ...form,
                  category: e.target.value,
                  subCategory: ""
                })
              }
            >
              <option value="">Category</option>
              {Object.keys(categories).map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              disabled={!form.category}
              className={inputStyle}
              value={form.subCategory || ""}
              onChange={e =>
                setForm({ ...form, subCategory: e.target.value })
              }
            >
              <option value="">Sub Category</option>
              {form.category &&
                categories[form.category].map(s => (
                  <option key={s}>{s}</option>
                ))}
            </select>

            <input
              className={inputStyle}
              placeholder="Product Name"
              value={form.name || ""}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              className={inputStyle}
              placeholder="Description"
              value={form.description || ""}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <input
              type="file"
              className={inputStyle}
              onChange={e =>
                setForm({ ...form, image: e.target.files[0] })
              }
            />
          </div>

          <button
            onClick={save}
            className="mt-6 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">

          <table className="w-full text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sub</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b hover:bg-green-50">
                  <td className="p-4">
                    <img src={p.image} height={50} alt="" />
                  </td>
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.type}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">{p.subCategory}</td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => edit(p)} className="text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => del(p._id)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </>
  );
}
