const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/database-sqlite');
const alipay = require('./config/alipay');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// 根路径路由 - 3000端口主页 (必须在静态文件服务之前)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-admin.html'));
});

app.use(express.static('.')); // 提供静态文件服务

// 管理页面路由
app.get('/files.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'files-admin.html'));
});

// 卡密管理页面路由
app.get('/card-admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'card-admin.html'));
});

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadDir);

// 文件存储配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/zip',
        'application/x-rar-compressed',
        'video/mp4',
        'video/avi',
        'video/mov',
        'audio/mp3',
        'audio/wav'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB限制
    }
});

// 文件信息存储（使用JSON文件持久化）
const databaseFile = path.join(__dirname, 'fileDatabase.json');
let fileDatabase = [];

// 加载数据库文件
const loadDatabase = () => {
    try {
        if (fs.existsSync(databaseFile)) {
            const data = fs.readFileSync(databaseFile, 'utf8');
            fileDatabase = JSON.parse(data);
            console.log(`📁 加载了 ${fileDatabase.length} 个文件记录`);
        } else {
            fileDatabase = [];
            console.log('📁 数据库文件不存在，创建空数据库');
        }
    } catch (error) {
        console.error('❌ 加载数据库失败:', error);
        fileDatabase = [];
    }
};

// 保存数据库文件
const saveDatabase = () => {
    try {
        fs.writeFileSync(databaseFile, JSON.stringify(fileDatabase, null, 2));
        console.log('💾 数据库已保存');
    } catch (error) {
        console.error('❌ 保存数据库失败:', error);
    }
};

// 初始化数据库
loadDatabase();

// 创建示例文件
function createSampleFiles() {
    const sampleFiles = [
        { id: 1, fileName: 'sample1.pdf', originalName: '产品介绍.pdf' },
        { id: 2, fileName: 'sample2.docx', originalName: '技术文档.docx' },
        { id: 3, fileName: 'sample3.mp4', originalName: '演示视频.mp4' },
        { id: 4, fileName: 'sample4.zip', originalName: '图片素材.zip' }
    ];
    
    sampleFiles.forEach(file => {
        const filePath = path.join(uploadDir, file.fileName);
        if (!fs.existsSync(filePath)) {
            // 创建示例文件内容
            const content = `这是示例文件: ${file.originalName}\n创建时间: ${new Date().toISOString()}`;
            fs.writeFileSync(filePath, content);
        }
    });
}

// 创建示例文件
createSampleFiles();

// API路由

// 获取文件列表
app.get('/api/files', (req, res) => {
    try {
        res.json(fileDatabase);
    } catch (error) {
        res.status(500).json({ error: '获取文件列表失败' });
    }
});

// 文件上传
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有文件上传' });
        }

        const newFile = {
            id: fileDatabase.length + 1,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            size: req.file.size,
            type: req.file.mimetype,
            uploadDate: new Date().toISOString().split('T')[0],
            downloadCount: 0
        };

        fileDatabase.push(newFile);
        
        res.json({
            message: '文件上传成功',
            file: newFile
        });
    } catch (error) {
        console.error('上传错误:', error);
        res.status(500).json({ error: '文件上传失败: ' + error.message });
    }
});

// 多文件上传
app.post('/api/upload-multiple', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: '没有文件上传' });
        }

        const uploadedFiles = [];
        
        req.files.forEach(file => {
            // 生成唯一ID，避免冲突
            const maxId = fileDatabase.length > 0 ? Math.max(...fileDatabase.map(f => f.id)) : 0;
            const newFile = {
                id: maxId + 1,
                originalName: file.originalname,
                fileName: file.filename,
                size: file.size,
                type: file.mimetype,
                uploadDate: new Date().toISOString().split('T')[0],
                downloadCount: 0
            };
            
            fileDatabase.push(newFile);
            uploadedFiles.push(newFile);
        });
        
        // 保存数据库
        saveDatabase();
        
        res.json({
            message: `成功上传 ${uploadedFiles.length} 个文件`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('批量上传错误:', error);
        res.status(500).json({ error: '批量上传失败: ' + error.message });
    }
});

// 文件下载
app.get('/api/download/:id', (req, res) => {
    try {
        const fileId = parseInt(req.params.id);
        const file = fileDatabase.find(f => f.id === fileId);
        
        if (!file) {
            return res.status(404).json({ error: '文件不存在' });
        }

        const filePath = path.join(uploadDir, file.fileName);
        
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: '文件不存在' });
        }

        // 更新下载次数
        file.downloadCount++;

        // 设置下载响应头
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
        res.setHeader('Content-Type', file.type);

        // 发送文件
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ error: '文件下载失败: ' + error.message });
    }
});

