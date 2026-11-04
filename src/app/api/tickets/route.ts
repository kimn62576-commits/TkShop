import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

const ticketSchema = z.object({
  subject: z.string().min(5, "Tiêu đề ít nhất 5 ký tự"),
  category: z.enum(["BILLING", "TECHNICAL", "ASSET_ISSUE", "GENERAL"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  message: z.string().min(10, "Nội dung ít nhất 10 ký tự"),
});

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  const where = isAdmin ? {} : { userId: session.id };

  const tickets = await prisma.supportTicket.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      user: {
        include: { profile: true },
      },
    },
  });

  return NextResponse.json({ tickets });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validated = ticketSchema.safeParse(body);
  if (!validated.success) {
    const msg = validated.error.issues?.[0]?.message || "Thông tin ticket không hợp lệ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { subject, category, priority, message } = validated.data;
  const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber,
      userId: session.id,
      subject,
      category,
      priority,
      status: "OPEN",
      messages: {
        create: {
          senderId: session.id,
          senderName: session.displayName,
          senderRole: session.role,
          message,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Yêu cầu hỗ trợ đã được tạo thành công!",
    ticket,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId, message, status } = await req.json();
  if (!ticketId) {
    return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  if (!isAdmin && ticket.userId !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update status or add reply
  if (message) {
    await prisma.supportMessage.create({
      data: {
        ticketId,
        senderId: session.id,
        senderName: session.displayName,
        senderRole: session.role,
        message,
      },
    });
  }

  const newStatus = status || (isAdmin ? "IN_PROGRESS" : "OPEN");
  const updatedTicket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: newStatus },
    include: { messages: true },
  });

  return NextResponse.json({
    success: true,
    ticket: updatedTicket,
  });
}
