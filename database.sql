-- 自动发卡系统数据库结构
-- 创建数据库
CREATE DATABASE IF NOT EXISTS card_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE card_system;

-- 卡类型表
CREATE TABLE card_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '卡类型名称',
    duration_days INT NOT NULL COMMENT '有效天数',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    description TEXT COMMENT '描述',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='卡类型表';

-- 卡密表
CREATE TABLE card_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_type_id INT NOT NULL COMMENT '卡类型ID',
    code VARCHAR(50) UNIQUE NOT NULL COMMENT '卡密',
    status ENUM('unused', 'used', 'expired') DEFAULT 'unused' COMMENT '状态',
    used_by VARCHAR(100) COMMENT '使用者',
    used_at TIMESTAMP NULL COMMENT '使用时间',
    expires_at TIMESTAMP NULL COMMENT '过期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_type_id) REFERENCES card_types(id) ON DELETE CASCADE
) COMMENT='卡密表';

-- 订单表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
    user_id VARCHAR(100) COMMENT '用户ID',
    card_type_id INT NOT NULL COMMENT '卡类型ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending' COMMENT '订单状态',
    payment_method VARCHAR(50) COMMENT '支付方式',
    alipay_trade_no VARCHAR(100) COMMENT '支付宝交易号',
    paid_at TIMESTAMP NULL COMMENT '支付时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_type_id) REFERENCES card_types(id) ON DELETE CASCADE
) COMMENT='订单表';

-- 用户购买记录表
CREATE TABLE user_purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL COMMENT '用户ID',
    order_id INT NOT NULL COMMENT '订单ID',
    card_code VARCHAR(50) NOT NULL COMMENT '发放的卡密',
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) COMMENT='用户购买记录表';

-- 插入初始卡类型数据
INSERT INTO card_types (name, duration_days, price, description) VALUES
('日卡', 1, 5.00, '基础功能，有效期1天'),
('月卡', 30, 30.00, '全功能，有效期30天'),
('季卡', 90, 80.00, '全功能+优先支持，有效期90天'),
('年卡', 365, 300.00, '全功能+VIP支持，有效期365天');

-- 插入测试卡密数据
INSERT INTO card_codes (card_type_id, code) VALUES
-- 日卡
(1, 'DAY001-ABC123-XYZ789'),
(1, 'DAY002-DEF456-UVW012'),
(1, 'DAY003-GHI789-RST345'),
(1, 'DAY004-JKL012-MNO678'),
(1, 'DAY005-PQR345-TUV901'),

-- 月卡
(2, 'MON001-ABC123-XYZ789'),
(2, 'MON002-DEF456-UVW012'),
(2, 'MON003-GHI789-RST345'),
(2, 'MON004-JKL012-MNO678'),
(2, 'MON005-PQR345-TUV901'),

-- 季卡
(3, 'QUA001-ABC123-XYZ789'),
(3, 'QUA002-DEF456-UVW012'),
(3, 'QUA003-GHI789-RST345'),
(3, 'QUA004-JKL012-MNO678'),
(3, 'QUA005-PQR345-TUV901'),

-- 年卡
(4, 'YEA001-ABC123-XYZ789'),
(4, 'YEA002-DEF456-UVW012'),
(4, 'YEA003-GHI789-RST345'),
(4, 'YEA004-JKL012-MNO678'),
(4, 'YEA005-PQR345-TUV901');
