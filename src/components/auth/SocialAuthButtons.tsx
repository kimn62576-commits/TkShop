"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SocialAuthButtons() {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleOAuthLogin = (provider: "google" | "discord" | "github" | "facebook" | "microsoft") => {
    setActiveProvider(provider);
    // Chuyển hướng trình duyệt đến endpoint OAuth của hệ thống (sẽ tạo CSRF state và chuyển tới nhà cung cấp)
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  return (
    <div className="space-y-2.5">
      {/* 1. Continue with Google */}
      <button
        type="button"
        onClick={() => handleOAuthLogin("google")}
        disabled={!!activeProvider}
        className="w-full relative flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-sky-500/60 text-sm font-medium text-slate-100 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer group"
      >
        {activeProvider === "google" ? (
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.54 0 2.9.56 3.96 1.48l2.95-2.95C17.09 1.83 14.7 1 12 1 7.39 1 3.49 3.65 1.57 7.51l3.52 2.73C6.01 7.27 8.76 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.18-2.01 3.7-4.99 3.7-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.09 14.76c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.57 7.41C.57 9.4 0 11.64 0 14.05s.57 4.65 1.57 6.64l3.52-2.73-.001-3.2z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.72-2.88c-1.07.72-2.45 1.15-4.21 1.15-3.24 0-5.99-2.27-6.91-5.24L1.57 15.85C3.49 19.71 7.39 23 12 23z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* Grid 2 cột cho các mạng xã hội khác */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* 2. Continue with Discord */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("discord")}
          disabled={!!activeProvider}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-[#5865F2]/60 text-xs font-medium text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer group"
          title="Đăng nhập tài khoản Discord thật"
        >
          {activeProvider === "discord" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5865F2]" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0 fill-[#5865F2]" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          )}
          <span>Discord</span>
        </button>

        {/* 3. Continue with GitHub */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
          disabled={!!activeProvider}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-400 text-xs font-medium text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer group"
          title="Đăng nhập tài khoản GitHub thật"
        >
          {activeProvider === "github" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0 fill-slate-200" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          )}
          <span>GitHub</span>
        </button>

        {/* 4. Continue with Facebook */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("facebook")}
          disabled={!!activeProvider}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-[#1877F2]/60 text-xs font-medium text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer group"
          title="Đăng nhập tài khoản Facebook thật"
        >
          {activeProvider === "facebook" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1877F2]" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>Facebook</span>
        </button>

        {/* 5. Continue with Microsoft */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("microsoft")}
          disabled={!!activeProvider}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-[#00A4EF]/60 text-xs font-medium text-slate-200 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer group"
          title="Đăng nhập tài khoản Microsoft thật"
        >
          {activeProvider === "microsoft" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A4EF]" />
          ) : (
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 23 23">
              <rect x="1" y="1" width="10" height="10" fill="#F25022" />
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
              <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
            </svg>
          )}
          <span>Microsoft</span>
        </button>

      </div>
    </div>
  );
}
