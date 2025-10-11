@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    Tailscale Funnel 部署脚本
echo ========================================
echo.

echo 🔍 检查Tailscale安装状态...
tailscale version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Tailscale未安装，请先安装Tailscale
    echo 📥 下载地址: https://tailscale.com/download/windows
    pause
    exit /b 1
)

echo ✅ Tailscale已安装

echo.
echo 🔍 检查Tailscale连接状态...
tailscale status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Tailscale未连接，请先运行: tailscale up
    pause
    exit /b 1
)

echo ✅ Tailscale已连接

echo.
echo 🚀 启动Tailscale Funnel...
echo 📋 正在暴露3000端口到公网...
echo.
echo ⚠️  请记录下生成的URL，稍后需要更新配置文件
echo.

tailscale funnel 3000

echo.
echo 📝 请将生成的URL更新到 js/config.js 文件中
echo 📝 替换 'https://your-server.ts.net:3000' 为实际的URL
echo.
echo 🔧 配置文件位置: js/config.js
echo 🔧 需要更新的行: return 'https://your-server.ts.net:3000';
echo.

pause
