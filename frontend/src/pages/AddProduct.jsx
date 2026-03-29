import { useState } from "react";
import api, { getErrorMessage } from "../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    if (loading) return;
    setLoading(true);

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
      toast.error(getErrorMessage(err, "Failed to add product"));
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="section-kicker">Create Listing</p>
        <h1 className="hero-title mt-3 text-4xl font-black sm:text-5xl">Add a new rental product</h1>
        <p className="muted-copy mt-4 max-w-2xl text-base leading-7">
          Upload a strong image, set the pricing, and make the listing easy for renters to trust at a glance.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-[32px] p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Visual</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Upload product image</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              Best with clear lighting
            </span>
          </div>

          <label className="flex h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/20 bg-slate-950/30 transition hover:border-teal-300/60 hover:bg-slate-950/40">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="space-y-3 px-6 text-center">
                <p className="text-xl font-semibold text-white">Drop in a strong cover image</p>
                <p className="muted-copy text-sm">Wide, sharp photos make listings feel more trustworthy.</p>
              </div>
            )}

            <input type="file" hidden onChange={(e) => handleImageChange(e.target.files[0])} />
          </label>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel space-y-5 rounded-[32px] p-6 sm:p-8"
        >
          <div>
            <p className="section-kicker">Details</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Tell renters what makes it useful</h2>
          </div>

          <input
            name="title"
            placeholder="Product title"
            onChange={handleChange}
            className="field-shell w-full"
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="5"
            onChange={handleChange}
            className="field-shell w-full"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              name="pricePerDay"
              placeholder="Price per day"
              onChange={handleChange}
              className="field-shell w-full"
            />

            <input
              name="category"
              placeholder="Category"
              onChange={handleChange}
              className="field-shell w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cta-primary w-full rounded-2xl py-3 font-semibold text-slate-950 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default AddProduct;
