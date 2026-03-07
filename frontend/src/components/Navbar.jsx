import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FiLogOut, FiPlusCircle } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinkStyle = (path) =>
    `relative px-3 py-2 transition-all duration-300 ${
      location.pathname === path
        ? "text-cyan-400"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-wide"
        >
          RentMyStuff
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {!user ? (
            <>
              <Link className={navLinkStyle("/login")} to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-md"
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
                className="px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 transition-all duration-300 text-white shadow-md hover:scale-105"
              >
                Owner Dashboard
              </Link>

              <Link
                to="/add-product"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md hover:scale-105 transition-all duration-300"
              >
                <FiPlusCircle />
                Add Product
              </Link>

              {/* User Name */}
              <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">
                {user.name}
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-all duration-300"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}