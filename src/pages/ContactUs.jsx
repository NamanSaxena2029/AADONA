import { useState, useCallback, useMemo, useEffect } from 'react';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import bg from "../assets/bg.jpg";  // ✅ CSR BG imported

const businessOptions = [
  'Choose an option',
  'Distributor',
  'End Customer',
  'Reseller',
  'System Integrator',
  'Consultant',
];

const locations = [
  {
    id: 1,
    name:'AADONA',
    title: 'Global Head Office:',
    company: 'AADONA Communication Pvt Ltd.',
    address: '1st Floor, Phoenix Tech Tower, Plot No. 14/46, IDA – Uppal, Hyderabad',
    addressLine2: 'Telangana, 500039',
    phone: 'Toll Free: 1800-202-6599',
    hours: 'Working hours: Monday to Friday, 10:30 AM to 06:00 PM'
  },
  {
    id: 2,
    name:'AADONA',
    title: 'Production, Warehousing and Logistics Center:',
    company: 'AADONA Communication Pvt Ltd.',
    address: '7, SBI Colony, Mohaba Bazar, Hirapur Road, Raipur Chhattisgarh 492099',
    phone: 'Phone Number: +91-771 492-0035',
    hours: 'Working hours: Monday to Friday, 10:30 AM to 06:00 PM'
  },
  {
    id: 3,
    name:'AADONA',
    title: 'Authorised Service centre (Third Party):',
    company: 'AADONA Communication Pvt Ltd.',
    address: 'D171, 1st Floor, Sector-63, Noida, Uttar Pradesh, Pin Code 201307',
    phone: 'Toll Free: 1800-202-6599'
  }
];

