import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Home() {

  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    min: "",
    max: "",
  });

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );

      const res = await api.get("/products/filter", {
        params: cleanedFilters,
      });

      const pageData = res.data.data;

      if (Array.isArray(pageData.content)) {
        setProducts(pageData.content);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-28">

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Explore Rentals
      </motion.h1>

      {/* FILTER SECTION */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 shadow-lg flex flex-wrap gap-4"
      >

        <input
          placeholder="Search Title"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 transition w-48"
          onChange={(e) =>
            setFilters({ ...filters, title: e.target.value })
          }
        />

        <input
          placeholder="Category"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 transition w-40"
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />

        <input
          placeholder="Min Price"
          type="number"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 transition w-32"
          onChange={(e) =>
            setFilters({ ...filters, min: e.target.value })
          }
        />

        <input
          placeholder="Max Price"
          type="number"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 transition w-32"
          onChange={(e) =>
            setFilters({ ...filters, max: e.target.value })
          }
        />

        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <FiSearch />
          Apply
        </button>

      </motion.div>

      {/* PRODUCT GRID */}

      {loading ? (
        <div className="text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400">No products found.</div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {products.map((product, index) => (

            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:scale-105 hover:shadow-cyan-500/20 transition-all duration-300"
            >

              <img
                src={`http://localhost:8080/${product.imageUrl}`}
                alt={product.title}
                className="h-60 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-xl font-semibold">
                  {product.title}
                </h2>

                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mt-6">

                  <span className="text-2xl font-bold text-cyan-400">
                    ₹{product.pricePerDay}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      product.available
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {product.available ? "Available" : "Unavailable"}
                  </span>

                </div>

                {/* OWNER DELETE BUTTON */}

                {product.ownerId === user?.id && (
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 py-2 rounded-xl"
                  >
                    Delete Product
                  </button>
                )}

                <Link
                  to={`/products/${product.id}`}
                  className="block mt-4 text-center bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105 transition-all duration-300 py-2 rounded-xl"
                >
                  View Details
                </Link>

              </div>

            </motion.div>

          ))}

        </div>

      )}
    </div>
  );
}