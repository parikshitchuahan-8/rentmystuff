import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api, { getErrorMessage } from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { resolveAssetUrl } from "../api/config";

export default function ProductDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [unavailable, setUnavailable] = useState([]);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && product) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = end - start;
      const days = diffTime / (1000 * 60 * 60 * 24);

      if (days > 0) {
        setTotalDays(days);
        setTotalPrice(days * product.pricePerDay);
      } else {
        setTotalDays(0);
        setTotalPrice(0);
      }
    }
  }, [bookingData, product]);

  useEffect(() => {
    fetchProduct();
    fetchUnavailableDates();
  }, []);

  const hasUnavailableOverlap = unavailable.some(({ startDate, endDate }) => {
    if (!bookingData.startDate || !bookingData.endDate) {
      return false;
    }

    return bookingData.startDate <= endDate && bookingData.endDate >= startDate;
  });

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product");
    }
  };

  const fetchUnavailableDates = async () => {
    try {
      const res = await api.get(`/products/${id}/unavailable-dates`);
      setUnavailable(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBooking = async () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error("Please select dates");
      return;
    }

    if (hasUnavailableOverlap) {
      toast.error("Those dates overlap with an existing booking");
      return;
    }

    try {
      await api.post("/bookings", {
        productId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });

      toast.success("Booking created successfully!");
      setBookingData({ startDate: "", endDate: "" });
      setTotalDays(0);
      setTotalPrice(0);
      fetchUnavailableDates();
    } catch (err) {
      toast.error(getErrorMessage(err, "Booking failed!"));
    }
  };

  if (!product) {
    return <div className="glass-panel rounded-[28px] p-8 text-center text-slate-300">Loading product...</div>;
  }

  const isOwner = product.ownerId === user?.id;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="space-y-6"
      >
        <div className="overflow-hidden rounded-[34px] border border-white/10 shadow-2xl shadow-black/20">
          <img
            src={resolveAssetUrl(product.imageUrl)}
            alt={product.title}
            className="h-[420px] w-full object-cover sm:h-[520px]"
          />
        </div>

        <div className="glass-panel rounded-[32px] p-6 sm:p-8">
          <p className="section-kicker">Listing Overview</p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="hero-title text-4xl font-black sm:text-5xl">{product.title}</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-amber-200/70">
                {product.category || "General"}
              </p>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                product.available ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"
              }`}
            >
              {product.available ? "Available now" : "Not available"}
            </span>
          </div>

          <p className="muted-copy mt-6 text-base leading-7">{product.description}</p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Daily Price</p>
            <p className="mt-2 text-4xl font-black text-teal-300">Rs {product.pricePerDay}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-panel rounded-[32px] p-6 sm:p-8"
      >
        <p className="section-kicker">Reserve It</p>
        <h2 className="mt-2 text-3xl font-black text-white">Book this product</h2>
        <p className="muted-copy mt-3 text-sm leading-6">
          Choose your dates and we will calculate the total automatically.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="date"
            value={bookingData.startDate}
            min={new Date().toISOString().split("T")[0]}
            className="field-shell w-full"
            onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
          />

          <input
            type="date"
            value={bookingData.endDate}
            min={new Date().toISOString().split("T")[0]}
            className="field-shell w-full"
            onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
          />

          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <p>{unavailable.length} blocked dates are currently marked unavailable.</p>
            {totalDays > 0 ? (
              <div className="mt-3 space-y-2">
                <p>Rs {product.pricePerDay} x {totalDays} days</p>
                <p className="text-xl font-bold text-teal-300">Total: Rs {totalPrice}</p>
                {hasUnavailableOverlap && (
                  <p className="text-sm text-rose-200">Selected dates overlap with an existing booking.</p>
                )}
              </div>
            ) : (
              <p className="mt-3">Select a valid date range to see the total.</p>
            )}
          </div>

          <button
            onClick={handleBooking}
            disabled={totalDays <= 0 || !product.available || isOwner || hasUnavailableOverlap}
            className={`w-full rounded-2xl py-3 font-semibold transition-all duration-300 ${
              totalDays > 0 && product.available && !isOwner && !hasUnavailableOverlap
                ? "cta-primary text-slate-950"
                : "cursor-not-allowed bg-slate-700 text-slate-300"
            }`}
          >
            Reserve Now
          </button>

          {isOwner && <p className="text-sm text-rose-200">You cannot rent your own product.</p>}
        </div>
      </motion.div>
    </div>
  );
}
