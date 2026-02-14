import React from "react";
import { Link } from "react-router-dom";
import linkedin from "../assets/linkedin.png";
import facebook from "../assets/facebook.png";
import insta from "../assets/insta.png";

const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-2">
            <h4 className="text-xl font-bold mb-2 text-green-400">
              AADONA
            </h4>

            <div className="space-y-3 text-sm">

              <p><strong>Headquarters:</strong></p>

              <h4 className="font-semibold">
                AADONA Communication Pvt Ltd.
              </h4>

              <p>
                1st Floor, Phoenix Tech Tower, Plot No. 14/46,
                IDA – Uppal, Hyderabad, Telangana 500039
              </p>

              <p>
                <strong>PHONE:</strong>{" "}
                <a href="tel:18002026599" className="hover:text-green-400">
                  1800-202-6599
                </a>
              </p>

              <p>
                <strong>EMAIL:</strong>{" "}
                <a href="mailto:contact@aadona.com" className="hover:text-green-400">
                  contact@aadona.com
                </a>
              </p>

              <p>
                <strong>BUSINESS HOURS:</strong><br />
                Monday to Friday: 10:30 AM - 06:30 PM
              </p>

            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/warranty">Support</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contactus">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">
              Subscribe for updates.
            </p>

            <div className="mt-6 flex space-x-6">
              <a href="https://www.linkedin.com/company/aadona/">
                <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/">
                <img src={facebook} alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/">
                <img src={insta} alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-green-600 text-center text-sm">
          © {new Date().getFullYear()} AADONA Communication Pvt Ltd.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