// 删除文件
app.delete('/api/files/:id', (req, res) => {
    try {
        const fileId = parseInt(req.params.id);
        const fileIndex = fileDatabase.findIndex(f => f.id === fileId);
        
        if (fileIndex === -1) {
            return res.status(404).json({ error: '文件不存在' });
        }

        const file = fileDatabase[fileIndex];
        const filePath = path.join(uploadDir, file.fileName);
        
        // 删除物理文件
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // 从数据库中删除
        fileDatabase.splice(fileIndex, 1);
        
        // 保存数据库
        saveDatabase();
        
        res.json({ message: '文件删除成功' });
    } catch (error) {
        res.status(500).json({ error: '文件删除失败: ' + error.message });
    }
});

// 搜索文件
app.get('/api/files/search', (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json(fileDatabase);
        }

        const filteredFiles = fileDatabase.filter(file => 
            file.originalName.toLowerCase().includes(q.toLowerCase())
        );
        
        res.json(filteredFiles);
    } catch (error) {
        res.status(500).json({ error: '搜索失败: ' + error.message });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制' });
        }
    }
    
    res.status(500).json({ error: error.message });
});

// ==================== 发卡系统API ====================

// 获取卡类型列表
app.get('/api/card-types', async (req, res) => {
    try {
        const cardTypes = await db.query('SELECT * FROM card_types WHERE is_active = 1 ORDER BY price ASC');
        res.json(cardTypes);
    } catch (error) {
        console.error('获取卡类型失败:', error);
        res.status(500).json({ error: '获取卡类型失败' });
    }
});

// 创建订单
app.post('/api/orders', async (req, res) => {
    try {
        const { cardTypeId, userId } = req.body;
        
        if (!cardTypeId) {
            return res.status(400).json({ error: '卡类型ID不能为空' });
        }
        
        // 获取卡类型信息
        const cardTypes = await db.query('SELECT * FROM card_types WHERE id = ? AND is_active = 1', [cardTypeId]);
        if (cardTypes.length === 0) {
            return res.status(400).json({ error: '卡类型不存在或已停用' });
        }
        
        const cardType = cardTypes[0];
        
        // 生成订单号
        const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // 创建订单
        const result = await db.run(
            'INSERT INTO orders (order_no, user_id, card_type_id, amount) VALUES (?, ?, ?, ?)',
            [orderNo, userId || 'anonymous', cardTypeId, cardType.price]
        );
        
        res.json({
            orderId: result.lastID,
            orderNo: orderNo,
            amount: cardType.price,
            cardType: cardType
        });
    } catch (error) {
        console.error('创建订单失败:', error);
        res.status(500).json({ error: '创建订单失败' });
    }
});

// 创建支付订单
app.post('/api/payment/create', async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({ error: '订单ID不能为空' });
        }
        
        // 获取订单信息
        const orders = await db.query(`
            SELECT o.*, ct.name as card_type_name, ct.duration_days 
            FROM orders o 
            JOIN card_types ct ON o.card_type_id = ct.id 
            WHERE o.id = ?
        `, [orderId]);
        
        if (orders.length === 0) {
            return res.status(400).json({ error: '订单不存在' });
        }
        
        const order = orders[0];
        
        if (order.status !== 'pending') {
            return res.status(400).json({ error: '订单状态异常' });
        }
        
        // 调用支付宝API创建支付订单
        const alipayOrder = await alipay.createOrder({
            out_trade_no: order.order_no,
            total_amount: order.amount.toString(),
            subject: `${order.card_type_name} - 虚拟机器人服务卡`,
            body: `购买${order.card_type_name}，有效期${order.duration_days}天`
        });
        
        res.json({
            orderId: orderId,
            qrCode: alipayOrder.qr_code,
            status: 'pending'
        });
    } catch (error) {
        console.error('创建支付订单失败:', error);
        res.status(500).json({ error: '创建支付订单失败' });
    }
});

