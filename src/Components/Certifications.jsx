import React from 'react';
import c1 from '../assets/FC.jpg';
import c2 from '../assets/IEC.jpg';
import c3 from '../assets/ISO20000.png';
import c4 from '../assets/14001.jpg';
import c5 from '../assets/ISO9001.png';
import c6 from '../assets/27001.jpg';
import c7 from '../assets/DPIIT.png';
import c8 from '../assets/MakeInIndia.png';
import c9 from '../assets/CE.png';
import c10 from '../assets/rohs_logo.png';
import c11 from '../assets/MSME.jpg';
import c12 from '../assets/startUp.jpg';

const certifications = [c1, c2, c3, c4, c5, c6, c7, c8,c9,c10,c11,c12];

const App = () => {
  return (
    <div className="flex items-start justify-center font-inter mb-18">
      <div className="w-full max-w-7xl mt-6">
        <div className="px-2 py-4 sm:px-4 sm:py-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-12 text-center  tracking-tight">
            Our Certifications
          </h2>

          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2">
            {certifications.map((certUrl, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center w-40 h-28  p-2  transition-all duration-300  hover:shadow-xl hover:bg-white transform hover:scale-[1.05] cursor-default"
              >
                <img
                  src={certUrl}
                  alt={`Certification ${index + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/300x200/333333/cccccc?text=Error';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;