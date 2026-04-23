import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, Package, Calendar, Clock, CheckCircle, AlertTriangle, MapPin, Eye, User, Phone, Home, PackageCheck, PackageX, CalendarDays, Store } from "lucide-react";
import { tryAtHomeApi } from "@/api/tryAtHome";

const statusColors = {
  pending: { bg: "bg-yellow-900/30", text: "text-yellow-400", icon: Clock, label: "Pending" },
  approved: { bg: "bg-blue-900/30", text: "text-blue-400", icon: CheckCircle, label: "Approved" },
  rejected: { bg: "bg-red-900/30", text: "text-red-400", icon: PackageX, label: "Rejected" },
  completed: { bg: "bg-green-900/30", text: "text-green-400", icon: PackageCheck, label: "Completed" },
};

const StatusUpdateModal = ({ booking, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const handleSubmit = () => {
    if (newStatus === "rejected" && !rejectReason.trim()) return;
    onUpdate(booking._id, newStatus, rejectReason);
    onClose();
  };

  const canApprove = booking.status === "pending";
  const canReject = booking.status === "pending";
  const canComplete = booking.status === "approved";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Update Booking</h2>
            <p className="text-sm text-zinc-400">#{booking?._id}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Select Action</label>
            <div className="space-y-2">
              {canApprove && (
                <button
                  onClick={() => setNewStatus("approved")}
                  className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                    newStatus === "approved" 
                      ? "border-blue-500 bg-blue-900/20" 
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Approve Booking</span>
                </button>
              )}
              {canReject && (
                <button
                  onClick={() => setNewStatus("rejected")}
                  className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                    newStatus === "rejected" 
                      ? "border-red-500 bg-red-900/20" 
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <PackageX className="w-5 h-5 text-red-400" />
                  <span className="text-white">Reject Booking</span>
                </button>
              )}
              {canComplete && (
                <button
                  onClick={() => setNewStatus("completed")}
                  className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                    newStatus === "completed" 
                      ? "border-green-500 bg-green-900/20" 
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <PackageCheck className="w-5 h-5 text-green-400" />
                  <span className="text-white">Mark as Completed</span>
                </button>
              )}
            </div>
          </div>

          {newStatus === "rejected" && (
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Rejection Reason *</label>
              <textarea
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!newStatus || (newStatus === "rejected" && !rejectReason.trim())}
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const colors = statusColors[booking?.status] || statusColors.pending;
  const StatusIcon = colors.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <div>
            <h2 className="text-xl font-bold text-white">Booking Details</h2>
            <p className="text-sm text-zinc-400">#{booking?._id}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${colors.text}`} />
              <span className={`font-medium ${colors.text}`}>{colors.label}</span>
            </div>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Update Status
            </button>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Customer Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4 text-zinc-500" />
                {booking?.userName}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-4 h-4" />
                {booking?.userPhone}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4" />
                {booking?.address?.address}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Products to Try</h3>
            <div className="space-y-3">
              {booking?.products?.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-zinc-800 p-3 rounded-lg">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                  ) : (
                    <div className="w-14 h-14 bg-zinc-700 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="text-sm text-zinc-400">₹{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-white mb-2">
              <CalendarDays className="w-4 h-4 text-zinc-500" />
              <span>Scheduled Date: <strong>{new Date(booking?.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
            </div>
            <div className="text-sm text-zinc-400">
              Booked on: {new Date(booking?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>

          {booking?.rejectReason && (
            <div className="bg-red-900/20 border border-red-900 p-3 rounded-lg">
              <label className="block text-xs text-red-400 mb-1">Rejection Reason</label>
              <p className="text-sm text-red-300">{booking.rejectReason}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-zinc-800">
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

const TryAtHomeTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const pageSize = 10;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("Fetching bookings...");
      const response = await tryAtHomeApi.getAll({ search, status: filter === "all" ? undefined : filter });
      console.log("Bookings response:", response);
      setBookings(response?.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, filter]);

  const updateStatus = async (id, status, rejectReason) => {
    try {
      console.log("Updating status:", id, status, rejectReason);
      await tryAtHomeApi.updateStatus(id, { status, rejectReason });
      toast.success("Status updated successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleUpdateStatus = (id, status, reason) => {
    updateStatus(id, status, reason);
    setShowStatusModal(false);
  };
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking._id || "").toLowerCase().includes(search.toLowerCase()) ||
      (booking.userName || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "pending") return matchesSearch && booking.status === "pending";
    if (filter === "approved") return matchesSearch && booking.status === "approved";
    if (filter === "rejected") return matchesSearch && booking.status === "rejected";
    if (filter === "completed") return matchesSearch && booking.status === "completed";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredBookings.length / pageSize);
  const pagedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const openStatusModal = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const totalPending = bookings.filter(b => b.status === "pending").length;
  const totalApproved = bookings.filter(b => b.status === "approved").length;
  const totalCompleted = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Try @ Home</h2>
          <p className="text-sm text-zinc-400">{filteredBookings.length} bookings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search bookings..."
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
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Pending</span>
          </div>
          <div className="text-xl font-bold text-yellow-400">{totalPending}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">Approved</span>
          </div>
          <div className="text-xl font-bold text-blue-400">{totalApproved}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <PackageCheck className="w-4 h-4" />
            <span className="text-xs">Completed</span>
          </div>
          <div className="text-xl font-bold text-green-400">{totalCompleted}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Booking ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Products</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">No bookings found</td>
              </tr>
            ) : pagedBookings.map((booking) => {
              const colors = statusColors[booking.status] || statusColors.pending;
              const StatusIcon = colors.icon;
              return (
                <tr key={booking._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <span className="font-mono text-blue-400">#{booking._id}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">
                        {booking.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white">{booking.userName}</div>
                        <div className="text-xs text-zinc-500">{booking.userPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-300">
                    {booking.products.length} product{booking.products.length > 1 ? "s" : ""}
                  </td>
                  <td className="py-4 text-zinc-300">
                    {new Date(booking.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {colors.label}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openDetails(booking)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openStatusModal(booking)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                        title="Update Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No bookings found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBookings.length)} of {filteredBookings.length}
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

      {showDetails && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => { setShowDetails(false); setSelectedBooking(null); }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {showStatusModal && selectedBooking && (
        <StatusUpdateModal
          booking={selectedBooking}
          onClose={() => { setShowStatusModal(false); setSelectedBooking(null); }}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default TryAtHomeTable;