// 查询支付状态
app.get('/api/payment/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const orders = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) {
            return res.status(404).json({ error: '订单不存在' });
        }
        
        const order = orders[0];
        
        // 如果订单已支付，直接返回成功状态
        if (order.status === 'paid') {
            return res.json({ status: 'TRADE_SUCCESS' });
        }
        
        // 查询支付宝订单状态
        const alipayStatus = await alipay.queryOrder(order.order_no);
        
        if (alipayStatus.trade_status === 'TRADE_SUCCESS') {
            // 更新订单状态
            await db.query(
                'UPDATE orders SET status = "paid", alipay_trade_no = ?, paid_at = datetime("now") WHERE id = ?',
                [alipayStatus.trade_no, orderId]
            );
            
            // 发放卡密
            await issueCardCode(order.order_no);
        }
        
        res.json({ status: alipayStatus.trade_status || 'WAIT_BUYER_PAY' });
    } catch (error) {
        console.error('查询支付状态失败:', error);
        res.status(500).json({ error: '查询支付状态失败' });
    }
});

// 支付回调处理
app.post('/api/payment/callback', async (req, res) => {
    try {
        console.log('收到支付回调:', req.body);
        
        // 验证支付宝签名
        if (!alipay.verifyCallback(req.body)) {
            console.error('支付回调签名验证失败');
            return res.status(400).send('fail');
        }
        
        const { out_trade_no, trade_status, trade_no } = req.body;
        
        if (trade_status === 'TRADE_SUCCESS') {
            // 更新订单状态
            await db.query(
                'UPDATE orders SET status = "paid", alipay_trade_no = ?, paid_at = datetime("now") WHERE order_no = ?',
                [trade_no, out_trade_no]
            );
            
            // 发放卡密
            await issueCardCode(out_trade_no);
            
            console.log('支付成功，卡密已发放');
        }
        
        res.send('success');
    } catch (error) {
        console.error('支付回调处理失败:', error);
        res.status(500).send('fail');
    }
});

// 获取订单信息
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const orders = await db.query(`
            SELECT o.*, ct.name as card_type_name, ct.duration_days,
                   up.card_code
            FROM orders o 
            JOIN card_types ct ON o.card_type_id = ct.id 
            LEFT JOIN user_purchases up ON o.id = up.order_id
            WHERE o.id = ?
        `, [orderId]);
        
        if (orders.length === 0) {
            return res.status(404).json({ error: '订单不存在' });
        }
        
        res.json(orders[0]);
    } catch (error) {
        console.error('获取订单信息失败:', error);
        res.status(500).json({ error: '获取订单信息失败' });
    }
});

// 获取订单卡密
app.get('/api/orders/:orderId/card-code', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const purchases = await db.query(`
            SELECT up.card_code, o.status
            FROM user_purchases up
            JOIN orders o ON up.order_id = o.id
            WHERE o.id = ?
        `, [orderId]);
        
        if (purchases.length === 0) {
            return res.status(404).json({ error: '卡密不存在' });
        }
        
        res.json(purchases[0]);
    } catch (error) {
        console.error('获取卡密失败:', error);
        res.status(500).json({ error: '获取卡密失败' });
    }
});

// 发放卡密
async function issueCardCode(orderNo) {
    try {
        // 获取订单信息
        const orders = await db.query(`
            SELECT o.*, ct.name as card_type_name, ct.duration_days 
            FROM orders o 
            JOIN card_types ct ON o.card_type_id = ct.id 
            WHERE o.order_no = ?
        `, [orderNo]);
        
        if (orders.length === 0) {
            throw new Error('订单不存在');
        }
        
        const order = orders[0];
        
        if (order.status !== 'paid') {
            throw new Error('订单未支付');
        }
        
        // 获取一个未使用的卡密
        const cardCodes = await db.query(`
            SELECT * FROM card_codes 
            WHERE card_type_id = ? AND status = 'unused' 
            LIMIT 1
        `, [order.card_type_id]);
        
        if (cardCodes.length === 0) {
            throw new Error('该类型卡密已售罄');
        }
        
        const cardCode = cardCodes[0];
        
        // 更新卡密状态
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + order.duration_days);
        
        await db.query(
            'UPDATE card_codes SET status = "used", used_by = ?, used_at = datetime("now"), expires_at = ? WHERE id = ?',
            [order.user_id, expiresAt, cardCode.id]
        );
        
        // 记录用户购买
        await db.query(
            'INSERT INTO user_purchases (user_id, order_id, card_code) VALUES (?, ?, ?)',
            [order.user_id, order.id, cardCode.code]
        );
        
        console.log(`卡密发放成功: ${cardCode.code}`);
        return cardCode.code;
    } catch (error) {
        console.error('发放卡密失败:', error);
        throw error;
    }
}

