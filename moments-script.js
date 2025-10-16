// moments-script.js - 朋友圈主要功能
class MomentsApp {
    constructor() {
        this.currentCategory = 'all';
        this.moments = [];
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadMoments();
    }

    // 绑定事件
    bindEvents() {
        // 分类按钮事件
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // 点赞按钮事件（使用事件委托）
        document.getElementById('momentsContainer').addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                this.handleLike(e.target.closest('.like-btn'));
            }
            if (e.target.closest('.comment-btn')) {
                this.openCommentModal(e.target.closest('.comment-btn').dataset.id);
            }
            if (e.target.closest('.share-btn')) {
                this.handleShare(e.target.closest('.share-btn'));
            }
        });

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchMoments(e.target.value);
            });
        }
    }

    // 加载朋友圈数据
    async loadMoments() {
        const container = document.getElementById('momentsContainer');
        container.innerHTML = '<div class="loading-spinner">正在加载内容</div>';

        try {
            this.moments = await window.momentsData.getAllMoments();
            this.renderMoments(this.moments);
        } catch (error) {
            console.error('加载朋友圈失败:', error);
            container.innerHTML = '<div class="no-results">加载失败，请刷新重试</div>';
        }
    }

    // 按分类筛选
    async filterByCategory(category) {
        this.currentCategory = category;
        
        // 更新按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        const container = document.getElementById('momentsContainer');
        container.innerHTML = '<div class="loading-spinner">正在加载内容</div>';

        try {
            if (category === 'all') {
                this.moments = await window.momentsData.getAllMoments();
            } else {
                this.moments = await window.momentsData.getMomentsByCategory(category);
            }
            this.renderMoments(this.moments);
        } catch (error) {
            console.error('分类加载失败:', error);
            container.innerHTML = '<div class="no-results">加载失败，请刷新重试</div>';
        }
    }

    // 渲染朋友圈内容
    renderMoments(moments) {
        const container = document.getElementById('momentsContainer');
        
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

    // 创建朋友圈卡片
    createMomentCard(moment) {
        const card = document.createElement('div');
        card.className = 'moment-card';
        card.dataset.category = moment.category;
        card.dataset.id = moment.id;
        
        const imagesHtml = moment.images.length > 0 ? `
            <div class="moment-images">
                ${moment.images.map(img => `<img src="${img}" alt="分享图片" onclick="this.classList.toggle('zoomed')">`).join('')}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="moment-header">
                <div class="user-avatar">
                    <img src="${moment.avatar}" alt="${moment.username}">
                </div>
                <div class="user-info">
                    <h3 class="username">${moment.username}</h3>
                    <span class="timestamp">${moment.timestamp}</span>
                </div>
                <div class="moment-actions">
                    <button class="moment-menu">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            <div class="moment-content">
                <p class="moment-text">${moment.content}</p>
                ${imagesHtml}
            </div>
            <div class="moment-footer">
                <div class="moment-stats">
                    <button class="stat-btn like-btn ${moment.isLiked ? 'liked' : ''}" data-liked="${moment.isLiked}" data-id="${moment.id}">
                        <i class="${moment.isLiked ? 'fas' : 'far'} fa-heart"></i>
                        <span class="like-count">${moment.likes}</span>
                    </button>
                    <button class="stat-btn comment-btn" data-id="${moment.id}">
                        <i class="far fa-comment"></i>
                        <span class="comment-count">${moment.comments}</span>
                    </button>
                    <button class="stat-btn share-btn">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // 处理点赞
    async handleLike(btn) {
        const momentId = btn.dataset.id;
        const isLiked = btn.dataset.liked === 'true';
        const heartIcon = btn.querySelector('i');
        const countSpan = btn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent);

        // 临时更新UI
        if (isLiked) {
            btn.dataset.liked = 'false';
            heartIcon.className = 'far fa-heart';
            btn.classList.remove('liked');
            count--;
        } else {
            btn.dataset.liked = 'true';
            heartIcon.className = 'fas fa-heart';
            btn.classList.add('liked');
            count++;
        }
        countSpan.textContent = count;

        // 同步到LeanCloud
        try {
            if (isLiked) {
                await window.momentsData.unlikeMoment(momentId);
            } else {
                await window.momentsData.likeMoment(momentId);
            }
        } catch (error) {
            console.error('点赞同步失败:', error);
            // 如果同步失败，回滚UI
            if (isLiked) {
                btn.dataset.liked = 'true';
                heartIcon.className = 'fas fa-heart';
                btn.classList.add('liked');
                count++;
            } else {
                btn.dataset.liked = 'false';
                heartIcon.className = 'far fa-heart';
                btn.classList.remove('liked');
                count--;
            }
            countSpan.textContent = count;
        }
    }

    // 搜索功能
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

    // 打开评论弹窗
    openCommentModal(momentId) {
        // 实现评论弹窗逻辑
        console.log('打开评论:', momentId);
    }

    // 处理分享
    handleShare(btn) {
        if (navigator.share) {
            navigator.share({
                title: '狂客·银河朋友圈',
                text: '看看我分享的内容',
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('链接已复制到剪贴板');
        }
    }

    // 显示通知
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // 自动关闭
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 确保LeanCloud已初始化
    if (typeof AV !== 'undefined') {
        window.momentsApp = new MomentsApp();
    } else {
        console.error('LeanCloud SDK未加载');
        document.getElementById('momentsContainer').innerHTML = 
            '<div class="no-results">系统初始化失败，请刷新页面重试</div>';
    }
});
