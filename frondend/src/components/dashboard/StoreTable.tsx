import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, Upload, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, MapPin, Building, Navigation, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { storesApi } from "@/api/stores";

const StoreForm = ({ store, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(store || {
    name: "",
    address: "",
    city: "",
    state: "Kerala",
    lat: "",
    lng: "",
    phone: "",
    email: "",
    timings: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setForm({
          ...form,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...form,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null
    };
    onSubmit(submitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Store" : "Add New Store"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Store Name *</label>
            <input
              name="name"
              placeholder="e.g., Palakkad Store"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Address *</label>
            <textarea
              name="address"
              placeholder="Full address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">City *</label>
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">State</label>
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <label className="block text-sm text-zinc-400 mb-1">Location (Lat/Lng)</label>
            <p className="text-xs text-zinc-500 mb-2">Used for map integration and nearby store features</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-zinc-500 mb-1">Latitude</label>
                <input
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="e.g., 10.7867"
                  value={form.lat}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-zinc-500 mb-1">Longitude</label>
                <input
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="e.g., 76.6548"
                  value={form.lng}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="self-end px-3 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
                title="Get current location"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <label className="block text-sm text-zinc-400 mb-2">Contact Information</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    name="phone"
                    placeholder="0491 2345678"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    name="email"
                    type="email"
                    placeholder="store@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Store Timings</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                name="timings"
                placeholder="e.g., 9AM - 9PM"
                value={form.timings}
                onChange={handleChange}
                className="w-full pl-10 p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
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
              {isEdit ? "Update Store" : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StoreTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const pageSize = 10;

  const fetchStores = async () => {
    try {
      setLoading(true);
      console.log("Fetching stores...");
      const response = await storesApi.getAll();
      console.log("Stores response:", response);
      setStores(response?.data?.stores || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error(error.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const createStore = async (store) => {
    try {
      console.log("Creating store:", store);
      await storesApi.create(store);
      toast.success('Store created successfully');
      fetchStores();
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error(error.message || 'Failed to create store');
    }
  };

  const updateStore = async (id, data) => {
    try {
      console.log("Updating store:", id, data);
      await storesApi.update(id, data);
      toast.success('Store updated successfully');
      fetchStores();
    } catch (error) {
      console.error("Error updating store:", error);
      toast.error(error.message || 'Failed to update store');
    }
  };

  const deleteStore = async (id) => {
    try {
      console.log("Deleting store:", id);
      await storesApi.delete(id);
      toast.success('Store deleted successfully');
      fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error(error.message || 'Failed to delete store');
    }
  };

  const filteredStores = (Array.isArray(stores) ? stores : []).filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && store.isActive;
    if (filter === "inactive") return matchesSearch && !store.isActive;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredStores.length / pageSize);
  const pagedStores = filteredStores.slice((page - 1) * pageSize, page * pageSize);

  const handleAddStore = (store) => {
    createStore(store);
  };

  const handleUpdateStore = (store) => {
    updateStore(selectedStore._id, store);
  };

  const handleDelete = (id) => {
    deleteStore(id);
  };

  const handleToggleStatus = (id) => {
    const store = stores.find(s => s._id === id);
    updateStore(id, { isActive: !store.isActive });
  };

  const openEdit = (store) => {
    setSelectedStore(store);
    setIsEdit(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedStore(null);
  };

  const handleFormSubmit = (formData) => {
    if (isEdit) {
      handleUpdateStore(formData);
    } else {
      handleAddStore(formData);
    }
    closeForm();
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Stores</h2>
          <p className="text-sm text-zinc-400">{filteredStores.length} stores</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search stores..."
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
          </select>
          <button
            onClick={() => { setIsEdit(false); setSelectedStore(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Store
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedStores.map((store) => (
          <div key={store._id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{store.name}</h3>
                  <p className="text-xs text-zinc-400">{store.city}, {store.state}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleStatus(store._id)}
                className="flex items-center gap-1"
              >
                {store.isActive ? (
                  <ToggleRight className="w-5 h-5 text-green-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-red-400" />
                )}
              </button>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{store.address}</span>
              </div>
              {store.phone && (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Phone className="w-4 h-4" />
                  <span>{store.phone}</span>
                </div>
              )}
              {store.timings && (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span>{store.timings}</span>
                </div>
              )}
            </div>

            {store.lat && store.lng && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3 bg-zinc-900 p-2 rounded">
                <Navigation className="w-3 h-3" />
                <span>Lat: {store.lat}, Lng: {store.lng}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(store)}
                className="flex-1 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(store._id)}
                className="px-3 py-2 rounded bg-zinc-700 hover:bg-red-900 text-zinc-200 hover:text-red-400"
                title={store.isActive ? "Deactivate" : "Activate"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
          <div className="text-center py-12 text-zinc-400">Loading...</div>
        )}

        {!loading && filteredStores.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No stores found</p>
          </div>
        )}

        {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredStores.length)} of {filteredStores.length}
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
        <StoreForm
          store={selectedStore}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default StoreTable;