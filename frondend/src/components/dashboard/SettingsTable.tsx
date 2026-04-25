import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Settings, Save, Mail, Phone, Globe, Percent, Truck, DollarSign, ShoppingBag, Check, X, AlertTriangle } from "lucide-react";
import { settingsApi } from "@/api/settings";

const SettingsTable = () => {
  const [editSettings, setEditSettings] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.get();
      setSettings(response?.data?.data || response?.data || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error(error.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings && !isEditing) {
      setEditSettings(settings);
    }
  }, [settings, isEditing]);

  const updateSettings = async (data) => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await settingsApi.update(data);
      toast.success("Settings saved successfully");
      setIsEditing(false);
      setSaveSuccess(true);
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setEditSettings({ ...editSettings, [field]: value });
  };

  const handleSocialChange = (platform, value) => {
    setEditSettings({
      ...editSettings,
      socialLinks: { ...(editSettings.socialLinks || {}), [platform]: value }
    });
  };

  const handleSave = () => {
    updateSettings(editSettings);
  };

  const handleCancel = () => {
    setEditSettings(settings);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditSettings(settings);
    setIsEditing(true);
  };

  const sections = [
    { id: "general", label: "General", icon: Globe },
    { id: "pricing", label: "Pricing & Tax", icon: DollarSign },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 w-full">
        <div className="py-8 text-center text-zinc-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <p className="text-sm text-zinc-400">Manage your store configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {setSaveSuccess && (
            <div className="flex items-center gap-2 text-green-400 bg-green-900/30 px-3 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              <span className="text-sm">Settings saved!</span>
            </div>
          )}
          {!isEditing ? (
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 hover:bg-zinc-600 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mb-6 bg-blue-900/20 border border-blue-900 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400">You are editing settings. Make changes and click Save to apply.</span>
        </div>
      )}

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 bg-zinc-800 rounded-lg p-6">
          {activeSection === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">General Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Site Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editSettings.siteName || ""}
                      onChange={(e) => handleChange("siteName", e.target.value)}
                      className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-zinc-700 rounded text-white">{settings.siteName}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Currency</label>
                  {isEditing ? (
                    <select
                      value={editSettings.currency || "INR"}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-zinc-700 rounded text-white">{settings.currency} ({settings.currencySymbol})</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Store Address</label>
                {isEditing ? (
                  <textarea
                    value={editSettings.storeAddress || ""}
                    onChange={(e) => handleChange("storeAddress", e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
                  />
                ) : (
                  <div className="p-3 bg-zinc-700 rounded text-zinc-300">{settings.storeAddress}</div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-3">Social Links</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Facebook</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editSettings.socialLinks?.facebook || ""}
                        onChange={(e) => handleSocialChange("facebook", e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="p-2 bg-zinc-700 rounded text-blue-400 text-sm">{settings.socialLinks?.facebook}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Instagram</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editSettings.socialLinks?.instagram || ""}
                        onChange={(e) => handleSocialChange("instagram", e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="p-2 bg-zinc-700 rounded text-pink-400 text-sm">{settings.socialLinks?.instagram}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Twitter</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editSettings.socialLinks?.twitter || ""}
                        onChange={(e) => handleSocialChange("twitter", e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="p-2 bg-zinc-700 rounded text-sky-400 text-sm">{settings.socialLinks?.twitter}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "pricing" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Pricing & Tax Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Tax Percentage (%)</label>
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-zinc-500" />
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editSettings.taxPercentage || 0}
                        onChange={(e) => handleChange("taxPercentage", parseFloat(e.target.value) || 0)}
                        className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex-1 p-3 bg-zinc-700 rounded text-white">{settings.taxPercentage}%</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Min Order Amount ({settings.currencySymbol})</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={editSettings.minOrderAmount || 0}
                      onChange={(e) => handleChange("minOrderAmount", parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-zinc-700 rounded text-white">{settings.currencySymbol}{settings.minOrderAmount}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Max Order Amount ({settings.currencySymbol})</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={editSettings.maxOrderAmount || 0}
                      onChange={(e) => handleChange("maxOrderAmount", parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-zinc-700 rounded text-white">{settings.currencySymbol}{settings.maxOrderAmount?.toLocaleString()}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "shipping" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Shipping Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Shipping Charge ({settings.currencySymbol})</label>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-zinc-500" />
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editSettings.shippingCharge || 0}
                        onChange={(e) => handleChange("shippingCharge", parseFloat(e.target.value) || 0)}
                        className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex-1 p-3 bg-zinc-700 rounded text-white">
                        {settings.shippingCharge === 0 ? "Free" : `${settings.currencySymbol}${settings.shippingCharge}`}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Free Shipping Threshold ({settings.currencySymbol})</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={editSettings.freeShippingThreshold || 0}
                      onChange={(e) => handleChange("freeShippingThreshold", parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-zinc-700 rounded text-white">Orders above {settings.currencySymbol}{settings.freeShippingThreshold} get free shipping</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "orders" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Order Settings</h3>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Refund Window (Days)</label>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-500" />
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={editSettings.refundDays || 0}
                      onChange={(e) => handleChange("refundDays", parseInt(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="flex-1 p-3 bg-zinc-700 rounded text-white">
                      {settings.refundDays} days after delivery
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "contact" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Support Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editSettings.supportEmail || ""}
                        onChange={(e) => handleChange("supportEmail", e.target.value)}
                        className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex-1 p-3 bg-zinc-700 rounded text-blue-400">{settings.supportEmail}</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Contact Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editSettings.contactPhone || ""}
                        onChange={(e) => handleChange("contactPhone", e.target.value)}
                        className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex-1 p-3 bg-zinc-700 rounded text-white">{settings.contactPhone}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTable;