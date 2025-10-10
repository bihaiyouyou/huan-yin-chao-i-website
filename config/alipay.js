// 支付宝配置
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default;

// 支付宝配置（请替换为实际的配置信息）
const alipayConfig = {
    appId: 'your_app_id', // 支付宝应用ID
    privateKey: `-----BEGIN PRIVATE KEY-----
your_private_key_here
-----END PRIVATE KEY-----`, // 应用私钥
    alipayPublicKey: `-----BEGIN PUBLIC KEY-----
your_alipay_public_key_here
-----END PUBLIC KEY-----`, // 支付宝公钥
    gateway: 'https://openapi.alipay.com/gateway.do', // 正式环境
    // gateway: 'https://openapi.alipaydev.com/gateway.do', // 沙箱环境
    signType: 'RSA2',
    charset: 'utf-8',
    version: '1.0',
    timeout: 5000
};

// 创建支付宝SDK实例
const alipaySdk = new AlipaySdk(alipayConfig);

// 创建支付订单
async function createOrder(orderData) {
    try {
        const formData = new AlipayFormData();
        formData.setMethod('get');
        
        // 设置支付参数
        formData.addField('bizContent', {
            outTradeNo: orderData.out_trade_no,
            totalAmount: orderData.total_amount,
            subject: orderData.subject,
            body: orderData.body,
            productCode: 'FACE_TO_FACE_PAYMENT', // 当面付产品码
            timeoutExpress: '10m' // 订单超时时间
        });
        
        formData.addField('notifyUrl', 'https://your-domain.com/api/payment/callback'); // 支付回调地址
        
        // 调用支付宝API
        const result = await alipaySdk.exec(
            'alipay.trade.precreate', // 预创建订单接口
            {},
            { formData: formData }
        );
        
        return result;
    } catch (error) {
        console.error('创建支付订单失败:', error);
        throw error;
    }
}

// 查询订单状态
async function queryOrder(outTradeNo) {
    try {
        const formData = new AlipayFormData();
        formData.setMethod('get');
        
        formData.addField('bizContent', {
            outTradeNo: outTradeNo
        });
        
        const result = await alipaySdk.exec(
            'alipay.trade.query',
            {},
            { formData: formData }
        );
        
        return result;
    } catch (error) {
        console.error('查询订单状态失败:', error);
        throw error;
    }
}

// 验证回调签名
function verifyCallback(params) {
    try {
        return alipaySdk.checkNotifySign(params);
    } catch (error) {
        console.error('验证回调签名失败:', error);
        return false;
    }
}

// 生成二维码数据
function generateQRCodeData(qrCode) {
    return `alipays://platformapi/startapp?saId=10000007&qrcode=${encodeURIComponent(qrCode)}`;
}

module.exports = {
    alipaySdk,
    createOrder,
    queryOrder,
    verifyCallback,
    generateQRCodeData
};
