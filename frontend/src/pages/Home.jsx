import { useEffect, useState, useContext } from "react";
import api, { getErrorMessage } from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiRefreshCw, FiSearch, FiSliders } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { resolveAssetUrl } from "../api/config";

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
    const confirmed = window.confirm(
      "Delete this product? Listings with booking history cannot be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  };

  const fetchProducts = async (nextFilters = filters) => {
    try {
      setLoading(true);

      const cleanedFilters = Object.fromEntries(
        Object.entries(nextFilters).filter(([_, value]) => value !== "" && value !== null)
      );

      const res = await api.get("/products/filter", {
        params: cleanedFilters,
      });

      const pageData = res.data.data;
      setProducts(Array.isArray(pageData.content) ? pageData.content : []);
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

  const activeFilters = Object.values(filters).filter(Boolean).length;
  const resetFilters = () => {
    const clearedFilters = {
      title: "",
      category: "",
      min: "",
      max: "",
    };
    setFilters(clearedFilters);
    fetchProducts(clearedFilters);
  };

  return (
    <div className="space-y-10 pb-6">
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
      >
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <p className="section-kicker">Find something worth borrowing</p>
            <h1 className="hero-title max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Rent standout gear, everyday essentials, and hidden gems from people nearby.
            </h1>
            <p className="muted-copy max-w-2xl text-base leading-7 sm:text-lg">
              Browse listed items, compare daily pricing, and book with a cleaner, calmer flow.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                {products.length} live listings
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                {activeFilters} active filters
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-[28px] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200/70">Quick Start</p>
              <p className="mt-3 text-3xl font-black text-white">24h</p>
              <p className="muted-copy mt-2 text-sm">Fast daily rental format for simple bookings.</p>
            </div>
            <div className="rounded-[28px] border border-emerald-300/20 bg-emerald-300/10 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-200/80">Owner Friendly</p>
              <p className="mt-3 text-3xl font-black text-emerald-100">Approve</p>
              <p className="mt-2 text-sm text-emerald-100/80">Search by category, price, and product type with less guesswork.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel rounded-[32px] p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Filters</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Refine your search</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <FiSliders />
            Tailor by title, category, and price range
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto_auto]">
          <input
            value={filters.title}
            placeholder="Search by title"
            className="field-shell"
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
          <input
            value={filters.category}
            placeholder="Category"
            className="field-shell"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
          <input
            value={filters.min}
            placeholder="Min price"
            type="number"
            className="field-shell"
            onChange={(e) => setFilters({ ...filters, min: e.target.value })}
          />
          <input
            value={filters.max}
            placeholder="Max price"
            type="number"
            className="field-shell"
            onChange={(e) => setFilters({ ...filters, max: e.target.value })}
          />
          <button
            onClick={() => fetchProducts()}
            className="cta-primary flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-slate-950 transition-all duration-300"
          >
            <FiSearch />
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10"
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>
      </motion.section>

      {loading ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="glass-panel animate-pulse rounded-[30px] p-6">
              <div className="h-64 rounded-[24px] bg-white/8" />
              <div className="mt-6 h-4 w-24 rounded bg-white/8" />
              <div className="mt-4 h-8 w-2/3 rounded bg-white/8" />
              <div className="mt-4 space-y-3">
                <div className="h-3 rounded bg-white/8" />
                <div className="h-3 rounded bg-white/8" />
              </div>
              <div className="mt-6 h-12 rounded-2xl bg-white/8" />
            </div>
          ))}
        </section>
      ) : products.length === 0 ? (
        <div className="glass-panel rounded-[28px] p-8 text-slate-300">No products found.</div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="glass-panel overflow-hidden rounded-[30px] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={resolveAssetUrl(product.imageUrl)}
                  alt={product.title}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                    product.available
                      ? "bg-emerald-400/15 text-emerald-200"
                      : "bg-rose-400/15 text-rose-200"
                  }`}
                >
                  {product.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">
                      {product.category || "General"}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{product.title}</h2>
                  </div>
                  <span className="text-right text-2xl font-black text-teal-300">Rs {product.pricePerDay}</span>
                </div>

                <p className="muted-copy line-clamp-3 text-sm leading-6">{product.description}</p>
                {product.ownerEmail && (
                  <p className="text-sm text-slate-400">Listed by {product.ownerEmail}</p>
                )}

                {product.ownerId === user?.id && (
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="w-full rounded-2xl border border-rose-400/20 bg-rose-400/10 py-3 font-medium text-rose-200 transition-all duration-300 hover:bg-rose-400/20"
                  >
                    Delete Product
                  </button>
                )}

                <Link
                  to={`/products/${product.id}`}
                  className="cta-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-slate-950 transition-all duration-300"
                >
                  View Details
                  <FiArrowRight />
                </Link>
              </div>
            </motion.article>
          ))}
        </section>
      )}
    </div>
  );
}
