"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Loader2, Check } from "lucide-react";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setError(decodeURIComponent(urlError));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      window.dispatchEvent(new Event("refreshUser"));
      // Đăng nhập xong chuyển ngay về Trang chủ (Shop), không vào trang dev/dashboard
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white">
      {/* Container chính căn giữa */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Logo & Tiêu đề */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group transition-transform hover:scale-[1.02]">
            <img
              src="/tkshop-logo-animated-sm.webp"
              alt="TKSHOP.VN"
              className="h-10 w-auto object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]"
            />
            <div className="text-left border-l border-slate-700/80 pl-3">
              <span className="font-bold text-sm tracking-widest uppercase text-white block">
                TKSHOP.VN
              </span>
              <span className="text-[10px] font-mono tracking-wider text-sky-400 block">
                ROBLOX STUDIO
              </span>
            </div>
          </Link>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Đăng nhập để quản lý thư viện Model, tải source game và theo dõi số dư ví.
          </p>
        </div>

        {/* Card Đăng Nhập Kính Mờ (Glassmorphism cao cấp) */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle gradient glow phía trên */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 opacity-90" />

          {/* Hộp Thông Báo Lỗi */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
              <button 
                type="button" 
                onClick={() => setError(null)} 
                className="text-rose-400 hover:text-rose-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Các Nút Đăng Nhập OAuth 2.0 Thật (Google, Discord, GitHub, Facebook, Microsoft) */}
          <div className="mb-6">
            <SocialAuthButtons />
          </div>

          {/* Đường Phân Cách "Or continue with email" */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-medium tracking-wider uppercase text-slate-500 absolute">
              Or continue with email
            </span>
          </div>

          {/* Form Email & Mật Khẩu Thật */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-400">Remember me for 30 days</span>
              </label>
            </div>

            {/* Nút Đăng Nhập Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Chuyển Sang Trang Đăng Ký */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors"
            >
              Create an account
            </Link>
          </div>

        </div>

        {/* Chân Trang Nhỏ */}
        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} TKSHOP.VN. BẢO MẬT SSL 256-BIT CHUẨN QUỐC TẾ.
        </p>

      </div>

      {/* Modal Hướng Dẫn Quên Mật Khẩu Thật */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white">Khôi phục mật khẩu</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nếu bạn đã đăng ký bằng <strong>Google / Discord / GitHub / Facebook / Microsoft</strong>, hãy bấm nút đăng nhập mạng xã hội tương ứng mà không cần mật khẩu.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nếu bạn đăng ký bằng email truyền thống, vui lòng liên hệ Hotline Zalo <strong>0394.063.917</strong> hoặc hỗ trợ viên để xác minh và đặt lại mật khẩu an toàn.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
