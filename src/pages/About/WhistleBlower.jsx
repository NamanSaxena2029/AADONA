import {React,useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg';

/* ✅ Hover-Lift Card Style */
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

      {/* Background with CSR style */}
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
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Whistle Blower
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Ensuring Ethics, Integrity & Transparency
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto px-6 sm:px-8 mt-16 pb-20 space-y-10">

          {/* ✅ CARD 1 */}
          <div className={liftCard}>
            <p className="text-lg leading-relaxed text-gray-700">
              As per AADONA top management, the final ruling regarding standards relating
              to regular internal audit requires that AADONA COMMUNICATION provide a
              facility for the receipt, retention, and treatment of complaints received
              regarding accounting, misconducts, ethical, and integrity issues, internal
              accounting controls, or auditing matters. Your message is encrypted and
              will be delivered directly to the CEO.
            </p>
          </div>

          {/* ✅ CARD 2 */}
          <div className={liftCard}>
            <p className="text-lg leading-relaxed text-gray-700">
              Understanding and acting upon any issues that exist regarding financial,
              accounting, and/or audit matters is an essential component of AADONA
              COMMUNICATION’s ability to take action and ensure the highest levels of
              ethics, integrity, and transparency to keep systems clean.
            </p>
          </div>

          {/* ✅ CARD 3 */}
          <div className={liftCard}>
            <p className="text-lg leading-relaxed text-gray-700">
              We love our customers. If you have seen any unethical practice or behavior
              in AADONA by any of our team members or partners related to our business,
              feel free to drop us a mail through the secure form below or give us a
              direct call and speak to the CEO during normal business hours. We are
              committed to keeping things clean here.
            </p>
          </div>

          {/* ✅ BUTTON */}
          <div className="text-center">
            <Link to="/whistleButton">
              <button className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all">
                Whistle Blower Form
              </button>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default WhistleBlower;
