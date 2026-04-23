import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const initialBrands = [
  { name: "Nike", description: "Sportswear and footwear brand." },
  { name: "Apple", description: "Electronics and technology brand." },
  { name: "Adidas", description: "Athletic and casual footwear, apparel." },
  { name: "Sony", description: "Electronics, gaming, and entertainment." },
  { name: "Samsung", description: "Electronics and appliances." },
  { name: "Puma", description: "Sportswear and accessories." },
  { name: "Reebok", description: "Footwear and apparel." },
  { name: "LG", description: "Electronics and appliances." },
  { name: "Dell", description: "Computers and technology." },
  { name: "Lenovo", description: "Computers and electronics." },
];

const AddBrandModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Add Brand</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Brand Name" value={form.name} onChange={handleChange} required className="w-full p-2 rounded bg-zinc-800 text-white" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 rounded bg-zinc-800 text-white" />
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-zinc-700 text-zinc-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BrandTable = () => {
  const [brands, setBrands] = useState(initialBrands);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(brands.length / pageSize);
  const pagedBrands = brands.slice((page - 1) * pageSize, page * pageSize);

  const handleAddBrand = (brand) => setBrands([...brands, brand]);
  const handleDelete = (idx) => setBrands(brands.filter((_, i) => i !== idx));
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditForm(brands[idx]);
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setBrands(brands.map((b, i) => (i === editIdx ? editForm : b)));
    setEditIdx(null);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Brands</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setShowModal(true)}>+ Add brand</button>
      </div>
      <div className="grid grid-cols-4 gap-4 text-zinc-400 text-xs font-semibold border-b border-zinc-800 pb-2 mb-2">
        <div>Name</div>
        <div>Description</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      {pagedBrands.map((brand, idx) => {
        const realIdx = (page - 1) * pageSize + idx;
        return (
          <div key={brand.name + realIdx} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-zinc-800 text-zinc-100 text-sm">
            <div className="font-semibold text-blue-300">{brand.name}</div>
            <div className="text-zinc-300">{brand.description}</div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => handleEdit(realIdx)} className="p-2 rounded bg-zinc-800 hover:bg-blue-700"><Pencil className="w-4 h-4 text-blue-400" /></button>
              <button onClick={() => handleDelete(realIdx)} className="p-2 rounded bg-zinc-800 hover:bg-red-700"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        );
      })}
      <div className="flex justify-end mt-4 gap-2">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {showModal && (
        <AddBrandModal onClose={() => setShowModal(false)} onAdd={handleAddBrand} />
      )}
      {editIdx !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Brand</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input name="name" placeholder="Brand Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required className="w-full p-2 rounded bg-zinc-800 text-white" />
              <input name="description" placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full p-2 rounded bg-zinc-800 text-white" />
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setEditIdx(null)} className="px-4 py-2 rounded bg-zinc-700 text-zinc-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandTable;
