import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  const approveBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/approve`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/reject`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white space-y-10">

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
      >
        My Bookings
      </motion.h1>

      {/* EMPTY STATE */}
      {bookings.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-gray-400">
          You have no bookings yet.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:justify-between md:items-center gap-6"
            >

              {/* LEFT INFO */}
              <div className="space-y-3">

                  <img
                  src={`http://localhost:8080/${booking.imageUrl}`}
                                  className="w-24 h-24 rounded-xl object-cover"
                                  />

                <h2 className="text-xl font-semibold">
                  {booking.productTitle}
                </h2>


                <p className="text-gray-400 text-sm">
                  {booking.startDate} → {booking.endDate}
                </p>

                <p className="text-cyan-400 font-semibold text-lg">
                  ₹{booking.totalPrice ?? 0}
                </p>

                <StatusBadge status={booking.status} />

              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-4">

                {booking.status === "PENDING" &&
                  booking.ownerId === user?.id && (
                    <>
                      <button
                        onClick={() => approveBooking(booking.id)}
                        className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        Reject
                      </button>
                    </>
                  )}

                {booking.status !== "REJECTED" && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

/* STATUS BADGE COMPONENT */
function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    APPROVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}