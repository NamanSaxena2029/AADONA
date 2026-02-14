import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";



      
/* Reveal Animation */
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

/* Lift Card */
const liftCard =
  "rounded-2xl bg-white p-6 shadow-md hover:shadow-2xl hover:shadow-green-200/60 " +
  "border border-green-300 hover:border-green-500 transition-all duration-500 ease-out hover:-translate-y-1";

const COUNTRIES = [
  "Afghanistan","Aland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla",
  "Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Cambodia","Cameroon","Canada",
  "Chile","China","Colombia","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland","France","Germany","Ghana","Greece","Greenland",
  "Guatemala","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Lithuania","Luxembourg","Madagascar","Malaysia","Maldives","Mali","Malta","Mexico","Monaco","Mongolia",
  "Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua",
  "Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Panama","Paraguay","Peru","Philippines","Poland",
  "Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Seychelles","Singapore",
  "Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland",
  "Syria","Taiwan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Turkey","Uganda","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen",
  "Zambia","Zimbabwe","Other"
];

const REVENUE_RANGES = [
  "Select an option",
  "Less than ₹10 Lakh",
  "₹10 Lakh – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "₹1 Crore – ₹5 Crore",
  "₹5 Crore – ₹20 Crore",
  "Above ₹20 Crore"
];

const VERTICALS = [
  "Select an option",
  "Retail / eCommerce",
  "Enterprise (Large Business)",
  "SMB (Small & Medium Business)",
  "Government / Public Sector",
  "Education",
  "Healthcare",
  "Hospitality",
  "Telecom / ISP",
  "Manufacturing",
  "Banking & Finance",
  "Transportation & Logistics",
  "Security / Surveillance",
  "Other"
];

const MARKET_SEGMENTS = [
  "Select an option",
  "Retail",
  "Enterprise",
  "SMB",
  "Public Sector / Government",
  "Education",
  "Healthcare",
  "Hospitality",
  "Telecom",
  "Industrial / Manufacturing",
  "Other"
];

const STRENGTH_OPTIONS = [
  "Select an option",
  "None",
  "1-3",
  "4-10",
  "11-25",
  "26-50",
  "50+"
];

const YES_NO_PARTIAL = [
  "Select an option",
  "None",
  "Partial / Some",
  "Full / Extensive"
];

export default function BecomePartner() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyAddress: "",
    email: "",
    primaryInterest: "",
    companyCity: "",
    regionStateProvince: "",
    phone: "",
    geographiesServed: "",
    postalZip: "",
    country: "",
    companyName: "",
    websiteAddress: "",
    revenueAnnual: "",
    verticals: "",
    revenuePrivateProjects: "",
    revenueFromGovt: "",
    revenueFromDirectEnd: "",
    strengthSalesTeam: "",
    strengthTechnicalSalesTeam: "",
    revenueRetailTrading: "",
    marketSegmentExpertise: "",
    wlanLanExpertise: "",
    brandsYouSell: "",
    otherComments: "",
    additionalNotes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Partner form:", form);
    alert("Partner application submitted!");
  };

  const inputClasses =
    "p-4 rounded-lg border border-blue-200 bg-white text-base transition-all " +
    "focus:outline-none focus:border-emerald-500 text-gray-800 w-full placeholder:text-gray-400";

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    
  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ✅ Header Section (exactly like CSR/WhistleBlower/Leadership) */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Become a Partner
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Join our success story with a low risk, rapidly expanding business
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-12 -mt-8">

          {/* ✅ ONE-BY-ONE CARDS */}
          <section className="py-6 mb-12">
            <div className="max-w-4xl mx-auto space-y-6">

              <Reveal>
                <div className={liftCard}>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">Distributors</h3>
                  <p className="text-slate-700">
                    We Plan to work in Exclusive Regional Distribution Model, Will have exclusive distributor in each region. We don’t believe in dumping stocks, your risk will be kept low so that you can breathe easy with us. There are many more benefits working with us.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className={liftCard}>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">System Integrators</h3>
                  <p className="text-slate-700">
                    We Plan to work in Exclusive Regional Distribution Model, Will have exclusive distributor in each region. We don’t believe in dumping stocks, your risk will be kept low so that you can breathe easy with us. There are many more benefits working with us.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className={liftCard}>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">Solutions Consultant</h3>
                  <p className="text-slate-700">
                    We welcome and highly value solution consultants who are the influential lot to educate customer with unbiased right information, we highly value their knowledge and perseverance, we have special package to support consultants with knowledge on our products and solutions.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className={liftCard}>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">Partner Training</h3>
                  <p className="text-slate-700">
                    We believe in sharing knowledge and taking customer feedback, we will provide in depth sales and technical training to our registered partners to make sure they can independently manage our products and offer solution. Education helps partners to evaluate our product against others and compare by themselves. We believe in giving power in the hands of our partners.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className={liftCard}>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">Product Demonstration</h3>
                  <p className="text-slate-700">
                    
