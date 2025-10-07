@echo off
echo 启动文件管理系统服务 (后台运行模式)...
echo.

echo 启动后端服务器 (端口3000) - 后台运行...
start /min "" cmd /c "cd /d C:\static-site && npm start > nul 2>&1"

timeout /t 3 /nobreak >nul

echo 启动前端服务器 (端口8000) - 后台运行...
start /min "" cmd /c "cd /d C:\static-site && python -m http.server 8000 > nul 2>&1"

echo.
echo ✅ 服务已在后台启动！
echo 后端API: http://localhost:3000
echo 前端页面: http://localhost:8000
echo 文件管理: http://localhost:8000/files.html
echo.
echo 服务运行在后台，不会显示命令行窗口
echo 使用 stop-services.bat 可以停止服务
echo.
echo 按任意键关闭此窗口...
pause >nul
