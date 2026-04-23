import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, X, Building, User, Mail, Phone, MapPin, Eye, Check, XCircle, Clock, Briefcase, CheckCircle, FileText } from "lucide-react";
import { franchisesApi } from "@/api/franchises";

const statusColors = {
  pending: { bg: "bg-yellow-900/30", text: "text-yellow-400", icon: Clock, label: "Pending" },
  approved: { bg: "bg-green-900/30", text: "text-green-400", icon: CheckCircle, label: "Approved" },
  rejected: { bg: "bg-red-900/30", text: "text-red-400", icon: XCircle, label: "Rejected" },
};

const ApplicationDetailsModal = ({ application, onClose, onUpdateStatus }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const colors = statusColors[application?.status] || statusColors.pending;
  const StatusIcon = colors.icon;

  const handleStatusUpdate = (status) => {
    onUpdateStatus(application?._id, status, status === "rejected" ? rejectReason : null);
    setShowStatusModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Application Details</h2>
            <p className="text-sm text-zinc-400">#{application?._id}</p>
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
            {application?.status === "pending" && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Update Status
              </button>
            )}
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Applicant Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4 text-zinc-500" />
                {application?.name}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-4 h-4" />
                {application?.email}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-4 h-4" />
                {application?.phone}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Business Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-zinc-500" />
                {application?.city}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Building className="w-4 h-4" />
                {application?.address}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Briefcase className="w-4 h-4" />
                {application?.businessType}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <FileText className="w-4 h-4" />
                Investment: {application?.investment}
              </div>
            </div>
          </div>

          <div className="text-sm text-zinc-500">
            Applied on: {new Date(application?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>

          {application?.rejectReason && (
            <div className="bg-red-900/20 border border-red-900 p-3 rounded-lg">
              <label className="block text-xs text-red-400 mb-1">Rejection Reason</label>
              <p className="text-sm text-red-300">{application.rejectReason}</p>
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

const StatusUpdateModal = ({ application, onClose, onUpdate }) => {
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    onUpdate(application._id, "approved", null);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onUpdate(application._id, "rejected", rejectReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Update Application</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-zinc-400">What would you like to do with this application?</p>

          <button
            onClick={handleApprove}
            className="w-full p-4 rounded-lg border border-green-700 hover:border-green-500 bg-green-900/20 flex items-center gap-3 transition-colors"
          >
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div className="text-left">
              <div className="text-white font-medium">Approve Application</div>
              <div className="text-xs text-zinc-400">Move forward with franchise partnership</div>
            </div>
          </button>

          <div className="border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-white font-medium">Reject Application</div>
                <div className="text-xs text-zinc-400">Close this application</div>
              </div>
            </div>
            <textarea
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="w-full mt-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FranchiseTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const pageSize = 10;

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log("Fetching applications...");
      const response = await franchisesApi.getAll({ search, status: filter === "all" ? undefined : filter });
      console.log("Applications response:", response);
      setApplications(response?.data?.data?.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(error.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, filter]);

  const updateStatus = async (id, status, rejectReason) => {
    try {
      console.log("Updating status:", id, status, rejectReason);
      await franchisesApi.updateStatus(id, { status, rejectReason });
      toast.success("Status updated successfully");
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleUpdateStatus = (id, status, reason) => {
    updateStatus(id, status, reason);
    setShowStatusModal(false);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app._id || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.city || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "pending") return matchesSearch && app.status === "pending";
    if (filter === "approved") return matchesSearch && app.status === "approved";
    if (filter === "rejected") return matchesSearch && app.status === "rejected";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredApplications.length / pageSize);
  const pagedApplications = filteredApplications.slice((page - 1) * pageSize, page * pageSize);

  const openDetails = (app) => {
    setSelectedApplication(app);
    setShowDetails(true);
  };

  const openStatusModal = (app) => {
    setSelectedApplication(app);
    setShowStatusModal(true);
  };

  const totalPending = applications.filter(a => a.status === "pending").length;
  const totalApproved = applications.filter(a => a.status === "approved").length;
  const totalRejected = applications.filter(a => a.status === "rejected").length;

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Franchise Applications</h2>
          <p className="text-sm text-zinc-400">{filteredApplications.length} applications</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search applications..."
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
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
          <div className="text-xl font-bold text-green-400">{totalApproved}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-xs">Rejected</span>
          </div>
          <div className="text-xl font-bold text-red-400">{totalRejected}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Applicant</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">City</th>
              <th className="pb-3">Business Type</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400">No applications found</td>
              </tr>
            ) : pagedApplications.map((app) => {
              const colors = statusColors[app.status] || statusColors.pending;
              const StatusIcon = colors.icon;
              return (
                <tr key={app._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-blue-400">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium">{app.name}</div>
                        <div className="text-xs text-zinc-500">ID: {app._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-zinc-300">{app.phone}</div>
                    <div className="text-xs text-zinc-500">{app.email}</div>
                  </td>
                  <td className="py-4 text-zinc-300">{app.city}</td>
                  <td className="py-4 text-zinc-300">{app.businessType}</td>
                  <td className="py-4 text-zinc-400">
                    {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
                        onClick={() => openDetails(app)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status === "pending" && (
                        <button
                          onClick={() => openStatusModal(app)}
                          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                          title="Update Status"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No applications found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredApplications.length)} of {filteredApplications.length}
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

      {showDetails && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => { setShowDetails(false); setSelectedApplication(null); }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {showStatusModal && selectedApplication && (
        <StatusUpdateModal
          application={selectedApplication}
          onClose={() => { setShowStatusModal(false); setSelectedApplication(null); }}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default FranchiseTable;