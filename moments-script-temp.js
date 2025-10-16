// moments-script-temp.js - 简化版测试
console.log('开始加载朋友圈脚本...');

// 简化的朋友圈数据管理
class SimpleMomentsApp {
    constructor() {
        this.currentCategory = 'all';
        this.moments = [];
        this.isInitialized = false;
    }

    init() {
        console.log('初始化朋友圈应用...');
        this.bindEvents();
        this.loadMoments();
        this.isInitialized = true;
    }

    bindEvents() {
        console.log('绑定事件...');
        
        // 分类按钮事件
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('点击分类:', e.target.dataset.category);
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // 朋友圈容器点击事件
        const container = document.getElementById('momentsContainer');
        if (container) {
            container.addEventListener('click', (e) => {
                if (e.target.closest('.like-btn')) {
                    this.handleLike(e.target.closest('.like-btn'));
                }
                if (e.target.closest('.comment-btn')) {
                    this.showNotification('评论功能开发中', 'info');
                }
                if (e.target.closest('.share-btn')) {
                    this.handleShare();
                }
            });
        }

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchMoments(e.target.value);
            });
        }
    }

    async loadMoments() {
        console.log('加载朋友圈数据...');
        const container = document.getElementById('momentsContainer');
        
        if (!container) {
            console.error('找不到momentsContainer元素');
            return;
        }

        container.innerHTML = '<div class="loading-spinner">正在加载内容</div>';

        try {
            // 先尝试从LeanCloud获取数据
            if (typeof window.momentsData !== 'undefined') {
                console.log('使用LeanCloud数据...');
                this.moments = await window.momentsData.getAllMoments();
            } else {
                console.log('使用默认数据...');
                this.moments = this.getDefaultMoments();
            }
            
            this.renderMoments(this.moments);
            console.log('朋友圈数据加载完成:', this.moments.length, '条');
        } catch (error) {
            console.error('加载朋友圈失败:', error);
            this.moments = this.getDefaultMoments();
            this.renderMoments(this.moments);
        }
    }

    getDefaultMoments() {
        return [
            {
                id: '1',
                username: '狂客同学',
                avatar: 'images/avatar-default.jpg',
                content: '欢迎使用狂客·银河朋友圈！这里可以分享你的生活点滴。',
                images: [],
                category: '生活日常',
                timestamp: '刚刚',
                likes: 5,
                comments: 2,
                isLiked: false
            },
            {
                id: '2',
                username: '测试用户',
                avatar: 'images/avatar-default.jpg',
                content: '今天天气真好，适合出去走走！',
                images: ['https://via.placeholder.com/300x200/667eea/ffffff?text=示例图片'],
                category: '生活日常',
                timestamp: '5分钟前',
                likes: 3,
                comments: 1,
                isLiked: false
            }
        ];
    }

    renderMoments(moments) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        if (!moments || moments.length === 0) {
            container.innerHTML = '<div class="no-results">暂无内容</div>';
            return;
        }

        container.innerHTML = '';
        moments.forEach(moment => {
            const momentCard = this.createMomentCard(moment);
            container.appendChild(momentCard);
        });
    }

    createMomentCard(moment) {
        const card = document.createElement('div');
        card.className = 'moment-card';
        card.dataset.category = moment.category;
        card.dataset.id = moment.id;
        
        const imagesHtml = moment.images && moment.images.length > 0 ? `
            <div class="moment-images">
                ${moment.images.map((img, index) => `
                    <img src="${img}" alt="分享图片${index + 1}" style="max-width: 100%; border-radius: 8px;">
                `).join('')}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="moment-header">
                <div class="user-avatar">
                    <img src="${moment.avatar}" alt="${moment.username}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
                </div>
                <div class="user-info">
                    <h3 class="username" style="margin: 0; font-size: 16px;">${moment.username}</h3>
                    <span class="timestamp" style="color: #999; font-size: 12px;">${moment.timestamp}</span>
                </div>
                <div class="moment-actions">
                    <button class="moment-menu" style="background: none; border: none; cursor: pointer;">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            <div class="moment-content" style="padding: 0 16px 16px;">
                <p class="moment-text" style="margin: 8px 0;">${moment.content}</p>
                ${imagesHtml}
            </div>
            <div class="moment-footer" style="padding: 12px 16px; border-top: 1px solid #f0f0f0;">
                <div class="moment-stats" style="display: flex; gap: 24px;">
                    <button class="stat-btn like-btn ${moment.isLiked ? 'liked' : ''}" 
                            data-liked="${moment.isLiked}" 
                            data-id="${moment.id}"
                            style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #666;">
                        <i class="${moment.isLiked ? 'fas' : 'far'} fa-heart"></i>
                        <span class="like-count">${moment.likes || 0}</span>
                    </button>
                    <button class="stat-btn comment-btn" data-id="${moment.id}"
                            style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #666;">
                        <i class="far fa-comment"></i>
                        <span class="comment-count">${moment.comments || 0}</span>
                    </button>
                    <button class="stat-btn share-btn"
                            style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #666;">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    async filterByCategory(category) {
        console.log('筛选分类:', category);
        this.currentCategory = category;
        
        // 更新按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        const container = document.getElementById('momentsContainer');
        container.innerHTML = '<div class="loading-spinner">正在加载内容</div>';

        try {
            if (category === 'all') {
                this.renderMoments(this.moments);
            } else {
                const filtered = this.moments.filter(moment => moment.category === category);
                this.renderMoments(filtered);
            }
        } catch (error) {
            console.error('分类加载失败:', error);
            container.innerHTML = '<div class="no-results">加载失败，请刷新重试</div>';
        }
    }

    handleLike(btn) {
        const isLiked = btn.dataset.liked === 'true';
        const heartIcon = btn.querySelector('i');
        const countSpan = btn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent);

        if (isLiked) {
            btn.dataset.liked = 'false';
            heartIcon.className = 'far fa-heart';
            btn.classList.remove('liked');
            count--;
            this.showNotification('取消点赞');
        } else {
            btn.dataset.liked = 'true';
            heartIcon.className = 'fas fa-heart';
            btn.classList.add('liked');
            count++;
            this.showNotification('点赞成功');
        }
        
        countSpan.textContent = count;
    }

    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: '狂客·银河朋友圈',
                text: '看看我分享的内容',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('链接已复制到剪贴板');
        }
    }

    searchMoments(keyword) {
        if (!keyword.trim()) {
            this.renderMoments(this.moments);
            return;
        }

        const filtered = this.moments.filter(moment => 
            moment.content.toLowerCase().includes(keyword.toLowerCase()) ||
            moment.username.toLowerCase().includes(keyword.toLowerCase())
        );
        
        this.renderMoments(filtered);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 立即创建并暴露到全局
console.log('创建朋友圈应用实例...');
window.momentsApp = new SimpleMomentsApp();

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM加载完成，初始化应用...');
        window.momentsApp.init();
    });
} else {
    console.log('DOM已加载，立即初始化应用...');
    setTimeout(() => window.momentsApp.init(), 100);
}

console.log('朋友圈脚本加载完成');
