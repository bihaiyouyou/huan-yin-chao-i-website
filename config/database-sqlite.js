// SQLite数据库配置
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.join(__dirname, '..', 'card_system.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
    } else {
        console.log('✅ SQLite数据库连接成功');
    }
});

// 初始化数据库表
function initDatabase() {
    return new Promise((resolve, reject) => {
        // 创建卡类型表
        db.run(`
            CREATE TABLE IF NOT EXISTS card_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) NOT NULL,
                duration_days INTEGER NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('创建card_types表失败:', err);
                reject(err);
                return;
            }
            console.log('✅ card_types表创建成功');
        });

        // 创建卡密表
        db.run(`
            CREATE TABLE IF NOT EXISTS card_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                card_type_id INTEGER NOT NULL,
                code VARCHAR(50) UNIQUE NOT NULL,
                status VARCHAR(20) DEFAULT 'unused',
                used_by VARCHAR(100),
                used_at DATETIME,
                expires_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (card_type_id) REFERENCES card_types(id)
            )
        `, (err) => {
            if (err) {
                console.error('创建card_codes表失败:', err);
                reject(err);
                return;
            }
            console.log('✅ card_codes表创建成功');
        });

        // 创建订单表
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_no VARCHAR(50) UNIQUE NOT NULL,
                user_id VARCHAR(100),
                card_type_id INTEGER NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                payment_method VARCHAR(50),
                alipay_trade_no VARCHAR(100),
                paid_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (card_type_id) REFERENCES card_types(id)
            )
        `, (err) => {
            if (err) {
                console.error('创建orders表失败:', err);
                reject(err);
                return;
            }
            console.log('✅ orders表创建成功');
        });

        // 创建用户购买记录表
        db.run(`
            CREATE TABLE IF NOT EXISTS user_purchases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(100) NOT NULL,
                order_id INTEGER NOT NULL,
                card_code VARCHAR(50) NOT NULL,
                purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        `, (err) => {
            if (err) {
                console.error('创建user_purchases表失败:', err);
                reject(err);
                return;
            }
            console.log('✅ user_purchases表创建成功');
            resolve();
        });
    });
}

// 插入初始数据
function insertInitialData() {
    return new Promise((resolve, reject) => {
        // 插入卡类型数据
        const cardTypes = [
            ['日卡', 1, 5.00, '基础功能，有效期1天'],
            ['月卡', 30, 30.00, '全功能，有效期30天'],
            ['季卡', 90, 80.00, '全功能+优先支持，有效期90天'],
            ['年卡', 365, 300.00, '全功能+VIP支持，有效期365天']
        ];

        // 检查是否已有数据，如果没有才插入
        db.get('SELECT COUNT(*) as count FROM card_types', (err, row) => {
            if (err) {
                console.error('检查card_types数据失败:', err);
                return;
            }
            
            if (row.count === 0) {
                console.log('📝 插入初始卡类型数据...');
                const insertCardTypes = db.prepare(`
                    INSERT INTO card_types (name, duration_days, price, description) 
                    VALUES (?, ?, ?, ?)
                `);
                
                cardTypes.forEach(cardType => {
                    insertCardTypes.run(cardType, (err) => {
                        if (err) {
                            console.error('插入卡类型失败:', err);
                        }
                    });
                });
                
                insertCardTypes.finalize();
                console.log('✅ 初始卡类型数据插入完成');
            } else {
                console.log('📋 card_types表已有数据，跳过初始化');
            }
        });

        // 插入测试卡密数据
        const cardCodes = [];
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 5; j++) {
                const code = `CARD${i}${j.toString().padStart(3, '0')}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
                cardCodes.push([i, code]);
            }
        }

        const insertCardCodes = db.prepare(`
            INSERT OR IGNORE INTO card_codes (card_type_id, code) 
            VALUES (?, ?)
        `);

        cardCodes.forEach(cardCode => {
            insertCardCodes.run(cardCode, (err) => {
                if (err) {
                    console.error('插入卡密失败:', err);
                }
            });
        });

        insertCardCodes.finalize();

        console.log('✅ 初始数据插入完成');
        resolve();
    });
}

// 执行SQL查询
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('数据库查询错误:', err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 执行SQL更新
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('数据库更新错误:', err);
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// 测试数据库连接
async function testConnection() {
    try {
        await query('SELECT 1 as test');
        console.log('✅ SQLite数据库连接测试成功');
        return true;
    } catch (error) {
        console.error('❌ SQLite数据库连接测试失败:', error.message);
        return false;
    }
}

// 初始化完整数据库
async function init() {
    try {
        await initDatabase();
        await insertInitialData();
        console.log('✅ 数据库初始化完成');
        return true;
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        return false;
    }
}

module.exports = {
    db,
    query,
    run,
    testConnection,
    init
};
