import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { resolveAssetUrl } from "../api/config";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
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

  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[34px] px-6 py-8 sm:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="section-kicker">Bookings</p>
            <h1 className="hero-title mt-3 text-4xl font-black sm:text-5xl">Track every rental in one place</h1>
            <p className="muted-copy mt-4 max-w-2xl text-base leading-7">
              Review upcoming dates, keep an eye on approvals, and manage any booking before it becomes a problem.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Pending" value={pendingCount} tone="amber" />
            <MetricCard label="Approved" value={approvedCount} tone="teal" />
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="glass-panel rounded-[30px] p-8 text-slate-300">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel rounded-[30px] p-8 text-slate-300">You have no bookings yet.</div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking, index) => (
            <motion.article
              key={booking.id}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="glass-panel grid gap-6 rounded-[30px] p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center"
            >
              <img
                src={resolveAssetUrl(booking.imageUrl)}
                alt={booking.productTitle}
                className="h-24 w-full rounded-[22px] object-cover sm:w-28"
              />

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">{booking.productTitle}</h2>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {booking.startDate} to {booking.endDate}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-teal-300">
                    Rs {booking.totalPrice ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                {(booking.status === "PENDING" || booking.status === "APPROVED") && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  const toneMap = {
    amber: "text-amber-200 border-amber-300/20 bg-amber-300/10",
    teal: "text-teal-200 border-teal-300/20 bg-teal-300/10",
  };

  return (
    <div className={`rounded-[26px] border p-5 ${toneMap[tone]}`}>
      <p className="text-sm uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-400/15 text-amber-200",
    APPROVED: "bg-emerald-400/15 text-emerald-200",
    REJECTED: "bg-rose-400/15 text-rose-200",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
