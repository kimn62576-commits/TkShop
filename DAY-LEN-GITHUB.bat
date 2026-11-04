@echo off
chcp 65001 >nul
title ĐẨY MÃ NGUỒN TKSHOP.VN LÊN GITHUB
color 0b

echo ================================================================
echo       HỆ THỐNG ĐẨY MÃ NGUỒN TKSHOP.VN TỰ ĐỘNG LÊN GITHUB
echo ================================================================
echo.
echo Bước 1: Hãy vào https://github.com/new trên trình duyệt
echo Bước 2: Đặt tên Repository (ví dụ: tkshop)
echo Bước 3: Chọn Private (hoặc Public) và bấm "Create repository"
echo Bước 4: Copy đường link Repo (ví dụ: https://github.com/username/tkshop.git)
echo.
echo ================================================================
echo.

set /p REPO_URL=">> Dán link GitHub Repo của bạn vào đây rồi bấm ENTER: "

if "%REPO_URL%"=="" (
    echo.
    echo [LỖI] Bạn chưa nhập link GitHub! Vui lòng chạy lại file.
    pause
    exit /b
)

echo.
echo [1/3] Đang di chuyển vào thư mục dự án...
cd /d "C:\Users\H2PC\Desktop\roblox-asset-marketplace"

echo [2/3] Đang liên kết với GitHub Repo: %REPO_URL%
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [3/3] Đang đẩy toàn bộ mã nguồn lên nhánh main...
echo (Nếu đây là lần đầu tiên, GitHub sẽ mở một cửa sổ nhỏ để bạn bấm Đăng Nhập xác nhận)
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo    THÀNH CÔNG RỰC RỠ! MÃ NGUỒN ĐÃ ĐƯỢC ĐẨY LÊN GITHUB 100%!
    echo ================================================================
    echo Bây giờ bạn có thể vào https://vercel.com để Deploy chỉ với 1 click!
    echo.
) else (
    echo.
    echo ================================================================
    echo [THÔNG BÁO] Nếu chưa đẩy được, bạn có thể thử lệnh:
    echo git push -u origin main --force
    echo hoặc kiểm tra lại quyền truy cập tài khoản GitHub của bạn.
    echo ================================================================
)

pause
