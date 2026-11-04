file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\app\api\wallet\deposit\route.ts"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# Add GET method if not present
if "export async function GET" not in code:
    get_code = '''

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Thiếu mã giao dịch" }, { status: 400 });
    }

    const deposit = await prisma.deposit.findFirst({
      where: { 
        transactionCode: code,
        userId: session.id,
      },
      select: {
        id: true,
        transactionCode: true,
        amount: true,
        status: true,
        completedAt: true,
      },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Không tìm thấy giao dịch" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deposit,
      isCompleted: deposit.status === "COMPLETED",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Lỗi kiểm tra trạng thái" }, { status: 500 });
  }
}
'''
    code = code + get_code

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated deposit route with GET status handler!")
