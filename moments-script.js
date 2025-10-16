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

        // 添加发布按钮
        this.addPublishButton();
    }

    // 添加发布按钮
    addPublishButton() {
        const header = document.querySelector('.header .container');
        if (!header || header.querySelector('.publish-btn')) return;
        
        const publishBtn = document.createElement('button');
        publishBtn.className = 'publish-btn';
        publishBtn.innerHTML = '<i class="fas fa-plus"></i> 发布';
        publishBtn.onclick = () => this.openPublishModal();
        header.appendChild(publishBtn);
    }

    // 加载朋友圈数据
    async loadMoments() {
        const container = document.getElementById('momentsContainer');
        container.innerHTML = '<div class="loading-spinner">正在加载内容</div>';

        try {
            this.moments = await window.momentsData.getAllMoments();
            this.renderMoments(this.moments);
            console.log('成功加载朋友圈数据:', this.moments);
        } catch (error) {
            console.error('加载朋友圈失败:', error);
            container.innerHTML = `
                <div class="no-results">
                    <p>加载失败，请刷新重试</p>
                    <button onclick="location.reload()" class="retry-btn">重新加载</button>
                </div>
            `;
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
            container.innerHTML = `
                <div class="no-results">
                    <p>加载失败，请刷新重试</p>
                    <button onclick="location.reload()" class="retry-btn">重新加载</button>
                </div>
            `;
        }
    }

    // 渲染朋友圈内容
    renderMoments(moments) {
        const container = document.getElementById('momentsContainer');
        
        if (!moments || moments.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>暂无内容</p>
                    <button onclick="momentsApp.openPublishModal()" class="publish-first-btn">发布第一条朋友圈</button>
                </div>
            `;
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
        
        // 处理图片显示
        const imagesHtml = moment.images && moment.images.length > 0 ? `
            <div class="moment-images ${this.getImageGridClass(moment.images.length)}">
                ${moment.images.map((img, index) => `
                    <img src="${img}" 
                         alt="分享图片${index + 1}" 
                         onclick="momentsApp.toggleImageZoom(this)"
                         onerror="this.src='images/placeholder.jpg'">
                `).join('')}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="moment-header">
                <div class="user-avatar">
                    <img src="${moment.avatar}" 
                         alt="${moment.username}" 
                         onerror="this.src='images/avatar-default.jpg'">
                </div>
                <div class="user-info">
                    <h3 class="username">${this.escapeHtml(moment.username)}</h3>
                    <span class="timestamp">${moment.timestamp}</span>
                </div>
                <div class="moment-actions">
                    <button class="moment-menu" onclick="momentsApp.showMenu('${moment.id}')">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            <div class="moment-content">
                <p class="moment-text">${this.escapeHtml(moment.content)}</p>
                ${imagesHtml}
            </div>
            <div class="moment-footer">
                <div class="moment-stats">
                    <button class="stat-btn like-btn ${moment.isLiked ? 'liked' : ''}" 
                            data-liked="${moment.isLiked}" 
                            data-id="${moment.id}">
                        <i class="${moment.isLiked ? 'fas' : 'far'} fa-heart"></i>
                        <span class="like-count">${moment.likes || 0}</span>
                    </button>
                    <button class="stat-btn comment-btn" data-id="${moment.id}">
                        <i class="far fa-comment"></i>
                        <span class="comment-count">${moment.comments || 0}</span>
                    </button>
                    <button class="stat-btn share-btn" onclick="momentsApp.handleShare(this)">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // 获取图片网格类名
    getImageGridClass(count) {
        if (count === 1) return 'single';
        if (count === 2) return 'double';
        if (count === 4) return 'four';
        return 'multiple';
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 图片放大切换
    toggleImageZoom(img) {
        // 移除所有已放大的图片和遮罩层
        document.querySelectorAll('.zoomed').forEach(zoomedImg => {
            zoomedImg.classList.remove('zoomed');
        });
        document.querySelectorAll('.image-overlay').forEach(overlay => {
            overlay.remove();
        });

        if (!img.classList.contains('zoomed')) {
            img.classList.add('zoomed');
            
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.onclick = () => {
                img.classList.remove('zoomed');
                overlay.remove();
            };
            
            document.body.appendChild(overlay);
        }
    }

    // 显示菜单
    showMenu(momentId) {
        this.showNotification('菜单功能开发中...', 'info');
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
                this.showNotification('取消点赞');
            } else {
                await window.momentsData.likeMoment(momentId);
                this.showNotification('点赞成功');
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
            this.showNotification('操作失败，请重试', 'error');
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
        
        if (filtered.length === 0) {
            document.getElementById('momentsContainer').innerHTML = 
                '<div class="no-results">没有找到相关内容</div>';
        }
    }

    // 打开评论弹窗
    openCommentModal(momentId) {
        // 创建评论弹窗
        const existingModal = document.getElementById('commentModal');
        if (existingModal) {
            existingModal.style.display = 'block';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'commentModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="momentsApp.closeCommentModal()">&times;</span>
                <h2 id="commentModalTitle">评论</h2>
                <div id="commentsList" class="comments-list">
                    <div class="loading-spinner">正在加载评论...</div>
                </div>
                <div class="comment-input-area">
                    <input type="text" 
                           id="commentInput" 
                           placeholder="写下你的评论..." 
                           onkeypress="if(event.key === 'Enter') momentsApp.submitComment('${momentId}')">
                    <button onclick="momentsApp.submitComment('${momentId}')">发送</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // 加载评论
        this.loadComments(momentId);
    }

    // 关闭评论弹窗
    closeCommentModal() {
        const modal = document.getElementById('commentModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 加载评论
    async loadComments(momentId) {
        // 这里可以实现从LeanCloud加载评论的逻辑
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '<p class="no-comments">暂无评论</p>';
    }

    // 提交评论
    async submitComment(momentId) {
        const input = document.getElementById('commentInput');
        const content = input.value.trim();
        
        if (!content) {
            this.showNotification('请输入评论内容', 'warning');
            return;
        }

        try {
            // 这里可以实现向LeanCloud提交评论的逻辑
            input.value = '';
            this.showNotification('评论发布成功', 'success');
            // 重新加载评论
            this.loadComments(momentId);
        } catch (error) {
            console.error('评论发布失败:', error);
            this.showNotification('评论发布失败，请重试', 'error');
        }
    }

    // 打开发布弹窗
    openPublishModal() {
        this.showNotification('发布功能开发中...', 'info');
    }

    // 处理分享
    handleShare(btn) {
        if (navigator.share) {
            navigator.share({
                title: '狂客·银河朋友圈',
                text: '看看我分享的内容',
                url: window.location.href
            }).catch(err => {
                console.log('分享取消或失败:', err);
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('链接已复制到剪贴板', 'success');
            }).catch(err => {
                console.error('复制失败:', err);
                this.showNotification('复制失败，请手动复制链接', 'error');
            });
        }
    }

    // 显示通知
    showNotification(message, type = 'success') {
        // 移除现有通知
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (notification.timer) {
                clearTimeout(notification.timer);
            }
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${this.escapeHtml(message)}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // 添加点击关闭功能
        notification.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // 自动关闭
        notification.timer = setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
}

// 在 moments-script.js 文件最后，替换原来的初始化代码：

// 立即创建应用实例并暴露到全局
(function() {
    // 创建应用实例
    const app = new MomentsApp();
    
    // 暴露到全局
    window.momentsApp = app;
    
    // 确保DOM加载完成后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            app.init();
        });
    } else {
        // DOM已经加载完成
        setTimeout(() => app.init(), 100);
    }
})();

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
});

// 添加调试信息
console.log('moments-script.js 加载完成');
