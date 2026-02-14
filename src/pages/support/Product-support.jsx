import React, { useState,useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg'; // CSR-style background

const ProductSupport = () => {
  // Form state
  const [formData, setFormData] = useState({
    productModel: '',
    email: '',
    phone: '',
    details: ''
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.productModel.trim()) {
      newErrors.productModel = 'Product model is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Please describe your question or issue';
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
        productModel: '',
        email: '',
        phone: '',
        details: ''
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

      {/* Full-page background (CSR style) */}
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
              Product Support
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Access our comprehensive support tools and resources
            </p>
          </div>
        </div>

        {/* ===== NOTE: outer frosted white wrapper removed so background is fully visible ===== */}

        {/* Page content placed directly on top of background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          <main className="grow pt-4 pb-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <section className="bg-green-50 py-10 px-6 rounded-2xl shadow-sm text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
                  Need Help with Your Product? We're Here to Assist You.
                </h2>
                <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
                  Fill out the form below and our team will get back to you within 24 hours
                </p>
              </section>

              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-green-800 font-semibold">Success!</h3>
                      <p className="text-green-700 mt-1">
                        Your request has been received. We'll respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Card (kept white for readability) */}
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Product Model, Email, Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Product Model */}
                    <div>
                      <label htmlFor="productModel" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="productModel"
                        name="productModel"
                        value={formData.productModel}
                        onChange={handleChange}
                        placeholder="Product Model"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.productModel
                            ? 'bg-red-50 border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        } focus:ring-2 focus:outline-none transition duration-200`}
                      />
                      {errors.productModel && (
                        <p className="mt-1 text-sm text-red-600">{errors.productModel}</p>
                      )}
                    </div>

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

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
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
                  </div>

                  {/* Row 2: Question/Issue Details */}
                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your Issue or Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Describe your question or issue in detail..."
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.details
                          ? 'bg-red-50 border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                      } focus:ring-2 focus:outline-none transition duration-200 resize-none`}
                    />
                    {errors.details && (
                      <p className="mt-1 text-sm text-red-600">{errors.details}</p>
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
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
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

export default ProductSupport;
