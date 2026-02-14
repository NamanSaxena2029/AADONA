import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const API = "http://localhost:5000/products";

export default function CategoryProductsPage() {

  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(API)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          p => p.category === decodeURIComponent(categoryName)
        );
        setProducts(filtered);
      });
  }, [categoryName]);

  // Group by SubCategory
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.subCategory]) {
      acc[product.subCategory] = [];
    }
    acc[product.subCategory].push(product);
    return acc;
  }, {});

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 pt-28 px-10 pb-16">

        <h1 className="text-4xl font-bold text-center text-green-800 mb-12">
          {decodeURIComponent(categoryName)}
        </h1>

        {Object.keys(grouped).map(sub => (
          <div key={sub} className="mb-16">

            <h2 className="text-2xl font-semibold text-green-700 mb-6">
              {sub}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {grouped[sub].map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  <h3 className="text-lg font-bold text-green-800 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    {product.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

      <Footer />
    </>
  );
}
