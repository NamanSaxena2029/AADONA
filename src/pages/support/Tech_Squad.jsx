import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Wrench, ClipboardList, CheckCircle2, Mail, Phone, MapPin, Calendar, UploadCloud, Send } from "lucide-react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
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

const liftCard =
  "rounded-2xl bg-white/90 p-6 shadow-md hover:shadow-2xl hover:shadow-green-200/60 " +
  "border border-green-300 hover:border-green-500 transition-all duration-500 ease-out hover:-translate-y-1";

const liftSection =
  "rounded-2xl bg-white/90 p-6 md:p-8 border border-green-200 transition-all duration-500 ease-out";

const inputBase =
  "w-full border border-green-300 rounded-xl px-4 py-3 text-base " +
  "focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition";

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", purchaseDate: "", serviceType: "", issue: ""
};

const TechSquad = () => {
  const [fileName, setFileName] = useState("Choose file");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-techsquad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoiceFileName: fileName !== "Choose file" ? fileName : "-" }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setForm(emptyForm);
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

  return (
    <div className="min-h-screen">
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
      >
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">Tech Squad</h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              On-site / Remote Engineering Support across India — fast, reliable, professional.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Reveal>
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <Wrench className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Flexible Service</h3>
                </div>
                <p className="text-slate-700">On-site & remote options for installation, troubleshooting, and replacements.</p>
              </div>
            </Reveal>

            <Reveal className="delay-100">
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Clear Process</h3>
                </div>
                <p className="text-slate-700">Log a request, get a callback, confirm scope & quotation, and we dispatch.</p>
              </div>
            </Reveal>

            <Reveal className="delay-200">
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Certified Engineers</h3>
                </div>
                <p className="text-slate-700">Experienced team with ESD safety practices and proper documentation.</p>
              </div>
            </Reveal>
          </div>

          <main className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Reveal>
                <section className={liftSection}>
                  <h2 className="text-2xl md:text-3xl font-bold text-teal-900 mb-3">How it Works</h2>
                  <ol className="list-decimal pl-6 space-y-2 leading-relaxed text-slate-700">
                    <li>Fill the request form with accurate details.</li>
                    <li>Our coordinator confirms scope and location.</li>
                    <li>Quotation shared for approval; visit scheduled.</li>
                    <li>Payment done via UPI / PayTM / Bank transfer.</li>
                    <li>Engineer visits, diagnoses, and resolves the issue.</li>
                    <li>Report & ticket closure shared via email.</li>
                  </ol>
                </section>
              </Reveal>

              <Reveal>
                <section className={liftSection}>
                  <h3 className="text-2xl font-bold text-teal-900 mb-3">Services Include</h3>
                  <ul className="list-disc pl-6 space-y-2 leading-relaxed text-slate-700">
                    <li>Advanced replacement coordination</li>
                    <li>Network / L2 & L3 configuration</li>
                    <li>CCTV installation & health checks</li>
                    <li>Fiber OTDR testing & termination</li>
                    <li>PC / Printer troubleshooting</li>
                    <li>Onsite triage & escalation</li>
                  </ul>
                </section>
              </Reveal>

              <Reveal>
                <section className={liftSection}>
                  <h3 className="text-2xl font-bold text-teal-900 mb-3">Notes</h3>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700">
                    <li>Paid service — charges vary by location.</li>
                    <li>Visit fee is non-refundable once engineer dispatched.</li>
                    <li>Parts replacement billed separately.</li>
                    <li>Cancellation after confirmation not refundable.</li>
                    <li>Disputes subject to Raipur, Chhattisgarh.</li>
                  </ul>
                </section>
              </Reveal>
            </div>

            <Reveal>
              <section className={liftSection}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Request Tech Squad</h2>

                {/* ✅ Success Message */}
                {submitted && (
                  <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl px-6 py-5 text-center font-semibold text-lg mb-6">
                    ✅ Tech Squad request submitted! Our team will contact you soon.
                  </div>
                )}

                {!submitted && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">First Name</label>
                        <input name="firstName" value={form.firstName} onChange={handleChange} className={inputBase} placeholder="Enter first name" required />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">Last Name</label>
                        <input name="lastName" value={form.lastName} onChange={handleChange} className={inputBase} placeholder="Enter last name" />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-600" /> Email
                        </label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className={inputBase} placeholder="you@example.com" required />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" /> Phone
                        </label>
                        <input name="phone" value={form.phone} onChange={handleChange} className={inputBase} placeholder="Enter phone number" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" /> Address
                        </label>
                        <input name="address" value={form.address} onChange={handleChange} className={inputBase} placeholder="Full address with city & pin code" required />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">Purchase Date</label>
                        <div className="relative">
                          <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} className={inputBase} />
                          <Calendar className="w-4 h-4 absolute right-3 top-3.5 text-green-600 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">Service Type</label>
                        <select name="serviceType" value={form.serviceType} onChange={handleChange} className={inputBase + " bg-white"}>
                          <option value="">Choose an option</option>
                          <option>On-site Visit</option>
                          <option>Remote Support</option>
                          <option>Installation</option>
                          <option>Troubleshooting</option>
                          <option>Replacement Coordination</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-1">Upload Invoice / Evidence (Max 15MB)</label>
                        <div className="relative flex items-center justify-between border border-green-300 rounded-xl px-4 py-3 hover:border-green-500 cursor-pointer transition">
                          <span className="text-slate-600">{fileName}</span>
                          <UploadCloud className="w-5 h-5 text-green-700" />
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files?.[0]?.name || "Choose file")} accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                        <p className="text-sm mt-1 text-slate-500">PDF / JPG / PNG supported</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-1">Describe the issue</label>
                        <textarea name="issue" value={form.issue} onChange={handleChange} rows={4} className={inputBase} placeholder="Describe your issue..." required />
                      </div>
                    </div>

                    <div className="flex justify-center mt-8">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-10 py-4 font-semibold hover:bg-green-700 transition duration-300 ease-out hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                )}
              </section>
            </Reveal>
          </main>

          <div className="w-full flex justify-center mt-8">
            <Link to="/warranty" className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-8 py-3 font-semibold hover:bg-green-700 transition">
              Warranty & Support
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TechSquad;