We help our partners with Demo Kit and train them to show successful POC or Demo to their customers. We provide free Demo kit to registered partners* to ensure they don’t have to waste time waiting for it or facing difficulty convincing customers.

                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className={liftCard}>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">Benefits & Incentives</h3>
                  <p className="text-slate-700">
                    A touchy subject, we know many burned their hands, we are different being an Indian brand, we care about our customers and their emotions. Do contact us to know more about your benefits working with us.
                  </p>
                </div>
              </Reveal>

            </div>
          </section>

          {/* ✅ FORM STARTS */}
         <main className="flex justify-center -mt-4 px-5 pb-10">
        <div className="relative bg-white w-full max-w-6xl rounded-3xl p-12 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-3xl"></div>
          
          <h2 className="text-3xl text-emerald-700 text-center mb-6 font-normal">Partner Application</h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">First name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter your first name" required className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Last name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter your last name" required className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Company Address</label>
                <input name="companyAddress" value={form.companyAddress} onChange={handleChange} placeholder="Street Address" className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Primary area of Interest *</label>
                <select name="primaryInterest" value={form.primaryInterest} onChange={handleChange} required className={inputClasses}>
                  <option value="">Select an option</option>
                  <option value="Distributor">Distributor</option>
                  <option value="System Integrator">System Integrator</option>
                  <option value="Solutions Consultant">Solutions Consultant</option>
                  <option value="Partner Training">Partner Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Company City</label>
                <input name="companyCity" value={form.companyCity} onChange={handleChange} placeholder="City" className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Region/State/Province</label>
                <input name="regionStateProvince" value={form.regionStateProvince} onChange={handleChange} placeholder="Region/State/Province" className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Geographies served</label>
                <input name="geographiesServed" value={form.geographiesServed} onChange={handleChange} placeholder="Please mention markets you cover" className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Postal / Zip code</label>
                <input name="postalZip" value={form.postalZip} onChange={handleChange} placeholder="Postal / Zip code" className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Country *</label>
                <select name="country" value={form.country} onChange={handleChange} required className={inputClasses}>
                  <option value="">Country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Company</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company" className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Website Address</label>
                <input name="websiteAddress" value={form.websiteAddress} onChange={handleChange} placeholder="Leave empty if you don't have" className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Annual revenue *</label>
                <select name="revenueAnnual" value={form.revenueAnnual} onChange={handleChange} required className={inputClasses}>
                  {REVENUE_RANGES.map(r => <option key={r} value={r === "Select an option" ? "" : r}>{r}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Verticals *</label>
                <select name="verticals" value={form.verticals} onChange={handleChange} required className={inputClasses}>
                  {VERTICALS.map(v => <option key={v} value={v === "Select an option" ? "" : v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Revenue From Private Projects</label>
                <select name="revenuePrivateProjects" value={form.revenuePrivateProjects} onChange={handleChange} className={inputClasses}>
                  {REVENUE_RANGES.map(r => <option key={r} value={r === "Select an option" ? "" : r}>{r}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Revenue from Government *</label>
                <select name="revenueFromGovt" value={form.revenueFromGovt} onChange={handleChange} required className={inputClasses}>
                  {REVENUE_RANGES.map(r => <option key={r} value={r === "Select an option" ? "" : r}>{r}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Revenue From Direct End Customer *</label>
                <select name="revenueFromDirectEnd" value={form.revenueFromDirectEnd} onChange={handleChange} required className={inputClasses}>
                  {REVENUE_RANGES.map(r => <option key={r} value={r === "Select an option" ? "" : r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Sales team strength *</label>
                <select name="strengthSalesTeam" value={form.strengthSalesTeam} onChange={handleChange} required className={inputClasses}>
                  {STRENGTH_OPTIONS.map(s => <option key={s} value={s === "Select an option" ? "" : s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Technical sales team strength</label>
                <select name="strengthTechnicalSalesTeam" value={form.strengthTechnicalSalesTeam} onChange={handleChange} className={inputClasses}>
                  {STRENGTH_OPTIONS.map(s => <option key={s} value={s === "Select an option" ? "" : s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Revenue From Retail / Trading *</label>
                <select name="revenueRetailTrading" value={form.revenueRetailTrading} onChange={handleChange} required className={inputClasses}>
                  {REVENUE_RANGES.map(r => <option key={r} value={r === "Select an option" ? "" : r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Market segment expertise *</label>
                <select name="marketSegmentExpertise" value={form.marketSegmentExpertise} onChange={handleChange} required className={inputClasses}>
                  {MARKET_SEGMENTS.map(m => <option key={m} value={m === "Select an option" ? "" : m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">WLAN & LAN expertise</label>
                <select name="wlanLanExpertise" value={form.wlanLanExpertise} onChange={handleChange} className={inputClasses}>
                  {YES_NO_PARTIAL.map(y => <option key={y} value={y === "Select an option" ? "" : y}>{y}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Brands you sell</label>
                <input name="brandsYouSell" value={form.brandsYouSell} onChange={handleChange} placeholder="write which brands do you sell..." className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Any other comments</label>
                <textarea name="otherComments" value={form.otherComments} onChange={handleChange} placeholder="Any other comments" className={inputClasses + " min-h-28 resize-y"}></textarea>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-2 font-normal">Additional notes / attachments (URL)</label>
                <input name="additionalNotes" value={form.additionalNotes} onChange={handleChange} placeholder="paste link to Drive / document (optional)" className={inputClasses} />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button type="submit" className="bg-green-700 text-white px-9 py-3.5 rounded-lg text-base cursor-pointer shadow-[0_8px_0_rgba(90,133,105,0.12)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_0_rgba(90,133,105,0.16)]">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </main>  </div>
      </div>

      <Footer />
    </>
  );
}
