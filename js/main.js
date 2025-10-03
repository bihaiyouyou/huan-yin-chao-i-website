// 主要JavaScript功能

// 标签切换功能
function showTab(index) {
    // 隐藏所有标签内容
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    
    // 移除所有按钮的活动状态
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.style.background = '#333';
        button.classList.remove('active');
    });
    
    // 显示选中的标签内容
    const targetTab = document.getElementById(`tab-${index}`);
    if (targetTab) {
        targetTab.style.display = 'block';
        targetTab.classList.add('active');
    }
    
    // 激活选中的按钮
    if (buttons[index]) {
        buttons[index].style.background = '#ff6537';
        buttons[index].classList.add('active');
    }
}

// 平滑滚动功能
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// 导航栏高亮
function updateNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPage) {
            item.classList.add('itemSelected');
        } else {
            item.classList.remove('itemSelected');
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // 为视频播放按钮添加点击事件
    const playButton = document.querySelector('.video-play a');
    if (playButton) {
        playButton.addEventListener('click', function(e) {
            // 在新窗口打开视频
            window.open(this.href, '_blank');
            e.preventDefault();
        });
    }
    
    // 添加页面滚动效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('.fullmeasure-section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrolled >= sectionTop - window.innerHeight / 2 && 
                scrolled < sectionTop + sectionHeight) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
});

// 响应式菜单切换
function toggleMobileMenu() {
    const nav = document.querySelector('.itemContainer');
    nav.classList.toggle('mobile-active');
}

// 图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 初始化懒加载
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}