# Tailscale Funnel + EdgeOne 部署指南

## 📋 概述

本指南将帮助您将项目部署到腾讯EdgeOne Pages，并使用Tailscale Funnel暴露本地后端API。

## 🏗️ 架构设计

```
EdgeOne Pages (前端) → Tailscale Funnel → 本地服务器 (后端API)
```

## 🚀 部署步骤

### 1. 安装和配置Tailscale

#### Windows系统：
```bash
# 下载并安装Tailscale
# 访问：https://tailscale.com/download/windows

# 登录Tailscale账户
tailscale up

# 验证连接
tailscale status
```

#### Linux/macOS系统：
```bash
# 安装Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 启动服务
sudo tailscale up
```

### 2. 配置Tailscale Funnel

```bash
# 暴露3000端口到公网
tailscale funnel --port=3000

# 输出示例：
# https://your-server.ts.net:3000
```

**重要**：记录下生成的URL，稍后需要更新配置文件。

### 3. 更新API配置

编辑 `js/config.js` 文件，将生产环境的API地址更新为您的Tailscale Funnel URL：

```javascript
// 在js/config.js中更新
getApiBaseUrl: function() {
    if (this.isLocalhost) {
        return 'http://localhost:3000';
    } else {
        // 替换为您的实际Tailscale Funnel URL
        return 'https://your-server.ts.net:3000';
    }
}
```

### 4. 部署到EdgeOne Pages

#### 4.1 准备部署文件

确保以下文件已准备好：
- 所有HTML文件
- CSS和JavaScript文件
- 配置文件 `js/config.js`

#### 4.2 上传到EdgeOne Pages

1. 登录腾讯云EdgeOne控制台
2. 创建新的Pages项目
3. 上传项目文件
4. 配置构建和部署

### 5. 测试部署

#### 5.1 本地测试
```bash
# 启动本地服务器
npm start

# 访问本地页面
# http://localhost:8000/files.html
```

#### 5.2 生产环境测试
1. 访问EdgeOne Pages提供的URL
2. 测试文件上传和下载功能
3. 检查控制台日志确认API调用正常

## 🔧 配置说明

### API地址配置

项目使用 `js/config.js` 文件来管理API地址：

```javascript
const config = {
    // 自动检测环境
    isLocalhost: window.location.hostname === 'localhost',
    
    // 获取API基础URL
    getApiBaseUrl: function() {
        if (this.isLocalhost) {
            return 'http://localhost:3000';  // 本地开发
        } else {
            return 'https://your-server.ts.net:3000';  // 生产环境
        }
    }
};
```

### CORS配置

后端服务器已配置CORS支持跨域请求：

```javascript
app.use(cors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));
```

## ⚠️ 注意事项

### 1. Tailscale Funnel限制
- **免费使用**：Tailscale Funnel免费提供
- **URL稳定性**：每次重启可能生成新的URL
- **网络延迟**：通过Tailscale网络可能有一定延迟

### 2. 服务器要求
- **24小时运行**：本地服务器需要持续运行
- **网络连接**：需要稳定的网络连接
- **防火墙**：确保Tailscale可以正常连接

### 3. 安全考虑
- **访问控制**：考虑添加身份验证
- **文件大小限制**：设置合理的上传限制
- **备份策略**：定期备份上传的文件

## 🛠️ 故障排除

### 常见问题

#### 1. API调用失败
- 检查Tailscale Funnel是否正常运行
- 验证API URL配置是否正确
- 查看浏览器控制台错误信息

#### 2. 文件上传失败
- 检查CORS配置
- 验证文件大小限制
- 确认服务器磁盘空间

#### 3. 文件下载重命名
- 检查Content-Disposition头设置
- 验证CORS exposedHeaders配置

### 调试方法

```javascript
// 在浏览器控制台中检查配置
console.log('API Base URL:', config.getApiBaseUrl());
console.log('Is Localhost:', config.isLocalhost);

// 测试API连接
fetch(config.getApiUrl('/api/files'))
    .then(response => console.log('API Response:', response))
    .catch(error => console.error('API Error:', error));
```

## 📈 性能优化

### 1. 文件存储优化
- 考虑使用云存储服务（腾讯云COS）
- 实现文件压缩和优化
- 添加CDN加速

### 2. 网络优化
- 使用EdgeOne的全球CDN
- 优化API响应时间
- 实现文件分片上传

## 🔄 维护和更新

### 定期维护
1. 检查Tailscale连接状态
2. 监控服务器资源使用
3. 备份重要数据
4. 更新依赖包

### 版本更新
1. 更新本地代码
2. 重新部署到EdgeOne
3. 测试新功能
4. 更新文档

## 📞 技术支持

如遇到问题，请检查：
1. Tailscale连接状态
2. 服务器运行状态
3. 网络连接情况
4. 浏览器控制台错误

---

**部署完成后，您的网站将具备完整的文件管理功能，包括上传、下载、删除等操作。**
