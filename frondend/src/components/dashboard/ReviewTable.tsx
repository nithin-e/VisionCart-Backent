import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, X, Star, AlertTriangle, MessageSquare, User, Package, Eye, EyeOff, Check } from "lucide-react";
import { reviewsApi } from "@/api/reviews";

const ReviewTable = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [hideConfirm, setHideConfirm] = useState(null);
  const pageSize = 10;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = { page, limit: pageSize };
      if (filter !== "all") {
        params.isApproved = filter === "approved" ? "true" : "false";
      }
      const response = await reviewsApi.getAll(params);
      setReviews(response?.data?.data?.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, filter]);

  const hideReview = async (id) => {
    try {
      await reviewsApi.hide(id);
      toast.success('Review hidden successfully');
      fetchReviews();
    } catch (error) {
      console.error("Error hiding review:", error);
      toast.error(error.message || 'Failed to hide review');
    } finally {
      setHideConfirm(null);
    }
  };

  const showReview = async (id) => {
    try {
      await reviewsApi.show(id);
      toast.success('Review made visible');
      fetchReviews();
    } catch (error) {
      console.error("Error showing review:", error);
      toast.error(error.message || 'Failed to show review');
    }
  };

  const filteredReviews = (Array.isArray(reviews) ? reviews : []).filter(review => {
    const matchesSearch = 
      review.comment?.toLowerCase().includes(search.toLowerCase()) ||
      review.productId?.toLowerCase().includes(search.toLowerCase()) ||
      review.userId?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const total = filteredReviews.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedReviews = filteredReviews.slice((page - 1) * pageSize, page * pageSize);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
      />
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleApprove = (id, isApproved) => {
    if (isApproved) {
      showReview(id);
    } else {
      setHideConfirm(id);
    }
    setShowDetails(false);
  };

  const openDetails = (review) => {
    setSelectedReview(review);
    setShowDetails(true);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <p className="text-sm text-zinc-400">{total} reviews</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search reviews..."
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
            <option value="all">All Reviews</option>
            <option value="approved">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">User</th>
              <th className="pb-3">Product</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Comment</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400">No reviews found</td>
              </tr>
            ) : pagedReviews.map((review) => (
              <tr key={review._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span className="text-white text-sm">{review.userId?.slice(0, 8)}...</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-300 text-sm">{review.productId?.slice(0, 8)}...</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                </td>
                <td className="py-4 max-w-xs">
                  <p className="text-zinc-300 text-sm truncate">
                    {review.comment || "No comment"}
                  </p>
                </td>
                <td className="py-4">
                  {review.isApproved ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-400">
                      Visible
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-400">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="py-4 text-zinc-400 text-sm">
                  {formatDate(review.createdAt)}
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-1 pr-2">
                    <button
                      onClick={() => openDetails(review)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                      title="View"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(review._id, !review.isApproved)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400"
                      title={review.isApproved ? "Hide" : "Show"}
                    >
                      {review.isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
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
              disabled={page >= pageCount}
              className="p-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showDetails && selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">Review Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {renderStars(selectedReview.rating)}
                  <span className="text-white ml-2">/ {selectedReview.rating}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Comment</label>
                <p className="text-white bg-zinc-800 p-3 rounded">{selectedReview.comment || "No comment"}</p>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm ${selectedReview.isApproved ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                  {selectedReview.isApproved ? "Visible" : "Hidden"}
                </span>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Date</label>
                <p className="text-white">{formatDate(selectedReview.createdAt)}</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => handleApprove(selectedReview._id, !selectedReview.isApproved)}
                  className={`px-4 py-2 rounded ${selectedReview.isApproved ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  {selectedReview.isApproved ? "Hide Review" : "Show Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hideConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-zinc-900 rounded-xl w-full max-w-sm shadow-lg p-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Hide Review</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to hide this review? It will not be visible to users.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setHideConfirm(null)}
                  className="px-5 py-2.5 rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => hideReview(hideConfirm)}
                  className="px-5 py-2.5 rounded bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;