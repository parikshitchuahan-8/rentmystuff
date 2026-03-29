import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import OwnerDashboard from "./pages/OwnerDashboard";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d1b2f",
            color: "#f5f7fb",
            border: "1px solid rgba(158, 173, 196, 0.16)",
          },
        }}
      />
    </div>
  );
}

export default App;
