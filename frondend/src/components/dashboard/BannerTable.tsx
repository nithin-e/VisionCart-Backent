import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, Upload, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, Image, Calendar, ArrowRight, Monitor, Smartphone, Tablet } from "lucide-react";
import { bannersApi } from "@/api/banners";

const bannerTypes = [
  { value: "homepage", label: "Homepage", icon: Monitor },
  { value: "category", label: "Category", icon: Smartphone },
  { value: "promotional", label: "Promotional", icon: Tablet },
];

const BannerForm = ({ banner, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(banner || {
    title: "",
    subtitle: "",
    image: "",
    redirectUrl: "",
    type: "homepage",
    position: 1,
    startDate: "",
    endDate: ""
  });
  const [imageInput, setImageInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "position" ? Number(value) : value });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, image: imageInput.trim() });
      setImageInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Banner" : "Add New Banner"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Title *</label>
            <input
              name="title"
              placeholder="e.g., Summer Sale"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Subtitle</label>
            <input
              name="subtitle"
              placeholder="e.g., Up to 50% Off"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Banner Image *</label>
            <div className="flex gap-2 mb-2">
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
            {form.image && (
              <div className="relative inline-block group mb-2">
                <img src={form.image} alt="Banner" className="w-full h-32 object-cover rounded-lg border border-zinc-700" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-400 hover:text-blue-300">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Redirect URL</label>
            <div className="relative">
              <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                name="redirectUrl"
                placeholder="/products, /collections/premium, etc."
                value={form.redirectUrl}
                onChange={handleChange}
                className="w-full pl-10 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                {bannerTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Position</label>
              <input
                name="position"
                type="number"
                min="1"
                value={form.position}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
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
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEdit ? "Update Banner" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BannerTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const pageSize = 10;

  const fetchBanners = async () => {
    try {
      setLoading(true);
      console.log("Fetching banners...");
      const response = await bannersApi.getAll();
      console.log("Banners response:", response);
      setBanners(response?.data?.data?.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error(error.message || 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const createBanner = async (banner) => {
    try {
      console.log("Creating banner:", banner);
      await bannersApi.create(banner);
      toast.success('Banner created successfully');
      fetchBanners();
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error(error.message || 'Failed to create banner');
    }
  };

  const updateBanner = async (id, data) => {
    try {
      console.log("Updating banner:", id, data);
      await bannersApi.update(id, data);
      toast.success('Banner updated successfully');
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error(error.message || 'Failed to update banner');
    }
  };

  const deleteBanner = async (id) => {
    try {
      console.log("Deleting banner:", id);
      await bannersApi.delete(id);
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(error.message || 'Failed to delete banner');
    }
  };

  const filteredBanners = (Array.isArray(banners) ? banners : []).filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && banner.isActive;
    if (filter === "inactive") return matchesSearch && !banner.isActive;
    if (filter === "homepage") return matchesSearch && banner.type === "homepage";
    if (filter === "popup") return matchesSearch && banner.type === "promotional";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredBanners.length / pageSize);
  const pagedBanners = filteredBanners.slice((page - 1) * pageSize, page * pageSize);

  const handleAddBanner = (banner) => {
    createBanner(banner);
  };

  const handleUpdateBanner = (banner) => {
    updateBanner(selectedBanner._id, banner);
  };

  const handleDelete = (id) => {
    deleteBanner(id);
  };

  const handleToggleStatus = (id) => {
    const banner = banners.find(b => b._id === id);
    updateBanner(id, { isActive: !banner.isActive });
  };

  const openEdit = (banner) => {
    setSelectedBanner(banner);
    setIsEdit(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedBanner(null);
  };

  const handleFormSubmit = (formData) => {
    if (isEdit) {
      handleUpdateBanner(formData);
    } else {
      handleAddBanner(formData);
    }
    closeForm();
  };

  const getTypeIcon = (type) => {
    const typeObj = bannerTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Monitor;
  };

  const isBannerExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Banners</h2>
          <p className="text-sm text-zinc-400">{filteredBanners.length} banners</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search banners..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none w-full sm:w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="homepage">Homepage</option>
            <option value="promotional">Promotional</option>
          </select>
          <button
            onClick={() => { setIsEdit(false); setSelectedBanner(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pagedBanners.map((banner) => {
          const TypeIcon = getTypeIcon(banner.type);
          const expired = isBannerExpired(banner.endDate);
          return (
            <div key={banner._id} className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-colors">
              <div className="relative">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-700 flex items-center justify-center">
                    <Image className="w-12 h-12 text-zinc-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(banner._id)}
                    className={`p-2 rounded-full ${banner.isActive ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {banner.isActive ? <ToggleRight className="w-4 h-4 text-white" /> : <ToggleLeft className="w-4 h-4 text-white" />}
                  </button>
                </div>
                {expired && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Expired</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm text-zinc-400">{banner.subtitle}</p>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    banner.isActive ? "bg-green-900 text-green-400" : "bg-zinc-600 text-zinc-400"
                  }`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                  <span className="flex items-center gap-1">
                    <TypeIcon className="w-3 h-3" />
                    {banner.type}
                  </span>
                  <span>Position: {banner.position}</span>
                </div>
                {banner.startDate && banner.endDate && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                    <Calendar className="w-3 h-3" />
                    {banner.startDate} - {banner.endDate}
                  </div>
                )}
                {banner.redirectUrl && (
                  <div className="text-xs text-blue-400 mb-3 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    {banner.redirectUrl}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(banner)}
                    className="flex-1 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="px-4 py-2 rounded bg-zinc-700 hover:bg-red-900 text-zinc-200 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
          <div className="text-center py-12 text-zinc-400">Loading...</div>
        )}

        {!loading && filteredBanners.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No banners found</p>
          </div>
        )}

        {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBanners.length)} of {filteredBanners.length}
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
        <BannerForm
          banner={selectedBanner}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default BannerTable;
