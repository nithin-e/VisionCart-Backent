import React, { useState } from "react";

const AddProductForm = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    rating: "4.0",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required className="w-full p-2 rounded bg-zinc-800 text-white" />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required className="w-full p-2 rounded bg-zinc-800 text-white" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="w-full p-2 rounded bg-zinc-800 text-white" />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required className="w-full p-2 rounded bg-zinc-800 text-white" />
          <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required className="w-full p-2 rounded bg-zinc-800 text-white" />
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-zinc-700 text-zinc-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
