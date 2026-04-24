import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, X, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { brandsApi } from "@/api/brands";

const BrandForm = ({ brand, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(brand || { name: "", description: "", logo: "" });
  const [logoInput, setLogoInput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLogo = () => {
    if (logoInput.trim()) {
      setForm({ ...form, logo: logoInput.trim() });
      setLogoInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{isEdit ? "Edit Brand" : "Add Brand"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Brand Name *</label>
            <input
              name="name"
              placeholder="Brand Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Logo URL</label>
            <div className="flex gap-2">
              <input
                name="logo"
                placeholder="Logo URL"
                value={form.logo || logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                className="flex-1 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddLogo}
                className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600"
              >
                Add
              </button>
            </div>
            {form.logo && (
              <div className="mt-2">
                <img src={form.logo} alt="Logo preview" className="w-12 h-12 object-contain" />
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BrandTable = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandsApi.getAll();
      setBrands(response?.data?.data?.brands || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error(error.message || "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (data) => {
    try {
      await brandsApi.create(data);
      toast.success("Brand created successfully");
      fetchBrands();
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error(error.message || "Failed to create brand");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await brandsApi.update(selectedBrand._id, data);
      toast.success("Brand updated successfully");
      fetchBrands();
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error(error.message || "Failed to update brand");
    }
  };

  const handleDelete = async (id) => {
    try {
      await brandsApi.delete(id);
      toast.success("Brand deleted successfully");
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error(error.message || "Failed to delete brand");
    }
  };

  const handleToggleStatus = async (brand) => {
    try {
      await brandsApi.update(brand._id, { isActive: !brand.isActive });
      fetchBrands();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const openAdd = () => {
    setSelectedBrand(null);
    setIsEdit(false);
    setShowForm(true);
  };

  const openEdit = (brand) => {
    setSelectedBrand(brand);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (isEdit) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const filteredBrands = (Array.isArray(brands) ? brands : []).filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredBrands.length / pageSize);
  const pagedBrands = filteredBrands.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Brands</h2>
          <p className="text-sm text-zinc-400">{filteredBrands.length} brands</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none w-full sm:w-64"
            />
          </div>
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-8 text-center text-zinc-400">Loading...</div>
        ) : pagedBrands.length === 0 ? (
          <div className="col-span-full py-8 text-center text-zinc-400">No brands found</div>
        ) : (
          pagedBrands.map((brand) => (
            <div
              key={brand._id}
              className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-lg object-contain bg-white" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-zinc-700 flex items-center justify-center">
                    <span className="text-lg font-bold text-zinc-400">{brand.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{brand.name}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">{brand.description || "No description"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-700">
                <button
                  onClick={() => handleToggleStatus(brand)}
                  className="flex items-center gap-1"
                >
                  {brand.isActive ? (
                    <ToggleRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${brand.isActive ? "text-green-400" : "text-red-400"}`}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(brand)}
                    className="p-2 rounded hover:bg-zinc-700 text-zinc-400 hover:text-blue-400"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="p-2 rounded hover:bg-zinc-700 text-zinc-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBrands.length)} of {filteredBrands.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm ${page === p ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="p-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <BrandForm
          brand={selectedBrand}
          isEdit={isEdit}
          onClose={() => { setShowForm(false); setSelectedBrand(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default BrandTable;