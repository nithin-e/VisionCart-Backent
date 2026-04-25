import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Edit, Eye, Upload, ChevronLeft, ChevronRight, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { api } from "@/api/fetch";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";

const statusColor = (product) => {
  if (!product.isActive) return "bg-zinc-700 text-zinc-400";
  if (product.stock === 0) return "bg-red-900 text-red-400";
  if (product.stock < 10) return "bg-yellow-900 text-yellow-400";
  return "bg-green-900 text-green-400";
};

const statusText = (product) => {
  if (!product.isActive) return "Inactive";
  if (product.stock === 0) return "Out of stock";
  if (product.stock < 10) return "Low stock";
  return "In stock";
};

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 10;
  const [filter, setFilter] = useState("all");

  const fetchProducts = async () => {
    console.log("🔄 [FETCH] Initial Load Started - fetchProducts() called");
    try {
      console.log("⏳ [FETCH] Fetching Products...");
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/products");
      console.log("📦 [FETCH] Full API Response:", response);
      console.log("📦 [FETCH] Response Type:", typeof response);
      console.log("📦 [FETCH] Has .data property?:", !!response?.data);
      console.log("📦 [FETCH] .data.products Type:", typeof response?.data?.products);
      console.log("📦 [FETCH] .data.products Is Array?:", Array.isArray(response?.data?.products));

      const productsArray = response?.data?.products || [];

      console.log("✅ [FETCH] Extracted Products Array:", productsArray);
      console.log("✅ [FETCH] Products Count:", productsArray.length);
      console.log("✅ [FETCH] Setting state with products...");
      setProducts(productsArray);
      console.log("✅ [FETCH] State (setProducts) called successfully");
    } catch (err) {
      console.error("❌ [FETCH] Error Fetching Products:", err.message);
      setError(err.message);
      toast.error(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
      console.log("🏁 [FETCH] fetchProducts() completed");
    }
  };

  useEffect(() => {
    console.log("🚀 [MOUNT] ProductsTable component mounted");
    fetchProducts();
    return () => {
      console.log("🔚 [UNMOUNT] ProductsTable component unmounted");
    };
  }, []);

  const createProduct = async (productData) => {
    try {
      setSubmitting(true);
      const response = await api.post("/admin/products", productData);
      console.log("Add Product Response:", response);
      toast.success("Product created successfully");
      await fetchProducts();
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to create product");
      return { success: false, error: err };
    } finally {
      setSubmitting(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setSubmitting(true);
      await api.put(`/admin/products/${id}`, productData);
      toast.success("Product updated successfully");
      await fetchProducts();
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to update product");
      return { success: false, error: err };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setSubmitting(true);
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted successfully");
      await fetchProducts();
      setShowDetails(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  const updateProductStock = async (id, stock) => {
    try {
      await api.put(`/admin/products/${id}`, { stock });
      toast.success("Stock updated successfully");
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to update stock");
    }
  };

  const updateProductStatus = async (id, isActive) => {
    try {
      await api.put(`/admin/products/${id}`, { isActive });
      toast.success("Status updated successfully");
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const updateProductPrice = async (id, price) => {
    try {
      await api.put(`/admin/products/${id}`, { price });
      toast.success("Price updated successfully");
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to update price");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
      p.brand?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && p.isActive;
    if (filter === "inactive") return matchesSearch && !p.isActive;
    if (filter === "lowStock") return matchesSearch && p.stock > 0 && p.stock < 10;
    if (filter === "outOfStock") return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  const handleUpdateStock = (id, stock) => {
    updateProductStock(id, stock);
  };

  const handleUpdateStatus = (id, isActive) => {
    updateProductStatus(id, isActive);
  };

  const handleUpdatePrice = (id, price) => {
    updateProductPrice(id, price);
  };

  const openDetails = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const openEdit = (product) => {
    setSelectedProduct(product);
    setIsEdit(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (formData) => {
    if (isEdit && selectedProduct?._id) {
      const result = await updateProduct(selectedProduct._id, formData);
      if (result.success) {
        closeForm();
      }
    } else {
      const result = await createProduct(formData);
      if (result.success) {
        closeForm();
      }
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Products</h2>
          <p className="text-sm text-zinc-400">{filteredProducts.length} products</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
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
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setIsEdit(false); setSelectedProduct(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <p>Error: {error}</p>
            <button onClick={fetchProducts} className="mt-2 text-blue-400 hover:underline">
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No products found</p>
          </div>
        ) : (
          <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Product</th>
              <th className="pb-3">Brand</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Stock</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedProducts.map((product) => (
                <tr key={product._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Package className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-zinc-500">ID: {product._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-300">{product.brand || "-"}</td>
                  <td className="py-4 text-white">₹{product.price}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{product.stock}</span>
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock === 0 ? 'bg-red-500' : product.stock < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(product)}`}>
                      {statusText(product)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openDetails(product)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12 text-zinc-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No products found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length}
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
        <ProductForm
          product={selectedProduct}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          submitting={submitting}
        />
      )}

      {showDetails && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => { setShowDetails(false); setSelectedProduct(null); }}
          onEdit={() => { setShowDetails(false); openEdit(selectedProduct); }}
          onDelete={handleDelete}
          onUpdateStock={handleUpdateStock}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePrice={handleUpdatePrice}
        />
      )}
    </div>
  );
};

export default ProductsTable;