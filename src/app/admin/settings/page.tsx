"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, QrCode, Globe, Shield, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    SITE_NAME: "Roblox Asset Marketplace",
    CURRENCY_SYMBOL: "đ",
    SUPPORT_EMAIL: "support@robloxmarket.dev",
    MAINTENANCE_MODE: "false",
  });

  const [bankConfig, setBankConfig] = useState({
    bankName: "MBBank",
    bankAccount: "999988886666",
    bankAccountName: "ROBLOX ASSET MARKETPLACE",
    webhookSecret: "whsec_rbxmarket_super_secure_secret_2026",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
      if (data.bankConfig) {
        setBankConfig(data.bankConfig);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          bankConfig,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Cấu Hình Toàn Hệ Thống</h1>
        <p className="text-xs text-dark-muted mt-1">
          Thiết lập thông tin thương hiệu, cấu hình cổng ngân hàng VietQR và Webhook bảo mật.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Cập nhật cấu hình website và VietQR thành công!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* General Settings */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-dark-border pb-3">
            <Globe className="w-4 h-4 text-brand-primary" />
            <span>Thông Tin Website Chung</span>
          </h3>

          <div>
            <label className="block font-semibold text-dark-text mb-1">TÊN SÀN THƯƠNG MẠI</label>
            <input
              type="text"
              value={settings.SITE_NAME}
              onChange={(e) => setSettings({ ...settings, SITE_NAME: e.target.value })}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-dark-text mb-1">KÝ HIỆU TIỀN TỆ</label>
              <input
                type="text"
                value={settings.CURRENCY_SYMBOL}
                onChange={(e) => setSettings({ ...settings, CURRENCY_SYMBOL: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-dark-text mb-1">EMAIL HỖ TRỢ</label>
              <input
                type="email"
                value={settings.SUPPORT_EMAIL}
                onChange={(e) => setSettings({ ...settings, SUPPORT_EMAIL: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
              />
            </div>
          </div>
        </div>

        {/* VietQR & Banking Configuration */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-dark-border pb-3">
            <QrCode className="w-4 h-4 text-brand-accent" />
            <span>Cấu Hình Tài Khoản VietQR Nạp Tiền</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-dark-text mb-1">TÊN NGÂN HÀNG</label>
              <input
                type="text"
                value={bankConfig.bankName}
                onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-dark-text mb-1">SỐ TÀI KHOẢN NGÂN HÀNG</label>
              <input
                type="text"
                value={bankConfig.bankAccount}
                onChange={(e) => setBankConfig({ ...bankConfig, bankAccount: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-dark-text mb-1">CHỦ TÀI KHOẢN (IN HOA KHÔNG DẤU)</label>
            <input
              type="text"
              value={bankConfig.bankAccountName}
              onChange={(e) => setBankConfig({ ...bankConfig, bankAccountName: e.target.value })}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white uppercase font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-dark-text mb-1">PAYMENT WEBHOOK HMAC SECRET KEY</label>
            <input
              type="text"
              value={bankConfig.webhookSecret}
              onChange={(e) => setBankConfig({ ...bankConfig, webhookSecret: e.target.value })}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-white font-mono text-xs"
            />
            <p className="text-[10px] text-dark-muted mt-1">Dùng để xác thực chữ ký số HMAC-SHA256 của Webhook chuyển khoản.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Lưu Toàn Bộ Cấu Hình</span>
        </button>

      </form>

    </div>
  );
}
