const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 提供静态文件服务

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

// 文件信息存储（实际项目中应使用数据库）
let fileDatabase = [];

// 初始化一些示例文件
const initSampleFiles = () => {
    fileDatabase = [
        {
            id: 1,
            originalName: '产品介绍.pdf',
            fileName: 'sample1.pdf',
            size: 2048576,
            type: 'application/pdf',
            uploadDate: '2025-01-07',
            downloadCount: 15
        },
        {
            id: 2,
            originalName: '技术文档.docx',
            fileName: 'sample2.docx',
            size: 1536000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadDate: '2025-01-06',
            downloadCount: 8
        },
        {
            id: 3,
            originalName: '演示视频.mp4',
            fileName: 'sample3.mp4',
            size: 52428800,
            type: 'video/mp4',
            uploadDate: '2025-01-05',
            downloadCount: 23
        },
        {
            id: 4,
            originalName: '图片素材.zip',
            fileName: 'sample4.zip',
            size: 10485760,
            type: 'application/zip',
            uploadDate: '2025-01-04',
            downloadCount: 12
        }
    ];
};

// 初始化示例数据
initSampleFiles();

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
            const newFile = {
                id: fileDatabase.length + 1,
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
        
        res.json({ message: '文件删除成功' });
    } catch (error) {
        res.status(500).json({ error: '文件删除失败: ' + error.message });
    }
});

// 批量上传文件
app.post('/api/upload-multiple', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: '没有文件上传' });
        }

        const uploadedFiles = [];
        
        req.files.forEach(file => {
            const newFile = {
                id: fileDatabase.length + 1,
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
        
        res.json({
            message: `成功上传 ${uploadedFiles.length} 个文件`,
            files: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ error: '批量上传失败: ' + error.message });
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
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('🛑 服务器正在关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 服务器正在关闭...');
    process.exit(0);
});
