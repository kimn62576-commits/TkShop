"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      window.dispatchEvent(new Event("refreshUser"));
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white">
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
            Create an Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Đăng ký để nhận quyền tải asset Roblox Studio và ưu đãi nạp ví tự động.
          </p>
        </div>

        {/* Card Đăng Ký */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
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

          {/* Social OAuth Buttons */}
          <div className="mb-6">
            <SocialAuthButtons />
          </div>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-medium tracking-wider uppercase text-slate-500 absolute">
              Or register with email
            </span>
          </div>

          {/* Form Đăng Ký */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Alex Studio"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password (tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>

        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} TKSHOP.VN. BẢO MẬT SSL 256-BIT CHUẨN QUỐC TẾ.
        </p>

      </div>
    </div>
  );
}
