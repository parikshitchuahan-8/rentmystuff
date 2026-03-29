import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FiHome, FiLogOut, FiPlusCircle } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinkStyle = (path) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
      location.pathname === path
        ? "bg-white/10 text-white shadow-lg shadow-black/10"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="glass-panel flex flex-col gap-4 rounded-[28px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-teal-400 text-base font-black text-slate-950">
            RM
          </span>
          <span>
            <span className="block text-xs uppercase tracking-[0.3em] text-amber-200/80">
              Rental Marketplace
            </span>
            <span className="hero-title block text-2xl font-black tracking-[0.08em]">
              RentMyStuff
            </span>
          </span>
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link className={`${navLinkStyle("/")} inline-flex items-center gap-2`} to="/">
            <FiHome />
            Explore
          </Link>
          {!user ? (
            <>
              <Link className={navLinkStyle("/login")} to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="cta-primary rounded-full px-5 py-2 text-sm font-semibold text-slate-950 transition-all duration-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/my-bookings"
                className={navLinkStyle("/my-bookings")}
              >
                My Bookings
              </Link>

              <Link
                to="/owner-dashboard"
                className={navLinkStyle("/owner-dashboard")}
              >
                Owner Dashboard
              </Link>

              <Link
                to="/add-product"
                className="cta-primary flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-slate-950 transition-all duration-300"
              >
                <FiPlusCircle />
                Add Product
              </Link>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {user.name}
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-rose-300 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-200"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      </div>
    </motion.nav>
  );
}
