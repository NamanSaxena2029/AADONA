import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

const emptyForm = {
  issueDetails: "",
  serialNumber: "",
  references: "",
  email: "",
  evidenceFileName: "",
};

const WhistleBlowerButton = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-whistleblower`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setForm(emptyForm);
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

          {/* Success Message */}
          {submitted && (
            <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl px-6 py-5 text-center font-semibold text-lg mb-6">
              ✅ Report submitted successfully. We will handle it confidentially.
            </div>
          )}

          {/* Form */}
          {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Details Of Your Product / Issue
                </label>
                <input
                  type="text"
                  name="issueDetails"
                  value={form.issueDetails}
                  onChange={handleChange}
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
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={handleChange}
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
                  name="references"
                  value={form.references}
                  onChange={handleChange}
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
                      <span>{form.evidenceFileName || "Upload a file"}</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            evidenceFileName: e.target.files?.[0]?.name || "",
                          }))
                        }
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
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email (we will keep it confidential)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-8 py-3 font-semibold shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default WhistleBlowerButton;