# 幻银超i桌面虚拟机器人官网

> 专业的桌面虚拟机器人解决方案提供商

## 🌟 项目简介

幻银超i桌面虚拟机器人官网是一个现代化的企业官网，集成了完整的文件管理系统。我们专注于为企业提供专业的虚拟机器人解决方案，实现业务流程自动化和智能化升级。

## ✨ 主要功能

### 🏠 企业官网
- **首页展示** - 公司介绍和核心产品展示
- **公司业务** - 产品中心、成功案例
- **新闻资讯** - 公司新闻、行业资讯
- **核心技术** - 技术优势和创新点
- **关于我们** - 公司简介、发展历程

### 📁 文件管理系统
- **文件下载** - 安全便捷的文件下载中心
- **文件搜索** - 智能文件搜索功能
- **文件管理** - 文件列表、分页显示
- **响应式设计** - 适配各种设备

## 🚀 技术栈

### 前端技术
- **HTML5** - 语义化标签，现代化结构
- **CSS3** - 响应式设计，动画效果
- **JavaScript** - 交互功能，动态内容
- **响应式布局** - 适配桌面、平板、手机

### 后端技术
- **Node.js** - 高性能JavaScript运行时
- **Express** - 轻量级Web框架
- **Multer** - 文件上传处理
- **CORS** - 跨域资源共享

## 📦 项目结构

```
static-site/
├── index.html              # 首页
├── business.html           # 公司业务页面
├── news.html              # 新闻资讯页面
├── technology.html        # 核心技术页面
├── about.html             # 关于我们页面
├── files.html             # 文件管理页面
├── css/
│   ├── main.css           # 主样式文件
│   └── files.css          # 文件管理样式
├── js/
│   ├── main.js            # 主JavaScript文件
│   └── files.js           # 文件管理功能
├── images/                # 图片资源
├── uploads/               # 文件上传目录
├── server.js              # Node.js后端服务器
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 🛠️ 快速开始

### 环境要求
- Node.js 14.0+
- Python 3.6+
- 现代浏览器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/huan-yin-chao-i-website.git
cd huan-yin-chao-i-website
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务**
```bash
# 方式一：使用脚本启动（推荐）
start-services-background.bat

# 方式二：手动启动
# 终端1 - 启动后端服务器
npm start

# 终端2 - 启动前端服务器
python -m http.server 8000
```

4. **访问网站**
- 前端页面: http://localhost:8000
- 文件管理: http://localhost:8000/files.html
- 后端API: http://localhost:3000/api/files

## 📋 功能特性

### 🎨 界面设计
- 现代化暗色主题
- 响应式布局设计
- 流畅的动画效果
- 优秀的用户体验

### 🔧 技术特性
- 前后端分离架构
- RESTful API设计
- 文件类型验证
- 安全文件下载
- 跨域资源共享

### 📱 兼容性
- 支持所有现代浏览器
- 移动端适配
- 平板端优化
- 触摸操作支持

## 🔧 开发指南

### 本地开发
```bash
# 开发模式启动
npm run dev

# 前端开发服务器
python -m http.server 8000
```

### 生产部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 文件管理API

### 获取文件列表
```http
GET /api/files
```

### 下载文件
```http
GET /api/download/:id
```

### 删除文件
```http
DELETE /api/files/:id
```

### 搜索文件
```http
GET /api/files/search?q=关键词
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- **公司**: 幻银超i桌面虚拟机器人
- **地址**: 浙江省杭州市滨江区
- **邮箱**: 1930360522@qq.com
- **网站**: [http://localhost:8000](http://localhost:8000)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

© 2025 幻银超i桌面虚拟机器人. 保留所有权利.
