import React, { useRef, useState,useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import bg from '../../assets/bg.jpg';

// Import images (Vite dynamic import)
const imageModules = import.meta.glob(
  '../../assets/Media-Center/Media-Center/**/*.{png,jpg,jpeg}',
  { eager: true }
);

// Build categories from folder structure
const buildCategoryData = (modules) => {
  const map = new Map();

  for (const path in modules) {
    const img = modules[path].default;
    const parts = path.split('/');
    const idx = parts.lastIndexOf('Media-Center');
    const category = parts[idx + 1];
    if (!category) continue;

    if (!map.has(category)) map.set(category, []);
    map.get(category).push(img);
  }

  return Array.from(map.entries()).map(([title, images]) => ({
    title,
    images
  }));
};

const categories = buildCategoryData(imageModules);

export default function MediaCenter() {
  const [selectedImage, setSelectedImage] = useState(null);

  // single ref storage for horizontal scroll containers
  const scrollRefs = useRef({});

  const downloadImage = (url) => {
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = url.split('/').pop();
        a.click();
      });
  };

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
    <>
      <Navbar />

      {/* Full-page background */}
      <div
              className="min-h-screen bg-cover bg-center"
              style={{ backgroundImage: `url(${bg})` }}
            >    
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Media Center
            </h1>
            <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
              Explore AADONA's latest events, photos & resources
            </p>
          </div>
        </div>

        {/* Content blurred panel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
          <div className="backdrop-blur-sm bg-white/40 py-10 rounded-2xl shadow-lg space-y-24">

            {categories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-700">No media available.</p>
              </div>
            )}

            {categories.map((cat, i) => {
              // create scroll ref for each category
              if (!scrollRefs.current[cat.title]) {
                scrollRefs.current[cat.title] = React.createRef();
              }

              return (
                <section key={i} className="px-4">
                  <h2 className="text-4xl font-bold text-green-800 text-center mb-10">
                    {cat.title}
                  </h2>

                  {/* Horizontal scroll section */}
                  <div className="relative group">

                    {/* Left arrow */}
                    <button
                      onClick={() =>
                        scrollRefs.current[cat.title].current.scrollBy({
                          left: -350,
                          behavior: 'smooth'
                        })
                      }
                      className="
                        hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
                        text-white text-6xl font-bold px-2 py-6 opacity-0 
                        group-hover:opacity-100 hover:text-green-200 transition-all z-20
                      "
                      aria-label={`Scroll ${cat.title} left`}
                    >
                      ‹
                    </button>

                    {/* Scrollable container */}
                    <div
                      ref={scrollRefs.current[cat.title]}
                      className="overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory px-2 pb-4"
                    >
                      <div className="flex gap-8">

                        {cat.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="
                              min-w-[260px] bg-white p-4 rounded-2xl shadow-md snap-start
                              border border-green-300 transition-all duration-500 cursor-pointer
                              hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-200/60
                              hover:border-green-500 hover:scale-105 hover:z-20
                            "
                            onClick={() => setSelectedImage(img)}
                          >
                            <img
                              src={img}
                              className="w-full h-48 object-cover rounded-lg"
                              alt={`${cat.title}-${idx}`}
                              loading="lazy"
                            />

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(img);
                              }}
                              className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                              aria-label="Download image"
                            >
                              Download
                            </button>
                          </div>
                        ))}

                      </div>
                    </div>

                    {/* Right arrow */}
                    <button
                      onClick={() =>
                        scrollRefs.current[cat.title].current.scrollBy({
                          left: 350,
                          behavior: 'smooth'
                        })
                      }
                      className="
                        hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
                        text-white text-6xl font-bold px-2 py-6 opacity-0 
                        group-hover:opacity-100 hover:text-green-200 transition-all z-20
                      "
                      aria-label={`Scroll ${cat.title} right`}
                    >
                      ›
                    </button>

                  </div>
                </section>
              );
            })}

          </div>
        </div>

        {/* Fullscreen Preview Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              className="max-w-[90vw] max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
              alt="Fullscreen Preview"
            />

            <button
              className="absolute top-6 right-6 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        )}

      </div>

      <Footer />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
    </>
  );
}