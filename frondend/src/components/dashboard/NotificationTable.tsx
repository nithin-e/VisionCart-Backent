import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, ChevronLeft, ChevronRight, X, Bell, User, Send, Users, Eye, EyeOff, Check, Clock, AlertCircle, Megaphone, Info, Zap } from "lucide-react";
import { notificationsApi } from "@/api/notifications";

const typeIcons = {
  offer: { icon: Megaphone, color: "text-blue-400", bg: "bg-blue-900/30" },
  order: { icon: Zap, color: "text-green-400", bg: "bg-green-900/30" },
  alert: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-900/30" },
  system: { icon: Info, color: "text-purple-400", bg: "bg-purple-900/30" },
};

const users = [
  { _id: "user123", name: "Mathews" },
  { _id: "user124", name: "Priya Sharma" },
  { _id: "user125", name: "John David" },
  { _id: "user126", name: "Sarah Wilson" },
  { _id: "user127", name: "Mike Johnson" },
  { _id: "user128", name: "Emily Brown" },
];

const NotificationForm = ({ onClose, onSend }) => {
  const [form, setForm] = useState({ title: "", message: "", userId: "", type: "offer" });
  const [isBroadcast, setIsBroadcast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({
      ...form,
      userId: isBroadcast ? null : form.userId,
      type: form.type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Notification</h2>
              <p className="text-sm text-zinc-400">Push notification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Title *</label>
            <input
              name="title"
              placeholder="Notification title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Message *</label>
            <textarea
              name="message"
              placeholder="Notification message..."
              value={form.message}
              onChange={handleChange}
              rows={3}
              required
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="offer">Offer / Promotion</option>
              <option value="order">Order Update</option>
              <option value="alert">Alert</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Recipients</label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsBroadcast(true)}
                className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                  isBroadcast ? "border-blue-500 bg-blue-900/20" : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <Users className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="text-white font-medium">All Users</div>
                  <div className="text-xs text-zinc-400">Send to everyone</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsBroadcast(false)}
                className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                  !isBroadcast ? "border-blue-500 bg-blue-900/20" : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <User className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Single User</div>
                  <div className="text-xs text-zinc-400">Send to specific user</div>
                </div>
              </button>
            </div>
          </div>

          {!isBroadcast && (
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Select User</label>
              <select
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required={!isBroadcast}
                className="w-full p-2.5 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
          )}

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
              disabled={!form.title.trim() || !form.message.trim() || (!isBroadcast && !form.userId)}
              className="px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Notification
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const pageSize = 10;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log("Fetching notifications...");
      const response = await notificationsApi.getAll({ search, isRead: filter === "all" ? undefined : filter === "read" ? true : filter === "unread" ? false : undefined });
      console.log("Notifications response:", response);
      setNotifications(response?.data?.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(error.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [search, filter]);

  const createNotification = async (data) => {
    try {
      console.log("Creating notification:", data);
      await notificationsApi.create(data);
      toast.success("Notification sent successfully");
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to send notification");
    }
  };

  const handleMarkRead = (id) => {
    console.log("Marked as read:", id);
    fetchNotifications();
  };

  const handleMarkAllRead = () => {
    console.log("Marked all as read");
    fetchNotifications();
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = 
      (notif.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (notif.message || "").toLowerCase().includes(search.toLowerCase()) ||
      (notif.userName || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "unread") return matchesSearch && !notif.isRead;
    if (filter === "read") return matchesSearch && notif.isRead;
    if (filter === "offer") return matchesSearch && notif.type === "offer";
    if (filter === "order") return matchesSearch && notif.type === "order";
    if (filter === "alert") return matchesSearch && notif.type === "alert";
    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredNotifications.length / pageSize);
  const pagedNotifications = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);

  const handleSend = (notification) => {
    createNotification(notification);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalSent = notifications.filter(n => n.userId === null).length;
  const totalIndividual = notifications.filter(n => n.userId !== null).length;

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <p className="text-sm text-zinc-400">{filteredNotifications.length} notifications</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search notifications..."
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
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="offer">Offers</option>
            <option value="order">Orders</option>
            <option value="alert">Alerts</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Bell className="w-4 h-4" />
            <span className="text-xs">Total</span>
          </div>
          <div className="text-xl font-bold text-white">{notifications.length}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Eye className="w-4 h-4" />
            <span className="text-xs">Unread</span>
          </div>
          <div className="text-xl font-bold text-yellow-400">{unreadCount}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Broadcast</span>
          </div>
          <div className="text-xl font-bold text-blue-400">{totalSent}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <User className="w-4 h-4" />
            <span className="text-xs">Individual</span>
          </div>
          <div className="text-xl font-bold text-green-400">{totalIndividual}</div>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="mb-4">
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-800">
              <th className="pb-3 pl-2">Notification</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Recipient</th>
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
            ) : pagedNotifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400">No notifications found</td>
              </tr>
            ) : pagedNotifications.map((notif) => {
              const typeInfo = typeIcons[notif.type] || typeIcons.system;
              const TypeIcon = typeInfo.icon;
              return (
                <tr key={notif._id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 ${!notif.isRead ? "bg-blue-900/10" : ""}`}>
                  <td className="py-4 pl-2">
                    <div className="flex items-start gap-3">
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />}
                      <div>
                        <div className="font-medium text-white">{notif.title}</div>
                        <div className="text-sm text-zinc-400 max-w-md">{notif.message}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>
                      <TypeIcon className="w-3 h-3" />
                      {notif.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${notif.userId ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}>
                      {notif.userName}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400">
                    {new Date(notif.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notif.isRead ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {notif.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkRead(notif._id)}
                          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-blue-400"
                          title="Mark as read"
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

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No notifications found</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredNotifications.length)} of {filteredNotifications.length}
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
        <NotificationForm
          onClose={() => setShowForm(false)}
          onSend={handleSend}
        />
      )}
    </div>
  );
};

export default NotificationTable;