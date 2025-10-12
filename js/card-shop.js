// 发卡页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('发卡页面加载完成');
    loadCardTypes();
    setupEventListeners();
});

// 加载卡类型
async function loadCardTypes() {
    try {
        console.log('开始加载卡类型...');
        const response = await fetch(config.getApiUrl('/api/card-types'));
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const cardTypes = await response.json();
        console.log('卡类型加载成功:', cardTypes);
        
        displayCardTypes(cardTypes);
    } catch (error) {
        console.error('加载卡类型失败:', error);
        showError('加载卡类型失败，请刷新页面重试');
    }
}

// 显示卡类型
function displayCardTypes(cardTypes) {
    const cardGrid = document.getElementById('cardGrid');
    
    if (!cardTypes || cardTypes.length === 0) {
        cardGrid.innerHTML = '<div class="error-message">暂无可用卡类型</div>';
        return;
    }
    
    cardGrid.innerHTML = cardTypes.map(cardType => {
        const isPopular = cardType.name === '月卡'; // 月卡设为推荐
        const popularClass = isPopular ? 'popular' : '';
        
        return `
            <div class="card-item ${popularClass}" data-type-id="${cardType.id}">
                <div class="card-header">
                    <h3>${cardType.name}</h3>
                    <div class="price">
                        <span class="price-currency">¥</span>${cardType.price}
                    </div>
                </div>
                <div class="card-content">
                    <p>有效期：${cardType.duration_days}天</p>
                    <p>${cardType.description}</p>
                    <ul class="card-features">
                        ${getCardFeatures(cardType.name)}
                    </ul>
                </div>
                <button class="buy-btn" onclick="buyCard(${cardType.id}, '${cardType.name}', ${cardType.price})">
                    立即购买
                </button>
            </div>
        `;
    }).join('');
}

// 获取卡类型特色功能
function getCardFeatures(cardName) {
    const features = {
        '日卡': [
            '基础功能访问',
            '标准技术支持',
            '1天有效期'
        ],
        '月卡': [
            '全功能访问',
            '优先技术支持',
            '30天有效期',
            '数据备份服务'
        ],
        '季卡': [
            '全功能访问',
            'VIP技术支持',
            '90天有效期',
            '数据备份服务',
            '定制化配置'
        ],
        '年卡': [
            '全功能访问',
            '专属技术支持',
            '365天有效期',
            '数据备份服务',
            '定制化配置',
            '专属客服'
        ]
    };
    
    return (features[cardName] || []).map(feature => `<li>${feature}</li>`).join('');
}

// 购买卡片
async function buyCard(cardTypeId, cardName, price) {
    try {
        console.log('开始购买卡片:', { cardTypeId, cardName, price });
        
        // 生成用户ID（实际应用中应该从登录状态获取）
        const userId = generateUserId();
        
        // 映射cardTypeId到数据库中的实际ID
        const cardTypeMapping = {
            1: 37, // 日卡
            2: 38, // 月卡
            3: 39, // 季卡
            4: 40  // 年卡
        };
        
        const actualCardTypeId = cardTypeMapping[cardTypeId] || cardTypeId;
        console.log('映射后的cardTypeId:', actualCardTypeId);
        
        // 创建订单
        const orderResponse = await fetch(config.getApiUrl('/api/orders'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cardTypeId: actualCardTypeId,
                userId: userId
            })
        });
        
        if (!orderResponse.ok) {
            throw new Error(`创建订单失败: ${orderResponse.status}`);
        }
        
        const order = await orderResponse.json();
        console.log('订单创建成功:', order);
        
        // 跳转到支付页面
        const paymentUrl = `payment.html?orderId=${order.orderId}&cardName=${encodeURIComponent(cardName)}&price=${price}`;
        console.log('跳转到支付页面:', paymentUrl);
        window.location.href = paymentUrl;
        
    } catch (error) {
        console.error('购买失败:', error);
        showError('购买失败，请重试');
    }
}

// 生成用户ID
function generateUserId() {
    // 实际应用中应该从登录状态获取
    // 这里使用浏览器指纹作为临时用户ID
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('User ID', 2, 2);
    
    const fingerprint = canvas.toDataURL();
    return 'user_' + btoa(fingerprint).substring(0, 16);
}

// 设置事件监听器
function setupEventListeners() {
    // 移动端菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // 点击外部关闭菜单
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// 显示错误信息
function showError(message) {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = `
        <div class="error-message">
            <h4>错误</h4>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #fff; color: #f44336; border: none; border-radius: 4px; cursor: pointer;">
                刷新页面
            </button>
        </div>
    `;
}

// 显示成功信息
function showSuccess(message) {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = `
        <div class="success-message">
            <h4>成功</h4>
            <p>${message}</p>
        </div>
    `;
}

// 显示加载状态
function showLoading() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '<div class="loading"></div>';
}
