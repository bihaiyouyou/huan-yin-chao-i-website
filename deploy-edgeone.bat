@echo off
chcp 65001 >nul
echo ========================================
echo 幻银超i桌面虚拟机器人官网 - EdgeOne Pages部署
echo ========================================
echo.

echo 📋 准备EdgeOne Pages部署...
echo.

echo 🔍 检查必要文件...
if not exist "index.html" (
    echo ❌ 错误: 未找到 index.html
    pause
    exit /b 1
)

if not exist "edgeone-pages.json" (
    echo ❌ 错误: 未找到 edgeone-pages.json
    pause
    exit /b 1
)

echo ✅ 必要文件检查完成
echo.

echo 📦 创建部署包...
if exist "edgeone-deploy" rmdir /s /q "edgeone-deploy"
mkdir "edgeone-deploy"

echo 复制HTML文件...
copy "*.html" "edgeone-deploy\"

echo 复制CSS文件...
xcopy "css" "edgeone-deploy\css\" /e /i

echo 复制JS文件...
xcopy "js" "edgeone-deploy\js\" /e /i

echo 复制图片文件...
xcopy "images" "edgeone-deploy\images\" /e /i

echo 复制配置文件...
copy "edgeone-pages.json" "edgeone-deploy\"
copy "README.md" "edgeone-deploy\"

echo ✅ 部署包创建完成
echo.

echo 📋 部署说明:
echo    1. 登录腾讯云EdgeOne控制台
echo    2. 进入Pages服务
echo    3. 创建新项目
echo    4. 上传 edgeone-deploy 文件夹中的所有文件
echo    5. 配置自定义域名（可选）
echo.

echo 🌐 部署后访问地址:
echo    https://your-project-name.edgeone-pages.com
echo.

echo 📁 部署文件位置: edgeone-deploy\
echo.

echo 按任意键打开部署文件夹...
pause >nul
explorer "edgeone-deploy"
