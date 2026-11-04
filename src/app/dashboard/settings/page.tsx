"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function UserSettingsPage() {
  const [profile, setProfile] = useState({
    displayName: "",
    robloxUsername: "",
    bio: "",
    avatarUrl: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.user?.profile) {
        setProfile({
          displayName: data.user.profile.displayName || "",
          robloxUsername: data.user.profile.robloxUsername || "",
          bio: data.user.profile.bio || "",
          avatarUrl: data.user.profile.avatarUrl || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg("Cập nhật thông tin thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.dispatchEvent(new Event("refreshUser"));
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi cập nhật cài đặt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F1F3F6] tracking-tight">
          Cài Đặt Tài Khoản
        </h1>
        <p className="text-xs text-[#929BAA] mt-1">
          Cập nhật thông tin định danh lập trình viên và đổi mật khẩu bảo mật.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Khối Hồ Sơ */}
        <div className="bg-[#162036] border border-[#263554] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-semibold text-[#F1F3F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#263554] pb-3">
            <User className="w-4 h-4 text-[#38BDF8]" />
            <span>Hồ Sơ Nhà Phát Triển</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
                Tên Hiển Thị
              </label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
                Roblox Username
              </label>
              <input
                type="text"
                value={profile.robloxUsername}
                onChange={(e) => setProfile({ ...profile, robloxUsername: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
              URL Ảnh Đại Diện (Avatar)
            </label>
            <input
              type="text"
              value={profile.avatarUrl}
              onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
              className="w-full px-3 py-2 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
              Tiểu Sử / Giới Thiệu Ngắn
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-2.5 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
              placeholder="Chia sẻ kinh nghiệm làm game của bạn..."
            />
          </div>
        </div>

        {/* Khối Đổi Mật Khẩu */}
        <div className="bg-[#162036] border border-[#263554] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-semibold text-[#F1F3F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#263554] pb-3">
            <Lock className="w-4 h-4 text-[#38BDF8]" />
            <span>Đổi Mật Khẩu Bảo Mật</span>
          </h3>

          <div>
            <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
              Mật Khẩu Hiện Tại
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
              placeholder="Chỉ nhập khi muốn đổi mật khẩu"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
                Mật Khẩu Mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#929BAA] mb-1.5 uppercase">
                Xác Nhận Mật Khẩu Mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#263554] rounded text-xs text-[#F1F3F6] placeholder-[#626D7D] focus:outline-none focus:border-[#38BDF8]"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0B111E] text-xs font-semibold rounded transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Lưu Thay Đổi Cài Đặt</span>
        </button>

      </form>

    </div>
  );
}
