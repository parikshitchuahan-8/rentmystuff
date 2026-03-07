import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import OwnerDashboard from "./pages/OwnerDashboard";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/NavBar";

function App() {
  return (
    <AuthProvider>
  <div className="min-h-screen bg-slate-900 text-white">

    {/* Navbar */}
    <Navbar />

    {/* Main Content Wrapper */}
    <main className="pt-28 px-6 max-w-7xl mx-auto">
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

  </div>
</AuthProvider>
  );
}

export default App;
