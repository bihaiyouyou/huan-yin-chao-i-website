// 卡密管理页面JavaScript
let currentFilter = {
    type: '',
    status: ''
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('卡密管理页面加载完成');
    initializeAdmin();
});

// 初始化管理页面
function initializeAdmin() {
    // 绑定事件
    document.getElementById('uploadBtn').addEventListener('click', uploadCardCodes);
    document.getElementById('filterType').addEventListener('change', handleFilterChange);
    document.getElementById('filterStatus').addEventListener('change', handleFilterChange);
    document.getElementById('refreshBtn').addEventListener('click', loadCardCodes);
    
    // 加载初始数据
    loadStatistics();
    loadCardCodes();
}

// 上传卡密
async function uploadCardCodes() {
    const cardTypeId = document.getElementById('cardType').value;
    const cardCodesText = document.getElementById('cardCodes').value.trim();
    
    if (!cardTypeId) {
        showMessage('请选择卡类型', 'error');
        return;
    }
    
    if (!cardTypeId) {
        showMessage('请选择卡类型', 'error');
        return;
    }
    
    if (!cardCodesText) {
        showMessage('请输入卡密', 'error');
        return;
    }
    
    // 解析卡密
    const cardCodes = cardCodesText.split('\n')
        .map(code => code.trim())
        .filter(code => code.length > 0);
    
    if (cardCodes.length === 0) {
        showMessage('请输入有效的卡密', 'error');
        return;
    }
    
    try {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = '上传中...';
        
        console.log('开始上传卡密:', { cardTypeId, count: cardCodes.length });
        
        const response = await fetch(config.getApiUrl('/api/admin/card-codes'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cardTypeId: parseInt(cardTypeId),
                cardCodes: cardCodes
            })
        });
        
        if (!response.ok) {
            throw new Error(`上传失败: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('卡密上传成功:', result);
        
        showMessage(`成功上传 ${result.count} 个卡密`, 'success');
        
        // 清空表单
        document.getElementById('cardCodes').value = '';
        
        // 刷新数据
        loadStatistics();
        loadCardCodes();
        
    } catch (error) {
        console.error('上传卡密失败:', error);
        showMessage('上传失败，请重试', 'error');
    } finally {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = false;
        uploadBtn.textContent = '上传卡密';
    }
}

// 加载统计信息
async function loadStatistics() {
    try {
        const response = await fetch(config.getApiUrl('/api/admin/statistics'));
        
        if (!response.ok) {
            throw new Error(`加载统计失败: ${response.status}`);
        }
        
        const stats = await response.json();
        console.log('统计信息:', stats);
        
        // 更新统计显示
        document.getElementById('dailyCount').textContent = stats.daily || 0;
        document.getElementById('monthlyCount').textContent = stats.monthly || 0;
        document.getElementById('quarterlyCount').textContent = stats.quarterly || 0;
        document.getElementById('yearlyCount').textContent = stats.yearly || 0;
        
    } catch (error) {
        console.error('加载统计失败:', error);
        showMessage('加载统计信息失败', 'error');
    }
}

// 加载卡密列表
async function loadCardCodes() {
    try {
        const codesList = document.getElementById('codesList');
        codesList.innerHTML = '<div class="loading">加载中...</div>';
        
        const params = new URLSearchParams();
        if (currentFilter.type) params.append('type', currentFilter.type);
        if (currentFilter.status) params.append('status', currentFilter.status);
        
        const response = await fetch(config.getApiUrl(`/api/admin/card-codes?${params}`));
        
        if (!response.ok) {
            throw new Error(`加载卡密列表失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('卡密列表:', data);
        
        displayCardCodes(data.codes || []);
        
    } catch (error) {
        console.error('加载卡密列表失败:', error);
        const codesList = document.getElementById('codesList');
        codesList.innerHTML = '<div class="empty-state"><h4>加载失败</h4><p>请刷新页面重试</p></div>';
    }
}

// 显示卡密列表
function displayCardCodes(codes) {
    const codesList = document.getElementById('codesList');
    
    if (codes.length === 0) {
        codesList.innerHTML = '<div class="empty-state"><h4>暂无卡密</h4><p>请上传卡密或调整筛选条件</p></div>';
        return;
    }
    
    const html = codes.map(code => `
        <div class="code-item">
            <div class="code-info">
                <div class="code-value">${code.code}</div>
                <div class="code-meta">
                    <span class="code-type">${code.card_type_name}</span>
                    <span>创建时间: ${formatDate(code.created_at)}</span>
                    ${code.used_at ? `<span>使用时间: ${formatDate(code.used_at)}</span>` : ''}
                </div>
            </div>
            <div class="code-actions">
                <span class="code-status status-${code.status}">${getStatusText(code.status)}</span>
                <button class="action-btn copy-btn" onclick="copyCode('${code.code}')">复制</button>
                ${code.status === 'unused' ? `<button class="action-btn delete-btn" onclick="deleteCode(${code.id})">删除</button>` : ''}
            </div>
        </div>
    `).join('');
    
    codesList.innerHTML = html;
}

// 处理筛选变化
function handleFilterChange() {
    currentFilter.type = document.getElementById('filterType').value;
    currentFilter.status = document.getElementById('filterStatus').value;
    loadCardCodes();
}

// 复制卡密
function copyCode(code) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(() => {
            showMessage('卡密已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyCode(code);
        });
    } else {
        fallbackCopyCode(code);
    }
}

// 降级复制方案
function fallbackCopyCode(code) {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showMessage('卡密已复制到剪贴板', 'success');
        } else {
            showMessage('复制失败，请手动复制', 'error');
        }
    } catch (err) {
        console.error('降级复制失败:', err);
        showMessage('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 删除卡密
async function deleteCode(codeId) {
    if (!confirm('确定要删除这个卡密吗？此操作不可恢复。')) {
        return;
    }
    
    try {
        const response = await fetch(config.getApiUrl(`/api/admin/card-codes/${codeId}`), {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`删除失败: ${response.status}`);
        }
        
        showMessage('卡密删除成功', 'success');
        loadStatistics();
        loadCardCodes();
        
    } catch (error) {
        console.error('删除卡密失败:', error);
        showMessage('删除失败，请重试', 'error');
    }
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'unused': '未使用',
        'used': '已使用',
        'expired': '已过期'
    };
    return statusMap[status] || status;
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'error') {
        messageDiv.style.background = '#f44336';
    } else if (type === 'success') {
        messageDiv.style.background = '#4CAF50';
    } else {
        messageDiv.style.background = '#2196F3';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
