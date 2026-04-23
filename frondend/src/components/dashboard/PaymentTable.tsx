import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, CreditCard, DollarSign, CheckCircle, AlertCircle, Clock, Eye, RefreshCw, Box, Receipt, Wallet, Building } from "lucide-react";
import { paymentsApi } from "@/api/payments";

const PaymentTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const pageSize = 10;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log("Fetching payments...");
      const response = await paymentsApi.getAll();
      console.log("Payments response:", response);
      setPayments(response?.data?.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error(error.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment._id.toLowerCase().includes(search.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(search.toLowerCase()) ||
      payment.userName.toLowerCase().includes(search.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "success") return matchesSearch && payment.status === "success";
    if (filter === "pending") return matchesSearch && payment.status === "pending";
    if (filter === "failed") return matchesSearch && payment.status === "failed";
    if (filter === "refunded") return matchesSearch && payment.status === "refunded";
    if (filter === "razorpay") return matchesSearch && payment.paymentMethod === "razorpay";
    if (filter === "stripe") return matchesSearch && payment.paymentMethod === "stripe";
    if (filter === "cod") return matchesSearch && payment.paymentMethod === "cod";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredPayments.length / pageSize);
  const pagedPayments = filteredPayments.slice((page - 1) * pageSize, page * pageSize);

  const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.status === "success" ? p.amount : 0), 0);
  const totalPending = filteredPayments.reduce((sum, p) => sum + (p.status === "pending" ? p.amount : 0), 0);
  const totalFailed = filteredPayments.reduce((sum, p) => sum + (p.status === "failed" ? p.amount : 0), 0);

  const openDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Payments</h2>
          <p className="text-sm text-zinc-400">{filteredPayments.length} transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search transactions..."
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
            <option value="all">All Payments</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="razorpay">Razorpay</option>
            <option value="stripe">Stripe</option>
            <option value="cod">COD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">Success</span>
          </div>
          <div className="text-xl font-bold text-green-400">₹{totalAmount.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Pending</span>
          </div>
          <div className="text-xl font-bold text-yellow-400">₹{totalPending.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">Failed</span>
          </div>
          <div className="text-xl font-bold text-red-400">₹{totalFailed.toLocaleString()}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Transaction</th>
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedPayments.map((payment) => {
              const colors = statusColors[payment.status] || statusColors.pending;
              const MethodInfo = methodIcons[payment.paymentMethod];
              const MethodIcon = MethodInfo?.icon || CreditCard;
              const StatusIcon = colors.icon || Clock;
              return (
                <tr key={payment._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div>
                      <span className="font-mono text-blue-400">#{payment._id}</span>
                      {payment.transactionId && (
                        <div className="text-xs text-zinc-500 font-mono">{payment.transactionId}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-zinc-300">#{payment.orderId}</span>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-white">{payment.userName}</div>
                      <div className="text-xs text-zinc-500">{payment.userEmail}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center gap-1 ${MethodInfo?.color}`}>
                      <MethodIcon className="w-4 h-4" />
                      <span className="text-xs capitalize">{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-white">₹{payment.amount}</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <button
                        onClick={() => openDetails(payment)}
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
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No transactions found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredPayments.length)} of {filteredPayments.length}
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

      {showDetails && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => { setShowDetails(false); setSelectedPayment(null); }}
        />
      )}
    </div>
  );
};

export default PaymentTable;