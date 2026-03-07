import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function OwnerDashboard() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/owner");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/approve`);
      toast.success("Booking approved");
      fetchBookings();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const rejectBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/reject`);
      toast.success("Booking rejected");
      fetchBookings();
    } catch (err) {
      toast.error("Reject failed");
    }
  };

  const pending = bookings.filter(b => b.status === "PENDING").length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const rejected = bookings.filter(b => b.status === "REJECTED").length;

  return (
    <div className="max-w-7xl mx-auto text-white space-y-10">

      {/* HEADER */}

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Owner Dashboard
      </motion.h1>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <StatCard title="Pending Requests" value={pending} color="yellow" />
        <StatCard title="Approved Bookings" value={approved} color="green" />
        <StatCard title="Rejected Requests" value={rejected} color="red" />

      </div>

      {/* LOADING */}

      {loading && (
        <div className="text-gray-400">Loading bookings...</div>
      )}

      {/* EMPTY */}

      {!loading && bookings.length === 0 && (
        <div className="text-gray-400">
          No booking requests yet.
        </div>
      )}

      {/* BOOKINGS */}

      <div className="space-y-6">

        {bookings.map((b, index) => (

          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >

            {/* LEFT */}

            <div className="space-y-2">

              <h2 className="text-xl font-semibold">
                {b.productTitle}
              </h2>

              <p className="text-gray-400 text-sm">
                {b.startDate} → {b.endDate}
              </p>

              <p className="text-cyan-400 font-semibold">
                ₹{b.totalPrice}
              </p>

              {b.renterEmail && (
                <p className="text-xs text-gray-400">
                  Renter: {b.renterEmail}
                </p>
              )}

              <StatusBadge status={b.status} />

            </div>

            {/* ACTIONS */}

            {b.status === "PENDING" && (
              <div className="flex gap-4">

                <button
                  onClick={() => approveBooking(b.id)}
                  className="px-5 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectBooking(b.id)}
                  className="px-5 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Reject
                </button>

              </div>
            )}

          </motion.div>

        ))}

      </div>

    </div>
  );
}

/* STAT CARD */

function StatCard({ title, value, color }) {

  const colorMap = {
    yellow: "text-yellow-400",
    green: "text-green-400",
    red: "text-red-400",
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${colorMap[color]}`}>
        {value}
      </h2>
    </div>
  );
}

/* STATUS BADGE */

function StatusBadge({ status }) {

  const styles = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    APPROVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}