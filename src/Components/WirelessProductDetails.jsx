import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Wifi, Shield, Zap, Check } from 'lucide-react';
import { wirelessProducts } from '../Components/wirelessData'; // Create this data file
import Navbar from './Navbar';
import Footer from './Footer';

const WirelessProductDetails = () => {
  const { model } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the product data based on the URL parameter
  const product = useMemo(() => {
    return wirelessProducts.find(p => p.model.toLowerCase() === model.toLowerCase());
  }, [model]);

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
        <Link to="/wireless" className="mt-4 text-green-600 hover:underline">Return to Wireless Solutions</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-12">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/">Home</Link> / <Link to="/wireless">Wireless</Link> / <span className="text-green-600 font-semibold">{product.model}</span>
          </div>
          <Link to="/wireless" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center">
            <img 
              src={product.imageUrl} 
              alt={product.model} 
              className="max-h-[400px] w-auto object-contain transition-transform hover:scale-105 duration-500" 
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold w-fit mb-4">
              {product.series || 'APOLLO SERIES'}
            </span>
            <h1 className="text-5xl font-black text-gray-900 mb-2">{product.model}</h1>
            <h2 className="text-xl text-gray-500 mb-6 font-medium">{product.fullName}</h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <QuickStat label="Category" value={product.category} />
              <QuickStat label="Segment" value={product.segment} />
              <QuickStat label="Standard" value={product.standard || 'Enterprise'} />
            </div>

            <button className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-green-100 w-full md:w-fit">
              <Download size={20} /> Download Datasheet
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b overflow-x-auto">
              {['overview', 'features', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'text-green-600 border-b-2 border-green-600 bg-white' 
                    : 'text-gray-400 hover:text-gray-600 bg-gray-50/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-12">
              {activeTab === 'overview' && (
                <div className="max-w-4xl">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Technical Overview</h3>
                  <p className="text-gray-600 text-lg leading-loose">{product.overview || product.description}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.features?.map((feature, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-green-600 mb-4 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                         <Check size={16} /> Key Feature
                      </div>
                      <p className="text-gray-800 font-semibold">{typeof feature === 'string' ? feature : feature.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-8">
                   {/* Render your specs table logic here */}
                   <p className="text-gray-500 italic">Detailed specifications for {product.model} available in the datasheet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const QuickStat = ({ label, value }) => (
  <div className="bg-gray-100 p-3 rounded-xl">
    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value}</p>
  </div>
);

export default WirelessProductDetails;