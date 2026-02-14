import React, { useState,useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

const WarrantyCheckButton = () => {
  const [fileName, setFileName] = useState("Choose file");


  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Full background (CSR style) */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* HERO SECTION — same styling as CSR */}
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

        {/* Main content wrapper — frosted (semi-transparent) so bg image remains visible */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10">
          <div
            className="rounded-3xl p-8 shadow-xl border border-white/20"
            style={{
              background: "rgba(255,255,255,0.65)", // lighter than full white so bg shows through
              backdropFilter: "saturate(120%) blur(6px)",
            }}
          >
            {/* FORM CONTENT */}
            <div className="space-y-6">
              {/* Serial Number */}
              <div>
                <label className="text-green-700 font-semibold block text-lg">
                  Enter Serial Number
                </label>
                <input
                  type="text"
                  placeholder="Enter serial number"
                  className="w-full mt-2 border border-green-300 rounded-xl
                    focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none
                    px-4 py-3 text-lg transition duration-300"
                />
              </div>

              {/* Invoice Upload + Date/place */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-green-700 font-semibold block text-lg">
                    Upload Invoice (Max 15MB)
                  </label>

                  <div className="relative flex items-center justify-between border border-green-300 rounded-xl px-4 py-3 mt-2
                    hover:border-green-500 cursor-pointer transition-all">
                    <span className="text-slate-600 truncate">{fileName}</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-green-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l-4-4m0 0l-4 4m4-4v12M20 16a4 4 0 00-4-4H8a4 4 0 00-4 4" />
                    </svg>

                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) =>
                        setFileName(e.target.files?.[0]?.name || "Choose file")
                      }
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <p className="text-sm mt-1 text-slate-500">
                    Supported: PDF / JPG / PNG — max 15MB
                  </p>
                </div>

                <div>
                  <label className="text-green-700 font-semibold block text-lg">
                    Invoice / Purchase Date (optional)
                  </label>
                  <input
                    type="date"
                    className="w-full mt-2 mb-3 border border-green-300 rounded-xl
                      focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none
                      px-4 py-3 text-lg transition duration-300"
                  />

                  <label className="text-green-700 font-semibold block text-lg mt-3">
                    Place of Purchase (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Authorized reseller or store name"
                    className="w-full mt-2 border border-green-300 rounded-xl
                      focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none
                      px-4 py-3 text-lg transition duration-300"
                  />
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-green-700 font-semibold block text-lg">Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full mt-2 border border-green-300 rounded-xl
                      focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none
                      px-4 py-3 text-lg transition duration-300"
                  />
                </div>

                <div>
                  <label className="text-green-700 font-semibold block text-lg">Phone (optional)</label>
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    className="w-full mt-2 border border-green-300 rounded-xl
                      focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none
                      px-4 py-3 text-lg transition duration-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white
                    px-10 py-4 font-semibold shadow-xl hover:shadow-2xl hover:shadow-green-300/50
                    hover:bg-green-700 transition-all duration-500 ease-out transform hover:-translate-y-1"
                  type="button"
                  onClick={() => alert("Demo: warranty check submitted (no backend hooked)")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  Submit Application
                </button>
              </div>
            </div>
            {/* end form content */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WarrantyCheckButton;
