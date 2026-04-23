import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, Upload, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, Layers, Package, Check, ChevronDown } from "lucide-react";
import { collectionsApi } from "@/api/collections";
import { productsApi } from "@/api/products";

const CollectionForm = ({ collection, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(collection || { name: "", description: "", image: "" });
  const [imageInput, setImageInput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Collection" : "Add New Collection"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Collection Name *</label>
            <input
              name="name"
              placeholder="e.g., Premium Collection"
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
              placeholder="Collection description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Image URL</label>
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
              <div className="relative inline-block group">
                <img src={form.image} alt="Collection" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-blue-400 hover:text-blue-300">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
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
              {isEdit ? "Update Collection" : "Create Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignProductsModal = ({ collection, allProducts, onClose, onAssign }) => {
  const [selectedProducts, setSelectedProducts] = useState(collection?.productIds || []);

  const toggleProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAssign = () => {
    onAssign(selectedProducts);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            Assign Products to "{collection?.name}"
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {allProducts.map(product => (
              <div
                key={product._id}
                onClick={() => toggleProduct(product._id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                  selectedProducts.includes(product._id)
                    ? "bg-blue-900/30 border-blue-500"
                    : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedProducts.includes(product._id)
                    ? "bg-blue-500 border-blue-500"
                    : "border-zinc-500"
                }`}>
                  {selectedProducts.includes(product._id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{product.name}</div>
                  <div className="text-xs text-zinc-400">{product.brand}</div>
                </div>
                <div className="text-xs text-zinc-500">ID: {product._id}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            {selectedProducts.length} product(s) selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Assign Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const pageSize = 10;

  const fetchCollections = async () => {
    try {
      setLoading(true);
      console.log("Fetching collections...");
      const response = await collectionsApi.getAll();
      console.log("Collections response:", response);
      setCollections(response?.data?.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error(error.message || 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      console.log("Products response:", response);
      setProducts(response?.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const createCollection = async (col) => {
    try {
      console.log("Creating collection:", col);
      await collectionsApi.create(col);
      toast.success('Collection created successfully');
      fetchCollections();
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error(error.message || 'Failed to create collection');
    }
  };

  const updateCollection = async (id, data) => {
    try {
      console.log("Updating collection:", id, data);
      await collectionsApi.update(id, data);
      toast.success('Collection updated successfully');
      fetchCollections();
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error(error.message || 'Failed to update collection');
    }
  };

  const deleteCollection = async (id) => {
    try {
      console.log("Deleting collection:", id);
      await collectionsApi.delete(id);
      toast.success('Collection deleted successfully');
      fetchCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error(error.message || 'Failed to delete collection');
    }
  };

  const filteredCollections = (Array.isArray(collections) ? collections : []).filter(col => {
    const matchesSearch = col.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && col.isActive;
    if (filter === "inactive") return matchesSearch && !col.isActive;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredCollections.length / pageSize);
  const pagedCollections = filteredCollections.slice((page - 1) * pageSize, page * pageSize);

  const handleAddCollection = (col) => {
    createCollection(col);
  };

  const handleUpdateCollection = (col) => {
    updateCollection(selectedCollection._id, col);
  };

  const handleDelete = (id) => {
    deleteCollection(id);
  };

  const handleToggleStatus = (id) => {
    const collection = collections.find(c => c._id === id);
    updateCollection(id, { isActive: !collection.isActive });
  };

  const handleAssignProducts = async (productIds) => {
    try {
      console.log("Assigning products:", selectedCollection._id, productIds);
      await collectionsApi.addProducts(selectedCollection._id, productIds);
      toast.success('Products assigned successfully');
      fetchCollections();
    } catch (error) {
      console.error("Error assigning products:", error);
      toast.error(error.message || 'Failed to assign products');
    }
  };

  const openEdit = (col) => {
    setSelectedCollection(col);
    setIsEdit(true);
    setShowForm(true);
  };

  const openAssignProducts = (col) => {
    setSelectedCollection(col);
    setShowAssignModal(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedCollection(null);
  };

  const handleFormSubmit = (formData) => {
    if (isEdit) {
      handleUpdateCollection(formData);
    } else {
      handleAddCollection(formData);
    }
    closeForm();
  };

  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Collections</h2>
          <p className="text-sm text-zinc-400">{filteredCollections.length} collections</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search collections..."
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
            onClick={() => { setIsEdit(false); setSelectedCollection(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Collection
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Collection</th>
              <th className="pb-3">Slug</th>
              <th className="pb-3">Products</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedCollections.map((col) => (
              <tr key={col._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    {col.image ? (
                      <img src={col.image} alt={col.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-zinc-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{col.name}</div>
                      <div className="text-xs text-zinc-500">{col.description || "No description"}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-zinc-400 font-mono text-sm">{col.slug}</td>
                <td className="py-4">
                  <button
                    onClick={() => openAssignProducts(col)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>{col.productIds?.length || 0}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </td>
                <td className="py-4">
                  <button
                    onClick={() => handleToggleStatus(col._id)}
                    className="flex items-center gap-1"
                  >
                    {col.isActive ? (
                      <ToggleRight className="w-5 h-5 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${col.isActive ? "text-green-400" : "text-red-400"}`}>
                      {col.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-1 pr-2">
                    <button
                      onClick={() => openAssignProducts(col)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                      title="Assign Products"
                    >
                      <Package className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(col)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(col._id)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                      title={col.isActive ? "Deactivate" : "Activate"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCollections.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No collections found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredCollections.length)} of {filteredCollections.length}
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
        <CollectionForm
          collection={selectedCollection}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {showAssignModal && selectedCollection && (
        <AssignProductsModal
          collection={selectedCollection}
          allProducts={products}
          onClose={() => { setShowAssignModal(false); setSelectedCollection(null); }}
          onAssign={handleAssignProducts}
        />
      )}
    </div>
  );
};

export default CollectionTable;
