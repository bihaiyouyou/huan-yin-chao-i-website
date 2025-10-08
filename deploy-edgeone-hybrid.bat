@echo off
chcp 65001 >nul
echo ========================================
echo 幻银超i桌面虚拟机器人官网 - EdgeOne混合部署
echo ========================================
echo.

echo 📋 混合部署方案说明:
echo   前端: EdgeOne Pages (免费静态托管)
echo   后端: 云服务器 (API服务)
echo   通讯: 跨域API调用
echo.

echo 🔧 准备部署文件...
echo.

echo 📦 创建EdgeOne部署包...
if exist "edgeone-hybrid-deploy" rmdir /s /q "edgeone-hybrid-deploy"
mkdir "edgeone-hybrid-deploy"

echo 复制前端文件...
copy "*.html" "edgeone-hybrid-deploy\"
xcopy "css" "edgeone-hybrid-deploy\css\" /e /i
xcopy "js" "edgeone-hybrid-deploy\js\" /e /i
xcopy "images" "edgeone-hybrid-deploy\images\" /e /i

echo 复制配置文件...
copy "edgeone-deploy-config.json" "edgeone-hybrid-deploy\"
copy "README.md" "edgeone-hybrid-deploy\"

echo 创建生产环境配置...
echo {
echo   "backend_api": "https://your-backend-domain.com",
echo   "cors_enabled": true,
echo   "production": true
echo } > "edgeone-hybrid-deploy\config.json"

echo ✅ EdgeOne部署包创建完成
echo.

echo 📋 部署步骤:
echo   1. 登录腾讯云EdgeOne控制台
echo   2. 创建新项目
echo   3. 上传 edgeone-hybrid-deploy 文件夹
echo   4. 配置自定义域名
echo.

echo 🌐 后端部署:
echo   1. 将server.js部署到云服务器
echo   2. 配置CORS允许EdgeOne Pages访问
echo   3. 更新前端API地址
echo.

echo 📁 部署文件位置: edgeone-hybrid-deploy\
echo.

echo 按任意键打开部署文件夹...
pause >nul
explorer "edgeone-hybrid-deploy"