export default function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    phone: '',
    natureOfBusiness: businessOptions[0],
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (formData.natureOfBusiness === businessOptions[0]) newErrors.natureOfBusiness = 'Please select a business nature';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    return newErrors;
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          phone: '',
          natureOfBusiness: businessOptions[0],
          message: '',
        });
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

  const inputBaseClasses = useMemo(() => `
    mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm text-green-800 bg-green-50/50 
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none 
    transition duration-150 ease-in-out border-green-200
  `, []);

  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const ContactDetails = () => (
    <div className="md:pl-10 pt-10 md:pt-0">
      <h3 className="text-xl font-bold text-green-700 mb-4 border-b pb-2 border-green-100">
        Toll Free Number
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        For any kind of enquiry call our toll free number (from 10:30 to 18:30)
      </p>
      <p className="text-2xl font-extrabold text-green-700 mb-8">
        Call At : 1800-202-6599
      </p>

      <h3 className="text-xl font-bold text-green-700 mb-4 border-b pb-2 border-green-100">
        Other Contacts
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        Alternatively speak to a member of our team during business hours (10:30 to 18:30)
      </p>
      <p className="text-xl font-extrabold text-green-700 mb-4">
        Board Number: +91-77149-20035
      </p>
      <p className="text-xl font-extrabold text-green-700 mb-4">
        Phone Number:<span /> +91 99100 50918, +91 98993 36461
      </p>
      <p className="text-xl font-extrabold text-green-700 mb-4">
        Email:<span /> support@aadona.com
      </p>
    </div>
  );

  // =================================================================
  // ✅ UPDATED: OfficeLocations component with embedded Google Maps (lat/lng q= to force marker)
  // =================================================================
  const OfficeLocations = () => (
    <div className="pt-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-12 text-center tracking-tight">
        Our Offices
      </h2>

      <div className="space-y-8">
        {locations.map((location) => (
          <div
            key={location.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white border rounded-2xl shadow-xl items-center"
          >
            {/* Left Side: Address Details */}
            <div className="text-base text-gray-600 space-y-2">
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                {location.name}
              </h3>
              <h3 className="text-xl font-bold text-green-700 mb-3 border-b pb-2">
                {location.title}
              </h3>
              <p className="font-semibold text-gray-700">{location.company}</p>
              <p>{location.address}</p>
              {location.addressLine2 && <p>{location.addressLine2}</p>}
              {location.phone && (
                <p><span className="font-semibold text-gray-700">{location.phone.split(':')[0]}:</span> {location.phone.split(':').slice(1).join(':')}</p>
              )}
              {location.email && (
                <p><span className="font-semibold text-gray-700">{location.email.split(':')[0]}:</span> {location.email.split(':').slice(1).join(':')}</p>
              )}
              {location.hours && (
                <p><span className="font-semibold text-gray-700">{location.hours.split(':')[0]}:</span> {location.hours.split(':').slice(1).join(':')}</p>
              )}
            </div>

            {/* ✅ Right Side: Embedded Google Map */}
            <div className="w-full h-64 bg-gray-100 border rounded-lg overflow-hidden shadow-sm">
              {location.id === 1 && (
                // Hyderabad coordinates: 17.393409, 78.562722
                <iframe
                  title="AADONA Hyderabad Office"
                  src="https://maps.google.com/maps?q=17.393409,78.562722&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
              {location.id === 2 && (
                // Raipur coordinates: 21.243362, 81.659324
                <iframe
                  title="AADONA Raipur Center"
                  src="https://maps.google.com/maps?q=21.243362,81.659324&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
              {location.id === 3 && (
                // Noida coordinates: 28.668389, 77.373598
                <iframe
                  title="AADONA Noida Service Centre"
                  src="https://maps.google.com/maps?q=28.668389,77.373598&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  // =================================================================
  // ✅ END OF MAP UPDATE
  // =================================================================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
            We're here to help! Get in touch with our team.
          </p>
        </div>
      </div>

      <div
        className="font-sans bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="md:col-span-2 p-8 bg-white border rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold mb-1 text-green-700">
                Send us a message
              </h2>
              <p className="mb-8 text-gray-600 text-lg border-b pb-4 border-green-50">
                and we'll get back to you shortly.
              </p>

              {submitted ? (
                <div className="p-8 my-8 bg-green-50 border-l-4 border-green-600 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-green-700 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Submission Successful!
                  </h3>
                  <p className="text-green-600 mt-2">
                    Thank you for reaching out. We will contact you within 24–48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Email + Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Email *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="e.g., email@example.com"
                        disabled={isSubmitting}
                        className={`${inputBaseClasses} ${errors.email ? 'border-red-500' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 italic">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="e.g., Support"
                        disabled={isSubmitting}
                        className={`${inputBaseClasses} ${errors.subject ? 'border-red-500' : ''}`}
                        value={formData.subject}
                        onChange={handleChange}
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1 italic">{errors.subject}</p>}
                    </div>
                  </div>

                  {/* First + Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">First name *</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        disabled={isSubmitting}
                        className={`${inputBaseClasses} ${errors.firstName ? 'border-red-500' : ''}`}
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1 italic">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Last name *</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        disabled={isSubmitting}
                        className={`${inputBaseClasses} ${errors.lastName ? 'border-red-500' : ''}`}
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1 italic">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Phone + Business */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        disabled={isSubmitting}
                        className={`${inputBaseClasses} ${errors.phone ? 'border-red-500' : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 italic">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Nature of Business *</label>
                      <div className="relative">
                        <select
                          name="natureOfBusiness"
                          disabled={isSubmitting}
                          className={`${inputBaseClasses} ${errors.natureOfBusiness ? 'border-red-500' : ''}`}
                          value={formData.natureOfBusiness}
                          onChange={handleChange}
                        >
                          {businessOptions.map(option => (
                            <option key={option} value={option} disabled={option === businessOptions[0]}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      {errors.natureOfBusiness && <p className="text-red-500 text-xs mt-1 italic">{errors.natureOfBusiness}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-8 space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Your message *</label>
                    <textarea
                      name="message"
                      rows="6"
                      placeholder="Enter text here"
                      disabled={isSubmitting}
                      className={`${inputBaseClasses} resize-none h-40 ${errors.message ? 'border-red-500' : ''}`}
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1 italic">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-1/2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg 
                      shadow-md transition duration-300 ease-in-out flex items-center justify-center
                      ${isSubmitting ? 'bg-green-400 cursor-not-allowed'
                        : 'hover:bg-green-700 hover:shadow-lg focus:ring-4 focus:ring-green-300 transform hover:-translate-y-0.5'}
                    `}
                  >
                    {isSubmitting && <Spinner />}
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </button>

                </form>
              )}
            </div>

            <div className="md:col-span-1 border-green-200/50 pt-12 md:pt-0 md:border-l-4">
              <ContactDetails />
            </div>
          </div>

          <OfficeLocations />
        </div>
      </div>

      <Footer />
    </>
  );
}