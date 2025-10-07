# GitHub上传指南

## 🚀 快速上传（推荐）

### 方法一：使用自动脚本
1. 双击运行 `upload-to-github.bat`
2. 按照提示在GitHub上创建仓库
3. 输入仓库URL
4. 等待上传完成

### 方法二：手动上传

## 📋 详细步骤

### 1. 创建GitHub仓库
1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `huan-yin-chao-i-website`
   - **Description**: `幻银超i桌面虚拟机器人官网`
   - **Visibility**: 选择 Public 或 Private
   - **不要勾选** "Add a README file"
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"
4. 点击 "Create repository"

### 2. 获取仓库URL
创建完成后，GitHub会显示仓库URL，类似：
```
https://github.com/your-username/huan-yin-chao-i-website.git
```

### 3. 上传代码

#### 使用命令行：
```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/huan-yin-chao-i-website.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

#### 使用GitHub Desktop：
1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开GitHub Desktop
3. 选择 "Clone a repository from the Internet"
4. 输入仓库URL
5. 选择本地保存位置
6. 将项目文件复制到克隆的文件夹
7. 提交并推送更改

## 🌐 启用GitHub Pages

### 1. 进入仓库设置
1. 在GitHub仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"

### 2. 配置Pages
1. 在 "Source" 部分选择 "Deploy from a branch"
2. 选择 "main" 分支
3. 选择 "/ (root)" 文件夹
4. 点击 "Save"

### 3. 访问网站
配置完成后，您的网站将在以下地址可用：
```
https://your-username.github.io/huan-yin-chao-i-website
```

## 📁 项目文件说明

### 核心文件
- `index.html` - 首页
- `business.html` - 公司业务页面
- `news.html` - 新闻资讯页面
- `technology.html` - 核心技术页面
- `about.html` - 关于我们页面
- `files.html` - 文件管理页面

### 样式和脚本
- `css/main.css` - 主样式文件
- `css/files.css` - 文件管理样式
- `js/main.js` - 主JavaScript文件
- `js/files.js` - 文件管理功能

### 后端服务
- `server.js` - Node.js后端服务器
- `package.json` - 项目配置
- `uploads/` - 文件上传目录

### 启动脚本
- `start-services.bat` - 启动服务（普通模式）
- `start-services-background.bat` - 启动服务（后台模式）
- `start-services-service.bat` - 启动服务（服务模式）
- `stop-services.bat` - 停止服务

## 🔧 本地开发

### 启动服务
```bash
# 安装依赖
npm install

# 启动服务
start-services-background.bat
```

### 访问地址
- 前端页面: http://localhost:8000
- 文件管理: http://localhost:8000/files.html
- 后端API: http://localhost:3000/api/files

## 📞 技术支持

如有问题，请联系：
- 邮箱: 1930360522@qq.com
- 公司: 幻银超i桌面虚拟机器人

---

© 2025 幻银超i桌面虚拟机器人. 保留所有权利.
