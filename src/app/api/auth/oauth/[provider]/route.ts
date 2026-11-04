import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Danh sách các nhà cung cấp OAuth 2.0 / OpenID Connect được hỗ trợ
const SUPPORTED_PROVIDERS = ["google", "discord", "facebook", "github", "microsoft"] as const;
type Provider = (typeof SUPPORTED_PROVIDERS)[number];

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase() as Provider;

  if (!SUPPORTED_PROVIDERS.includes(provider)) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(`Nhà cung cấp đăng nhập "${params.provider}" không được hỗ trợ.`)}`, req.url)
    );
  }

  // Tự động nhận diện host / domain (Hỗ trợ cả localhost lẫn domain production có HTTPS)
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;
  const callbackUrl = `${baseUrl}/api/auth/callback/${provider}`;

  // Tạo CSRF State ngẫu nhiên bằng mật mã học (Cryptographically Secure)
  const state = crypto.randomBytes(24).toString("hex");

  let authUrl: string | null = null;
  let missingConfigMessage: string | null = null;

  switch (provider) {
    case "google": {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        missingConfigMessage = "Chưa cấu hình GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET trong file .env.";
        break;
      }
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("access_type", "offline");
      url.searchParams.set("prompt", "select_account");
      url.searchParams.set("state", state);
      authUrl = url.toString();
      break;
    }

    case "discord": {
      const clientId = process.env.DISCORD_CLIENT_ID;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        missingConfigMessage = "Chưa cấu hình DISCORD_CLIENT_ID và DISCORD_CLIENT_SECRET trong file .env.";
        break;
      }
      const url = new URL("https://discord.com/api/oauth2/authorize");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "identify email");
      url.searchParams.set("prompt", "consent");
      url.searchParams.set("state", state);
      authUrl = url.toString();
      break;
    }

    case "facebook": {
      const clientId = process.env.FACEBOOK_CLIENT_ID || process.env.FACEBOOK_APP_ID;
      const clientSecret = process.env.FACEBOOK_CLIENT_SECRET || process.env.FACEBOOK_APP_SECRET;
      if (!clientId || !clientSecret) {
        missingConfigMessage = "Chưa cấu hình FACEBOOK_CLIENT_ID và FACEBOOK_CLIENT_SECRET trong file .env.";
        break;
      }
      const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "email,public_profile");
      url.searchParams.set("state", state);
      authUrl = url.toString();
      break;
    }

    case "github": {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        missingConfigMessage = "Chưa cấu hình GITHUB_CLIENT_ID và GITHUB_CLIENT_SECRET trong file .env.";
        break;
      }
      const url = new URL("https://github.com/login/oauth/authorize");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("scope", "read:user user:email");
      url.searchParams.set("state", state);
      authUrl = url.toString();
      break;
    }

    case "microsoft": {
      const clientId = process.env.MICROSOFT_CLIENT_ID;
      const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        missingConfigMessage = "Chưa cấu hình MICROSOFT_CLIENT_ID và MICROSOFT_CLIENT_SECRET trong file .env.";
        break;
      }
      const url = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile User.Read");
      url.searchParams.set("prompt", "select_account");
      url.searchParams.set("state", state);
      authUrl = url.toString();
      break;
    }
  }

  // Nếu chưa cấu hình thông tin định danh, chuyển hướng về trang đăng nhập với thông báo hướng dẫn
  if (missingConfigMessage || !authUrl) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(missingConfigMessage || "Thiếu thông tin cấu hình nhà cung cấp OAuth.")}`, req.url)
    );
  }

  // Tạo phản hồi chuyển hướng tới trang xác thực chính thức của nhà cung cấp
  const response = NextResponse.redirect(authUrl);

  // Lưu state vào HttpOnly cookie bảo vệ chống CSRF (hết hạn sau 10 phút)
  // Chỉ bật Secure khi chạy trên kết nối HTTPS thực tế để cookie hoạt động trơn tru trên cả http://localhost
  const isSecure = proto === "https";
  response.cookies.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
