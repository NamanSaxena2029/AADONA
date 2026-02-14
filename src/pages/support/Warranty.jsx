import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import bg from "../../assets/bg.jpg"; // same background as CSR

/** Scroll-reveal with Tailwind-only transitions */
const Reveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShow(true),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

const liftCard =
  "rounded-2xl bg-white p-6 shadow-md hover:shadow-2xl hover:shadow-green-200/60 " +
  "border border-green-300 hover:border-green-500 transition-all duration-500 ease-out " +
  "hover:-translate-y-1";

const liftSection =
  "rounded-2xl bg-white p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-green-100/70 " +
  "border border-green-200 hover:border-green-400 transition-all duration-500 ease-out " +
  "hover:-translate-y-1";

const Warranty = () => {
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
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* CSR-style Hero Section */}        
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Warranty
              </h1>
              <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
                Standard terms, claim process, and extended coverage.
              </p>
            </div>
          </div>
        </div>
        
        {/* MAIN — removed the large frosted wrapper; sections render directly.
            We still keep per-section white cards for readability */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8">
          {/* Overview cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Reveal>
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Standard Warranty
                  </h3>
                </div>
                <p className="text-slate-600">
                  Coverage starts from the purchase date once your product is
                  registered with invoice.
                </p>
              </div>
            </Reveal>

            <Reveal className="delay-100">
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <FileCheck2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Claim Process
                  </h3>
                </div>
                <p className="text-slate-600">
                  Submit a claim online with serial, invoice, and registration
                  token. Our team will verify and respond.
                </p>
              </div>
            </Reveal>

            <Reveal className="delay-200">
              <div className={liftCard}>
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    When It’s Void
                  </h3>
                </div>
                <p className="text-slate-600">
                  Physical damage, tampering, incorrect serials, or power
                  surge issues may void warranty.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Full content sections */}
          <main className="space-y-10">
            <Reveal>
              <section className={liftSection}>
                <h2 className="text-2xl md:text-3xl font-bold text-teal-900">
                  Standard warranty terms
                </h2>
                <p className="mt-3 text-lg font-semibold text-teal-900">
                  Please adhere to these as prerequisite to avail warranty
                </p>
                <ol className="mt-5 list-decimal pl-6 space-y-3 leading-relaxed text-slate-700">
                  <li>
                    Once customer buy product it is mandatory to register product within 15 days on our website along with invoice copy{" "}
                    <a
                      className="text-teal-700 underline underline-offset-2"
                      href="https://aadona.com/product-registration/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      https://aadona.com/product-registration/
                    </a>
                  </li>
                  <li>
                    Invoice must carry product serial numbers clearly along with model number.
                  </li>
                  <li>
                    Warranty will be counted from the day of purchase and the invoice uploaded during product registration.
                  </li>
                  <li>If invoice is not uploaded during online product registration.</li>
                  <li>
                    If invoice is missing, warranty will be counted 3 months from the date of import.
                  </li>
                </ol>
              </section>
            </Reveal>

            <Reveal>
              <section className={liftSection}>
                <h3 className="text-2xl md:text-3xl font-bold text-teal-900">
                  Warranty claim requirements
                </h3>
                <p className="mt-2 text-slate-700">
                  For warranty claim customer need to log warranty claim through our website after login in to customer section and submit warranty claim form along with below details like:-
                </p>
                <ul className="mt-4 list-disc pl-6 space-y-2 leading-relaxed text-slate-700">
                  <li>Model name</li>
                  <li>Date of purchase</li>
                  <li>
                    Serial number (Be careful on this as wrong serial number means warranty rejection)
                  </li>
                  <li>Full Name of purchase source</li>
                  <li>City of purchase</li>
                  <li>
                    Product registration token number (This is the one you got over mail when you registered your product with us)
                  </li>
                  <li>Invoice copy with serial number</li>
                  <li>Email ID</li>
                  <li>
                    Direct contact number (You may get a call back for basic troubleshooting on the same number)
                  </li>
                </ul>

                <ul className="mt-6 list-disc pl-6 space-y-2 leading-relaxed text-slate-700">
                  <li>
                    Our support team help troubleshooting and verification and issue ticket number if found faulty.
                  </li>
                  <li>
                    Company obligation under this policy shall be limited to repairing by replacing the damaged part. In case the machine is beyond repair, the company has option to replace it. At any given point of time, the maximum value of claims, if entertained by the company, will be subject to maximum retail price of product purchased or the purchase price, whichever is lower.
                  </li>
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section className={liftSection}>
                <h3 className="text-2xl md:text-3xl font-bold text-teal-900">
                  Process of paid warranty
                </h3>
                <p className="mt-1 font-semibold text-slate-800">Advanced replacement policy</p>
                <ul className="mt-4 list-disc pl-6 space-y-2 leading-relaxed text-slate-700">
                  <li>Process remains same as above from point 1 to point 9</li>
                  <li>We ship the unit immediately to your address once warranty is authorized and approved</li>
                  <li>
                    You have to ship faulty unit back on to pay basis within 7 days of receiving the unit, for this you have to pay the security deposit for the cost of device which you will get refund within 7 days once we receive the faulty unit at our end
                  </li>
                  <li>Try to ship the unit back in the original box without any accessories to avoid any physical damage during transit</li>
                  <li>Shipping back unit safely is customer’s responsibility, in case of receiving physical damaged unit the replacement unit will be fully charged as new with new warranty on it.</li>
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section className={liftSection}>
                <h3 className="text-2xl md:text-3xl font-bold text-teal-900">
                  When is warranty void?
                </h3>
                <ul className="mt-4 list-disc pl-6 space-y-2 leading-relaxed text-slate-700">
                  <li>Product got burned out due to electrical fault at customer end, like power surge, fluctuation, over power, reverse current, short circuit</li>
                  <li>Product got damage faulty due to customer negligence like water leakage, free fall, improper installation, rusting etc.</li>
                  <li>Serial number is missing or not in a readable format</li>
                  <li>Unauthorized product tampering, attempt of open, attempt to repair</li>
                  <li>If security seal is damaged</li>
                  <li>Tampering with product firmware</li>
                  <li>Product is physically damaged</li>
                  <li>Serial number on invoice and on device do not match</li>
                  <li>If device is reported or flagged under payment issue with point of sales</li>
                  <li>If product ownership changes to someone else or reported stolen</li>
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section className={liftSection}>
                <h3 className="text-2xl md:text-3xl font-bold text-teal-900">
                  Extended warranty terms
                </h3>
                <ul className="mt-4 list-disc pl-6 space-y-2 leading-relaxed text-slate-700">
                  <li>Extended warranty must be purchased within 45 days of purchase of the product.</li>
                  <li>Extended warranty only covers carry in warranty until specified otherwise.</li>
                  <li>In case onsite warranty is required the cost will be as per actuals.</li>
                  <li>Extended warranty only covers replacement / repair of the faulty component.</li>
                  <li>Extended warranty excludes product installation, setting, data recovery, network sharing and other admin services.</li>
                  <li>Extended warranty does not include accessories like antenna, power adapter, power cable, HDD’s etc until specified otherwise.</li>
                  <li>If extended warranty purchase request is made after the expiry of the standard warranty company reserves the right to accept or reject the request.</li>
                  <li>If extended warranty is purchased after the expiry of the standard warranty company reserve the right to physically examine the product, verify through old data, customer records to verify if required.</li>
                  <li>If extended warranty is purchased after the expiry of standard warranty an addition 3% per year would be charged from the date of expiry of the standard warranty.</li>
                  <li>Extended warranty only covers manufacturing defects.</li>
                  <li>Extended warranty does not cover product fault due to physical damage, fault due to power surge, fault due to short circuit or burn, fault due to moisture or water.</li>
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Easy online registration
                  </span>
                  <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Ticket-based support
                  </span>
                  <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Transparent process
                  </span>
                </div>
              </section>
            </Reveal>
          </main>

          {/* Single CTA — ABOVE FOOTER */}
          <div className="w-full flex justify-center mt-8">
            <Link
              to="/warrantyCheck"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-8 py-4 font-semibold shadow-xl hover:shadow-2xl hover:shadow-green-300/50 hover:bg-green-700 transition-all duration-500 ease-out hover:-translate-y-0.5"
            >
              Check Warranty
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Warranty;
