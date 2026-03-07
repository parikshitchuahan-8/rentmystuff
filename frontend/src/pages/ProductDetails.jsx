
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

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

    try {

      await api.post("/bookings", {
        productId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });

      toast.success("Booking created successfully!");

      setBookingData({
        startDate: "",
        endDate: "",
      });

      setTotalDays(0);
      setTotalPrice(0);

    } catch (err) {
      const message = err.response?.data || "Booking failed!";
      toast.error(message);
    }
  };

  if (!product) {
    return (
      <div className="text-center text-gray-400 pt-40">
        Loading product...
      </div>
    );
  }

  const isOwner = product.ownerId === user?.id;

  return (
    <div className="max-w-7xl mx-auto text-white">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* LEFT IMAGE */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >

          <img
            src={`http://localhost:8080/${product.imageUrl}`}
            alt={product.title}
            className="w-full h-[520px] object-cover"
          />

        </motion.div>


        {/* RIGHT SIDE */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between"
        >

          {/* PRODUCT INFO */}

          <div>

            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {product.title}
            </h1>

            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-8">

              <span className="text-3xl font-bold text-cyan-400">
                ₹{product.pricePerDay}
                <span className="text-lg text-gray-400"> /day</span>
              </span>

              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  product.available
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {product.available ? "Available" : "Not Available"}
              </span>

            </div>

          </div>


          {/* BOOKING CARD */}

          <div className="mt-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">

            <h2 className="text-2xl font-semibold mb-6">
              Book this product
            </h2>

            <div className="space-y-4">

              <input
                type="date"
                value={bookingData.startDate}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none transition"
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    startDate: e.target.value,
                  })
                }
              />

              <input
                type="date"
                value={bookingData.endDate}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none transition"
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    endDate: e.target.value,
                  })
                }
              />

              {totalDays > 0 && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm space-y-2">
                  <p className="text-gray-400">
                    ₹{product.pricePerDay} × {totalDays} days
                  </p>
                  <p className="font-semibold text-cyan-400 text-lg">
                    Total: ₹{totalPrice}
                  </p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={
                  totalDays <= 0 ||
                  !product.available ||
                  isOwner
                }
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                  totalDays > 0 && product.available && !isOwner
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105 shadow-lg"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Reserve Now
              </button>

              {isOwner && (
                <p className="text-red-400 text-sm">
                  You cannot rent your own product
                </p>
              )}

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}

