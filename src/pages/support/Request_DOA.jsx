import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { ClipboardList, FileWarning, CheckCircle2, UploadCloud, Calendar, Mail, Phone, MapPin, Hash, Send } from "lucide-react";
import bg from "../../assets/bg.jpg";

const Reveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShow(true),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

const liftCard = "rounded-2xl bg-white p-6 shadow-md hover:shadow-2xl hover:shadow-green-200/60 border border-green-300 hover:border-green-500 transition-all duration-500 ease-out hover:-translate-y-1";
const liftSection = "rounded-2xl bg-white p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-green-100/70 border border-green-200 hover:border-green-400 transition-all duration-500 ease-out hover:-translate-y-1";
const inputBase = "w-full border border-green-300 rounded-xl px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition";

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", productType: "", purchaseDate: "",
  warrantyYear: "", serialNumber: "", invoiceNumber: "", doaAuthCode: ""
};

const RequestDOA = () => {
  const [fileName, setFileName] = useState("Choose file");
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState(emptyForm);
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
    if (!agree) return alert("Please accept terms & conditions.");
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-doa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoiceFileName: fileName !== "Choose file" ? fileName : "-" }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setForm(emptyForm);
        setFileName("Choose file");
        setAgree(false);
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
    <div className="min-h-screen">
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
      >
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">Request DOA</h1>
              <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
                Raise a Dead-On-Arrival request & review our product return policies.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Reveal>
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">7-Day DOA Window</h3>
                </div>
                <p className="text-slate-600">DOA must be reported within <strong>7 days</strong> of billing to the end customer via our portal.</p>
              </div>
            </Reveal>

            <Reveal className="delay-100">
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <FileWarning className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Physical Condition</h3>
                </div>
                <p className="text-slate-600">Unit must be free from scratches, tampering, liquid damage; <em>gift box & warranty seal should be intact</em>.</p>
              </div>
            </Reveal>

            <Reveal className="delay-200">
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Clear Verification</h3>
                </div>
                <p className="text-slate-600">Our PM calls the customer for verification; replacement or repair is processed per policy.</p>
              </div>
            </Reveal>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Reveal>
              <section className={liftSection}>
                <h2 className="text-2xl md:text-3xl font-bold text-teal-900">AADONA Product Returns Policy</h2>
                <p className="text-slate-700 mt-2">This includes products that you wish to report as DOA.</p>
                <ul className="list-disc pl-6 space-y-2 leading-relaxed text-slate-700 mt-4">
                  <li>DOA must be reported within <strong>7 days</strong> of billing to the end customer.</li>
                  <li>DOA request should be raised via our portal after product registration.</li>
                  <li>No signs of scratches, damage, tampering, liquid damage or user defect.</li>
                  <li>Gift box & Warranty Seal must be intact.</li>
                  <li>Problem reported must not be a software/firmware issue.</li>
                  <li>Company obligation is limited to repairing by replacing the damaged part.</li>
                  <li>If replacement is approved, unit is shipped to customer or channel partner.</li>
                  <li className="italic">We issue authorization with ticket number to customer; upon physical inspection, if product fails checks, claim may be rejected.</li>
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section className={liftSection}>
                <h3 className="text-2xl font-bold text-teal-900">Sales return policy</h3>
                <ul className="list-disc pl-6 space-y-2 leading-relaxed text-slate-700 mt-3">
                  <li>Once sold there will be <strong>NO</strong> returns.</li>
                  <li>Return is possible only with AADONA authorization (exceptional cases).</li>
                  <li>Due to firmware upgrade/field fix, if product can be made working, only the exception in return policy will apply.</li>
                  <li>Depreciation, missing accessories, scratches may reduce the refund value.</li>
                  <li>Beyond 30 days from date of purchase, returns are not entertained.</li>
                  <li>All disputes subject to Raipur, Chhattisgarh jurisdiction.</li>
                </ul>
              </section>
            </Reveal>
          </div>

          <Reveal>
            <section className={liftSection}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Raise DOA Request</h2>

              {/* ✅ Success Message */}
              {submitted && (
                <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl px-6 py-5 text-center font-semibold text-lg mb-6">
                  ✅ DOA request submitted successfully! Our team will contact you soon.
                </div>
              )}

              {!submitted && (
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">First name</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} className={inputBase} placeholder="First name" required />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Last name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} className={inputBase} placeholder="Last name" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" /> Email *
                      </label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputBase} placeholder="e.g., email@example.com" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" /> Phone
                      </label>
                      <input name="phone" value={form.phone} onChange={handleChange} className={inputBase} placeholder="Phone" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" /> Address
                      </label>
                      <input name="address" value={form.address} onChange={handleChange} className={inputBase} placeholder="Enter your address" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Product Type</label>
                      <select name="productType" value={form.productType} onChange={handleChange} className={inputBase + " bg-white"}>
                        <option value="">Choose an option</option>
                        <option>Router</option>
                        <option>Switch</option>
                        <option>AP</option>
                        <option>NVR/CCTV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Purchase Date</label>
                      <div className="relative">
                        <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} className={inputBase} />
                        <Calendar className="w-4 h-4 absolute right-3 top-3.5 text-green-600 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Warranty of Year *</label>
                      <select name="warrantyYear" value={form.warrantyYear} onChange={handleChange} required className={inputBase + " bg-white"}>
                        <option value="">Select</option>
                        <option>1 Year</option>
                        <option>2 Years</option>
                        <option>3 Years</option>
                        <option>5 Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-green-600" /> Serial Number *
                      </label>
                      <input name="serialNumber" value={form.serialNumber} onChange={handleChange} required className={inputBase} placeholder="Enter serial number" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Invoice Number *</label>
                      <input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} required className={inputBase} placeholder="Enter invoice number" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">DOA Authorization Code *</label>
                      <input name="doaAuthCode" value={form.doaAuthCode} onChange={handleChange} required className={inputBase} placeholder="Enter authorization code" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Upload Invoice (Max 15MB)</label>
                      <div className="relative flex items-center justify-between border border-green-300 rounded-xl px-4 py-3 hover:border-green-500 cursor-pointer transition">
                        <span className="text-slate-600">{fileName}</span>
                        <UploadCloud className="w-5 h-5 text-green-700" />
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files?.[0]?.name || "Choose file")} accept=".pdf,.jpg,.jpeg,.png" />
                      </div>
                      <p className="text-sm mt-1 text-slate-500">Supported: PDF/JPG/PNG</p>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3 mt-2">
                      <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-400" />
                      <label htmlFor="agree" className="text-slate-700">I accept terms & conditions.</label>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-10 py-4 font-semibold shadow-xl hover:shadow-2xl hover:shadow-green-300/50 hover:bg-green-700 transition-all duration-500 ease-out hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </Reveal>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RequestDOA;