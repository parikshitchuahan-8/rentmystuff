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

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const approved = bookings.filter((b) => b.status === "APPROVED").length;
  const rejected = bookings.filter((b) => b.status === "REJECTED").length;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[34px] px-6 py-8 sm:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="section-kicker">Owner Control</p>
            <h1 className="hero-title mt-3 text-4xl font-black sm:text-5xl">Manage incoming requests with confidence</h1>
            <p className="muted-copy mt-4 max-w-2xl text-base leading-7">
              Keep the queue tidy, approve fast, and spot stalled rental requests before they stack up.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard title="Pending" value={pending} tone="amber" />
            <StatCard title="Approved" value={approved} tone="teal" />
            <StatCard title="Rejected" value={rejected} tone="rose" />
          </div>
        </div>
      </motion.section>

      {loading && <div className="glass-panel rounded-[30px] p-8 text-slate-300">Loading bookings...</div>}

      {!loading && bookings.length === 0 && (
        <div className="glass-panel rounded-[30px] p-8 text-slate-300">No booking requests yet.</div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid gap-6">
          {bookings.map((booking, index) => (
            <motion.article
              key={booking.id}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel grid gap-5 rounded-[30px] p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
            >
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
                    Rs {booking.totalPrice}
                  </span>
                  {booking.renterEmail && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      {booking.renterEmail}
                    </span>
                  )}
                </div>
              </div>

              {booking.status === "PENDING" && (
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <button
                    onClick={() => approveBooking(booking.id)}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-200 transition-all duration-300 hover:bg-emerald-400/20"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectBooking(booking.id)}
                    className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-2.5 text-sm font-medium text-rose-200 transition-all duration-300 hover:bg-rose-400/20"
                  >
                    Reject
                  </button>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, tone }) {
  const toneMap = {
    amber: "text-amber-200 border-amber-300/20 bg-amber-300/10",
    teal: "text-teal-200 border-teal-300/20 bg-teal-300/10",
    rose: "text-rose-200 border-rose-300/20 bg-rose-300/10",
  };

  return (
    <div className={`rounded-[26px] border p-5 ${toneMap[tone]}`}>
      <p className="text-sm uppercase tracking-[0.22em]">{title}</p>
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
