import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  Clock, Calendar, ArrowLeft, ArrowRight, Share2, 
  ChevronRight, PhoneCall, Zap, ShieldCheck, CheckCircle2,
  AlertCircle, BookOpen, ExternalLink, Sparkles, Copy
} from "lucide-react";
import { NEWS_ARTICLES, NewsArticle } from "@/data/newsArticles";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = NEWS_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: "Không tìm thấy bài viết | TKSHOP.VN" };

  return {
    title: `${article.title} | Cẩm Nang TKSHOP.VN`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
    },
  };
}

export default function ArticleDetailPage({ params }: PageProps) {
  const article = NEWS_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const relatedArticles = NEWS_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "CHO NGƯỜI MỚI":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "LẬP TRÌNH LUAU":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "KIẾN THỨC NỀN TẢNG":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "HƯỚNG DẪN DỊCH VỤ":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 select-text">
      
      {/* 01. BREADCRUMBS & BACK BUTTON */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
        <nav className="flex items-center gap-2">
          <Link href="/" className="hover:text-sky-500 transition-colors">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/news" className="hover:text-sky-500 transition-colors">Cẩm Nang Studio</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{article.category}</span>
        </nav>

        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang cẩm nang</span>
        </Link>
      </div>

      {/* 02. ARTICLE HEADER */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getCategoryBadgeClass(article.category)}`}>
            {article.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.publishedAt}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {article.summary}
        </p>

        {/* Author info */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-4 select-none">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-400/40 shadow-xs"
            />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block leading-tight">
                {article.author.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                {article.author.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {article.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#162036] text-slate-600 dark:text-slate-300 text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 03. HERO COVER IMAGE */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-slate-950 select-none">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-auto max-h-[460px] object-cover object-center"
        />
      </div>

      {/* 04. MAIN ARTICLE CONTENT BODY */}
      <article className="space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed">
        
        {/* Intro */}
        <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium leading-relaxed italic">
          {article.content.intro}
        </div>

        {/* Content Sections */}
        {article.content.sections.map((section, idx) => (
          <section key={idx} className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <span className="text-sky-500">✦</span>
              <span>{section.heading}</span>
            </h2>

            {section.body.map((p, pIdx) => (
              <p key={pIdx} className="text-sm sm:text-base leading-relaxed font-normal">
                {p}
              </p>
            ))}

            {/* Bullet points if any */}
            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-2 pl-2">
                {section.bulletPoints.map((bp, bpIdx) => (
                  <li key={bpIdx} className="flex items-start gap-2.5 text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Code Snippet if any */}
            {section.codeSnippet && (
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl select-text">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 select-none">
                  <span className="uppercase tracking-wider font-bold text-sky-400">
                    {section.codeSnippet.language} Script
                  </span>
                  {section.codeSnippet.caption && (
                    <span className="text-[11px] text-slate-500 truncate max-w-sm">
                      {section.codeSnippet.caption}
                    </span>
                  )}
                </div>
                <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-400 bg-slate-950 leading-relaxed">
                  <code>{section.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Callout Box if any */}
            {section.callout && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 select-none ${
                section.callout.type === "important"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                  : section.callout.type === "warning"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              }`}>
                {section.callout.type === "important" ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                ) : section.callout.type === "warning" ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                  {section.callout.text}
                </div>
              </div>
            )}
          </section>
        ))}

        {/* Conclusion */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Lời Kết
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            {article.content.conclusion}
          </p>
        </div>

      </article>

      {/* 05. AUTHOR BIO BOX */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4E] shadow-sm flex flex-col sm:flex-row items-center gap-5 select-none">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400 shadow-md flex-shrink-0"
        />
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="text-sm font-black text-slate-900 dark:text-white">
            Tác giả: {article.author.name}
          </div>
          <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
            {article.author.role}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Nhà phát triển Roblox Studio với hơn 5 năm kinh nghiệm tối ưu hóa Framework ACS, cấu trúc Luau Server và thiết kế hệ thống game đa người chơi.
          </p>
        </div>
      </div>

      {/* 06. ACTION CLUSTER: SHOPPING & DEPOSIT & HOTLINE */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#101C36] to-slate-950 border border-slate-800 shadow-xl text-white space-y-5 select-none">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
            TIẾP TỤC DỰ ÁN GAME CỦA BẠN
          </span>
          <h3 className="text-lg sm:text-2xl font-black uppercase">
            SỞ HỮU NGAY CÁC ASSET CHUẨN ROBLOX STUDIO
          </h3>
          <p className="text-xs text-slate-300">
            Hơn 500+ Framework súng ACS, hệ thống RPG, Map Cyberpunk độc quyền đang có sẵn trên TKSHOP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href="/marketplace"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <span>Khám Phá Cửa Hàng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="https://zalo.me/0394063917"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hỗ Trợ Zalo Ultraview</span>
          </a>
        </div>
      </div>

      {/* 07. RELATED ARTICLES */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-4 select-none">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Cẩm Nang Cùng Chuyên Mục</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/news/${rel.slug}`}
                className="group p-4 rounded-2xl bg-white dark:bg-[#0D1528] border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 shadow-xs hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-sky-500 transition-colors">
                    {rel.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>{rel.readTime}</span>
                  <span className="font-bold text-sky-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Đọc</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
