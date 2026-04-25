import React, { useState } from "react";
import { toast } from "sonner";
import { X, Edit, Trash2, Package, ToggleLeft, ToggleRight, Image } from "lucide-react";
import { productsApi } from "@/api/products";

const ProductDetails = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [stockInput, setStockInput] = useState(product?.stock || 0);
  const [priceInput, setPriceInput] = useState(product?.price || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateStock = async (id, stock) => {
    try {
      await productsApi.update(id, { stock });
      toast.success("Stock updated successfully");
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const updatePrice = async (id, price) => {
    try {
      await productsApi.update(id, { price });
      toast.success("Price updated successfully");
    } catch (error) {
      toast.error("Failed to update price");
    }
  };

  const deleteProduct = async (id) => {
    try {
      setDeleting(true);
      await productsApi.delete(id);
      toast.success("Product deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const finalPrice = product?.price || 0;

  const handleStockUpdate = () => {
    updateStock(product._id, Number(stockInput));
  };

  const handlePriceUpdate = () => {
    updatePrice(product._id, Number(priceInput));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product._id);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await productsApi.update(product._id, { isActive: !product.isActive });
      toast.success(`Product ${product.isActive ? "deactivated" : "activated"} successfully`);
      onClose();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            {product.images && product.images[0] && (
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
              <p className="text-sm text-zinc-400">ID: {product._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-blue-400"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-zinc-800">
          {["details", "pricing", "stock", "images"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Basic Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Name</span>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Brand</span>
                      <span className="text-white">{product.brand || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status</span>
                      <button onClick={handleToggleStatus} className="flex items-center gap-1">
                        {product.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-red-400" />
                        )}
                        <span className={product.isActive ? "text-green-400" : "text-red-400"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-2">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Price</span>
                      <span className="text-white">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-800 pt-2">
                      <span className="text-zinc-400">Final Price</span>
                      <span className="text-green-400 font-bold">₹{finalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4">Update Pricing</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="w-full p-2.5 rounded bg-zinc-700 text-white border border-zinc-600"
                    />
                  </div>
                  <div className="bg-zinc-700 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Price:</span>
                      <span className="text-green-400 font-bold">
                        ₹{Number(priceInput).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePriceUpdate}
                    className="w-full py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update Price
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4">Manage Stock</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Current Stock</label>
                    <input
                      type="number"
                      value={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      className="w-full p-2.5 rounded bg-zinc-700 text-white border border-zinc-600"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStockInput(Math.max(0, Number(stockInput) - 10))}
                      className="flex-1 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => setStockInput(Number(stockInput) + 10)}
                      className="flex-1 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
                    >
                      +10
                    </button>
                  </div>
                  <button
                    onClick={handleStockUpdate}
                    className="w-full py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Stock Status</h3>
                <div className="flex items-center gap-2">
                  {product.stock === 0 ? (
                    <span className="px-3 py-1 rounded-full bg-red-900 text-red-400 text-sm">Out of Stock</span>
                  ) : product.stock < 10 ? (
                    <span className="px-3 py-1 rounded-full bg-yellow-900 text-yellow-400 text-sm">Low Stock</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-green-900 text-green-400 text-sm">In Stock</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-zinc-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button className="p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-zinc-400">
                    No images available
                  </div>
                )}
              </div>
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors">
                <Image className="w-5 h-5" />
                <span>Upload New Image</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-zinc-800">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded bg-red-900/50 text-red-400 hover:bg-red-900 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;