// 初始化数据库并启动服务器
async function startServer() {
    try {
        // 初始化数据库
        console.log('🔧 初始化数据库...');
        await db.init();
        
        // 启动服务器
        app.listen(PORT, () => {
            console.log(`🚀 文件管理服务器运行在端口 ${PORT}`);
            console.log(`📁 上传目录: ${uploadDir}`);
            console.log(`🌐 访问地址: http://localhost:${PORT}`);
            console.log(`📋 API文档:`);
            console.log(`   GET  /api/files - 获取文件列表`);
            console.log(`   POST /api/upload - 上传文件`);
            console.log(`   GET  /api/download/:id - 下载文件`);
            console.log(`   DELETE /api/files/:id - 删除文件`);
            console.log(`   GET  /api/files/search?q=关键词 - 搜索文件`);
            console.log(`📋 发卡系统API:`);
            console.log(`   GET  /api/card-types - 获取卡类型列表`);
            console.log(`   POST /api/orders - 创建订单`);
            console.log(`   POST /api/payment/create - 创建支付订单`);
            console.log(`   GET  /api/payment/status/:orderId - 查询支付状态`);
            console.log(`   POST /api/payment/callback - 支付回调`);
            console.log(`   GET  /api/orders/:orderId - 获取订单信息`);
            console.log(`   GET  /api/orders/:orderId/card-code - 获取订单卡密`);
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

// ==================== 管理员API ====================

// 获取统计信息
app.get('/api/admin/statistics', async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                ct.id,
                ct.name,
                COUNT(cc.id) as total,
                COUNT(CASE WHEN cc.status = 'unused' THEN 1 END) as unused
            FROM card_types ct
            LEFT JOIN card_codes cc ON ct.id = cc.card_type_id
            GROUP BY ct.id, ct.name
        `);
        
        const result = {};
        stats.forEach(stat => {
            if (stat.name === '日卡') result.daily = stat.unused;
            else if (stat.name === '月卡') result.monthly = stat.unused;
            else if (stat.name === '季卡') result.quarterly = stat.unused;
            else if (stat.name === '年卡') result.yearly = stat.unused;
        });
        
        res.json(result);
    } catch (error) {
        console.error('获取统计信息失败:', error);
        res.status(500).json({ error: '获取统计信息失败' });
    }
});

// 获取卡密列表
app.get('/api/admin/card-codes', async (req, res) => {
    try {
        const { type, status } = req.query;
        
        let sql = `
            SELECT cc.*, ct.name as card_type_name
            FROM card_codes cc
            JOIN card_types ct ON cc.card_type_id = ct.id
            WHERE 1=1
        `;
        const params = [];
        
        if (type) {
            sql += ' AND cc.card_type_id = ?';
            params.push(type);
        }
        
        if (status) {
            sql += ' AND cc.status = ?';
            params.push(status);
        }
        
        sql += ' ORDER BY cc.created_at DESC LIMIT 100';
        
        const codes = await db.query(sql, params);
        res.json({ codes });
    } catch (error) {
        console.error('获取卡密列表失败:', error);
        res.status(500).json({ error: '获取卡密列表失败' });
    }
});

// 批量上传卡密
app.post('/api/admin/card-codes', async (req, res) => {
    try {
        const { cardTypeId, cardCodes } = req.body;
        
        if (!cardTypeId || !cardCodes || !Array.isArray(cardCodes)) {
            return res.status(400).json({ error: '参数错误' });
        }
        
        // 验证卡类型是否存在
        const cardTypes = await db.query('SELECT * FROM card_types WHERE id = ?', [cardTypeId]);
        if (cardTypes.length === 0) {
            return res.status(400).json({ error: '卡类型不存在' });
        }
        
        // 插入卡密
        let successCount = 0;
        for (const code of cardCodes) {
            if (code && code.trim()) {
                try {
                    await db.run(
                        'INSERT INTO card_codes (card_type_id, code, status) VALUES (?, ?, ?)',
                        [cardTypeId, code.trim(), 'unused']
                    );
                    successCount++;
                } catch (err) {
                    console.error('插入卡密失败:', code, err);
                }
            }
        }
        
        res.json({ 
            success: true, 
            count: successCount,
            total: cardCodes.length 
        });
    } catch (error) {
        console.error('上传卡密失败:', error);
        res.status(500).json({ error: '上传卡密失败' });
    }
});

// 删除卡密
app.delete('/api/admin/card-codes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.run('DELETE FROM card_codes WHERE id = ? AND status = "unused"', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: '卡密不存在或已被使用' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('删除卡密失败:', error);
        res.status(500).json({ error: '删除卡密失败' });
    }
});

// 启动服务器
startServer();

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('🛑 服务器正在关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 服务器正在关闭...');
    process.exit(0);
});
