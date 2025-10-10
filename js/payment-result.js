// 支付结果页面JavaScript
let currentOrderId = null;
let orderData = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('支付结果页面加载完成');
    initializeResult();
});

// 初始化结果页面
function initializeResult() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    currentOrderId = urlParams.get('orderId');
    
    if (!currentOrderId) {
        showError('订单ID缺失');
        return;
    }
    
    // 加载订单信息
    loadOrderInfo();
}

// 加载订单信息
async function loadOrderInfo() {
    try {
        console.log('加载订单信息:', currentOrderId);
        
        const response = await fetch(config.getApiUrl(`/api/orders/${currentOrderId}`));
        
        if (!response.ok) {
            throw new Error(`加载订单信息失败: ${response.status}`);
        }
        
        orderData = await response.json();
        console.log('订单信息加载成功:', orderData);
        
        // 显示订单信息
        displayOrderInfo(orderData);
        
    } catch (error) {
        console.error('加载订单信息失败:', error);
        showError('加载订单信息失败，请刷新页面重试');
    }
}

// 显示订单信息
function displayOrderInfo(order) {
    // 显示基本信息
    document.getElementById('orderNumber').textContent = order.order_no || '-';
    document.getElementById('productName').textContent = order.card_type_name || '虚拟机器人服务卡';
    document.getElementById('productPrice').textContent = `¥${order.amount || '0.00'}`;
    document.getElementById('paymentTime').textContent = formatDateTime(order.paid_at) || '-';
    
    // 显示卡密
    if (order.card_code) {
        document.getElementById('cardCode').textContent = order.card_code;
    } else {
        // 如果没有卡密，尝试获取
        getCardCode();
    }
}

// 获取卡密
async function getCardCode() {
    try {
        console.log('获取卡密:', currentOrderId);
        
        const response = await fetch(config.getApiUrl(`/api/orders/${currentOrderId}/card-code`));
        
        if (!response.ok) {
            throw new Error(`获取卡密失败: ${response.status}`);
        }
        
        const cardData = await response.json();
        console.log('卡密获取成功:', cardData);
        
        if (cardData.card_code) {
            document.getElementById('cardCode').textContent = cardData.card_code;
        } else {
            document.getElementById('cardCode').textContent = '卡密生成中，请稍后刷新页面';
        }
        
    } catch (error) {
        console.error('获取卡密失败:', error);
        document.getElementById('cardCode').textContent = '卡密获取失败，请联系客服';
    }
}

// 复制卡密
function copyCardCode() {
    const cardCode = document.getElementById('cardCode').textContent;
    
    if (!cardCode || cardCode === '-') {
        showMessage('卡密不可用', 'error');
        return;
    }
    
    // 使用现代API复制到剪贴板
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(cardCode).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyTextToClipboard(cardCode);
        });
    } else {
        // 降级方案
        fallbackCopyTextToClipboard(cardCode);
    }
}

// 降级复制方案
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showMessage('复制失败，请手动复制', 'error');
        }
    } catch (err) {
        console.error('降级复制失败:', err);
        showMessage('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 显示复制成功提示
function showCopySuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'copy-success';
    successDiv.textContent = '卡密已复制到剪贴板！';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 2000);
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

// 格式化日期时间
function formatDateTime(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// 重新支付
function retryPayment() {
    if (orderData && orderData.card_type_id) {
        window.location.href = `payment.html?orderId=${currentOrderId}&cardName=${encodeURIComponent(orderData.card_type_name)}&price=${orderData.amount}`;
    } else {
        window.location.href = 'card-shop.html';
    }
}

// 返回上页
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'card-shop.html';
    }
}

// 前往下载页面
function goToDownload() {
    window.location.href = 'files.html';
}

// 前往商店页面
function goToShop() {
    window.location.href = 'card-shop.html';
}

// 前往首页
function goToHome() {
    window.location.href = 'index.html';
}

// 显示错误
function showError(message) {
    document.getElementById('successResult').style.display = 'none';
    document.getElementById('failedResult').style.display = 'block';
    document.querySelector('.failed-message').textContent = message;
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
