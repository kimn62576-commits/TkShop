export type UserRole = "GUEST" | "USER" | "ADMIN" | "SUPER_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl: string | null;
  robloxUsername: string | null;
  walletBalance: number;
  createdAt?: string | Date;
  lastLoginAt?: string | Date | null;
  linkedProviders?: string[];
  hasPassword?: boolean;
}

export type OrderStatus = "COMPLETED" | "REFUNDED" | "CANCELLED";
export type DepositStatus = "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED";
export type TransactionType = "DEPOSIT" | "PURCHASE" | "REFUND" | "ADMIN_ADJUSTMENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface ProductSummary {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  isFree: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  ratingAverage: number;
  ratingCount: number;
  salesCount: number;
  fileFormat: string;
  creatorName: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  thumbnail: string;
}
