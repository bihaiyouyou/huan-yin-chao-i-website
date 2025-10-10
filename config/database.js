// 数据库配置
const mysql = require('mysql2/promise');

// 数据库连接配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // 请根据实际情况修改
    database: 'card_system',
    charset: 'utf8mb4',
    timezone: '+08:00'
};

// 创建数据库连接池
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试数据库连接
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        return false;
    }
}

// 执行SQL查询
async function query(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('数据库查询错误:', error);
        throw error;
    }
}

// 执行事务
async function transaction(callback) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};
