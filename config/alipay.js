// 支付宝配置 - 支持环境变量
console.log('📱 支付宝配置加载');

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// 加载环境变量配置
let alipayConfig = {
    appId: 'test_app_id',
    privateKey: 'test_private_key',
    alipayPublicKey: 'test_public_key',
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    notifyUrl: 'http://localhost:3000/api/payment/callback'
};

// 尝试加载真实配置
try {
    const envPath = path.join(__dirname, 'alipay.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envLines = envContent.split('\n');
        
        for (const line of envLines) {
            if (line.trim() && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    switch (key.trim()) {
                        case 'ALIPAY_APP_ID':
                            alipayConfig.appId = value.trim();
                            break;
                        case 'ALIPAY_PRIVATE_KEY':
                            alipayConfig.privateKey = value.trim();
                            break;
                        case 'ALIPAY_PUBLIC_KEY':
                            alipayConfig.alipayPublicKey = value.trim();
                            break;
                        case 'ALIPAY_GATEWAY':
                            alipayConfig.gateway = value.trim();
                            break;
                        case 'ALIPAY_NOTIFY_URL':
                            alipayConfig.notifyUrl = value.trim();
                            break;
                    }
                }
            }
        }
        console.log('✅ 已加载支付宝配置');
    } else {
        console.log('⚠️ 使用测试模式（未找到 alipay.env 文件）');
    }
} catch (error) {
    console.log('⚠️ 配置加载失败，使用测试模式:', error.message);
}

// 创建支付订单（模拟版本）
async function createOrder(orderData) {
    try {
        console.log('📱 模拟创建支付订单:', orderData);
        
        // 生成测试用的二维码（包含支付信息）
        // 注意：这是测试模式，扫码后不会进行真实支付
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

// 查询订单状态（支持真实和模拟支付）
async function queryOrder(outTradeNo) {
    try {
        console.log('🔍 查询订单状态:', outTradeNo);
        
        // 检查是否使用真实配置
        const isRealConfig = alipayConfig.appId !== 'test_app_id';
        
        if (isRealConfig) {
            // 真实支付：调用支付宝API查询订单状态
            console.log('📱 使用真实支付宝API查询订单状态');
            // 这里应该调用真实的支付宝API
            // 暂时返回等待状态，需要实现真实的API调用
            return {
                trade_status: 'WAIT_BUYER_PAY',
                trade_no: null
            };
        } else {
            // 模拟支付：模拟真实的扫码支付过程
            console.log('🧪 使用模拟支付模式');
            
            // 模拟扫码支付：检查是否已经"扫码"
            // 这里可以通过检查订单创建时间来判断是否扫码
            const orderTime = new Date().getTime();
            const currentTime = new Date().getTime();
            
            // 模拟：如果超过10秒，认为用户已经扫码并支付成功
            if (currentTime - orderTime > 10000) {
                console.log('✅ 模拟扫码支付成功');
                return {
                    trade_status: 'TRADE_SUCCESS',
                    trade_no: 'TEST_' + outTradeNo + '_' + Date.now()
                };
            }
            
            // 否则返回等待支付状态
            return {
                trade_status: 'WAIT_BUYER_PAY',
                trade_no: null
            };
        }
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