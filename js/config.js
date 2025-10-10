// API配置文件
const config = {
    // 检测当前环境
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // 获取API基础URL
    getApiBaseUrl: function() {
        if (this.isLocalhost) {
            // 本地开发环境
            return 'http://localhost:3000';
        } else {
            // 生产环境 - 使用Tailscale Funnel URL
            // 注意：这个URL需要根据实际的Tailscale Funnel URL进行更新
            return 'http://deepseek.tailc6a334.ts.net:3000';
        }
    },
    
    // 获取完整的API URL
    getApiUrl: function(endpoint) {
        const baseUrl = this.getApiBaseUrl();
        return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }
};

// 导出配置（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
