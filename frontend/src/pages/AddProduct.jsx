import { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";




const AddProduct = () => {

    const navigate = useNavigate();
    const[loading,setLoading]=useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pricePerDay: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
if(loading)  return
setLoading(true)
    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("pricePerDay", form.pricePerDay);
      formData.append("category", form.category);
      formData.append("image", imageFile);

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
setLoading(false)
  };

  return (
    <div className="max-w-6xl mx-auto text-white">

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-12 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Add New Product
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* LEFT — IMAGE UPLOAD */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-6">
            Upload Product Image
          </h2>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl h-72 cursor-pointer hover:border-cyan-400 transition">

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full object-cover rounded-2xl"
              />
            ) : (
              <span className="text-gray-400">
                Click to upload image
              </span>
            )}

            <input
              type="file"
              hidden
              onChange={(e) =>
                handleImageChange(e.target.files[0])
              }
            />
          </label>
        </motion.div>

        {/* RIGHT — FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl space-y-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            Product Details
          </h2>

          <input
            name="title"
            placeholder="Product Title"
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />

          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per day"
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />

         <button
         type="submit"
         disabled={loading}
         className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
         >
         {loading ? "Adding..." : "Add Product"}
         </button>
        </motion.form>

      </div>
    </div>
  );
};

export default AddProduct;