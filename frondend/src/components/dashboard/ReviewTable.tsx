import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, X, Star, Package, User, Eye, Trash2, Check, EyeOff, AlertTriangle, MessageSquare } from "lucide-react";
import { reviewsApi } from "@/api/reviews";

const ReviewDetailsModal = ({ review, onClose, onApprove, onDelete }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Review Details</h2>
            <p className="text-sm text-zinc-400">#{review?._id}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderStars(review?.rating)}
              <span className="text-white font-bold ml-2">{review?.rating}/5</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              review?.isApproved ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
            }`}>
              {review?.isApproved ? "Approved" : "Hidden"}
            </span>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <label className="block text-xs text-zinc-500 mb-1">Customer</label>
            <div className="flex items-center gap-2 text-white">
              <User className="w-4 h-4 text-zinc-500" />
              {review?.userName}
            </div>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <label className="block text-xs text-zinc-500 mb-1">Product</label>
            <div className="flex items-center gap-2 text-white">
              <Package className="w-4 h-4 text-zinc-500" />
              {review?.productName}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Comment</label>
            <div className="bg-zinc-800 p-4 rounded-lg text-zinc-300">
              {review?.comment}
            </div>
          </div>

          <div className="text-sm text-zinc-500">
            Posted on: {new Date(review?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

        <div className="flex justify-between p-6 border-t border-zinc-800">
          <button
            onClick={() => { onDelete(review?._id); onClose(); }}
            className="px-5 py-2.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hide Review
          </button>
          {review?.isApproved ? (
            <button
              onClick={() => { onApprove(review?._id, false); onClose(); }}
              className="px-5 py-2.5 rounded bg-yellow-600 text-white hover:bg-yellow-700 flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Hide
            </button>
          ) : (
            <button
              onClick={() => { onApprove(review?._id, true); onClose(); }}
              className="px-5 py-2.5 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const pageSize = 10;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log("Fetching reviews...");
      const response = await reviewsApi.getAll({ search, isApproved: filter === "all" ? undefined : filter === "approved" ? true : filter === "hidden" ? false : undefined });
      console.log("Reviews response:", response);
      setReviews(response?.data?.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [search, filter]);

  const hideReview = async (id) => {
    try {
      console.log("Hiding review:", id);
      await reviewsApi.delete(id);
      toast.success("Review hidden successfully");
      fetchReviews();
    } catch (error) {
      console.error("Error hiding review:", error);
      toast.error("Failed to hide review");
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (review.productName || "").toLowerCase().includes(search.toLowerCase()) ||
      (review.comment || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "approved") return matchesSearch && review.isApproved;
    if (filter === "hidden") return matchesSearch && !review.isApproved;
    if (filter === "5star") return matchesSearch && review.rating === 5;
    if (filter === "4star") return matchesSearch && review.rating === 4;
    if (filter === "3star") return matchesSearch && review.rating === 3;
    if (filter === "2star") return matchesSearch && review.rating === 2;
    if (filter === "1star") return matchesSearch && review.rating === 1;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredReviews.length / pageSize);
  const pagedReviews = filteredReviews.slice((page - 1) * pageSize, page * pageSize);

  const handleApprove = (id, isApproved) => {
    if (isApproved) {
      toast.success("Review approved");
    } else {
      toast.success("Review hidden");
    }
    setShowDetails(false);
  };

  const handleDelete = (id) => {
    hideReview(id);
    setShowDetails(false);
  };

  const openDetails = (review) => {
    setSelectedReview(review);
    setShowDetails(true);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"}`}
      />
    ));
  };

  const totalApproved = reviews.filter(r => r.isApproved).length;
  const totalHidden = reviews.filter(r => !r.isApproved).length;
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <p className="text-sm text-zinc-400">{filteredReviews.length} reviews</p>
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
            <option value="approved">Approved</option>
            <option value="hidden">Hidden</option>
            <option value="5star">5 Stars</option>
            <option value="4star">4 Stars</option>
            <option value="3star">3 Stars</option>
            <option value="2star">2 Stars</option>
            <option value="1star">1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Star className="w-4 h-4" />
            <span className="text-xs">Average Rating</span>
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            {avgRating}
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Check className="w-4 h-4" />
            <span className="text-xs">Approved</span>
          </div>
          <div className="text-xl font-bold text-green-400">{totalApproved}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <EyeOff className="w-4 h-4" />
            <span className="text-xs">Hidden</span>
          </div>
          <div className="text-xl font-bold text-red-400">{totalHidden}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Review</th>
              <th className="pb-3">Product</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">No reviews found</td>
              </tr>
            ) : pagedReviews.map((review) => (
              <tr key={review._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white">{review.userName}</div>
                      <div className="text-xs text-zinc-500 max-w-xs truncate">{review.comment}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-zinc-300">{review.productName}</td>
                <td className="py-4">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="text-white ml-1">{review.rating}</span>
                  </div>
                </td>
                <td className="py-4 text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.isApproved ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
                  }`}>
                    {review.isApproved ? "Approved" : "Hidden"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-1 pr-2">
                    <button
                      onClick={() => openDetails(review)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(review._id, !review.isApproved)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                      title={review.isApproved ? "Hide" : "Approve"}
                    >
                      {review.isApproved ? <EyeOff className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
))}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredReviews.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No reviews found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredReviews.length)} of {filteredReviews.length}
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

      {showDetails && selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={() => { setShowDetails(false); setSelectedReview(null); }}
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ReviewTable;