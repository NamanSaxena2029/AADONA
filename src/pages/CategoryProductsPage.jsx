import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import CheckCircle from "../assets/checkcircle.png";

const API = "http://localhost:5000/products";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer flex flex-col group 
                    transform transition duration-300 ease-in-out 
                    hover:shadow-2xl hover:scale-[1.02] hover:border-green-500 border border-transparent">
      
      {/* Product Image Area */}
      <div className="h-48 flex items-center justify-center p-4 bg-gray-50 border-b border-gray-100">
        <img
          className="max-h-full object-contain"
          src={product.image}
          alt={product.name}
        />
      </div>

      {/* Product Details - Left Aligned */}
      <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between text-left">
        <div> 
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-600 text-base mb-4">
              {product.description}
            </p>
          )}
        </div>

        {/* Features with Image Checkmark Icons */}
        {product.features && product.features.length > 0 && (
          <ul className="text-gray-700 text-base mb-6 space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <img
                  src={CheckCircle}
                  alt="Check"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-auto"> 
          <Link 
            to={`/product/${product._id}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                       text-base font-medium rounded-md shadow-sm text-white bg-green-600 
                       hover:bg-green-700 hover:shadow-lg transition duration-200 ease-in-out w-full"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function CategoryProductsPage() {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);
  
  const [products, setProducts] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState("");
  const [activeDetail, setActiveDetail] = useState("");

  const detailContent = {
    "Business": {
      title: "Business Grade Solutions",
      para: "Optimized for Small to Medium Enterprises (SMEs). These solutions provide professional-grade reliability and performance for growing businesses."
    },
    "Enterprise": {
      title: "Enterprise Infrastructure",
      para: "Designed for mission-critical deployments, high-density environments, and complex network architectures requiring the highest standards."
    },
    "Web Smart POE": { title: "Web Smart POE", para: "Power over Ethernet switches with smart management features for enhanced network control." },
    "Web Smart Non POE": { title: "Web Smart Non POE", para: "High-performance smart switches for data-only network requirements." },
    "Managed POE": { title: "Managed POE", para: "Fully managed switches providing granular control and power delivery for networked devices." },
    "Managed Non POE": { title: "Managed Non POE", para: "Advanced managed switches for secure, high-speed backbone connectivity." },
    "POE Switches": { title: "POE Enabled", para: "Delivering both data and power through a single cable for simplified infrastructure." },
    "Non POE Switches": { title: "Standard Connectivity", para: "Reliable, high-speed data switching for high-performance computing environments." }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(p => p.category === decodedCategory);
        setProducts(filtered);
        
        if (filtered.length > 0) {
          const subCats = [...new Set(filtered.map(p => p.subCategory))];
          setActiveSubCategory(subCats[0]);
        }
      })
      .catch(err => console.error("API Error:", err));
  }, [decodedCategory]);

  useEffect(() => {
    // AdminPanel ke 'extraCategory' ko yahan match kar rahe hain
    const availableDetails = [...new Set(products
      .filter(p => p.subCategory === activeSubCategory && p.extraCategory)
      .map(p => p.extraCategory))];
    
    if (availableDetails.length > 0) {
      setActiveDetail(availableDetails[0]);
    } else {
      setActiveDetail("");
    }
  }, [activeSubCategory, products]);

  const subCategories = [...new Set(products.map(p => p.subCategory))];
  const detailOptions = [...new Set(products
    .filter(p => p.subCategory === activeSubCategory && p.extraCategory)
    .map(p => p.extraCategory))];

  const filteredProducts = products.filter((p) => {
    const matchesSub = p.subCategory === activeSubCategory;
    if (detailOptions.length > 0) {
      return matchesSub && p.extraCategory === activeDetail;
    }
    return matchesSub;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ORIGINAL HERO HEADER DESIGN */}
      <div className="bg-white py-12 shadow-md mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 border-b-4 border-green-500 inline-block pb-1 uppercase">
            {decodedCategory}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 space-y-8 flex flex-col items-center">
        {/* SubCategory Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {subCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveSubCategory(cat)}
              className={`px-8 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                activeSubCategory === cat ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level 3 Toggle */}
        {detailOptions.length > 0 && (
          <div className="flex flex-col items-center space-y-8 w-full">
            <div className="flex items-center gap-2 bg-gray-200/60 p-1.5 rounded-full border border-gray-300">
              {detailOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveDetail(opt)}
                  className={`px-10 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeDetail === opt ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* CATEGORY INFO BOX (With Safety Check to prevent crash) */}
            {activeDetail && detailContent[activeDetail] && (
              <div className="max-w-4xl w-full p-8 bg-white border-l-8 border-green-500 shadow-xl rounded-r-xl text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {detailContent[activeDetail].title}
                </h2>
                <p className="text-gray-600 italic leading-relaxed">
                  {detailContent[activeDetail].para}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 flex-grow w-full">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 w-full">
            <h3 className="text-xl font-bold text-gray-400">No products available in this section</h3>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}