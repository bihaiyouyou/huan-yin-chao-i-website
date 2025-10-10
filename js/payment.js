// 支付页面JavaScript
let currentOrderId = null;
let paymentCheckInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('支付页面加载完成');
    initializePayment();
});

// 初始化支付页面
function initializePayment() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    currentOrderId = urlParams.get('orderId');
    const cardName = urlParams.get('cardName');
    const price = urlParams.get('price');
    
    if (!currentOrderId) {
        showError('订单ID缺失，请重新选择商品');
        return;
    }
    
    // 显示订单信息
    document.getElementById('productName').textContent = cardName || '虚拟机器人服务卡';
    document.getElementById('productPrice').textContent = `¥${price || '0.00'}`;
    
    // 开始支付流程
    startPayment();
}

// 开始支付流程
async function startPayment() {
    try {
        console.log('开始创建支付订单:', currentOrderId);
        
        // 创建支付订单
        const response = await fetch(config.getApiUrl('/api/payment/create'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: currentOrderId
            })
        });
        
        if (!response.ok) {
            throw new Error(`创建支付订单失败: ${response.status}`);
        }
        
        const paymentData = await response.json();
        console.log('支付订单创建成功:', paymentData);
        
        // 显示二维码
        displayQRCode(paymentData.qrCode);
        
        // 开始轮询支付状态
        startPaymentStatusCheck();
        
    } catch (error) {
        console.error('创建支付订单失败:', error);
        showError('创建支付订单失败，请重试');
    }
}

// 显示二维码
function displayQRCode(qrCode) {
    const qrLoading = document.getElementById('qrLoading');
    const qrImage = document.getElementById('qrCodeImage');
    
    if (qrCode) {
        qrLoading.style.display = 'none';
        qrImage.src = qrCode;
        qrImage.style.display = 'block';
    } else {
        showError('二维码生成失败');
    }
}

// 开始轮询支付状态
function startPaymentStatusCheck() {
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
    
    paymentCheckInterval = setInterval(async () => {
        try {
            const response = await fetch(config.getApiUrl(`/api/payment/status/${currentOrderId}`));
            
            if (!response.ok) {
                throw new Error(`查询支付状态失败: ${response.status}`);
            }
            
            const statusData = await response.json();
            console.log('支付状态:', statusData);
            
            if (statusData.status === 'TRADE_SUCCESS') {
                // 支付成功
                clearInterval(paymentCheckInterval);
                showPaymentSuccess();
                
                // 延迟跳转到结果页面
                setTimeout(() => {
                    window.location.href = `payment-result.html?orderId=${currentOrderId}`;
                }, 2000);
                
            } else if (statusData.status === 'TRADE_CLOSED' || statusData.status === 'TRADE_FINISHED') {
                // 支付失败或关闭
                clearInterval(paymentCheckInterval);
                showPaymentFailed();
            }
            
        } catch (error) {
            console.error('查询支付状态失败:', error);
        }
    }, 3000); // 每3秒查询一次
    
    // 设置超时（10分钟）
    setTimeout(() => {
        if (paymentCheckInterval) {
            clearInterval(paymentCheckInterval);
            showPaymentTimeout();
        }
    }, 600000);
}

// 显示支付成功状态
function showPaymentSuccess() {
    document.getElementById('statusPending').style.display = 'none';
    document.getElementById('statusFailed').style.display = 'none';
    document.getElementById('statusSuccess').style.display = 'flex';
}

// 显示支付失败状态
function showPaymentFailed() {
    document.getElementById('statusPending').style.display = 'none';
    document.getElementById('statusSuccess').style.display = 'none';
    document.getElementById('statusFailed').style.display = 'flex';
}

// 显示支付超时
function showPaymentTimeout() {
    document.getElementById('statusPending').style.display = 'none';
    document.getElementById('statusSuccess').style.display = 'none';
    document.getElementById('statusFailed').style.display = 'flex';
    document.querySelector('#statusFailed .status-text').textContent = '支付超时，请重新支付';
}

// 刷新支付
function refreshPayment() {
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
    
    // 重置状态
    document.getElementById('statusPending').style.display = 'flex';
    document.getElementById('statusSuccess').style.display = 'none';
    document.getElementById('statusFailed').style.display = 'none';
    
    // 重新开始支付流程
    startPayment();
}

// 返回上页
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'card-shop.html';
    }
}

// 显示错误信息
function showError(message) {
    const qrContainer = document.querySelector('.qr-container');
    qrContainer.innerHTML = `
        <div class="error-message">
            <h4>错误</h4>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #fff; color: #f44336; border: none; border-radius: 4px; cursor: pointer;">
                重新加载
            </button>
        </div>
    `;
}

// 页面卸载时清理定时器
window.addEventListener('beforeunload', function() {
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }
});

// 页面隐藏时暂停轮询，显示时恢复
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停轮询
        if (paymentCheckInterval) {
            clearInterval(paymentCheckInterval);
        }
    } else {
        // 页面显示时恢复轮询
        if (currentOrderId && !document.getElementById('statusSuccess').style.display !== 'none') {
            startPaymentStatusCheck();
        }
    }
});
