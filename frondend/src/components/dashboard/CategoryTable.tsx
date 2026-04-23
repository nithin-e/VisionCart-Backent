import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, Eye, Upload, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, Folder } from "lucide-react";
import { categoriesApi } from "@/api/categories";

const CategoryForm = ({ category, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(category || { name: "", description: "", image: "" });
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
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Category Name *</label>
            <input
              name="name"
              placeholder="e.g., Eyeglasses"
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
              placeholder="Category description"
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
                <img src={form.image} alt="Category" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
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
              {isEdit ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const pageSize = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log("Fetching categories...");
      const response = await categoriesApi.getAll();
      console.log("Categories response:", response);
      setCategories(response?.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (cat) => {
    try {
      console.log("Creating category:", cat);
      await categoriesApi.create(cat);
      toast.success('Category created successfully');
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.message || 'Failed to create category');
    }
  };

  const updateCategory = async (id, data) => {
    try {
      console.log("Updating category:", id, data);
      await categoriesApi.update(id, data);
      toast.success('Category updated successfully');
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.message || 'Failed to update category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      console.log("Deleting category:", id);
      await categoriesApi.delete(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const filteredCategories = (Array.isArray(categories) ? categories : []).filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && cat.isActive;
    if (filter === "inactive") return matchesSearch && !cat.isActive;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredCategories.length / pageSize);
  const pagedCategories = filteredCategories.slice((page - 1) * pageSize, page * pageSize);

  const handleAddCategory = (cat) => {
    createCategory(cat);
  };

  const handleUpdateCategory = (cat) => {
    updateCategory(selectedCategory._id, cat);
  };

  const handleDelete = (id) => {
    deleteCategory(id);
  };

  const handleToggleStatus = (id) => {
    const category = categories.find(c => c._id === id);
    updateCategory(id, { isActive: !category.isActive });
  };

  const openEdit = (cat) => {
    setSelectedCategory(cat);
    setIsEdit(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = (formData) => {
    if (isEdit) {
      handleUpdateCategory(formData);
    } else {
      handleAddCategory(formData);
    }
    closeForm();
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Categories</h2>
          <p className="text-sm text-zinc-400">{filteredCategories.length} categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search categories..."
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
            onClick={() => { setIsEdit(false); setSelectedCategory(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No categories found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
                <th className="pb-3 pl-2">Category</th>
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
            ) : pagedCategories.map((cat) => (
                <tr key={cat._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Folder className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{cat.name}</div>
                        <div className="text-xs text-zinc-500">{cat.description || "No description"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-400 font-mono text-sm">{cat.slug}</td>
                  <td className="py-4 text-zinc-300">
                    <span className="text-white font-medium">0</span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleToggleStatus(cat._id)}
                      className="flex items-center gap-1"
                    >
                      {cat.isActive ? (
                        <ToggleRight className="w-5 h-5 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${cat.isActive ? "text-green-400" : "text-red-400"}`}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredCategories.length)} of {filteredCategories.length}
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
        <CategoryForm
          category={selectedCategory}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default CategoryTable;