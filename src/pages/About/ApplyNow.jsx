import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import bg from "../../assets/bg.jpg";

const ApplyNow = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* Full-page background (CSR-style) */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* CSR-Style Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-white sm:text-6xl">
              Apply Now
            </h1>
            <p className="mt-3 text-green-100 text-lg md:text-xl max-w-3xl mx-auto">
              Join our growing team — fill in your details and attach your resume below.
            </p>
          </div>
        </div>

        {/* Page content (no large white wrapper) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          {/* Helper box */}
          <div className="mb-6 bg-white/60 rounded-xl p-4 border border-white/30 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-teal-900">Application Form</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-green-700 transition"
            >
              ← Back
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo: application submitted (no backend connected).");
            }}
            className="space-y-6"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume
              </label>
              <div className="flex flex-col items-center justify-center px-6 py-6 border-2 border-dashed rounded-xl hover:border-green-500 bg-white/90 transition">
                <svg
                  className="mx-auto h-10 w-10 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <label className="mt-3 cursor-pointer text-green-700 font-medium hover:underline">
                  Upload a file
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDF / DOC / DOCX — max 15MB
                </p>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which days are you available?
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <label key={day} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-400"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* About You */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                A few words about you
              </label>
              <textarea
                rows={4}
                placeholder="Tell us a bit about yourself..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-10 py-4 font-semibold shadow hover:bg-green-700 transition"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ApplyNow;
