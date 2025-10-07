@echo off
echo 停止文件管理系统服务...
echo.

echo 停止Node.js服务器...
taskkill /f /im node.exe 2>nul
if %errorlevel%==0 (
    echo ✅ Node.js服务器已停止
) else (
    echo ⚠️ 未找到运行中的Node.js服务器
)

echo.
echo 停止Python服务器...
taskkill /f /im python.exe 2>nul
if %errorlevel%==0 (
    echo ✅ Python服务器已停止
) else (
    echo ⚠️ 未找到运行中的Python服务器
)

echo.
echo 停止所有相关进程...
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq 后端服务器*" 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq 前端服务器*" 2>nul

echo.
echo ✅ 服务停止完成！
echo 按任意键关闭此窗口...
pause >nul
