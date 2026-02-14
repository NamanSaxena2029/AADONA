import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

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

export default function RequestDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    streetAddress2: "",
    phone: "",
    modelName: "",
    city: "",
    regionStateProvince: "",
    postalZipCode: "",
    country: "",
    customerType: [],
    comment: ""
  });

  // Matching RequestTraining input style
  const inputClasses =
    "py-3 px-4 rounded-lg border border-gray-300 bg-white text-base text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 shadow-sm w-full";
  const labelClasses = "text-sm font-medium text-gray-700 mb-1 block";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "customerType") {
      setFormData((prev) => ({
        ...prev,
        customerType: checked
          ? [...prev.customerType, value]
          : prev.customerType.filter((v) => v !== value)
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Demo request submitted! Check console for data.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      streetAddress: "",
      streetAddress2: "",
      phone: "",
      modelName: "",
      city: "",
      regionStateProvince: "",
      postalZipCode: "",
      country: "",
      customerType: [],
      comment: ""
    });
  };

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
        {/* Header (same as RequestTraining / Project Locking) */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Request a Demo
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Fill out the form and our team will contact you to schedule a personalized demonstration
            </p>
          </div>
        </div>

        {/* Main white card */}
        <main className="flex justify-center py-16 px-5">
          <div className="relative bg-white w-full max-w-5xl rounded-xl p-10 md:p-14 lg:p-16 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-xl"></div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Contact Information */}
              <h3 className="text-xl font-semibold text-emerald-700 border-b pb-2 mb-4">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    placeholder="Enter your first name"
                    required
                    className={inputClasses}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Last Name</label>
                  <input
                    name="lastName"
                    placeholder="Enter your last name"
                    className={inputClasses}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className={inputClasses}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="Enter your phone number"
                    required
                    className={inputClasses}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address */}
              <h3 className="text-xl font-semibold text-emerald-700 border-b pb-2 pt-4 mb-4">
                Address
              </h3>

              <div className="flex flex-col">
                <label className={labelClasses}>
                  Street Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  name="streetAddress"
                  placeholder="Enter street address line 1"
                  required
                  className={inputClasses}
                  value={formData.streetAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className={labelClasses}>Street Address Line 2</label>
                <input
                  name="streetAddress2"
                  placeholder="Apartment, Suite, Unit, etc. (optional)"
                  className={inputClasses}
                  value={formData.streetAddress2}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    placeholder="Enter your city"
                    required
                    className={inputClasses}
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>
                    Region / State / Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="regionStateProvince"
                    placeholder="Enter state, region, or province"
                    required
                    className={inputClasses}
                    value={formData.regionStateProvince}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>
                    Postal / Zip code <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="postalZipCode"
                    placeholder="Enter postal or zip code"
                    required
                    className={inputClasses}
                    value={formData.postalZipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    required
                    className={inputClasses + " cursor-pointer"}
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Country *
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Model Name</label>
                  <input
                    name="modelName"
                    placeholder="Model Name (optional)"
                    className={inputClasses}
                    value={formData.modelName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <h3 className="text-xl font-semibold text-emerald-700 border-b pb-2 pt-4 mb-4">
                Additional Details
              </h3>

              <div className="flex flex-col">
                <label className={labelClasses}>Customer Type</label>
                <div className="flex gap-8 flex-wrap py-2">
                  <label className="flex items-center gap-2 font-normal text-gray-700 text-base cursor-pointer">
                    <input
                      type="checkbox"
                      name="customerType"
                      value="endCustomer"
                      checked={formData.customerType.includes("endCustomer")}
                      onChange={handleChange}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>End Customer</span>
                  </label>

                  <label className="flex items-center gap-2 font-normal text-gray-700 text-base cursor-pointer">
                    <input
                      type="checkbox"
                      name="customerType"
                      value="siPartner"
                      checked={formData.customerType.includes("siPartner")}
                      onChange={handleChange}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>SI Partner (Systems Integrator)</span>
                  </label>

                  <label className="flex items-center gap-2 font-normal text-gray-700 text-base cursor-pointer">
                    <input
                      type="checkbox"
                      name="customerType"
                      value="distributor"
                      checked={formData.customerType.includes("distributor")}
                      onChange={handleChange}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Distributor / Reseller</span>
                  </label>
                </div>
              </div>

              {/* Comment */}
              <div className="flex flex-col">
                <label className={labelClasses}>Comments or Notes</label>
                <textarea
                  name="comment"
                  placeholder="Tell us any specifics you'd like the demo to cover (features, timelines, integrations, etc.)"
                  rows="5"
                  className={inputClasses + " resize-y min-h-[8rem]"}
                  value={formData.comment}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-semibold tracking-wider uppercase px-12 py-4 rounded-lg text-lg transition-all duration-300 shadow-md hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  Submit Demo Request
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}