import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Check,
  Wifi,
  Shield,
  Zap,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const iconMap = {
    wifi: <Wifi className="w-7 h-7" />,
    zap: <Zap className="w-7 h-7" />,
    shield: <Shield className="w-7 h-7" />,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/products/${slug}`
        );
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!product) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 mt-25 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-24 left-6 bg-white shadow-md px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Image */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[400px] mx-auto object-contain"
              />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
                {product.category}
              </span>

              <h1 className="text-4xl font-bold">
                {product.name}
              </h1>

              <p className="text-gray-600 text-lg">
                {product.description}
              </p>

              {product.highlights?.length > 0 && (
                <ul className="space-y-2">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="text-green-600 w-5 h-5" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Datasheet
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">

            <div className="flex gap-6 border-b">
              {["overview", "features", "specifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 mt-8">

              {activeTab === "overview" && (
                <p>{product.overview?.content}</p>
              )}

              {activeTab === "features" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {product.featuresDetail?.map((f, i) => (
                    <div key={i} className="border p-6 rounded-xl">
                      {iconMap[f.iconType] || <Wifi />}
                      <h3 className="font-bold mt-4">{f.title}</h3>
                      <p>{f.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "specifications" &&
                product.specifications &&
                Object.entries(product.specifications).map(
                  ([category, specs]) => (
                    <div key={category} className="mb-8">
                      <h3 className="font-bold text-xl mb-4">
                        {category}
                      </h3>
                      {Object.entries(specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b"
                        >
                          <span>{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;