import React, { useState, useEffect } from "react";
import hero from "../assets/hero.jpg";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.aadona.com"; // ✅ UPDATE to your actual domain

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const textContainerClasses = `
    p-6 pt-6 backdrop-blur-sm sm:backdrop-blur-none md:p-8 max-w-lg md:ml-12 
    transition-transform duration-1000 ease-out
    ${isVisible ? "translate-x-0 opacity-100" : "translate-x-[-100%] opacity-0"}
    hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 transform
  `;

  // JSON-LD — WebSite (enables Google Sitelinks Search Box)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AADONA",
    url: SITE_URL,
    description:
      "AADONA is a truly Indian IT brand offering enterprise & SME networking solutions — switches, wireless APs, routers, and more across India.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // JSON-LD — Organization (brand authority + Knowledge Panel)
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AADONA",
    alternateName: ["AADONA India", "AADONA IT Solutions"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 200,
      height: 60,
    },
    image: `${SITE_URL}/hero.jpg`,
    description:
      "AADONA — Truly Indian Brand for Bharat. Transforming IT Solutions with Integrity, Innovation, and Customer-Centric Values.",
    foundingCountry: "IN",
    areaServed: "IN",
    knowsAbout: [
      "IT Networking",
      "Enterprise Solutions",
      "Wireless Networking",
      "Network Switches",
      "POE Switches",
      "Managed Switches",
      "SME IT Solutions",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      // ✅ Add your social profile URLs here
      // "https://www.linkedin.com/company/aadona",
      // "https://twitter.com/aadona",
      // "https://www.facebook.com/aadona",
    ],
  };

  // JSON-LD — WebPage (homepage)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "AADONA - Truly Indian Brand for Bharat",
    description:
      "AADONA: Transforming IT Solutions with Integrity, Innovation, and Customer-Centric Values.",
    isPartOf: { "@type": "WebSite", url: SITE_URL },
    about: { "@type": "Organization", name: "AADONA" },
    inLanguage: "en-IN",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
  };

  return (
    <>
      <Helmet>
        {/* ── CORE ─────────────────────────────────────────────── */}
        <title>AADONA - Truly Indian IT Brand | Networking Solutions for Bharat</title>
        <meta
          name="description"
          content="AADONA — India's trusted IT networking brand. Enterprise & SME solutions: managed switches, wireless APs, POE switches & more. Integrity, Innovation, Excellence."
        />
        <meta
          name="keywords"
          content="AADONA, AADONA India, truly Indian IT brand, IT networking solutions India, wireless networking India, enterprise network solutions India, managed switches India, POE switch India, SME IT solutions, networking hardware India, buy networking products India, IT hardware supplier India, wireless access point India, network switch dealer India, IT solutions Bharat, networking company India 2025"
        />
        <link rel="canonical" href={SITE_URL} />

        {/* ── INDEXING & CRAWL CONTROL ────────────────────────── */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* ── AUTHORSHIP & IDENTITY ───────────────────────────── */}
        <meta name="author" content="AADONA" />
        <meta name="publisher" content="AADONA" />
        <meta name="copyright" content={`© ${new Date().getFullYear()} AADONA. All rights reserved.`} />
        <meta name="language" content="en-IN" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="geo.placename" content="India" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        <meta name="classification" content="Business, Technology, IT Networking" />
        <meta name="category" content="IT Solutions, Networking Products" />
        <meta name="subject" content="IT Networking Solutions for India" />
        <meta name="coverage" content="India" />
        <meta name="distribution" content="global" />
        <meta name="target" content="all" />

        {/* ── OPEN GRAPH ───────────────────────────────────────── */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AADONA - Truly Indian IT Brand | Networking Solutions for Bharat" />
        <meta
          property="og:description"
          content="AADONA: Transforming IT Solutions with Integrity, Innovation, and Customer-Centric Values. Enterprise & SME networking products across India."
        />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-home.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AADONA — Truly Indian IT Brand for Bharat" />
        <meta property="og:site_name" content="AADONA" />
        <meta property="og:locale" content="en_IN" />

        {/* ── TWITTER CARD ─────────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AADONA - Truly Indian IT Brand | Networking Solutions for Bharat" />
        <meta
          name="twitter:description"
          content="AADONA: Transforming IT Solutions with Integrity, Innovation, and Customer-Centric Values. Enterprise & SME networking products across India."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og-home.jpg`} />
        <meta name="twitter:image:alt" content="AADONA — Truly Indian IT Brand for Bharat" />
        <meta name="twitter:site" content="@AADONA" />     {/* ✅ Update handle */}
        <meta name="twitter:creator" content="@AADONA" />

        {/* ── SECURITY META TAGS ───────────────────────────────── */}
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta
          http-equiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=()"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'self';"
        />

        {/* ── PERFORMANCE / PRECONNECT ────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── MOBILE / PWA ─────────────────────────────────────── */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AADONA" />
        <meta name="format-detection" content="telephone=no" />

        {/* ── STRUCTURED DATA (JSON-LD) ────────────────────────── */}
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      {/* ── UI — EXACTLY SAME AS BEFORE ─────────────────────────── */}
      <div className="w-full h-[400px] sm:h-[600px] md:h-[600px] lg:h-[600px] xl:h-[700px] relative overflow-hidden">

        <img
          src={hero}
          alt="AADONA IT solutions banner"
          loading="lazy"
          className="w-full h-full block object-cover absolute inset-0"
        />

        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative z-10 w-full h-full flex items-center p-10 pt-28 md:p-10">
          <div className={textContainerClasses}>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white mb-3">
              Truly Indian Brand <br className="sm:hidden" />for Bharat
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-200">
              <span className="text-xl md:text-2xl font-bold text-white">AADONA:</span>{" "}
              Transforming IT Solutions with Integrity, Innovation, and Customer-Centric Values - Join Our Journey Towards Excellence!
            </p>

            <Link to="/wireless">
              <button className="mt-6 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0">
                Explore Solutions
              </button>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;