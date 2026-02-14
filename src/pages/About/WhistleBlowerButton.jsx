import {React,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

const WhistleBlowerButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
    <>
      <Navbar />

      {/* Full-page CSR-style background */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Hero Section (CSR style) */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              Whistle Blower
            </h1>
            <p className="mt-3 text-green-100 text-lg md:text-xl max-w-3xl mx-auto">
              Report issues confidentially — provide details and upload evidence (optional).
            </p>
          </div>
        </div>

        {/* Content wrapper (no large white card) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          {/* subtle helper box for context */}
          <div className="mb-6 bg-white/60 rounded-xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-teal-900">Whistle Blower Form</h2>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-green-700 transition"
              >
                ← Back
              </button>
            </div>
            <p className="mt-2 text-slate-700">
              If you have confidential information about a policy or compliance issue, please
              share details here. Upload files (PDF/JPG/PNG) as supporting evidence (optional).
            </p>
          </div>

          {/* Form — placed on page (inputs kept white for legibility) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo: whistle blower form submitted (no backend hooked)");
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Details Of Your Product / Issue
              </label>
              <input
                type="text"
                placeholder="Describe the issue briefly"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number (if applicable)
              </label>
              <input
                type="text"
                placeholder="Enter serial number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relevant Numbers / References
              </label>
              <input
                type="text"
                placeholder="Order ID, invoice no., ticket no., etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Evidence</label>
              <div className="flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-xl hover:border-green-500 bg-white/80">
                <div className="text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>

                  <label className="mt-2 inline-flex items-center gap-2 cursor-pointer text-green-700 font-medium">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF / JPG / PNG — max 15MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input
                type="email"
                placeholder="Enter your email (we will keep it confidential)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-8 py-3 font-semibold shadow hover:bg-green-700 transition"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default WhistleBlowerButton;
