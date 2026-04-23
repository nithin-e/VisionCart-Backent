import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, X, User, Mail, Phone, Calendar, MapPin, Eye, AlertTriangle, Check, Package } from "lucide-react";
import { usersApi } from "@/api/users";

const BlockModal = ({ user, onClose, onConfirm }) => {
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
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Block User</h2>
              <p className="text-sm text-zinc-400">@{user?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Block Reason *</label>
            <textarea
              placeholder="Reason for blocking..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
          
          <div className="bg-red-900/20 border border-red-900 p-3 rounded-lg">
            <p className="text-sm text-red-400">
              This user will be blocked and won't be able to login or make purchases.
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
              Block User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, onBlock, onUnblock }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-blue-400">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-zinc-400">ID: {user?._id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Email</label>
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-zinc-500" />
                {user?.email}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Phone</label>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-zinc-500" />
                {user?.phone}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Joined</label>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-zinc-500" />
                {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Status</label>
              <div className="flex items-center gap-2">
                {user?.isBlocked ? (
                  <ToggleLeft className="w-5 h-5 text-red-400" />
                ) : (
                  <ToggleRight className="w-5 h-5 text-green-400" />
                )}
                <span className={user?.isBlocked ? "text-red-400" : "text-green-400"}>
                  {user?.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {user?.isBlocked && user?.blockReason && (
            <div className="bg-red-900/20 border border-red-900 p-3 rounded-lg">
              <label className="block text-xs text-red-400 mb-1">Block Reason</label>
              <p className="text-sm text-red-300">{user.blockReason}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between p-6 border-t border-zinc-800">
          {user?.isBlocked ? (
            <button
              onClick={() => { onUnblock(user?._id); onClose(); }}
              className="px-5 py-2.5 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Unblock User
            </button>
          ) : (
            <button
              onClick={() => { onBlock(user); onClose(); }}
              className="px-5 py-2.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Block User
            </button>
          )}
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

const CustomersTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const response = await usersApi.getAll();
      console.log("Users response:", response);
      setUsers(response?.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id, reason) => {
    try {
      console.log("Blocking user:", id, reason);
      await usersApi.block(id, { reason });
      toast.success('User blocked successfully');
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error(error.message || 'Failed to block user');
    }
  };

  const unblockUser = async (id) => {
    try {
      console.log("Unblocking user:", id);
      await usersApi.unblock(id);
      toast.success('User unblocked successfully');
      fetchUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error(error.message || 'Failed to unblock user');
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search);
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && !user.isBlocked;
    if (filter === "blocked") return matchesSearch && user.isBlocked;
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleBlock = (user) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleBlockConfirm = (reason) => {
    blockUser(selectedUser._id, reason);
    setShowBlockModal(false);
    setSelectedUser(null);
  };

  const handleUnblock = (id) => {
    unblockUser(id);
  };

  const viewDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="text-sm text-zinc-400">{filteredUsers.length} users</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">User</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Joined</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">Loading...</td>
              </tr>
            ) : pagedUsers.map((user) => (
              <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-blue-400">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-zinc-500">ID: {user._id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-zinc-300">{user.email}</td>
                <td className="py-4 text-zinc-300">{user.phone}</td>
                <td className="py-4 text-zinc-400">{formatDate(user.createdAt)}</td>
                <td className="py-4">
                  {user.isBlocked ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-400">
                      Blocked
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-400">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-1 pr-2">
                    <button
                      onClick={() => viewDetails(user)}
                      className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {user.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                        title="Unblock"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                        title="Block"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No users found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length}
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

      {showDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => { setShowDetails(false); setSelectedUser(null); }}
          onBlock={(user) => { setShowDetails(false); handleBlock(user); }}
          onUnblock={handleUnblock}
        />
      )}

      {showBlockModal && selectedUser && (
        <BlockModal
          user={selectedUser}
          onClose={() => { setShowBlockModal(false); setSelectedUser(null); }}
          onConfirm={handleBlockConfirm}
        />
      )}
    </div>
  );
};

export default CustomersTable;