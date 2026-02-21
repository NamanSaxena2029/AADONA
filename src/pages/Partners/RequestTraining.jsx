import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg';

const RequestTraining = () => {
  const COUNTRIES = [
    "Afghanistan","Aland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica",
    "Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
    "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina",
    "Botswana","Brazil","Brunei","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia","Costa Rica",
    "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
    "Ethiopia","Finland","France","Germany","Ghana","Greece","Greenland","Guatemala","Hong Kong","Hungary","Iceland",
    "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait",
    "Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malaysia","Maldives","Mali",
    "Malta","Mexico","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands",
    "New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Panama","Paraguay","Peru",
    "Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Seychelles",
    "Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Sweden",
    "Switzerland","Syria","Taiwan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Turkey","Uganda",
    "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam",
    "Yemen","Zambia","Zimbabwe"
  ];

  const emptyForm = {
    firstName: '', lastName: '', email: '', streetAddress: '',
    streetAddress2: '', phone: '', numberOfParticipants: '', city: '',
    regionStateProvince: '', company: '', postalZipCode: '', country: '',
    customerType: [], comment: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        customerType: checked
          ? [...prev.customerType, value]
          : prev.customerType.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-training`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData(emptyForm);
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

  const inputClasses = "py-3 px-4 rounded-lg border border-gray-300 bg-white text-base text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 shadow-sm w-full";
  const labelClasses = "text-sm font-medium text-gray-700 mb-1 block";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">Request Training</h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Submit your details below to schedule a comprehensive, customized training session with our expert team.
            </p>
          </div>
        </div>

        <main className="flex justify-center py-16 px-5">
          <div className="relative bg-white w-full max-w-5xl rounded-xl p-10 md:p-14 lg:p-16 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-xl"></div>

            {/* ✅ Success Message */}
            {submitted && (
              <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl px-6 py-5 text-center font-semibold text-lg mb-6">
                ✅ Training request submitted successfully! Our team will contact you soon.
              </div>
            )}

            {!submitted && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-emerald-700 border-b pb-2 mb-4">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className={labelClasses}>First Name <span className="text-red-500">*</span></label>
                    <input type="text" name="firstName" placeholder="Enter your first name" value={formData.firstName} onChange={handleChange} required className={inputClasses} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClasses}>Last Name <span className="text-red-500">*</span></label>
                    <input type="text" name="lastName" placeholder="Enter your last name" value={formData.lastName} onChange={handleChange} required className={inputClasses} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClasses}>Work Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" placeholder="Enter your work email address" value={formData.email} onChange={handleChange} required className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required className={inputClasses} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClasses}>Company / Organization</label>
                    <input type="text" name="company" placeholder="Enter your company name" value={formData.company} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClasses}>Number of Participants</label>
                    <input type="number" name="numberOfParticipants" placeholder="e.g., 10" value={formData.numberOfParticipants} onChange={handleChange} className={inputClasses} min="1" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-emerald-700 border-b pb-2 pt-4 mb-4">Training Location</h3>

                <div className="flex flex-col">
                  <label className={labelClasses}>Street Address Line 1 <span className="text-red-500">*</span></label>
                  <input type="text" name="streetAddress" placeholder="Enter street address line 1" value={formData.streetAddress} onChange={handleChange} required className={inputClasses} />
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Street Address Line 2 (Apt, Suite, etc.)</label>
                  <input type="text" name="streetAddress2" placeholder="Apartment, Suite, Unit, etc. (optional)" value={formData.streetAddress2} onChange={handleChange} className={inputClasses} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className={labelClasses}>City <span className="text-red-500">*</span></label>
                    <input type="text" name="city" placeholder="Enter your city" value={formData.city} onChange={handleChange} required className={inputClasses} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClasses}>State / Region / Province <span className="text-red-500">*</span></label>
                    <input type="text" name="regionStateProvince" placeholder="Enter state, region, or province" value={formData.regionStateProvince} onChange={handleChange} required className={inputClasses} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClasses}>Postal / Zip code <span className="text-red-500">*</span></label>
                    <input type="text" name="postalZipCode" placeholder="Enter postal or zip code" value={formData.postalZipCode} onChange={handleChange} required className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className={labelClasses}>Country <span className="text-red-500">*</span></label>
                    <select name="country" value={formData.country} onChange={handleChange} required className={inputClasses + " cursor-pointer"}>
                      <option value="" disabled>Select Country *</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-emerald-700 border-b pb-2 pt-4 mb-4">Additional Details</h3>

                <div className="flex flex-col">
                  <label className={labelClasses}>I am an <span className="text-red-500">*</span></label>
                  <div className="flex gap-8 flex-wrap py-2">
                    <label className="flex items-center gap-2 font-normal text-gray-700 text-base cursor-pointer">
                      <input type="checkbox" name="customerType" value="endCustomer" checked={formData.customerType.includes('endCustomer')} onChange={handleChange} className="accent-emerald-600 w-4 h-4 cursor-pointer" />
                      <span>End Customer</span>
                    </label>
                    <label className="flex items-center gap-2 font-normal text-gray-700 text-base cursor-pointer">
                      <input type="checkbox" name="customerType" value="siPartner" checked={formData.customerType.includes('siPartner')} onChange={handleChange} className="accent-emerald-600 w-4 h-4 cursor-pointer" />
                      <span>SI Partner (Systems Integrator)</span>
                    </label>
                    <label className="flex items-center gap-2 font-normal text-gray-700 text-base cursor-pointer">
                      <input type="checkbox" name="customerType" value="distributor" checked={formData.customerType.includes('distributor')} onChange={handleChange} className="accent-emerald-600 w-4 h-4 cursor-pointer" />
                      <span>Distributor / Reseller</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Comments or Specific Training Needs</label>
                  <textarea name="comment" placeholder="Tell us about your organization's specific training requirements, preferred dates, or any other important details here." rows="5" value={formData.comment} onChange={handleChange} className={inputClasses + " resize-y min-h-[8rem]"}></textarea>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-emerald-600 text-white font-semibold tracking-wider uppercase px-12 py-4 rounded-lg text-lg transition-all duration-300 shadow-md hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Training Request"}
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Fields marked with <span className="text-red-500">*</span> are required.
                </p>
              </form>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default RequestTraining;