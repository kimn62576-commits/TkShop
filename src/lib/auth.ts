import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { SessionUser, UserRole } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "rbxmarket_fallback_secret_key_2026";
const COOKIE_NAME = "rbx_session_token";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string, rememberMe: boolean = true) {
  const cookieStore = cookies();
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined; // 30 ngày (Nhớ tôi) hoặc Session cookie (Tự đăng xuất khi tắt trình duyệt)
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  });
}

export async function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        wallet: true,
        accounts: {
          select: { provider: true },
        },
      },
    });

    if (!user || user.isBanned) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      displayName: user.profile?.displayName || user.email.split("@")[0],
      avatarUrl: user.profile?.avatarUrl || null,
      robloxUsername: user.profile?.robloxUsername || null,
      walletBalance: user.wallet?.balance || 0,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      linkedProviders: user.accounts.map((a) => a.provider),
      hasPassword: !!user.passwordHash,
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionUser | null> {
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = req.cookies.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      profile: true,
      wallet: true,
      accounts: {
        select: { provider: true },
      },
    },
  });

  if (!user || user.isBanned) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    displayName: user.profile?.displayName || user.email.split("@")[0],
    avatarUrl: user.profile?.avatarUrl || null,
    robloxUsername: user.profile?.robloxUsername || null,
    walletBalance: user.wallet?.balance || 0,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    linkedProviders: user.accounts.map((a) => a.provider),
    hasPassword: !!user.passwordHash,
  };
}

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return requiredRoles.includes(userRole);
}
