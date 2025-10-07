@echo off
echo 安装文件管理系统为Windows服务...
echo 注意：此功能需要管理员权限
echo.

echo 创建Node.js服务...
sc create "FileManagementAPI" binPath="C:\static-site\server.js" start=auto
if %errorlevel%==0 (
    echo ✅ Node.js服务创建成功
) else (
    echo ❌ Node.js服务创建失败
)

echo.
echo 启动服务...
sc start "FileManagementAPI"
if %errorlevel%==0 (
    echo ✅ 服务启动成功
) else (
    echo ❌ 服务启动失败
)

echo.
echo 服务安装完成！
echo 按任意键关闭此窗口...
pause >nul
