import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Mail, Lock, LogIn } from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

const inputBase =
  "w-full border border-green-300 rounded-xl px-4 py-3 text-base " +
  "focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔥 Auto redirect if already logged in */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin");
      }
    });

    window.scrollTo(0, 0);

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      /* 🔥 Save login timestamp for inactivity tracking */
      localStorage.setItem("adminLoginTime", Date.now());

      navigate("/admin");
    } catch (err) {
      console.log("Firebase Error Code:", err.code);

      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found. Please check email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/invalid-credential":
          setError("Invalid credentials.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-10 w-full max-w-md border border-green-300">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" /> Email
              </label>
              <input
                type="email"
                className={inputBase}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600" /> Password
              </label>
              <input
                type="password"
                className={inputBase}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-green-600 text-white py-3 font-semibold hover:bg-green-700 transition duration-300 ease-out hover:-translate-y-1 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
