// 支付宝配置 - 简化版本（用于测试）
console.log('📱 支付宝配置加载（测试模式）');

const QRCode = require('qrcode');

// 模拟支付宝配置
const alipayConfig = {
    appId: 'test_app_id',
    privateKey: 'test_private_key',
    alipayPublicKey: 'test_public_key',
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    notifyUrl: 'http://localhost:3000/api/payment/callback'
};

// 创建支付订单（模拟版本）
async function createOrder(orderData) {
    try {
        console.log('📱 模拟创建支付订单:', orderData);
        
        // 生成测试用的二维码（包含支付信息）
        const paymentUrl = `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent('https://www.alipay.com')}`;
        const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        return {
            qr_code: qrCodeDataUrl,
            out_trade_no: orderData.out_trade_no
        };
    } catch (error) {
        console.error('创建支付订单失败:', error);
        throw error;
    }
}

// 查询订单状态（模拟版本）
async function queryOrder(outTradeNo) {
    try {
        console.log('🔍 模拟查询订单状态:', outTradeNo);
        
        // 模拟返回等待支付状态
        // 在实际环境中，这里应该调用支付宝API查询真实状态
        return {
            trade_status: 'WAIT_BUYER_PAY',
            trade_no: null
        };
    } catch (error) {
        console.error('查询订单状态失败:', error);
        throw error;
    }
}

// 验证回调签名（模拟版本）
function verifyCallback(params) {
    try {
        console.log('🔐 模拟验证回调签名:', params);
        // 模拟验证通过
        // 在实际环境中，这里应该验证支付宝的签名
        return true;
    } catch (error) {
        console.error('验证回调签名失败:', error);
        return false;
    }
}

module.exports = {
    createOrder,
    queryOrder,
    verifyCallback
};