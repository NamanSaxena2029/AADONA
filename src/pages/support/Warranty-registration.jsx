import React, { useState,useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg'; // CSR-style background

// Countries list
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

const ProductRegistration = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyCity: '',
    postalZipCode: '',
    regionStateProvince: '',
    country: '',
    serialNumber: '',
    invoiceNumber: '',
    purchasedFrom: '',
    purchaseDate: '',
    invoiceFile: null
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        setErrors(prev => ({
          ...prev,
          invoiceFile: 'File size must be less than 15MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        invoiceFile: file
      }));
      setErrors(prev => ({
        ...prev,
        invoiceFile: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    
    if (!formData.purchasedFrom.trim()) {
      newErrors.purchasedFrom = 'Purchased from is required';
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate form submission
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyCity: '',
        postalZipCode: '',
        regionStateProvince: '',
        country: '',
        serialNumber: '',
        invoiceNumber: '',
        purchasedFrom: '',
        purchaseDate: '',
        invoiceFile: null
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

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
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {/* CSR-style Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Register Your Product
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Register your product to activate warranty and receive support
            </p>
          </div>
        </div>

        {/* ===== Outer frosted wrapper removed so background shows through fully ===== */}

        {/* Page content placed directly on background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          <main className="grow pt-4 pb-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-green-800 font-semibold">Registration Successful!</h3>
                      <p className="text-green-700 mt-1">
                        Your product has been registered successfully. Thank you!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Card (kept white for readability) */}
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: First Name, Last Name, Purchase Date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="e.g., John"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                      />
                    </div>

                    {/* Purchase Date */}
                    <div>
                      <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Purchase <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.purchaseDate 
                            ? 'bg-red-50 border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        } focus:ring-2 focus:outline-none transition duration-200`}
                      />
                      {errors.purchaseDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email, Company City, Region/State/Province */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email 
                            ? 'bg-red-50 border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        } focus:ring-2 focus:outline-none transition duration-200`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Company City */}
                    <div>
                      <label htmlFor="companyCity" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="companyCity"
                        name="companyCity"
                        value={formData.companyCity}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                      />
                    </div>

                    {/* Region/State/Province */}
                    <div>
                      <label htmlFor="regionStateProvince" className="block text-sm font-medium text-gray-700 mb-2">
                        Region/State/Province
                      </label>
                      <input
                        type="text"
                        id="regionStateProvince"
                        name="regionStateProvince"
                        value={formData.regionStateProvince}
                        onChange={handleChange}
                        placeholder="Region/State/Province"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Row 3: Phone, Postal/Zip Code, Country */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                      />
                    </div>

                    {/* Postal/Zip Code */}
                    <div>
                      <label htmlFor="postalZipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Postal / Zip code
                      </label>
                      <input
                        type="text"
                        id="postalZipCode"
                        name="postalZipCode"
                        value={formData.postalZipCode}
                        onChange={handleChange}
                        placeholder="Postal / Zip code"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full h-12 text-sm rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200 bg-white"
                      >
                        <option value="">Select Country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Serial Number, Invoice Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Serial Number */}
                    <div>
                      <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="serialNumber"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        placeholder="Enter Serial Number"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.serialNumber 
                            ? 'bg-red-50 border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        } focus:ring-2 focus:outline-none transition duration-200`}
                      />
                      {errors.serialNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
                      )}
                    </div>

                    {/* Invoice Number */}
                    <div>
                      <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleChange}
                        placeholder="Enter Number"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.invoiceNumber 
                            ? 'bg-red-50 border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        } focus:ring-2 focus:outline-none transition duration-200`}
                      />
                      {errors.invoiceNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Purchased From */}
                  <div>
                    <label htmlFor="purchasedFrom" className="block text-sm font-medium text-gray-700 mb-2">
                      Purchased From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="purchasedFrom"
                      name="purchasedFrom"
                      value={formData.purchasedFrom}
                      onChange={handleChange}
                      placeholder="Purchased From"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.purchasedFrom 
                          ? 'bg-red-50 border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                      } focus:ring-2 focus:outline-none transition duration-200`}
                    />
                    {errors.purchasedFrom && (
                      <p className="mt-1 text-sm text-red-600">{errors.purchasedFrom}</p>
                    )}
                  </div>

                  {/* Row 6: Upload Invoice */}
                  <div>
                    <label htmlFor="invoiceFile" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Invoice
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="invoiceFile"
                        name="invoiceFile"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <label
                        htmlFor="invoiceFile"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition duration-200"
                      >
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-green-600 font-medium">
                          {formData.invoiceFile ? formData.invoiceFile.name : 'Upload Invoice'}
                        </span>
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 15MB)</p>
                    {errors.invoiceFile && (
                      <p className="mt-1 text-sm text-red-600">{errors.invoiceFile}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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
