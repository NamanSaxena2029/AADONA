import React, { useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import Pinakii from "../../assets/Pinaki_Chatterjee.avif";
import Senthil from "../../assets/Senthil_VP_Kumar.avif";
import Govind from "../../assets/Govind_Madhav.avif";
import Chandan from "../../assets/Chandan_Sharma.avif";
import bg from "../../assets/bg.jpg";
import linkedin from "../../assets/linkedin.png"; // ✅ LinkedIn logo imported

// ✅ Hover-Lift Card Style
const liftCard =
  "rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl hover:shadow-green-200/60 " +
  "border border-green-300 hover:border-green-500 transition-all duration-500 ease-out hover:-translate-y-1";

const leaders = [
  {
    name: "Pinakii Chatterjje",
    title: "CEO and Founder",
    bio: "Pinakii Chatterjje has a long track record of establishing as well as expanding new brands in India. Holding a dual MBA degree and numerous technical certifications, he comes as a veteran in IT network technology space and has successfully played sales leadership roles with leading organisations. Prior to setting up his own venture AADONA COMMUNICATION he had played key roles in setting up new brands across India in his stint spanning over 20 years and created multiple new opportunities for IT channel partners. Pinakii in his spare time loves to cook, drive and read books.",
    linkedin: "https://in.linkedin.com/in/pinakiichatterjje",
    photo: Pinakii,
  },
  {
    name: "Senthil VP Kumar",
    title: "Regional Sales Director and Co-Founder",
    bio: "VP Senthil Kumar has a great track record of working from the ground up and creating successful brands in India, right from his first assignment in 1997 he has always played a key strategic role in creating and nurturing brands. Senthil has a BSc degree in Physics and various technical certifications. Known for attention to detail, ethics and integrity, he plays a key strategic role at AADONA. In his spare time he enjoys yoga, reading, travelling and trying exotic food.",
    linkedin: "https://www.linkedin.com/in/senthil-kumar-a5283275/",
    photo: Senthil,
  },
  {
    name: "Govind Madhav",
    title: "Vice President Product Management and Founder",
    bio: "Govind is a technology enthusiast bringing a vast pool of experience in field sales and product management. A B.Tech in Computer Science, he has worked extensively in presales roles for global technology brands. His expertise spans Wireless, Networking, Security and Storage solutions. Govind enjoys reading, music and travelling.",
    linkedin: "https://www.linkedin.com/in/govind-madhav-426a0957/",
    photo: Govind,
  },
  {
    name: "Chandan Sharma",
    title: "Chief Legal Officer",
    bio: "Dr Chandan Sharma holds a multidisciplinary background with expertise in corporate, IP, compliance, technology and company law. A Masters in Law and a Doctorate holder, he actively supports RTI initiatives and contributes views on cloud regulatory issues across government bodies. In spare time he supports NGO work and follows new-age technologies.",
    linkedin: "https://in.linkedin.com/in/chandan-sharma-a26b1a10",
    photo: Chandan,
  },
];

const LeadershipTeam = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      {/* ✅ Background Section */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* ✅ Header Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Leadership Team
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Guiding AADONA’s Vision & Strategy
            </p>
          </div>
        </div>

        {/* ✅ Leader Cards Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col gap-10">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className={`${liftCard} flex flex-col md:flex-row gap-8 items-center`}
              >
                {/* ✅ Image Section */}
                <div className="flex items-center justify-center w-48 h-48">
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-full h-full rounded-full object-cover object-top border-2 border-gray-200 p-1 bg-white"
                  />
                </div>

                {/* ✅ Text Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {leader.name}
                    </h3>
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <img
                        src={linkedin}
                        alt="LinkedIn"
                        className="w-6 h-6"
                      />
                    </a>
                  </div>
                  <h4 className="text-gray-600 mt-1 text-lg font-medium">
                    {leader.title}
                  </h4>
                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LeadershipTeam;