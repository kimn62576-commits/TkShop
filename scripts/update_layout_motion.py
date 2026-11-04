file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\app\layout.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace(
    'import AtmosphericBackground from "@/components/common/AtmosphericBackground";',
    '''import AtmosphericBackground from "@/components/common/AtmosphericBackground";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CustomCursor from "@/components/motion/CustomCursor";'''
)

code = code.replace(
    '''        {/* Nền Đồ Họa Tự Động Thích Ứng Theo Chế Độ Dark / Light Mode */}
        <AtmosphericBackground />
        
        {/* Nội Dung Trang Web Nằm Nổi Phía Trên */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>''',
    '''        <SmoothScroll>
          {/* Con trỏ chuột tương tác tuỳ biến (Custom Cursor) */}
          <CustomCursor />

          {/* Nền Đồ Họa Tự Động Thích Ứng Theo Chế Độ Dark / Light Mode */}
          <AtmosphericBackground />
          
          {/* Nội Dung Trang Web Nằm Nổi Phía Trên */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </SmoothScroll>'''
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated layout.tsx with SmoothScroll and CustomCursor!")
