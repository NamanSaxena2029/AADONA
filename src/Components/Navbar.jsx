import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import menuIcon from "../assets/menu.png";
import closeIcon from "../assets/close.png";

const CATEGORY_API = `${import.meta.env.VITE_API_URL}/categories`;

const nameToSlug = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, "").replace(/[^\w]+/g, "");

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const [openMobileNestedSubmenu, setOpenMobileNestedSubmenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  // ✅ DB order is preserved — no sorting applied, array order from API is used directly
  const [activeCategories, setActiveCategories] = useState([]);
  const [passiveCategories, setPassiveCategories] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(CATEGORY_API)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // ✅ DB returns categories in the order admin set via drag-reorder
          // We preserve that order — no .sort() or Set() that would scramble it
          setActiveCategories(data.filter(c => c.type === "active"));
          setPassiveCategories(data.filter(c => c.type === "passive"));
        }
      })
      .catch(err => console.error("Navbar categories fetch error:", err));
  }, []);

  const handleSubmenuToggle = (submenu) => {
    setOpenMobileSubmenu(openMobileSubmenu === submenu ? null : submenu);
  };

  const handleNestedSubmenuToggle = (submenu) => {
    setOpenMobileNestedSubmenu(openMobileNestedSubmenu === submenu ? null : submenu);
  };

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setOpenMobileSubmenu(null);
    setOpenMobileNestedSubmenu(null);
  };

  return (
    <nav className={`bg-white fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "shadow-xl border-b border-green-100" : "shadow-md"}`}>
      <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3">

        <Link to="/" onClick={() => setOpenMobileSubmenu(null)} className="flex items-center group">
          <img src={logo} alt="Logo" className="h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <ul className="flex items-center gap-0.5 text-base font-semibold text-gray-700 tracking-wide">

            {/* Products Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 px-5 py-3 rounded-xl hover:bg-green-50 hover:text-green-700 transition-all duration-200 group-hover:text-green-700 text-base">
                Products
                <svg className="w-4 h-4 mt-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <ul className="absolute left-0 top-full invisible opacity-0 group-hover:visible group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 bg-white shadow-2xl rounded-2xl py-3 w-72 text-gray-700 border border-gray-100 z-50 overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-green-400 to-teal-400 mb-2" />

                {/* Active */}
                <li className="relative">
                  <details className="group/details">
                    <summary className="list-none cursor-pointer px-5 py-3 hover:bg-green-50 hover:text-green-700 flex items-center justify-between font-bold text-gray-800 transition-colors duration-150 text-base">
                      <span className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-sm shadow-green-300 inline-block flex-shrink-0"></span>
                        Active Product
                      </span>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </summary>
                    <ul className="bg-gradient-to-b from-green-50/70 to-white border-t border-green-100 py-1">
                      {activeCategories.length === 0 ? (
                        <li className="px-9 py-2 text-sm text-gray-400 italic">Loading...</li>
                      ) : (
                        // ✅ Renders in DB order (as set by admin drag-reorder)
                        activeCategories.map((cat) => (
                          <li key={cat._id}>
                            <Link
                              to={`/category/${nameToSlug(cat.name)}`}
                              className="flex items-center gap-2.5 pl-9 pr-5 py-2.5 text-[15px] hover:bg-green-100 hover:text-green-700 transition-colors duration-150 font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                              {cat.name}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </details>
                </li>

                <li className="mx-4 h-px bg-gray-100 my-1" />

                {/* Passive */}
                <li className="relative">
                  <details>
                    <summary className="list-none cursor-pointer px-5 py-3 hover:bg-green-50 hover:text-green-700 flex items-center justify-between font-bold text-gray-800 transition-colors duration-150 text-base">
                      <span className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 shadow-sm shadow-teal-200 inline-block flex-shrink-0"></span>
                        Passive Product
                      </span>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </summary>
                    <ul className="bg-gradient-to-b from-green-50/70 to-white border-t border-green-100 py-1">
                      {passiveCategories.length === 0 ? (
                        <li className="px-9 py-2 text-sm text-gray-400 italic">Loading...</li>
                      ) : (
                        // ✅ Renders in DB order (as set by admin drag-reorder)
                        passiveCategories.map((cat) => (
                          <li key={cat._id}>
                            <Link
                              to={`/category/${nameToSlug(cat.name)}`}
                              className="flex items-center gap-2.5 pl-9 pr-5 py-2.5 text-[15px] hover:bg-green-100 hover:text-green-700 transition-colors duration-150 font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                              {cat.name}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </details>
                </li>
              </ul>
            </li>

            {/* Partners */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 px-5 py-3 rounded-xl hover:bg-green-50 hover:text-green-700 transition-all duration-200 group-hover:text-green-700 text-base">
                Partners
                <svg className="w-4 h-4 mt-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-2xl rounded-2xl py-3 w-60 text-gray-700 border border-gray-100 z-50 overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-green-400 to-teal-400 mb-2" />
                {[
                  { to: "/projectLocking", label: "Project Locking" },
                  { to: "/requestDemo", label: "Request a Demo" },
                  { to: "/requestTraining", label: "Request Training" },
                  { to: "/becomePartner", label: "Become a Partner" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="flex items-center gap-2.5 px-5 py-3 text-[15px] hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Support */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 px-5 py-3 rounded-xl hover:bg-green-50 hover:text-green-700 transition-all duration-200 group-hover:text-green-700 text-base">
                Support
                <svg className="w-4 h-4 mt-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-2xl rounded-2xl py-3 w-64 text-gray-700 border border-gray-100 z-50 overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-green-400 to-teal-400 mb-2" />
                {[
                  { to: "/warranty", label: "Warranty" },
                  { to: "/techSquad", label: "Tech Squad" },
                  { to: "/requestDda", label: "Request DOA" },
                  { to: "/supportTools", label: "Support Tools" },
                  { to: "/productSupport", label: "Product Support" },
                  { to: "/warrantyRegistration", label: "Warranty Registration" },
                  { to: "/networkstorageCalculator", label: "Network Storage Calculator" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="flex items-center gap-2.5 px-5 py-3 text-[15px] hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* About */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 px-5 py-3 rounded-xl hover:bg-green-50 hover:text-green-700 transition-all duration-200 group-hover:text-green-700 text-base">
                About
                <svg className="w-4 h-4 mt-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-2xl rounded-2xl py-3 w-60 text-gray-700 border border-gray-100 z-50 overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-green-400 to-teal-400 mb-2" />
                {[
                  { to: "/csr", label: "CSR" },
                  { to: "/careers", label: "Careers" },
                  { to: "/contactUs", label: "Contact Us" },
                  { to: "/mediaCenter", label: "Media Center" },
                  { to: "/whistleBlower", label: "Whistle Blower" },
                  { to: "/customers", label: "Our Customers" },
                  { to: "/missionVision", label: "Mission & Vision" },
                  { to: "/leadershipTeam", label: "Leadership Team" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="flex items-center gap-2.5 px-5 py-3 text-[15px] hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link to="/blog" className="px-5 py-3 rounded-xl hover:bg-green-50 hover:text-green-700 transition-all duration-200 inline-block text-base">
                Blog
              </Link>
            </li>
          </ul>

          <Link to="/contactus"
            className="ml-5 relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-7 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-bold text-base shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center p-2 rounded-xl hover:bg-green-50 transition-colors duration-200"
          onClick={() => setMenuOpen(true)}>
          <img src={menuIcon} alt="Menu" className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 flex-shrink-0" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-wide">Navigation</h1>
          </div>
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200">
            <img src={closeIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <ul className="flex flex-col px-4 py-4 text-base font-semibold text-gray-800 overflow-y-auto flex-1 space-y-1">

          {/* Products Mobile */}
          <li>
            <button onClick={() => handleSubmenuToggle('products')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-base ${openMobileSubmenu === 'products' ? 'bg-green-50 text-green-700 shadow-sm' : 'hover:bg-gray-50 hover:text-green-700'}`}>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></span>
                Products
              </span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileSubmenu === 'products' ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <ul className={`${openMobileSubmenu === 'products' ? 'block' : 'hidden'} ml-3 mt-1 space-y-0.5 border-l-2 border-green-200 pl-3`}>
              {/* Active nested */}
              <li>
                <button onClick={() => handleNestedSubmenuToggle('active')}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-[15px] transition-colors duration-150 font-semibold ${openMobileNestedSubmenu === 'active' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex-shrink-0"></span>
                    Active Product
                  </span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openMobileNestedSubmenu === 'active' ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className={`${openMobileNestedSubmenu === 'active' ? 'block' : 'hidden'} ml-3 mt-0.5 space-y-0.5 border-l-2 border-emerald-200 pl-3`}>
                  {/* ✅ DB order preserved */}
                  {activeCategories.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/category/${nameToSlug(cat.name)}`} onClick={handleMobileLinkClick}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[14px] text-gray-500 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Passive nested */}
              <li>
                <button onClick={() => handleNestedSubmenuToggle('passive')}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-[15px] transition-colors duration-150 font-semibold ${openMobileNestedSubmenu === 'passive' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex-shrink-0"></span>
                    Passive Product
                  </span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openMobileNestedSubmenu === 'passive' ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className={`${openMobileNestedSubmenu === 'passive' ? 'block' : 'hidden'} ml-3 mt-0.5 space-y-0.5 border-l-2 border-teal-200 pl-3`}>
                  {/* ✅ DB order preserved */}
                  {passiveCategories.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/category/${nameToSlug(cat.name)}`} onClick={handleMobileLinkClick}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[14px] text-gray-500 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          {/* Partners Mobile */}
          <li>
            <button onClick={() => handleSubmenuToggle('partners')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-base ${openMobileSubmenu === 'partners' ? 'bg-green-50 text-green-700 shadow-sm' : 'hover:bg-gray-50 hover:text-green-700'}`}>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></span>
                Partners
              </span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileSubmenu === 'partners' ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`${openMobileSubmenu === 'partners' ? 'block' : 'hidden'} ml-3 mt-1 space-y-0.5 border-l-2 border-green-200 pl-3`}>
              {[
                { to: "/projectLocking", label: "Project Locking" },
                { to: "/requestDemo", label: "Request a Demo" },
                { to: "/requestTraining", label: "Request Training" },
                { to: "/becomePartner", label: "Become a Partner" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={handleMobileLinkClick}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-[15px] text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Support Mobile */}
          <li>
            <button onClick={() => handleSubmenuToggle('support')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-base ${openMobileSubmenu === 'support' ? 'bg-green-50 text-green-700 shadow-sm' : 'hover:bg-gray-50 hover:text-green-700'}`}>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></span>
                Support
              </span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileSubmenu === 'support' ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`${openMobileSubmenu === 'support' ? 'block' : 'hidden'} ml-3 mt-1 space-y-0.5 border-l-2 border-green-200 pl-3`}>
              {[
                { to: "/warranty", label: "Warranty" },
                { to: "/techSquad", label: "Tech Squad" },
                { to: "/requestDda", label: "Request DDA" },
                { to: "/supportTools", label: "Support Tools" },
                { to: "/productSupport", label: "Product Support" },
                { to: "/warrantyRegistration", label: "Warranty Registration" },
                { to: "/networkstorageCalculator", label: "Network Storage Calculator" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={handleMobileLinkClick}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-[15px] text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* About Mobile */}
          <li>
            <button onClick={() => handleSubmenuToggle('about')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-base ${openMobileSubmenu === 'about' ? 'bg-green-50 text-green-700 shadow-sm' : 'hover:bg-gray-50 hover:text-green-700'}`}>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></span>
                About
              </span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileSubmenu === 'about' ? 'rotate-180 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`${openMobileSubmenu === 'about' ? 'block' : 'hidden'} ml-3 mt-1 space-y-0.5 border-l-2 border-green-200 pl-3`}>
              {[
                { to: "/csr", label: "CSR" },
                { to: "/careers", label: "Careers" },
                { to: "/contactUs", label: "Contact Us" },
                { to: "/mediaCenter", label: "Media Center" },
                { to: "/whistleBlower", label: "Whistle Blower" },
                { to: "/customers", label: "Our Customers" },
                { to: "/missionVision", label: "Mission & Vision" },
                { to: "/leadershipTeam", label: "Leadership Team" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={handleMobileLinkClick}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-[15px] text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Blog */}
          <li>
            <Link to="/blog" onClick={handleMobileLinkClick}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 hover:text-green-700 transition-all duration-200 text-base">
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></span>
              Blog
            </Link>
          </li>

          <li className="pt-2 pb-1">
            <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
          </li>

          <li className="pt-1 px-1">
            <Link to="/contactus" onClick={handleMobileLinkClick}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-200 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-xl hover:shadow-green-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;