import { useState } from "react";
import api, { getErrorMessage } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { ...form, role: "USER" });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-panel grid w-full max-w-5xl overflow-hidden rounded-[34px] lg:grid-cols-[0.95fr_1.05fr]"
      >
        <motion.form onSubmit={handleSubmit} className="space-y-6 p-8 sm:p-10">
          <div>
            <p className="section-kicker">Join In</p>
            <h2 className="mt-3 text-3xl font-black text-white">Create your account</h2>
            <p className="muted-copy mt-3 text-sm leading-6">Start renting, listing, and managing bookings from one place.</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="field-shell w-full"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email address"
              className="field-shell w-full"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="field-shell w-full"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              New accounts are created as standard renter accounts. Admin access is managed separately.
            </div>
          </div>

          <button
            type="submit"
            className="cta-primary w-full rounded-2xl py-3 font-semibold text-slate-950 transition-all duration-300"
          >
            Register
          </button>

          <p className="text-center text-sm text-slate-300">
            Already have an account? {" "}
            <Link to="/login" className="font-semibold text-amber-200 hover:text-white">
              Login
            </Link>
          </p>
        </motion.form>

        <div className="hidden bg-gradient-to-br from-teal-300/20 via-cyan-300/10 to-amber-200/20 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="section-kicker">Build Your Shelf</p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-white">
              Turn idle stuff into active rentals.
            </h1>
          </div>
          <p className="max-w-sm text-base leading-7 text-slate-200/80">
            Join as a renter and start publishing products with a cleaner onboarding flow.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
