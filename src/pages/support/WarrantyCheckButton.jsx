import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

const WarrantyCheckButton = () => {
  const [fileName, setFileName] = useState("Choose file");
  const [form, setForm] = useState({
    serialNumber: "", purchaseDate: "", placeOfPurchase: "",
    email: "", phone: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-warranty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoiceFileName: fileName !== "Choose file" ? fileName : "-" }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setForm({ serialNumber: "", purchaseDate: "", placeOfPurchase: "", email: "", phone: "" });
        setFileName("Choose file");
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-green-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none px-4 py-3 text-lg transition duration-300";

  return (
    <div className="min-h-screen">
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
      >
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Enter Details of Your Product
              </h1>
              <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
                Please provide the serial number and invoice to check your warranty status.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10">
          <div
            className="rounded-3xl p-8 shadow-xl border border-white/20"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "saturate(120%) blur(6px)" }}
          >
            {/* ✅ Success Message */}
            {submitted && (
              <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl px-6 py-5 text-center font-semibold text-lg mb-6">
                ✅ Warranty check submitted successfully! Our team will get back to you soon.
              </div>
            )}

            {!submitted && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Serial Number */}
                <div>
                  <label className="text-green-700 font-semibold block text-lg">
                    Enter Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={form.serialNumber}
                    onChange={handleChange}
                    placeholder="Enter serial number"
                    required
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                {/* Invoice Upload + Date/Place */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-green-700 font-semibold block text-lg">
                      Upload Invoice (Max 15MB)
                    </label>
                    <div className="relative flex items-center justify-between border border-green-300 rounded-xl px-4 py-3 mt-2 hover:border-green-500 cursor-pointer transition-all">
                      <span className="text-slate-600 truncate">{fileName}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l-4-4m0 0l-4 4m4-4v12M20 16a4 4 0 00-4-4H8a4 4 0 00-4 4" />
                      </svg>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "Choose file")}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="text-sm mt-1 text-slate-500">Supported: PDF / JPG / PNG — max 15MB</p>
                  </div>

                  <div>
                    <label className="text-green-700 font-semibold block text-lg">
                      Invoice / Purchase Date (optional)
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={form.purchaseDate}
                      onChange={handleChange}
                      className={`mt-2 mb-3 ${inputClass}`}
                    />
                    <label className="text-green-700 font-semibold block text-lg mt-3">
                      Place of Purchase (optional)
                    </label>
                    <input
                      type="text"
                      name="placeOfPurchase"
                      value={form.placeOfPurchase}
                      onChange={handleChange}
                      placeholder="e.g., Authorized reseller or store name"
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-green-700 font-semibold block text-lg">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className="text-green-700 font-semibold block text-lg">Phone (optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Mobile number"
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-10 py-4 font-semibold shadow-xl hover:shadow-2xl hover:shadow-green-300/50 hover:bg-green-700 transition-all duration-500 ease-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WarrantyCheckButton;