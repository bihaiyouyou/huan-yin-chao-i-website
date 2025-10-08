@echo off
chcp 65001 >nul
echo 启动文件管理系统服务...
echo.

echo 启动后端服务器 (端口3000)...
start "后端服务器" cmd /k "cd /d C:\static-site && npm start"

timeout /t 3 /nobreak >nul

echo 启动前端服务器 (端口8000)...
start "前端服务器" cmd /k "cd /d C:\static-site && python -m http.server 8000"

echo.
echo 服务启动完成！
echo 后端API: http://localhost:3000
echo 前端页面: http://localhost:8000
echo 文件管理: http://localhost:8000/files.html
echo.
echo 按任意键关闭此窗口...
pause >nul
