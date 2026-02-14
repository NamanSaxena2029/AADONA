import {React,useEffect} from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg';

// Images
import customerCommitment from '../../assets/CustomerCoomitment.png';
import quality from '../../assets/Quality.png';
import integrity from '../../assets/Integrity.png';
import teamwork from '../../assets/TeamWork.png';
import goodCitizenship from '../../assets/GoodCitizenship.png';
import respectPeople from '../../assets/Respect for People.png';
import willToWin from '../../assets/A will to win.png';
import accountability from '../../assets/PersonalAccountability.png';

/* ✅ Hover-Lift Card Style (same as Warranty/CSR) */
const liftCard =
  "rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl hover:shadow-green-200/60 " +
  "border border-green-300 hover:border-green-500 transition-all duration-500 ease-out hover:-translate-y-1";

const ValueCard = ({ title, description, image }) => (
  <div className={liftCard + " flex flex-col items-center"}>
    <div className="bg-[#f8faf9] rounded-full p-6 mb-6 flex items-center justify-center">
      <img src={image} alt={title} className="w-32 h-32 object-contain" />
    </div>
    <h3 className="text-xl font-medium text-green-800 mb-3">{title}</h3>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </div>
);

const MissionVision = () => {
  const values = [
    { title: "Customer Commitment", description: "We develop relationships that make a positive difference in our customers' lives.", image: customerCommitment },
    { title: "Quality", description: "We provide outstanding products and unsurpassed services that deliver premium value.", image: quality },
    { title: "Integrity", description: "We uphold the highest standards of integrity in all of our actions.", image: integrity },
    { title: "Team Work", description: "We work together across boundaries to meet customer needs and help the company win.", image: teamwork },
    { title: "Good Citizenship", description: "We are good citizens in the communities in which we live and work.", image: goodCitizenship },
    { title: "Respect for People", description: "We value our people, encourage their development and reward their performance.", image: respectPeople },
    { title: "A Will to Win", description: "We exhibit a strong will to win in the marketplace and every aspect of business.", image: willToWin },
    { title: "Personal Accountability", description: "We are personally accountable for delivering on our commitments.", image: accountability },
  ];

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* ✅ Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Mission & Vision
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Empowering Your IT Networking Solutions with Integrity and Innovation
            </p>
          </div>
        </div>

        {/* ✅ Mission & Vision Section with Hover Lift */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

            <div className={liftCard}>
              <h2 className="text-3xl font-bold text-green-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At AADONA, our mission revolves around your satisfaction. We are deeply committed
                to the common good, striving to provide exceptional IT networking solutions with
                a focus on security, availability, and reliability.
              </p>
            </div>

            <div className={liftCard}>
              <h2 className="text-3xl font-bold text-green-800 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our vision is clear: to become India's premier IT network solutions provider,
                catering to diverse needs. Rooted in customer-centricity, our vision drives our
                relentless pursuit of excellence.
              </p>
            </div>

          </div>

          {/* ✅ Values Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Our Values Define Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>

          {/* ✅ Footer text as card */}
          <div className="mt-16">
            <div className={liftCard}>
              <p className="text-lg text-gray-600 text-center leading-relaxed max-w-4xl mx-auto">
                With a firm resolve to adapt and innovate, we strive for continual improvement,
                ensuring a better tomorrow for our customers, our company, and our communities.
                Join AADONA on the journey towards excellence in IT networking solutions.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default MissionVision;
