import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import menuIcon from "../assets/menu.png";
import closeIcon from "../assets/close.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // State to manage which mobile submenu is open
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);

  // Helper to toggle submenus
  const handleSubmenuToggle = (submenu) => {
    setOpenMobileSubmenu(openMobileSubmenu === submenu ? null : submenu);
  };

  // Helper to close all menus on link click
  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setOpenMobileSubmenu(null);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {/* Navbar Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Logo - SIZE INCREASED HERE (h-14 -> h-16) */}
        <Link to="/" onClick={() => setOpenMobileSubmenu(null)}>
          <img 
            src={logo} 
            alt="Logo" 
            className="h-16 w-auto object-contain" // Changed h-14 to h-16
          />
        </Link>

        {/* Desktop Navbar - NO CHANGES HERE */}
        <div className="hidden md:flex items-center">
          <ul className="flex items-center justify-between space-x-8 text-lg font-medium text-gray-800">
            {/* Products */}
            <li className="relative group">
              <button className="hover:text-green-600 transition cursor-pointer flex items-center">
                Products
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md pt-2 w-56 text-gray-700 border border-gray-100">
                <li>
                  <Link
                    to="/active"
                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-600 rounded-t-md"
                  >
                    Active Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/passive"
                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-600 rounded-b-md"
                  >
                    Passive Product
                  </Link>
                </li>
              </ul>
            </li>

            {/* Partners */}
            <li className="relative group">
              <button className="hover:text-green-600 transition cursor-pointer flex items-center">
                Partners
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md pt-2 w-56 text-gray-700 border border-gray-100">
                <li>
                  <Link
                    to="/projectLocking"
                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-600"
                  >
                    Project Locking
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requestDemo"
                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-600"
                  >
                    Request a Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requestTraining"
                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-600"
                  >
                    Request Training
                  </Link>
                </li>
                <li>
                  <Link
                    to="/becomePartner"
                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-600 rounded-b-md"
                  >
                    Become a Partner
                  </Link>
                </li>
              </ul>
            </li>

            {/* Support */}
            <li className="relative group">
              <button className="hover:text-green-600 transition cursor-pointer flex items-center">
                Support
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md pt-2 w-56 text-gray-700 border border-gray-100">
                <li><Link to="/warranty" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Warranty</Link></li>
                <li><Link to="/techSquad" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Tech Squad</Link></li>
                <li><Link to="/requestDda" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Request DOA</Link></li>
                <li><Link to="/supportTools" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Support Tools</Link></li>
                <li><Link to="/productSupport" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Product Support</Link></li>
                <li><Link to="/warrantyRegistration" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Warranty Registration</Link></li>
                <li><Link to="/networkstorageCalculator" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600 rounded-b-md">Network Storage Calculator</Link></li>
              </ul>
            </li>

            {/* About */}
            <li className="relative group">
              <button className="hover:text-green-600 transition cursor-pointer flex items-center">
                About
              </button>
              <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md pt-2 w-56 text-gray-700 border border-gray-100">
                <li><Link to="/csr" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">CSR</Link></li>
                <li><Link to="/careers" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Careers</Link></li>
                <li><Link to="/contactUs" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Contact Us</Link></li>
                <li><Link to="/mediaCenter" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Media Center</Link></li>
                <li><Link to="/whistleBlower" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Whistle Blower</Link></li>
                <li><Link to="/customers" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Our Customers</Link></li>
                <li><Link to="/missionVision" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600">Mission & Vision</Link></li>
                <li><Link to="/leadershipTeam" className="block px-4 py-2 hover:bg-green-100 hover:text-green-600 rounded-b-md">Leadership Team</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/blog" className="hover:text-green-600 transition">
                Blog
              </Link>
            </li>
          </ul>

          <Link
            to="/contactus"
            className="ml-10 bg-green-500 text-white px-6 py-2 rounded-full border border-green-500 hover:bg-white hover:text-green-600 transition font-semibold shadow-sm"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button - NO CHANGES HERE */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen(true)}
        >
          <img src={menuIcon} alt="Menu" className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Sidebar - UPDATED LINKS (Paths were corrected in the previous turn) */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-green-50 shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600 mb-2">
          <h1 className="text-xl">Menu</h1>
          <button onClick={() => setMenuOpen(false)}>
            <img src={closeIcon} alt="Close" className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <ul className="flex flex-col space-y-4 px-6 py-6 text-base font-medium text-gray-800 overflow-y-auto h-[calc(100%-80px)]">
          
          {/* Products (Mobile) */}
          <li>
            <button
              onClick={() => handleSubmenuToggle('products')}
              className="cursor-pointer hover:text-green-600 flex items-center justify-between w-full"
            >
              Products
            </button>
            <ul className={`${openMobileSubmenu === 'products' ? 'block' : 'hidden'} ml-4 mt-2 space-y-2 text-gray-700`}>
              <li>
                <Link to="/active" onClick={handleMobileLinkClick}>
                  Active Product
                </Link>
              </li>
              <li>
                <Link to="/passive" onClick={handleMobileLinkClick}>
                  Passive Product
                </Link>
              </li>
            </ul>
          </li>

          {/* Partners (Mobile) */}
          <li>
            <button
              onClick={() => handleSubmenuToggle('partners')}
              className="cursor-pointer hover:text-green-600 flex items-center justify-between w-full"
            >
              Partners
            </button>
            <ul className={`${openMobileSubmenu === 'partners' ? 'block' : 'hidden'} ml-4 mt-2 space-y-2 text-gray-700`}>
              <li>
                <Link to="/projectLocking" onClick={handleMobileLinkClick}>
                  Project Locking
                </Link>
              </li>
              <li>
                <Link to="/requestDemo" onClick={handleMobileLinkClick}>
                  Request a Demo
                </Link>
              </li>
              <li>
                <Link to="/requestTraining" onClick={handleMobileLinkClick}>
                  Request Training
                </Link>
              </li>
              <li>
                <Link to="/becomePartner" onClick={handleMobileLinkClick}>
                  Become a Partner
                </Link>
              </li>
            </ul>
          </li>

          {/* Support (Mobile) */}
          <li>
            <button
              onClick={() => handleSubmenuToggle('support')}
              className="cursor-pointer hover:text-green-600 flex items-center justify-between w-full"
            >
              Support
            </button>
            <ul className={`${openMobileSubmenu === 'support' ? 'block' : 'hidden'} ml-4 mt-2 space-y-2 text-gray-700`}>
              <li><Link to="/warranty" onClick={handleMobileLinkClick}>Warranty</Link></li>
              <li><Link to="/techSquad" onClick={handleMobileLinkClick}>Tech Squad</Link></li>
              <li><Link to="/requestDda" onClick={handleMobileLinkClick}>Request DDA</Link></li>
              <li><Link to="/supportTools" onClick={handleMobileLinkClick}>Support Tools</Link></li>
              <li><Link to="/productSupport" onClick={handleMobileLinkClick}>Product Support</Link></li>
              <li><Link to="/warrantyRegistration" onClick={handleMobileLinkClick}>Warranty Registration</Link></li>
              <li><Link to="/networkstorageCalculator" onClick={handleMobileLinkClick}>Network Storage Calculator</Link></li>
            </ul>
          </li>

          {/* About (Mobile) */}
          <li>
            <button
              onClick={() => handleSubmenuToggle('about')}
              className="cursor-pointer hover:text-green-600 flex items-center justify-between w-full"
            >
              About
            </button>
            <ul className={`${openMobileSubmenu === 'about' ? 'block' : 'hidden'} ml-4 mt-2 space-y-2 text-gray-700`}>
              <li><Link to="/csr" onClick={handleMobileLinkClick}>CSR</Link></li>
              <li><Link to="/careers" onClick={handleMobileLinkClick}>Careers</Link></li>
              <li><Link to="/contactUs" onClick={handleMobileLinkClick}>Contact Us</Link></li>
              <li><Link to="/mediaCenter" onClick={handleMobileLinkClick}>Media Center</Link></li>
              <li><Link to="/whistleBlower" onClick={handleMobileLinkClick}>Whistle Blower</Link></li>
              <li><Link to="/customers" onClick={handleMobileLinkClick}>Our Customers</Link></li>
              <li><Link to="/missionVision" onClick={handleMobileLinkClick}>Mission & Vision</Link></li>
              <li><Link to="/leadershipTeam" onClick={handleMobileLinkClick}>Leadership Team</Link></li>
            </ul>
          </li>

          {/* Other Links */}
          <li>
            <Link to="/blog" onClick={handleMobileLinkClick}>
              Blog
            </Link>
          </li>
          <li>
            {/* This link remains outside the submenu as a primary button link equivalent */}
            <Link to="/contactus" onClick={handleMobileLinkClick} className="bg-green-500 text-white px-4 py-2 rounded-full text-center block mt-4">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;