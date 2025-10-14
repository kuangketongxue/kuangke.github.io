// ============================================
// AI前沿资讯管理系统
// ============================================

let aiNews = []; // 全局资讯数组

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    await loadAINewsFromJSON();
    setupCategoryFilters();
    setupSearch();
    setupThemeToggle();
    setupLoadMore();
});

// ============================================
// 从JSON文件加载AI资讯
// ============================================
async function loadAINewsFromJSON() {
    try {
        const response = await fetch('data/ai-news.json');
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        aiNews = data;
        
        // 更新统计数据
        updateStatistics();
        
        // 渲染资讯卡片
        renderAICards(aiNews);
        
        // 更新时间显示
        updateLastUpdateTime();
        
        // 显示成功提示
        showUpdateStatus('success', `✅ 已加载 ${aiNews.length} 条最新资讯`);
        
        console.log(`成功加载 ${aiNews.length} 条AI资讯`);
        
    } catch (error) {
        console.error('加载AI资讯失败:', error);
        
        // 使用默认数据作为后备方案
        aiNews = getDefaultNews();
        renderAICards(aiNews);
        updateStatistics();
        
        showUpdateStatus('error', '⚠️ 使用缓存数据，请检查网络连接');
    }
}

// ============================================
// 更新统计数据
// ============================================
function updateStatistics() {
    // 更新资讯总数
    const statNumber = document.querySelector('.ai-stat-number');
    if (statNumber) {
        statNumber.textContent = aiNews.length;
    }
    
    // 统计不同分类
    const categories = [...new Set(aiNews.map(item => item.category))];
    const categoryCountElement = document.querySelectorAll('.ai-stat-number')[1];
    if (categoryCountElement) {
        categoryCountElement.textContent = categories.length;
    }
    
    // 统计不同来源
    const sources = [...new Set(aiNews.map(item => item.source))];
    const sourceCountElement = document.querySelectorAll('.ai-stat-number')[2];
    if (sourceCountElement) {
        sourceCountElement.textContent = sources.length;
    }
}

// ============================================
// 显示更新状态提示
// ============================================
function showUpdateStatus(type, message) {
    const statusDiv = document.getElementById('updateStatus');
    if (statusDiv) {
        statusDiv.className = `update-status update-${type}`;
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                statusDiv.style.display = 'none';
                statusDiv.style.opacity = '1';
            }, 300);
        }, 3000);
    }
}

// ============================================
// 获取默认新闻数据（后备方案）
// ============================================
function getDefaultNews() {
    return [
        {
            id: 1,
            title: "AI技术持续演进中",
            description: "人工智能领域保持快速发展态势，各大科技公司持续投入研发...",
            category: "行业动态",
            date: new Date().toISOString().split('T')[0],
            source: "AI Weekly",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500"
        },
        {
            id: 2,
            title: "本地数据加载中",
            description: "正在尝试连接服务器获取最新AI资讯，请稍候...",
            category: "系统消息",
            date: new Date().toISOString().split('T')[0],
            source: "系统",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500"
        }
    ];
}

// ============================================
// 渲染AI资讯卡片
// ============================================
function renderAICards(news) {
    const grid = document.getElementById('aiGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    news.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ai-card';
        card.dataset.category = item.category;
        
        card.innerHTML = `
            <div class="ai-card-image" style="background-image: url('${item.image}')">
                <div class="ai-card-badge">${item.category}</div>
            </div>
            <div class="ai-card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="ai-card-meta">
                    <div class="ai-card-source">
                        <i class="fas fa-newspaper"></i>
                        ${item.source}
                    </div>
                    <div class="ai-card-date">
                        <i class="far fa-calendar"></i>
                        ${formatDate(item.date)}
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ============================================
// 设置分类筛选功能
// ============================================
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.ai-category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // 添加active类到当前按钮
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterAICards(category);
        });
    });
}

// ============================================
// 筛选AI卡片
// ============================================
function filterAICards(category) {
    const allCards = document.querySelectorAll('.ai-card');
    
    allCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// 设置搜索功能
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.ai-card');
        
        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ============================================
// 设置主题切换
// ============================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    
    // 检查本地存储的主题偏好
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// ============================================
// 设置加载更多功能
// ============================================
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', async function() {
        const button = this;
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在刷新...';
        button.disabled = true;
        
        // 重新加载数据
        await loadAINewsFromJSON();
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            showUpdateStatus('success', '✅ 内容已刷新');
        }, 500);
    });
}

// ============================================
// 格式化日期
// ============================================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

// ============================================
// 更新最后更新时间
// ============================================
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (!lastUpdateElement) return;
    
    const now = new Date();
    const updateTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    lastUpdateElement.textContent = `最后更新: ${updateTime}`;
}

// ============================================
// 定时自动刷新（可选）
// ============================================
// 每30分钟自动刷新一次数据
setInterval(async () => {
    console.log('执行定时刷新...');
    await loadAINewsFromJSON();
}, 30 * 60 * 1000);

// 添加淡入动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
