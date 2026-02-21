import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad",
  "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
  "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '', companyCity: '',
  postalZipCode: '', regionStateProvince: '', country: '', serialNumber: '',
  invoiceNumber: '', purchasedFrom: '', purchaseDate: '', invoiceFile: null
};

const ProductRegistration = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, invoiceFile: 'File size must be less than 15MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, invoiceFile: file }));
      setErrors(prev => ({ ...prev, invoiceFile: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required';
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.purchasedFrom.trim()) newErrors.purchasedFrom = 'Purchased from is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName, lastName: formData.lastName,
        email: formData.email, phone: formData.phone,
        companyCity: formData.companyCity, postalZipCode: formData.postalZipCode,
        regionStateProvince: formData.regionStateProvince, country: formData.country,
        serialNumber: formData.serialNumber, invoiceNumber: formData.invoiceNumber,
        purchasedFrom: formData.purchasedFrom, purchaseDate: formData.purchaseDate,
        invoiceFileName: formData.invoiceFile ? formData.invoiceFile.name : "-"
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-product-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
        setFormData(emptyForm);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
      >
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">Register Your Product</h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Register your product to activate warranty and receive support
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          <main className="grow pt-4 pb-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">

              {/* ✅ Success Message */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-green-800 font-semibold">Registration Successful!</h3>
                      <p className="text-green-700 mt-1">Your product has been registered successfully. Thank you!</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g., John" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Purchase <span className="text-red-500">*</span></label>
                      <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.purchaseDate ? 'bg-red-50 border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} focus:ring-2 focus:outline-none transition duration-200`} />
                      {errors.purchaseDate && <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'bg-red-50 border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} focus:ring-2 focus:outline-none transition duration-200`} />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input type="text" name="companyCity" value={formData.companyCity} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Region/State/Province</label>
                      <input type="text" name="regionStateProvince" value={formData.regionStateProvince} onChange={handleChange} placeholder="Region/State/Province" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal / Zip code</label>
                      <input type="text" name="postalZipCode" value={formData.postalZipCode} onChange={handleChange} placeholder="Postal / Zip code" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select name="country" value={formData.country} onChange={handleChange} className="w-full h-12 text-sm rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200 bg-white">
                        <option value="">Select Country</option>
                        {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number <span className="text-red-500">*</span></label>
                      <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="Enter Serial Number"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.serialNumber ? 'bg-red-50 border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} focus:ring-2 focus:outline-none transition duration-200`} />
                      {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number <span className="text-red-500">*</span></label>
                      <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="Enter Number"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.invoiceNumber ? 'bg-red-50 border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} focus:ring-2 focus:outline-none transition duration-200`} />
                      {errors.invoiceNumber && <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchased From <span className="text-red-500">*</span></label>
                    <input type="text" name="purchasedFrom" value={formData.purchasedFrom} onChange={handleChange} placeholder="Purchased From"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.purchasedFrom ? 'bg-red-50 border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} focus:ring-2 focus:outline-none transition duration-200`} />
                    {errors.purchasedFrom && <p className="mt-1 text-sm text-red-600">{errors.purchasedFrom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Invoice</label>
                    <div className="relative">
                      <input type="file" id="invoiceFile" name="invoiceFile" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                      <label htmlFor="invoiceFile" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition duration-200">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-green-600 font-medium">
                          {formData.invoiceFile ? formData.invoiceFile.name : 'Upload Invoice'}
                        </span>
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 15MB)</p>
                    {errors.invoiceFile && <p className="mt-1 text-sm text-red-600">{errors.invoiceFile}</p>}
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit" disabled={isSubmitting}
                      className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Register Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductRegistration;