import { useState, useContext } from "react";
import api, { getErrorMessage } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { fetchCurrentUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      await fetchCurrentUser();
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-panel grid w-full max-w-5xl overflow-hidden rounded-[34px] lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="hidden bg-gradient-to-br from-amber-300/20 via-orange-400/10 to-teal-300/20 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="section-kicker">Welcome Back</p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-white">
              Pick up where your last rental left off.
            </h1>
          </div>
          <p className="max-w-sm text-base leading-7 text-slate-200/80">
            Sign in to manage bookings, publish listings, and respond to incoming rental requests.
          </p>
        </div>

        <motion.form onSubmit={handleSubmit} className="space-y-6 p-8 sm:p-10">
          <div>
            <p className="section-kicker">Account Access</p>
            <h2 className="mt-3 text-3xl font-black text-white">Log in to RentMyStuff</h2>
            <p className="muted-copy mt-3 text-sm leading-6">Use your email and password to continue.</p>
          </div>

          <div className="space-y-4">
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
          </div>

          <button
            type="submit"
            className="cta-primary w-full rounded-2xl py-3 font-semibold text-slate-950 transition-all duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm text-slate-300">
            Do not have an account? {" "}
            <Link to="/register" className="font-semibold text-amber-200 hover:text-white">
              Register
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
