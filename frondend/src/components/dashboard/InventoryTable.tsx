import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, Package, AlertTriangle, CheckCircle, Clock, Eye, Box, Minus, Plus as PlusIcon, RotateCcw } from "lucide-react";
import { inventoryApi } from "@/api/inventory";

const stockStatus = (stock, isActive) => {
  if (!isActive) return { label: "Inactive", bg: "bg-zinc-700/30", text: "text-zinc-400", icon: Clock };
  if (stock === 0) return { label: "Out of Stock", bg: "bg-red-900/30", text: "text-red-400", icon: AlertTriangle };
  if (stock < 10) return { label: "Low Stock", bg: "bg-yellow-900/30", text: "text-yellow-400", icon: AlertTriangle };
  return { label: "In Stock", bg: "bg-green-900/30", text: "text-green-400", icon: CheckCircle };
};

const UpdateStockModal = ({ product, onClose, onUpdate }) => {
  const [stock, setStock] = useState(product?.stock || 0);
  const [quickAdjust, setQuickAdjust] = useState(0);

  const handleUpdate = () => {
    onUpdate(product._id, stock);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {product?.image ? (
              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-zinc-500" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">Update Stock</h2>
              <p className="text-sm text-zinc-400">{product?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Current Stock</label>
            <div className="text-3xl font-bold text-white text-center">{product?.stock}</div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Quick Adjust</label>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setStock(Math.max(0, stock - 10))}
                className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setStock(Math.max(0, stock - 5))}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                -5
              </button>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 p-3 text-center text-xl font-bold rounded-lg bg-zinc-800 text-white border border-zinc-700"
              />
              <button
                onClick={() => setStock(stock + 5)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                +5
              </button>
              <button
                onClick={() => setStock(stock + 10)}
                className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Change</span>
              <span className={`font-bold ${stock > product?.stock ? "text-green-400" : stock < product?.stock ? "text-red-400" : "text-zinc-400"}`}>
                {stock > product?.stock ? "+" : ""}{stock - (product?.stock || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-zinc-400">New Stock</span>
              <span className="font-bold text-blue-400">{stock}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const pageSize = 10;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      console.log("Fetching inventory...");
      const response = await inventoryApi.getAll();
      console.log("Inventory response:", response);
      setProducts(response?.data?.products || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error(error.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (productId, data) => {
    try {
      console.log("Updating stock:", productId, data);
      await inventoryApi.update(productId, data);
      toast.success('Stock updated successfully');
      fetchInventory();
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error.message || 'Failed to update stock');
    }
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.toLowerCase().includes(search.toLowerCase());
    const status = stockStatus(product.stock, product.isActive);
    if (filter === "all") return matchesSearch;
    if (filter === "inStock") return matchesSearch && product.stock >= 10;
    if (filter === "lowStock") return matchesSearch && product.stock > 0 && product.stock < 10;
    if (filter === "outOfStock") return matchesSearch && product.stock === 0;
    if (filter === "inactive") return matchesSearch && !product.isActive;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const handleUpdateStock = (id, newStock) => {
    updateStock(id, { stock: newStock });
    setShowUpdateModal(false);
    setSelectedProduct(null);
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const getStockPercentage = (stock) => {
    return Math.min((stock / 100) * 100, 100);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Inventory</h2>
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
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs">Total Products</span>
          </div>
          <div className="text-xl font-bold text-white">{products.length}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">In Stock</span>
          </div>
          <div className="text-xl font-bold text-green-400">{products.filter(p => p.stock >= 10).length}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Low Stock</span>
          </div>
          <div className="text-xl font-bold text-yellow-400">{products.filter(p => p.stock > 0 && p.stock < 10).length}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Out of Stock</span>
          </div>
          <div className="text-xl font-bold text-red-400">{products.filter(p => p.stock === 0).length}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Product</th>
              <th className="pb-3">Brand</th>
              <th className="pb-3">Stock Level</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedProducts.map((product) => {
              const status = stockStatus(product.stock, product.isActive);
              const StatusIcon = status.icon;
              return (
                <tr key={product._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <Box className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-zinc-500">ID: {product._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-300">{product.brand}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white w-12">{product.stock}</span>
                      <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            product.stock === 0 ? "bg-red-500" : product.stock < 10 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${getStockPercentage(product.stock)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="Update Stock"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
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

      {showUpdateModal && selectedProduct && (
        <UpdateStockModal
          product={selectedProduct}
          onClose={() => { setShowUpdateModal(false); setSelectedProduct(null); }}
          onUpdate={handleUpdateStock}
        />
      )}
    </div>
  );
};

export default InventoryTable;