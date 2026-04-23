import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, Tag, Calendar, DollarSign, Clock, AlertTriangle, CheckCircle, Eye, Package, Gift } from "lucide-react";
import { couponsApi } from "@/api/coupons";

const CouponForm = ({ coupon, onClose, onSubmit, isEdit = false }) => {
  const [form, setForm] = useState(coupon || {
    code: "",
    discount: "",
    discountType: "percentage",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = "Code is required";
    if (!form.discount || form.discount <= 0) newErrors.discount = "Discount must be greater than 0";
    if (!form.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (new Date(form.expiryDate) < new Date()) newErrors.expiryDate = "Expiry date must be in the future";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Coupon Code *</label>
            <input
              name="code"
              placeholder="e.g., SAVE20"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none uppercase"
            />
            {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Discount *</label>
              <input
                name="discount"
                type="number"
                placeholder="0"
                value={form.discount}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              {errors.discount && <p className="text-xs text-red-400 mt-1">{errors.discount}</p>}
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
                <option value="shipping">Free Shipping</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Min Order Amount (₹)</label>
              <input
                name="minOrderAmount"
                type="number"
                placeholder="0"
                value={form.minOrderAmount}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Max Discount (₹)</label>
              <input
                name="maxDiscount"
                type="number"
                placeholder="No limit"
                value={form.maxDiscount}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Expiry Date *</label>
              <input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              {errors.expiryDate && <p className="text-xs text-red-400 mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Usage Limit</label>
              <input
                name="usageLimit"
                type="number"
                placeholder="No limit"
                value={form.usageLimit}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Coupon description..."
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
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
              {isEdit ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CouponTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const pageSize = 10;

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      console.log("Fetching coupons...");
      const response = await couponsApi.getAll();
      console.log("Coupons response:", response);
      setCoupons(response?.data?.data?.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error(error.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const createCoupon = async (coupon) => {
    try {
      console.log("Creating coupon:", coupon);
      await couponsApi.create(coupon);
      toast.success('Coupon created successfully');
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error(error.message || 'Failed to create coupon');
    }
  };

  const updateCoupon = async (id, data) => {
    try {
      console.log("Updating coupon:", id, data);
      await couponsApi.update(id, data);
      toast.success('Coupon updated successfully');
      fetchCoupons();
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error(error.message || 'Failed to update coupon');
    }
  };

  const deleteCoupon = async (id) => {
    try {
      console.log("Deleting coupon:", id);
      await couponsApi.delete(id);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(error.message || 'Failed to delete coupon');
    }
  };

  const filteredCoupons = (Array.isArray(coupons) ? coupons : []).filter(coupon => {
    const matchesSearch = coupon.code?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && coupon.isActive;
    if (filter === "inactive") return matchesSearch && !coupon.isActive;
    if (filter === "expired") return matchesSearch && new Date(coupon.expiryDate) < new Date();
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredCoupons.length / pageSize);
  const pagedCoupons = filteredCoupons.slice((page - 1) * pageSize, page * pageSize);

  const handleAddCoupon = (coupon) => {
    createCoupon(coupon);
  };

  const handleUpdateCoupon = (coupon) => {
    updateCoupon(selectedCoupon._id, coupon);
  };

  const handleDelete = (id) => {
    deleteCoupon(id);
  };

  const handleToggleStatus = (id) => {
    const coupon = coupons.find(c => c._id === id);
    updateCoupon(id, { isActive: !coupon.isActive });
  };

  const openEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsEdit(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setSelectedCoupon(null);
  };

  const handleFormSubmit = (formData) => {
    if (isEdit) {
      handleUpdateCoupon(formData);
    } else {
      handleAddCoupon(formData);
    }
    closeForm();
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") return `${coupon.discount}%`;
    if (coupon.discountType === "fixed") return `₹${coupon.discount}`;
    if (coupon.discountType === "shipping") return "Free";
    return coupon.discount;
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Coupons</h2>
          <p className="text-sm text-zinc-400">{filteredCoupons.length} coupons</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search coupons..."
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
            <option value="all">All Coupons</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <button
            onClick={() => { setIsEdit(false); setSelectedCoupon(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Code</th>
              <th className="pb-3">Discount</th>
              <th className="pb-3">Min Order</th>
              <th className="pb-3">Expiry</th>
              <th className="pb-3">Usage</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedCoupons.map((coupon) => {
              const expired = isExpired(coupon.expiryDate);
              return (
                <tr key={coupon._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-400" />
                      <span className="font-mono font-bold text-white">{coupon.code}</span>
                    </div>
                    {coupon.description && (
                      <div className="text-xs text-zinc-500 mt-1">{coupon.description}</div>
                    )}
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-green-400">{formatDiscount(coupon)}</span>
                    {coupon.maxDiscount && (
                      <div className="text-xs text-zinc-500">Max: ₹{coupon.maxDiscount}</div>
                    )}
                  </td>
                  <td className="py-4 text-zinc-300">
                    {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : "No minimum"}
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center gap-1 ${expired ? "text-red-400" : "text-zinc-300"}`}>
                      <Calendar className="w-4 h-4" />
                      {new Date(coupon.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    {expired && (
                      <span className="text-xs text-red-400">Expired</span>
                    )}
                  </td>
                  <td className="py-4 text-zinc-300">
                    {coupon.usageCount} / {coupon.usageLimit || "∞"}
                  </td>
                  <td className="py-4">
                    {coupon.isActive ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openEdit(coupon)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(coupon._id)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                        title={coupon.isActive ? "Deactivate" : "Activate"}
                      >
                        {coupon.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loading && (
          <div className="text-center py-12 text-zinc-400">Loading...</div>
        )}

        {!loading && filteredCoupons.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No coupons found</p>
        </div>
        )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredCoupons.length)} of {filteredCoupons.length}
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
        <CouponForm
          coupon={selectedCoupon}
          isEdit={isEdit}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default CouponTable;