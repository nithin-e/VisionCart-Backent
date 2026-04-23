import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, X, MessageSquare, User, Mail, Phone, Eye, Send, Clock, CheckCircle, Reply, AlertCircle } from "lucide-react";
import { contactsApi } from "@/api/contacts";

const statusColors = {
  pending: { bg: "bg-yellow-900/30", text: "text-yellow-400", icon: Clock, label: "Pending" },
  replied: { bg: "bg-green-900/30", text: "text-green-400", icon: CheckCircle, label: "Replied" },
};

const ReplyModal = ({ message, onClose, onReply }) => {
  const [reply, setReply] = useState(message?.reply || "");

  const handleSubmit = () => {
    if (!reply.trim()) return;
    onReply(message._id, reply);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reply to Message</h2>
              <p className="text-sm text-zinc-400">From: {message?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-zinc-800 p-3 rounded-lg">
            <label className="block text-xs text-zinc-500 mb-1">Original Message</label>
            <p className="text-zinc-300 text-sm">{message?.message}</p>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Your Reply *</label>
            <textarea
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
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
              disabled={!reply.trim()}
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Reply
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageDetailsModal = ({ message, onClose, onReply }) => {
  const colors = statusColors[message?.status] || statusColors.pending;
  const StatusIcon = colors.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Message Details</h2>
            <p className="text-sm text-zinc-400">#{message?._id}</p>
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
            {message?.status === "pending" && (
              <button
                onClick={() => { onClose(); onReply(message); }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
            )}
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4 text-zinc-500" />
                {message?.name}
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-4 h-4" />
                {message?.email}
              </div>
              {message?.phone && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Phone className="w-4 h-4" />
                  {message?.phone}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Message</h3>
            <div className="bg-zinc-800 p-4 rounded-lg text-zinc-300">
              {message?.message}
            </div>
          </div>

          {message?.reply && (
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-2">Your Reply</h3>
              <div className="bg-green-900/20 border border-green-900 p-4 rounded-lg text-green-300">
                {message.reply}
              </div>
            </div>
          )}

          <div className="text-sm text-zinc-500">
            Received on: {new Date(message?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
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

const SupportTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const pageSize = 10;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log("Fetching messages...");
      const response = await contactsApi.getAll({ search, status: filter === "all" ? undefined : filter });
      console.log("Messages response:", response);
      setMessages(response?.data?.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search, filter]);

  const sendReply = async (id, reply) => {
    try {
      console.log("Sending reply:", id, reply);
      await contactsApi.reply(id, { reply });
      toast.success("Reply sent successfully");
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleReply = (id, reply) => {
    sendReply(id, reply);
    setShowReplyModal(false);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      (msg._id || "").toLowerCase().includes(search.toLowerCase()) ||
      (msg.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (msg.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (msg.message || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "pending") return matchesSearch && msg.status === "pending";
    if (filter === "replied") return matchesSearch && msg.status === "replied";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredMessages.length / pageSize);
  const pagedMessages = filteredMessages.slice((page - 1) * pageSize, page * pageSize);

  const openDetails = (msg) => {
    setSelectedMessage(msg);
    setShowDetails(true);
  };

  const openReply = (msg) => {
    setSelectedMessage(msg);
    setShowReplyModal(true);
  };

  const totalPending = messages.filter(m => m.status === "pending").length;
  const totalReplied = messages.filter(m => m.status === "replied").length;

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Support Messages</h2>
          <p className="text-sm text-zinc-400">{filteredMessages.length} messages</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search messages..."
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
            <option value="all">All Messages</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">Total Messages</span>
          </div>
          <div className="text-xl font-bold text-white">{messages.length}</div>
        </div>
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
            <span className="text-xs">Replied</span>
          </div>
          <div className="text-xl font-bold text-green-400">{totalReplied}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">User</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Message</th>
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
            ) : pagedMessages.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">No messages found</td>
              </tr>
            ) : pagedMessages.map((msg) => {
              const colors = statusColors[msg.status] || statusColors.pending;
              const StatusIcon = colors.icon;
              return (
                <tr key={msg._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-white">{msg.name}</div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-300">{msg.email}</td>
                  <td className="py-4">
                    <div className="max-w-xs">
                      <div className="text-zinc-300 truncate">{msg.message}</div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-400">
                    {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
                        onClick={() => openDetails(msg)}
                        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {msg.status === "pending" && (
                        <button
                          onClick={() => openReply(msg)}
                          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                          title="Reply"
                        >
                          <Reply className="w-4 h-4" />
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

      {filteredMessages.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No messages found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredMessages.length)} of {filteredMessages.length}
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

      {showDetails && selectedMessage && (
        <MessageDetailsModal
          message={selectedMessage}
          onClose={() => { setShowDetails(false); setSelectedMessage(null); }}
          onReply={openReply}
        />
      )}

      {showReplyModal && selectedMessage && (
        <ReplyModal
          message={selectedMessage}
          onClose={() => { setShowReplyModal(false); setSelectedMessage(null); }}
          onReply={handleReply}
        />
      )}
    </div>
  );
};

export default SupportTable;