import { React, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import bg from '../assets/bg.jpg';

const liftCard =
  "rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl hover:shadow-green-200/60 " +
  "border border-green-300 hover:border-green-500 transition-all duration-500 ease-out hover:-translate-y-1";

const WhistleBlower = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
Privacy Policy — How we collect, use, and protect your information
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 space-y-12">

          {/* CARD 1 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              Our Privacy Policy :
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you visit our website or use our services. Please read this policy carefully to understand our practices regarding your personal information and how we will treat it. By accessing or using our website or services, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          {/* CARD 2 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              Information We Collect:
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 space-y-4">
              We may collect personal information from you in various ways when you interact with our website or use our services.
              <br /><br />
              1.1. Personal Information Provided by You: We may collect personal information such as your name, email address, postal address, phone number, username, and other details you choose to provide.
              <br /><br />
              1.2. Usage Information: We may automatically collect information like IP address, browser type, operating system, referring/exit pages, and clickstream data.
              <br /><br />
              1.3. Cookies and Similar Technologies: We may use cookies and similar tracking technologies to collect browsing preferences and analytics data.
            </p>
          </div>

          {/* CARD 3 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              How We Use Your Information :
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              2.1. To provide and maintain our services. <br /><br />
              2.2. To personalize your experience and improve our website and services. <br /><br />
              2.3. To respond to your inquiries or requests. <br /><br />
              2.4. To send promotional communications. <br /><br />
              2.5. To prevent fraudulent activities. <br /><br />
              2.6. To comply with legal requirements.
            </p>
          </div>

          {/* CARD 4 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              How We Disclose Your Information:
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              3.1. Service Providers: We may share data with third-party providers. <br /><br />
              3.2. Business Transfers: Information may transfer during mergers or acquisitions. <br /><br />
              3.3. Legal Requirements: We may disclose information when required by law.
            </p>
          </div>

          {/* CARD 5 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              Data Security:
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We implement technical and organizational security measures to protect your personal information. However, no method is completely secure.
            </p>
          </div>

          {/* CARD 6 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              Your Choices:
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              4.1. Opt-Out: You may opt out of marketing communications. <br /><br />
              4.2. Cookies: You can disable cookies via browser settings.
            </p>
          </div>

          {/* CARD 7 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              Children's Privacy:
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Our services are not directed to individuals under 13. If a child has provided personal data, contact us for deletion.
            </p>
          </div>

          {/* CARD 8 */}
          <div className={liftCard}>
            <h2 className="text-green-700 text-xl uppercase font-bold mb-4">
              Changes to This Privacy Policy:
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We may update this Privacy Policy from time to time. Updates will reflect a revised Effective Date.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default WhistleBlower;