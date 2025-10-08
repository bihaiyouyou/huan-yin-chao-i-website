@echo off
chcp 65001 >nul
echo ========================================
echo 幻银超i桌面虚拟机器人官网 - GitHub上传工具
echo ========================================
echo.

echo 📋 请按照以下步骤操作：
echo.
echo 1. 在GitHub上创建新仓库
echo    - 访问: https://github.com/new
echo    - 仓库名: huan-yin-chao-i-website
echo    - 描述: 幻银超i桌面虚拟机器人官网
echo    - 选择: Public (公开) 或 Private (私有)
echo    - 不要勾选: Initialize this repository with a README
echo.
echo 2. 复制仓库URL (例如: https://github.com/username/huan-yin-chao-i-website.git)
echo.
echo 3. 按任意键继续...
pause >nul

echo.
echo 🔗 请输入您的GitHub仓库URL:
set /p REPO_URL="仓库URL: "

if "%REPO_URL%"=="" (
    echo ❌ 错误：未输入仓库URL
    pause
    exit /b 1
)

echo.
echo 📦 添加远程仓库...
git remote add origin %REPO_URL%

echo.
echo 🚀 推送到GitHub...
git branch -M main
git push -u origin main

if %errorlevel%==0 (
    echo.
    echo ✅ 上传成功！
    echo 🌐 您的网站已发布到: %REPO_URL%
    echo.
    echo 📋 后续操作：
    echo    1. 在GitHub仓库设置中启用GitHub Pages
    echo    2. 选择main分支作为源
    echo    3. 访问: https://username.github.io/huan-yin-chao-i-website
    echo.
) else (
    echo.
    echo ❌ 上传失败！
    echo 请检查：
    echo    1. 网络连接是否正常
    echo    2. GitHub仓库URL是否正确
    echo    3. 是否有仓库的推送权限
    echo.
)

echo 按任意键关闭...
pause >nul
