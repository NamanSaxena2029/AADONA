import React, { useEffect, useState } from "react"; // Added useState
import Navbar from "./Navbar";
import Footer from "./Footer";
import bg from "../assets/bg.jpg";

/* ✅ Dynamic Import */
const imageModules = import.meta.glob(
  "../assets/Companies/**/*.{png,jpg,jpeg,avif}",
  { eager: true }
);

/* ✅ Sorting Logic */
const sortImages = (modules) => {
  const govt = [];
  const privateCo = [];

  for (const path in modules) {
    const img = modules[path].default;
    const parts = path.split("/");
    const idx = parts.indexOf("Companies");
    const category = parts[idx + 1];

    const fileNameWithExtension = parts[parts.length - 1];
    const nameWithoutExtension = fileNameWithExtension.split(".")[0];
    const companyName = nameWithoutExtension
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const companyData = { src: img, name: companyName };

    if (category === "Government") govt.push(companyData);
    if (category === "Private") privateCo.push(companyData);
  }
  return { govt, privateCo };
};

const allImages = sortImages(imageModules);

const LogoCard = ({ data }) => (
  <div className="flex flex-col items-center justify-start p-2">
    <div className="flex items-center justify-center h-32 w-32 p-2 bg-white border border-green-600 rounded-lg shadow-md transition duration-300 hover:shadow-xl hover:scale-[1.05]">
      <img
        src={data.src}
        alt={data.name}
        className="max-h-full max-w-full object-contain transition duration-300"
      />
    </div>
    <p className="mt-2 text-sm text-center font-medium text-gray-700">
      {data.name}
    </p>
  </div>
);

export default function CustomerPage() {
  const [searchTerm, setSearchTerm] = useState(""); // State for search

  useEffect(() => window.scrollTo(0, 0), []);

  // ✅ Filter logic based on search input
  const filteredGovt = allImages.govt.filter((co) =>
    co.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPrivate = allImages.privateCo.filter((co) =>
    co.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Our Customers
          </h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
            Building Trust, Delivering Excellence
          </p>

        
        </div>
      </div>




      {/* Background & Content */}
      <div
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="min-h-screen bg-white/30 backdrop-blur-sm">
        
         {/* ✅ Search Bar Input */}
          <div className="mt-10 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a company..."
                className="w-full px-5 py-3 rounded-full border-2 border-green-400 focus:border-green-400 focus:outline-none shadow-lg text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
                        <span className="absolute right-4 top-3.5 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          
          {/* ✅ GOVERNMENT SECTION */}
          {filteredGovt.length > 0 && (
            <section className="max-w-7xl mx-auto py-12 px-4">
              <h2 className="text-3xl font-bold text-center bg-white/90 p-4 mb-10 text-green-600 rounded-lg shadow-lg">
                Government Enterprises
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                {filteredGovt.map((data, i) => (
                  <LogoCard data={data} key={`gov-${i}`} />
                ))}
              </div>
            </section>
          )}

          {/* ✅ PRIVATE SECTION */}
          {filteredPrivate.length > 0 && (
            <section className="max-w-7xl mx-auto py-12 px-4">
              <h2 className="text-3xl font-bold text-center bg-white/90 p-4 mb-10 text-green-600 rounded-lg shadow-lg">
                Private Enterprises
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                {filteredPrivate.map((data, i) => (
                  <LogoCard data={data} key={`private-${i}`} />
                ))}
              </div>
            </section>
          )}

          {/* ✅ No Results Message */}
          {filteredGovt.length === 0 && filteredPrivate.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-2xl font-semibold text-gray-800 bg-white/80 inline-block px-6 py-2 rounded-lg">
                No companies found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}