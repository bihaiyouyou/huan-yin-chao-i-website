@echo off
chcp 65001 >nul
echo ========================================
echo 幻银超i桌面虚拟机器人官网 - 本地预览
echo ========================================
echo.

echo 🚀 启动本地预览服务器...
echo.

echo 📋 预览模式说明:
echo    ✅ 纯静态模式 (模拟EdgeOne Pages)
echo    ✅ 文件管理使用纯前端实现
echo    ✅ 无需后端服务器
echo    ✅ 完全模拟生产环境
echo.

echo 🌐 启动服务器 (端口8000)...
echo 正在启动，请稍候...
echo.

start "本地预览服务器" cmd /k "cd /d C:\static-site && python -m http.server 8000"

timeout /t 3 /nobreak >nul

echo ✅ 服务器启动完成！
echo.
echo 🌐 访问地址:
echo    首页: http://localhost:8000
echo    公司业务: http://localhost:8000/business.html
echo    新闻资讯: http://localhost:8000/news.html
echo    核心技术: http://localhost:8000/technology.html
echo    关于我们: http://localhost:8000/about.html
echo    文件管理: http://localhost:8000/files.html
echo.
echo 📱 测试功能:
echo    ✅ 响应式设计 (调整浏览器窗口大小)
echo    ✅ 视频播放 (Bilibili视频)
echo    ✅ 文件管理 (纯前端，无需后端)
echo    ✅ 导航切换
echo    ✅ 移动端适配
echo.
echo 💡 提示:
echo    - 按 Ctrl+C 停止服务器
echo    - 关闭命令行窗口停止服务器
echo    - 这是纯静态模式，完全模拟EdgeOne Pages
echo.
echo 按任意键打开浏览器...
pause >nul
start http://localhost:8000
