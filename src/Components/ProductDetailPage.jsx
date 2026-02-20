import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductDetailPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/${slug}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-gray-400">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );

  if (!product) return null;

  return (
    <div className="bg-[#fbf9f9] min-h-screen font-sans antialiased text-[#1a1a1a]">
      <Navbar />

      <div className="max-w-[1240px] mx-auto px-6 pt-32 pb-24">
        
        {/* --- HERO SECTION --- */}
        <div className="bg-white rounded-sm border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] flex flex-col lg:grid lg:grid-cols-12 items-stretch overflow-hidden">
          
          {/* Left: Product Image */}
          <div className="lg:col-span-7 p-12 lg:p-20 flex items-center justify-center bg-[#fafafa]">
            <div className="relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[450px] w-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-5 p-12 lg:p-16 flex flex-col justify-center bg-white border-l border-gray-100">
            <h1 className="text-[34px] font-bold text-[#111] mb-5 leading-tight tracking-tight uppercase">
              {product.name}
            </h1>
            
            <p className="text-[#666] text-[16px] leading-relaxed mb-12">
              {product.description}
            </p>

            <div className="w-full max-w-[380px]">
              {/* ✅ FIXED: Direct Firebase URL open karo */}
              {product.datasheet ? (
                <a
                  href={product.datasheet}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-600 hover:bg-[#008f4c] text-white py-4 rounded-full font-bold text-[15px] shadow-md shadow-green-100/50 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-wider"
                >
                  <Download size={19} strokeWidth={2.5} />
                  Download Datasheet
                </a>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-400 py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-3 uppercase tracking-wider cursor-not-allowed"
                >
                  <Download size={19} strokeWidth={2.5} />
                  Datasheet Not Available
                </button>
              )}
              <p className="text-center text-[11px] text-[#aaa] mt-4 font-bold tracking-[0.05em] uppercase">
                Inquire about volume pricing and availability
              </p>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION --- */}
        <div className="mt-20">
          <div className="flex gap-14 border-b border-gray-200 mb-12 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "1. Product Overview" },
              { id: "features", label: "2. Features" },
              { id: "specifications", label: "3. Specifications" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-5 text-[14px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-[#00A859]" : "text-[#999] hover:text-[#555]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#00A859]" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-[#f9f9f9] border border-gray-100 rounded-sm p-12">
            {activeTab === "overview" && (
              <div className="max-w-4xl text-[16px] text-[#444] leading-[1.8]">
                <p className="whitespace-pre-line">
                  {product.overview?.content || product.description}
                </p>
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
                {product.highlights?.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="text-[#00A859] font-bold text-lg leading-none mt-1">✓</div>
                    <span className="text-[#444] text-[15px] font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-12">
                {product.specifications &&
                  Object.entries(product.specifications).map(([category, specs]) => (
                    <div key={category}>
                      <h3 className="text-sm font-black text-[#111] uppercase tracking-[0.15em] mb-6 border-l-4 border-[#00A859] pl-4">
                        {category}
                      </h3>
                      <div className="border border-gray-200 bg-white shadow-sm">
                        {Object.entries(specs).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-1 md:grid-cols-3 text-[14px] border-b border-gray-100 last:border-0">
                            <div className="p-5 font-bold text-[#333] bg-[#f7f7f7] border-r border-gray-100 uppercase tracking-tight">
                              {key}
                            </div>
                            <div className="md:col-span-2 p-5 text-[#666] leading-relaxed">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;