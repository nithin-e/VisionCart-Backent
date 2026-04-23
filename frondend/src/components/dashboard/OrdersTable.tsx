import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, User, Mail, Phone, Package, Clock, CheckCircle, Truck, AlertTriangle, MapPin, Eye, DollarSign, Calendar, RefreshCw, Box } from "lucide-react";
import { ordersApi } from "@/api/orders";

const statusColors = {
  pending: { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-500" },
  confirmed: { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-500" },
  shipped: { bg: "bg-purple-900/30", text: "text-purple-400", border: "border-purple-500" },
  delivered: { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-500" },
  cancelled: { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-500" },
  refunded: { bg: "bg-zinc-700/30", text: "text-zinc-400", border: "border-zinc-500" },
};

const statusFlow = ["pending", "confirmed", "shipped", "delivered"];

const RefundModal = ({ order, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Process Refund</h2>
              <p className="text-sm text-zinc-400">Order #{order?._id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Refund Amount:</span>
              <span className="text-white font-bold">₹{order?.totalAmount}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Refund Reason *</label>
            <textarea
              placeholder="Reason for refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-900 p-3 rounded-lg">
            <p className="text-sm text-yellow-400">
              This will process a refund and cancel the order.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="px-5 py-2.5 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, onRefund }) => {
  const [statusDropdown, setStatusDropdown] = useState(false);
  const colors = statusColors[order?.status] || statusColors.pending;

  const handleStatusUpdate = (newStatus) => {
    onUpdateStatus(order?._id, newStatus);
    setStatusDropdown(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <div>
            <h2 className="text-xl font-bold text-white">Order #{order?._id}</h2>
            <p className="text-sm text-zinc-400">Placed on {new Date(order?.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setStatusDropdown(!statusDropdown)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Update Status
              </button>
              {statusDropdown && (
                <div className="absolute right-0 top-12 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 py-1 z-10 min-w-40">
                  {statusFlow.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      className={`w-full px-4 py-2 text-left text-sm capitalize hover:bg-zinc-700 ${
                        order?.status === status ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-700"
                  >
                    Cancelled
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order?.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-zinc-800 p-3 rounded-lg">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center">
                      <Box className="w-8 h-8 text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-xs text-zinc-400">
                      {item.attributes?.color && `Color: ${item.attributes.color}, `}
                      {item.attributes?.size && `Size: ${item.attributes.size}`}
                    </div>
                    <div className="text-xs text-zinc-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">₹{item.price}</div>
                    <div className="text-xs text-zinc-400">₹{item.price} × {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total Amount</span>
              <span className="text-xl font-bold text-white">₹{order?.totalAmount}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Shipping Address</h3>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-white mb-1">
                <User className="w-4 h-4 text-zinc-500" />
                {order?.address?.name}
              </div>
              <div className="flex items-center gap-2 text-white mb-1">
                <Phone className="w-4 h-4 text-zinc-500" />
                {order?.address?.phone}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4" />
                {order?.address?.address}
              </div>
            </div>
          </div>

          {order?.tracking && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Tracking</h3>
              <div className="space-y-2">
                {order.tracking.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[item.status]?.bg?.replace('/30', '')} bg-current`} />
                    <div className="flex-1 flex justify-between">
                      <span className="capitalize text-white">{item.status}</span>
                      <span className="text-zinc-400">{item.date}</span>
                    </div>
                  </div>
                ))}
                {order.tracking.estimatedDelivery && (
                  <div className="text-sm text-green-400 mt-2">
                    Estimated Delivery: {order.tracking.estimatedDelivery}
                  </div>
                )}
              </div>
            </div>
          )}

          {order?.cancelReason && (
            <div className="bg-red-900/20 border border-red-900 p-3 rounded-lg">
              <span className="text-sm text-red-400">Cancelled: {order.cancelReason}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between p-6 border-t border-zinc-800">
          {order?.status !== "cancelled" && order?.status !== "delivered" && (
            <button
              onClick={() => { onClose(); onRefund(order); }}
              className="px-5 py-2.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Process Refund
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600 ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const pageSize = 10;

  const fetchOrders = async () => {
    console.log("🔄 [FETCH] Initial Load Started - fetchOrders() called");
    try {
      console.log("⏳ [FETCH] Fetching Orders...");
      setLoading(true);
      const response = await ordersApi.getAll();
      console.log("📦 [FETCH] Full API Response:", response);
      console.log("📦 [FETCH] Response Type:", typeof response);
      console.log("📦 [FETCH] Has .data property?:", !!response?.data);
      console.log("📦 [FETCH] .data.orders Type:", typeof response?.data?.orders);
      console.log("📦 [FETCH] .data.orders Is Array?:", Array.isArray(response?.data?.orders));

      const ordersArray = response?.data?.data?.orders || [];

      console.log("✅ [FETCH] Extracted Orders Array:", ordersArray);
      console.log("✅ [FETCH] Orders Count:", ordersArray.length);
      console.log("✅ [FETCH] Setting state with orders...");
      setOrders(ordersArray);
      console.log("✅ [FETCH] State (setOrders) called successfully");
    } catch (error) {
      console.error("❌ [FETCH] Error Fetching Orders:", error);
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      console.log("🏁 [FETCH] fetchOrders() completed");
    }
  };

  useEffect(() => {
    console.log("🚀 [MOUNT] OrdersTable component mounted");
    fetchOrders();
    return () => {
      console.log("🔚 [UNMOUNT] OrdersTable component unmounted");
    };
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      console.log("🔄 [UPDATE] Updating order status:", id, status);
      await ordersApi.updateStatus(id, status);
      toast.success("Order status updated successfully");
      await fetchOrders();
      setShowDetails(false);
    } catch (error) {
      console.error("❌ [UPDATE] Error updating order status:", error);
      toast.error(error.message || "Failed to update order status");
    }
  };

  const handleRefund = async (reason) => {
    try {
      console.log("🔄 [REFUND] Processing refund for order:", selectedOrder._id, "Reason:", reason);
      await ordersApi.refund(selectedOrder._id, { reason });
      toast.success("Refund processed successfully");
      await fetchOrders();
      setShowRefundModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("❌ [REFUND] Error processing refund:", error);
      toast.error(error.message || "Failed to process refund");
    }
  };

  console.log("🎨 [RENDER] Component rendering...");
  console.log("🎨 [RENDER] orders state:", orders);
  console.log("🎨 [RENDER] orders.length:", orders.length);
  console.log("🎨 [RENDER] loading:", loading);

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      order.userName?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "pending") return matchesSearch && order.status === "pending";
    if (filter === "confirmed") return matchesSearch && order.status === "confirmed";
    if (filter === "shipped") return matchesSearch && order.status === "shipped";
    if (filter === "delivered") return matchesSearch && order.status === "delivered";
    if (filter === "cancelled") return matchesSearch && order.status === "cancelled";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredOrders.length / pageSize);
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const openRefund = (order) => {
    setSelectedOrder(order);
    setShowRefundModal(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "confirmed": return <CheckCircle className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <Package className="w-4 h-4" />;
      case "cancelled": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="text-sm text-zinc-400">{filteredOrders.length} orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Items</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedOrders.map((order) => {
              const colors = statusColors[order.status] || statusColors.pending;
              return (
                <tr key={order._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <span className="font-mono text-blue-400">#{order._id}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">
                        {order.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white">{order.userName}</div>
                        <div className="text-xs text-zinc-500">{order.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-300">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-white">₹{order.totalAmount}</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {getStatusIcon(order.status)}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openDetails(order)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        )}
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-12 text-zinc-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredOrders.length)} of {filteredOrders.length}
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

      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => { setShowDetails(false); setSelectedOrder(null); }}
          onUpdateStatus={handleUpdateStatus}
          onRefund={openRefund}
        />
      )}

      {showRefundModal && selectedOrder && (
        <RefundModal
          order={selectedOrder}
          onClose={() => { setShowRefundModal(false); setSelectedOrder(null); setShowDetails(true); }}
          onConfirm={handleRefund}
        />
      )}
    </div>
  );
};

export default OrdersTable;