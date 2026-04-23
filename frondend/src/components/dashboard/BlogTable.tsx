import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, FileText, Calendar, Eye, Upload, Image, ExternalLink } from "lucide-react";
import { blogsApi } from "@/api/blogs";

const BlogForm = ({ blog, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(blog || { title: "", content: "", image: "" });
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
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Blog" : "Add New Blog"}
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
              placeholder="Blog title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Content *</label>
            <textarea
              name="content"
              placeholder="Blog content..."
              value={form.content}
              onChange={handleChange}
              rows={8}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Cover Image URL</label>
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
                <img src={form.image} alt="Blog" className="w-full h-32 object-cover rounded-lg border border-zinc-700" />
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

          {isEdit && (
            <div className="bg-zinc-800 p-3 rounded-lg">
              <label className="block text-xs text-zinc-500 mb-1">Slug (URL)</label>
              <div className="flex items-center gap-2 text-zinc-300">
                <span>/blog/</span>
                <span className="font-mono">{form.title?.toLowerCase().replace(/\s+/g, "-") || blog?.slug}</span>
              </div>
            </div>
          )}

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
              {isEdit ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const pageSize = 10;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log("Fetching blogs...");
      const response = await blogsApi.getAll();
      console.log("Blogs response:", response);
      setBlogs(response?.data?.data?.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(error.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const createBlog = async (blog) => {
    try {
      console.log("Creating blog:", blog);
      await blogsApi.create(blog);
      toast.success('Blog created successfully');
      fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(error.message || 'Failed to create blog');
    }
  };

  const updateBlog = async (id, data) => {
    try {
      console.log("Updating blog:", id, data);
      await blogsApi.update(id, data);
      toast.success('Blog updated successfully');
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(error.message || 'Failed to update blog');
    }
  };

  const deleteBlog = async (id) => {
    try {
      console.log("Deleting blog:", id);
      await blogsApi.delete(id);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.message || 'Failed to delete blog');
    }
  };

  const filteredBlogs = (Array.isArray(blogs) ? blogs : []).filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && blog.isActive;
    if (filter === "inactive") return matchesSearch && !blog.isActive;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredBlogs.length / pageSize);
  const pagedBlogs = filteredBlogs.slice((page - 1) * pageSize, page * pageSize);

  const handleAddBlog = (blog) => {
    createBlog(blog);
  };

  const handleUpdateBlog = (blog) => {
    updateBlog(selectedBlog._id, blog);
  };

  const handleDelete = (id) => {
    deleteBlog(id);
  };

  const handleToggleStatus = (id) => {
    const blog = blogs.find(b => b._id === id);
    updateBlog(id, { isActive: !blog.isActive });
  };

  const openEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEdit(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedBlog(null);
  };

  const handleFormSubmit = (formData) => {
    if (isEdit) {
      handleUpdateBlog(formData);
    } else {
      handleAddBlog(formData);
    }
    closeForm();
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Blogs</h2>
          <p className="text-sm text-zinc-400">{filteredBlogs.length} blogs</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search blogs..."
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
            onClick={() => { setIsEdit(false); setSelectedBlog(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Blog
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedBlogs.map((blog) => (
          <div key={blog._id} className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-colors">
            <div className="relative">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-zinc-700 flex items-center justify-center">
                  <Image className="w-12 h-12 text-zinc-500" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(blog._id)}
                  className={`p-2 rounded-full ${blog.isActive ? "bg-green-500" : "bg-red-500"}`}
                >
                  {blog.isActive ? <ToggleRight className="w-4 h-4 text-white" /> : <ToggleLeft className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  blog.isActive ? "bg-green-900 text-green-400" : "bg-zinc-600 text-zinc-400"
                }`}>
                  {blog.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(blog.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{blog.content}</p>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  /blog/{blog.slug}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(blog)}
                  className="flex-1 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-4 py-2 rounded bg-zinc-700 hover:bg-red-900 text-zinc-200 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
          <div className="text-center py-12 text-zinc-400">Loading...</div>
        )}

        {!loading && filteredBlogs.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No blogs found</p>
        </div>
        )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBlogs.length)} of {filteredBlogs.length}
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
        <BlogForm
          blog={selectedBlog}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default BlogTable;