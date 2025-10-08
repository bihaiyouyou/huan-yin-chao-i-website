// 文件下载页面专用JavaScript (8000端口)
let currentFiles = [];
let currentPage = 1;
const filesPerPage = 12;

document.addEventListener('DOMContentLoaded', function() {
    console.log('文件下载页面加载完成，开始初始化...');
    initializeFileDownload();
});

// 初始化文件下载
function initializeFileDownload() {
    console.log('开始初始化文件下载...');
    
    // 加载文件列表
    loadFiles();
    console.log('开始加载文件列表');
    
    // 设置搜索功能
    setupSearch();
    console.log('搜索功能设置完成');
}

// 加载文件列表
async function loadFiles() {
    console.log('开始加载文件列表...');
    try {
        // 8000端口使用绝对路径连接到3000端口API
        const apiUrl = 'http://localhost:3000/api/files';
        
        console.log('发送请求到:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('收到响应:', response.status, response.statusText);
        
        if (response.ok) {
            const files = await response.json();
            console.log('文件列表数据:', files);
            currentFiles = files;
            displayFileGrid(files);
            console.log('文件列表显示完成');
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('加载文件列表失败:', error);
        showMessage('加载文件列表失败: ' + error.message, 'error');
        // 显示模拟数据
        console.log('使用模拟数据...');
        displayMockFiles();
    }
}

// 显示模拟文件数据（用于演示）
function displayMockFiles() {
    const mockFiles = [
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
    
    currentFiles = mockFiles;
    displayFileGrid(mockFiles);
}

// 显示文件网格
function displayFileGrid(files) {
    const fileGrid = document.getElementById('fileGrid');
    if (!fileGrid) return;
    
    fileGrid.innerHTML = '';
    
    const startIndex = (currentPage - 1) * filesPerPage;
    const endIndex = startIndex + filesPerPage;
    const pageFiles = files.slice(startIndex, endIndex);
    
    pageFiles.forEach(file => {
        const fileCard = createFileCard(file);
        fileGrid.appendChild(fileCard);
    });
    
    updatePagination(files.length);
}

// 创建文件卡片 (仅下载功能)
function createFileCard(file) {
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card';
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    fileCard.innerHTML = `
        <div class="file-card-icon">${fileIcon}</div>
        <h4>${file.originalName || file.name}</h4>
        <p>大小: ${fileSize}</p>
        <p>上传时间: ${file.uploadDate}</p>
        <p>下载次数: ${file.downloadCount}</p>
        <div class="file-card-actions">
            <button class="file-card-btn" onclick="downloadFile(${file.id})">下载</button>
        </div>
    `;
    
    return fileCard;
}

// 下载文件
async function downloadFile(fileId) {
    try {
        console.log('开始下载文件:', fileId);
        
        // 8000端口使用绝对路径连接到3000端口API
        const downloadUrl = `http://localhost:3000/api/download/${fileId}`;
        
        console.log('下载URL:', downloadUrl);
        const response = await fetch(downloadUrl);
        console.log('下载响应:', response.status, response.statusText);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'file';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showMessage('文件下载开始', 'success');
        } else {
            throw new Error(`下载失败: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('下载文件失败:', error);
        showMessage('下载失败: ' + error.message, 'error');
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
        (file.originalName || file.name).toLowerCase().includes(searchTerm)
    );
    
    displayFileGrid(filteredFiles);
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFiles();
            }
        });
    }
}

// 更新分页
function updatePagination(totalFiles) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(totalFiles / filesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 上一页按钮
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">上一页</button>`;
    }
    
    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }
    
    // 下一页按钮
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">下一页</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// 切换页面
function changePage(page) {
    currentPage = page;
    displayFileGrid(currentFiles);
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // 添加样式
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#28a745';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#ffc107';
            messageDiv.style.color = '#000';
            break;
        default:
            messageDiv.style.backgroundColor = '#17a2b8';
    }
    
    // 添加到页面
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 获取文件图标
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) {
        return '🖼️';
    } else if (fileType.startsWith('video/')) {
        return '🎥';
    } else if (fileType.startsWith('audio/')) {
        return '🎵';
    } else if (fileType.includes('pdf')) {
        return '📄';
    } else if (fileType.includes('word') || fileType.includes('document')) {
        return '📝';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
        return '📊';
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
        return '📽️';
    } else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) {
        return '📦';
    } else if (fileType.includes('text')) {
        return '📃';
    } else {
        return '📄';
    }
}
