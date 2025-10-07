@echo off
echo 启动文件管理系统服务 (Windows服务模式)...
echo 注意：此方式需要管理员权限
echo.

echo 检查Node.js服务状态...
sc query "FileManagementAPI" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js服务已存在，正在启动...
    sc start "FileManagementAPI"
) else (
    echo 📦 创建Node.js服务...
    sc create "FileManagementAPI" binPath="C:\static-site\server.js" start=auto
    sc start "FileManagementAPI"
)

echo.
echo 启动Python服务器 (端口8000) - 后台运行...
start /min "" cmd /c "cd /d C:\static-site && python -m http.server 8000 > nul 2>&1"

echo.
echo ✅ 服务启动完成！
echo 后端API: http://localhost:3000 (Windows服务)
echo 前端页面: http://localhost:8000 (后台进程)
echo 文件管理: http://localhost:8000/files.html
echo.
echo 服务运行状态：
sc query "FileManagementAPI"
echo.
echo 按任意键关闭此窗口...
pause >nul
