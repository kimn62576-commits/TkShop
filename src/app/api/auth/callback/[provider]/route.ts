import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const SUPPORTED_PROVIDERS = ["google", "discord", "facebook", "github", "microsoft"] as const;
type Provider = (typeof SUPPORTED_PROVIDERS)[number];

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase() as Provider;
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const queryState = searchParams.get("state");

  // Xử lý khi người dùng từ chối cấp quyền trên trang OAuth
  if (error) {
    const errorMsg = errorDescription || error;
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(`Xác thực ${provider.toUpperCase()} không thành công: ${errorMsg}`)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Không nhận được mã xác thực Authorization Code từ nhà cung cấp.")}`, req.url)
    );
  }

  // ----------------------------------------------------
  // 1. BẢO MẬT CHỐNG TẤN CÔNG CSRF BẰNG OAUTH STATE
  // ----------------------------------------------------
  const stateCookieName = `oauth_state_${provider}`;
  const storedState = req.cookies.get(stateCookieName)?.value;

  if (!storedState || !queryState || storedState !== queryState) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Cảnh báo bảo mật: Mã CSRF State không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.")}`, req.url)
    );
  }

  // Xác định chính xác domain callback
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;
  const callbackUrl = `${baseUrl}/api/auth/callback/${provider}`;

  let providerAccountId: string = "";
  let email: string = "";
  let displayName: string = "";
  let avatarUrl: string | null = null;
  let tokenData: any = {};

  try {
    // ----------------------------------------------------
    // 2. TRAO ĐỔI AUTHORIZATION CODE VÀ LẤY USER INFO
    // ----------------------------------------------------

    // === A. GOOGLE OAUTH 2.0 / OPENID CONNECT ===
    if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: "authorization_code",
        }),
      });

      tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "Google từ chối cấp token xác thực.");
      }

      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const googleUser = await userRes.json();

      if (!googleUser.email || !googleUser.sub) {
        throw new Error("Không thể trích xuất tài khoản Google.");
      }

      providerAccountId = String(googleUser.sub);
      email = googleUser.email.toLowerCase();
      displayName = googleUser.name || email.split("@")[0];
      avatarUrl = googleUser.picture || null;
    }

    // === B. DISCORD OAUTH 2.0 ===
    else if (provider === "discord") {
      const clientId = process.env.DISCORD_CLIENT_ID!;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET!;

      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: callbackUrl,
        }),
      });

      tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "Discord từ chối cấp token.");
      }

      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const discordUser = await userRes.json();

      if (!discordUser.id) {
        throw new Error("Không thể trích xuất tài khoản Discord.");
      }

      providerAccountId = String(discordUser.id);
      email = (discordUser.email || `discord_${discordUser.id}@discord.user`).toLowerCase();
      displayName = discordUser.global_name || discordUser.username || `Discord_${discordUser.id.slice(0, 5)}`;
      avatarUrl = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : null;
    }

    // === C. FACEBOOK OAUTH 2.0 GRAPH API ===
    else if (provider === "facebook") {
      const clientId = (process.env.FACEBOOK_CLIENT_ID || process.env.FACEBOOK_APP_ID)!;
      const clientSecret = (process.env.FACEBOOK_CLIENT_SECRET || process.env.FACEBOOK_APP_SECRET)!;

      const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
      tokenUrl.searchParams.set("client_id", clientId);
      tokenUrl.searchParams.set("client_secret", clientSecret);
      tokenUrl.searchParams.set("redirect_uri", callbackUrl);
      tokenUrl.searchParams.set("code", code);

      const tokenRes = await fetch(tokenUrl.toString(), { method: "GET" });
      tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error?.message || "Facebook từ chối cấp token.");
      }

      const userUrl = new URL("https://graph.facebook.com/me");
      userUrl.searchParams.set("fields", "id,name,email,picture.width(250).height(250)");
      userUrl.searchParams.set("access_token", tokenData.access_token);

      const userRes = await fetch(userUrl.toString());
      const fbUser = await userRes.json();

      if (!fbUser.id) {
        throw new Error("Không thể trích xuất tài khoản Facebook.");
      }

      providerAccountId = String(fbUser.id);
      email = (fbUser.email || `facebook_${fbUser.id}@facebook.user`).toLowerCase();
      displayName = fbUser.name || `FB_${fbUser.id.slice(0, 6)}`;
      avatarUrl = fbUser.picture?.data?.url || null;
    }

    // === D. GITHUB OAUTH 2.0 ===
    else if (provider === "github") {
      const clientId = process.env.GITHUB_CLIENT_ID!;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET!;

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "GitHub từ chối cấp token.");
      }

      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "TKSHOP-Roblox-App",
        },
      });
      const ghUser = await userRes.json();

      if (!ghUser.id) {
        throw new Error("Không thể trích xuất tài khoản GitHub.");
      }

      providerAccountId = String(ghUser.id);
      displayName = ghUser.name || ghUser.login;
      avatarUrl = ghUser.avatar_url || null;

      if (ghUser.email) {
        email = ghUser.email.toLowerCase();
      } else {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "User-Agent": "TKSHOP-Roblox-App",
          },
        });
        const emails = await emailsRes.json();
        const primary = Array.isArray(emails) ? emails.find((e: any) => e.primary && e.verified) : null;
        email = (primary?.email || `${ghUser.login}@github.user`).toLowerCase();
      }
    }

    // === E. MICROSOFT ENTRA / OAUTH 2.0 / OIDC ===
    else if (provider === "microsoft") {
      const clientId = process.env.MICROSOFT_CLIENT_ID!;
      const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;

      const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: callbackUrl,
          scope: "openid email profile User.Read",
        }),
      });

      tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "Microsoft từ chối cấp token.");
      }

      const userRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const msUser = await userRes.json();

      if (!msUser.id) {
        throw new Error("Không thể trích xuất tài khoản Microsoft.");
      }

      providerAccountId = String(msUser.id);
      email = (msUser.mail || msUser.userPrincipalName || `microsoft_${msUser.id}@microsoft.user`).toLowerCase();
      displayName = msUser.displayName || email.split("@")[0];
      avatarUrl = null;
    } else {
      throw new Error(`Nhà cung cấp OAuth "${provider}" chưa được hỗ trợ.`);
    }

    // ----------------------------------------------------
    // 3. QUẢN LÝ TÀI KHOẢN & ACCOUNT LINKING (TRÁNH TRÙNG LẶP)
    // ----------------------------------------------------

    // Bước 1: Kiểm tra xem liên kết Account (provider + providerAccountId) đã có chưa
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: {
          include: { profile: true, wallet: true },
        },
      },
    });

    let targetUser: any = null;

    if (existingAccount) {
      targetUser = existingAccount.user;

      if (targetUser.isBanned) {
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(`Tài khoản đã bị khóa: ${targetUser.banReason || "Vi phạm quy định"}`)}`, req.url)
        );
      }

      // Cập nhật token và thời gian đăng nhập gần nhất
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: tokenData.access_token || null,
          refreshToken: tokenData.refresh_token || existingAccount.refreshToken,
          expiresAt: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
          idToken: tokenData.id_token || null,
        },
      });

      await prisma.user.update({
        where: { id: targetUser.id },
        data: { lastLoginAt: new Date() },
      });

      // Bổ sung avatar nếu người dùng chưa có
      if (avatarUrl && !targetUser.profile?.avatarUrl) {
        await prisma.userProfile.update({
          where: { userId: targetUser.id },
          data: { avatarUrl },
        });
      }
    } else {
      // Bước 2: Kiểm tra xem User với email này đã tồn tại trong hệ thống chưa (Ví dụ: đã đăng ký email/mật khẩu hoặc nhà cung cấp khác)
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
        include: { profile: true, wallet: true },
      });

      if (existingUserByEmail) {
        targetUser = existingUserByEmail;

        if (targetUser.isBanned) {
          return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(`Tài khoản đã bị khóa: ${targetUser.banReason || "Vi phạm quy định"}`)}`, req.url)
          );
        }

        // Tự động LIÊN KẾT (Account Linking) nhà cung cấp mới vào User hiện có (KHÔNG tạo user trùng lặp!)
        await prisma.account.create({
          data: {
            userId: targetUser.id,
            provider,
            providerAccountId,
            accessToken: tokenData.access_token || null,
            refreshToken: tokenData.refresh_token || null,
            expiresAt: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
            idToken: tokenData.id_token || null,
          },
        });

        await prisma.user.update({
          where: { id: targetUser.id },
          data: {
            lastLoginAt: new Date(),
            emailVerified: targetUser.emailVerified || new Date(),
          },
        });

        if (avatarUrl && !targetUser.profile?.avatarUrl) {
          await prisma.userProfile.update({
            where: { userId: targetUser.id },
            data: { avatarUrl },
          });
        }
      } else {
        // Bước 3: Người dùng hoàn toàn mới -> Tạo User + Profile + Wallet + Account
        targetUser = await prisma.user.create({
          data: {
            email,
            role: "USER",
            emailVerified: new Date(),
            lastLoginAt: new Date(),
            profile: {
              create: {
                displayName,
                avatarUrl,
                robloxUsername: `RBX_${email.split("@")[0].slice(0, 10)}`,
              },
            },
            wallet: {
              create: {
                balance: 0,
              },
            },
            accounts: {
              create: {
                provider,
                providerAccountId,
                accessToken: tokenData.access_token || null,
                refreshToken: tokenData.refresh_token || null,
                expiresAt: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
                idToken: tokenData.id_token || null,
              },
            },
          },
          include: {
            profile: true,
            wallet: true,
          },
        });
      }
    }

    // ----------------------------------------------------
    // 4. THIẾT LẬP PHIÊN ĐĂNG NHẬP JWT BẢO MẬT (7 NGÀY)
    // ----------------------------------------------------
    const token = signToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role as any,
    });

    // Sau khi đăng nhập OAuth thành công, chuyển hướng người dùng thẳng về Trang chủ
    const redirectUrl = new URL("/", req.url);
    const response = NextResponse.redirect(redirectUrl);

    // Gán Cookie HttpOnly, Secure (chỉ khi https), SameSite=Lax
    response.cookies.set("rbx_session_token", token, {
      httpOnly: true,
      secure: proto === "https",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Dọn sạch cookie CSRF state
    response.cookies.delete(stateCookieName);

    return response;
  } catch (err: any) {
    console.error(`OAuth Callback Error [${provider}]:`, err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(`Lỗi xác thực ${provider.toUpperCase()}: ${err.message || "Không thể hoàn tất xác thực."}`)}`, req.url)
    );
  }
}
