// 文件管理功能JavaScript

// 全局变量
let currentFiles = [];
let currentPage = 1;
let filesPerPage = 12;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('文件管理页面加载完成，开始初始化...');
    initializeFileManagement();
});

// 初始化文件管理
function initializeFileManagement() {
    console.log('开始初始化文件下载...');
    
    // 加载文件列表
    loadFiles();
    console.log('开始加载文件列表');
    
    // 设置搜索功能
    setupSearch();
    console.log('搜索功能设置完成');
}

// 上传功能已移除，只保留下载功能

// 加载文件列表（纯前端实现）
function loadFiles() {
    console.log('开始加载文件列表（纯前端模式）...');
    
    // 从浏览器本地存储加载文件列表
    const storedFiles = localStorage.getItem('fileList');
    if (storedFiles) {
        try {
            const files = JSON.parse(storedFiles);
            console.log('从本地存储加载文件:', files);
            currentFiles = files;
            displayFileGrid(files);
            return;
        } catch (error) {
            console.error('解析本地存储文件失败:', error);
        }
    }
    
    // 如果没有本地存储，显示默认文件列表
    console.log('使用默认文件列表...');
    displayMockFiles();
}

// 显示模拟文件数据（用于演示）
function displayMockFiles() {
    const mockFiles = [
        {
            id: 1,
            name: '产品介绍.pdf',
            size: 2048576,
            type: 'application/pdf',
            uploadDate: '2025-01-07',
            downloadCount: 15
        },
        {
            id: 2,
            name: '技术文档.docx',
            size: 1536000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadDate: '2025-01-06',
            downloadCount: 8
        },
        {
            id: 3,
            name: '演示视频.mp4',
            size: 52428800,
            type: 'video/mp4',
            uploadDate: '2025-01-05',
            downloadCount: 23
        },
        {
            id: 4,
            name: '图片素材.zip',
            size: 10485760,
            type: 'application/zip',
            uploadDate: '2025-01-04',
            downloadCount: 12
        }
    ];
    
    currentFiles = mockFiles;
    displayFileGrid(mockFiles);
}

// 显示文件网格
function displayFileGrid(files) {
    console.log('开始显示文件网格，文件数量:', files.length);
    const fileGrid = document.getElementById('fileGrid');
    
    if (!fileGrid) {
        console.error('找不到fileGrid元素');
        return;
    }
    
    fileGrid.innerHTML = '';
    
    const startIndex = (currentPage - 1) * filesPerPage;
    const endIndex = startIndex + filesPerPage;
    const pageFiles = files.slice(startIndex, endIndex);
    
    console.log('当前页文件数量:', pageFiles.length);
    
    pageFiles.forEach((file, index) => {
        console.log(`创建文件卡片 ${index + 1}:`, file.name);
        const fileCard = createFileCard(file);
        fileGrid.appendChild(fileCard);
    });
    
    // 更新分页
    updatePagination(files.length);
    console.log('文件网格显示完成');
}

// 创建文件卡片
function createFileCard(file) {
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card';
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    fileCard.innerHTML = `
        <div class="file-card-icon">${fileIcon}</div>
        <h4>${file.name}</h4>
        <p>大小: ${fileSize}</p>
        <p>上传时间: ${file.uploadDate}</p>
        <p>下载次数: ${file.downloadCount}</p>
        <div class="file-card-actions">
            <button class="file-card-btn" onclick="downloadFile(${file.id})">下载</button>
            <button class="file-card-btn delete" onclick="deleteFile(${file.id})">删除</button>
        </div>
    `;
    
    return fileCard;
}

// 下载文件（纯前端实现）
function downloadFile(fileId) {
    const file = currentFiles.find(f => f.id === fileId);
    if (!file) {
        showMessage('文件不存在', 'error');
        return;
    }
    
    // 纯前端下载实现
    if (file.downloadUrl) {
        // 如果有外部下载链接，直接下载
        const link = document.createElement('a');
        link.href = file.downloadUrl;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // 创建模拟下载（实际项目中需要真实的文件）
        const blob = new Blob(['这是一个模拟文件内容'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    showMessage(`开始下载: ${file.name}`, 'success');
}

// 删除文件
async function deleteFile(fileId) {
    if (confirm('确定要删除这个文件吗？')) {
        try {
            const response = await fetch(`http://localhost:3000/api/files/${fileId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showMessage('文件删除成功', 'success');
                loadFiles(); // 重新加载文件列表
            } else {
                throw new Error('删除失败');
            }
        } catch (error) {
            showMessage('删除失败: ' + error.message, 'error');
        }
    }
}

// 搜索文件
function searchFiles() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        displayFileGrid(currentFiles);
        return;
    }
    
    const filteredFiles = currentFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm)
    );
    
    displayFileGrid(filteredFiles);
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchFiles();
        }
    });
}

// 更新分页
function updatePagination(totalFiles) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalFiles / filesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 上一页按钮
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
    `;
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    // 下一页按钮
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// 切换页面
function changePage(page) {
    const totalPages = Math.ceil(currentFiles.length / filesPerPage);
    
    if (page < 1 || page > totalPages) {
        return;
    }
    
    currentPage = page;
    displayFileGrid(currentFiles);
}

// 标签切换功能已移除，只保留下载功能

// 工具函数
function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showMessage(message, type) {
    // 创建消息提示
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#28a745';
    } else if (type === 'error') {
        messageDiv.style.background = '#dc3545';
    } else {
        messageDiv.style.background = '#17a2b8';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}
