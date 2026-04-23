import React, { useState } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  categoryId: "",
  collectionIds: [],
  price: "",
  discount: "",
  stock: "",
  images: [],
  brand: "",
  attributes: {
    shape: "",
    color: "",
    frameType: "",
    gender: ""
  }
};

const ProductForm = ({ product, onClose, isEdit = false, onSubmit, submitting = false }) => {
  const [form, setForm] = useState({
    ...initialForm,
    ...product,
    attributes: {
      ...initialForm.attributes,
      ...(product?.attributes || {})
    }
  });
  const [imageInput, setImageInput] = useState("");
  const [variant, setVariant] = useState({ color: "", size: "", stock: "" });
  const [variants, setVariants] = useState(product?.variants || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("attr_")) {
      const attrKey = name.replace("attr_", "");
      setForm({ ...form, attributes: { ...form.attributes, [attrKey]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] });
      setImageInput("");
    }
  };

  const handleRemoveImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleAddVariant = () => {
    if (variant.color || variant.size) {
      setVariants([...variants, variant]);
      setVariant({ color: "", size: "", stock: "" });
    }
  };

  const handleRemoveVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      stock: Number(form.stock),
      variants
    };
    onSubmit(finalData);
  };

  const finalPrice = form.price && form.discount 
    ? (Number(form.price) - Number(form.discount)).toFixed(2) 
    : form.price;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Product Name *</label>
              <input
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Brand</label>
              <input
                name="brand"
                placeholder="e.g., Vincent Chase"
                value={form.brand}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Price (₹) *</label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Discount (₹)</label>
              <input
                name="discount"
                type="number"
                placeholder="0"
                value={form.discount}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              {finalPrice && (
                <p className="text-xs text-green-400 mt-1">
                  Final Price: ₹{finalPrice}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Stock *</label>
              <input
                name="stock"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Category ID</label>
              <input
                name="categoryId"
                placeholder="Category ID"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Attributes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input
                name="attr_shape"
                placeholder="Shape (e.g., round)"
                value={form.attributes.shape}
                onChange={handleChange}
                className="p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
              <input
                name="attr_color"
                placeholder="Color (e.g., black)"
                value={form.attributes.color}
                onChange={handleChange}
                className="p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
              <input
                name="attr_frameType"
                placeholder="Frame Type"
                value={form.attributes.frameType}
                onChange={handleChange}
                className="p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
              <input
                name="attr_gender"
                placeholder="Gender (men/women)"
                value={form.attributes.gender}
                onChange={handleChange}
                className="p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Product Images</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Product ${idx + 1}`} className="w-16 h-16 object-cover rounded border border-zinc-700" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-blue-400 hover:text-blue-300">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Variants</h3>
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Color"
                value={variant.color}
                onChange={(e) => setVariant({ ...variant, color: e.target.value })}
                className="flex-1 p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
              <input
                placeholder="Size"
                value={variant.size}
                onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                className="flex-1 p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => setVariant({ ...variant, stock: e.target.value })}
                className="w-20 p-2 rounded bg-zinc-800 text-white text-sm border border-zinc-700"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {variants.length > 0 && (
              <div className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-zinc-800 p-2 rounded text-sm">
                    <span className="text-white">
                      {v.color} / {v.size} - Stock: {v.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting 
                ? (isEdit ? "Updating..." : "Creating...") 
                : (isEdit ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;