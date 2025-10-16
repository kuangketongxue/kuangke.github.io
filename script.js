/* ==================== CSS样式定义 ==================== */
/* 图片放大效果 */
.moment-images img.zoomed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    max-width: 90vw;
    max-height: 90vh;
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
    cursor: zoom-out;
}

/* 点赞动画 */
.stat-btn.liked {
    color: #ef4444;
    animation: likeAnimation 0.3s ease;
}

@keyframes likeAnimation {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* 加载状态优化 */
.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    color: var(--text-secondary, #666);
    font-size: 1.1rem;
}

.loading-spinner::after {
    content: '';
    width: 24px;
    height: 24px;
    margin-left: 12px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

// ==================== 优化版常量定义 ====================
const CONFIG = Object.freeze({
    STORAGE_KEYS: {
        moments: 'momentsData',
        diary: 'successDiaryData',
        theme: 'theme',
        language: 'language',
        username: 'username'
    },
    PAGE_TYPES: {
        MOMENTS: 'moments',
        SUCCESS: 'success'
    },
    TIMING: {
        DEBOUNCE_DELAY: 300,
        ANIMATION_DELAY: 0.1,
        NOTIFICATION_DURATION: 3000,
        LIKE_ANIMATION: 200
    },
    LIMITS: {
        MAX_COMMENT_LENGTH: 500,
        MAX_RETRY_ATTEMPTS: 3
    },
    // LeanCloud配置（仅用于朋友圈点赞/评论）
    LEANCLOUD: {
        APP_ID: '2pmu0Y0IKEfIKXhdJHNEd1uU-gzGzoHsz',
        APP_KEY: 'cbLreTdVyxyXuWgmfwdQxPFF',
        SERVER_URL: 'https://2pmu0y0i.lc-cn-n1-shared.com'
    }
});

// ==================== 全局状态管理 ====================
class AppState {
    constructor() {
        this._listeners = new Map();
        this.reset();
        this.loadInitialState();
    }

    reset() {
        this.currentCategory = 'all';
        this.currentMomentId = null;
        this.selectedDiaryTags = new Set();
        this.diaryMoodFilter = 'all';
        this.diarySortBy = 'dateDesc';
        this.diarySearchKeyword = '';
        this.currentLanguage = 'zh';
        this.currentPage = CONFIG.PAGE_TYPES.MOMENTS;
        this.activeListeners = new Map();
        this.pendingOperations = new Map();
    }

    loadInitialState() {
        this.currentLanguage = this.loadFromStorage(CONFIG.STORAGE_KEYS.language) || 'zh';
    }

    loadFromStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`[AppState] Storage load failed: ${key}`, error);
            return null;
        }
    }

    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn(`[AppState] Storage save failed: ${key}`, error);
            return false;
        }
    }

    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(callback);
    }

    off(event, callback) {
        const listeners = this._listeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    emit(event, data) {
        const listeners = this._listeners.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }

    setOperationLock(operationId, duration = 1000) {
        this.pendingOperations.set(operationId, Date.now());
        setTimeout(() => {
            this.pendingOperations.delete(operationId);
        }, duration);
    }

    isOperationLocked(operationId) {
        return this.pendingOperations.has(operationId);
    }
}

const appState = new AppState();

// ==================== 工具函数类 ====================
class Utils {
    static escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    static formatMultiline(text) {
        if (!text) return '';
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    }

    static formatTime(timeStr) {
        const date = new Date(timeStr);
        if (!this.isValidDate(date)) return timeStr;
        const now = new Date();
        const diff = now - date;
        const ranges = {
            minute: 60 * 1000,
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000
        };

        if (diff < ranges.minute) return '刚刚';
        if (diff < ranges.hour) return `${Math.floor(diff / ranges.minute)}分钟前`;
        if (diff < ranges.day) return `${Math.floor(diff / ranges.hour)}小时前`;
        if (diff < ranges.day * 2) return '昨天';
        if (diff < ranges.day * 7) return `${Math.floor(diff / ranges.day)}天前`;

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static formatDate(dateStr) {
        const date = new Date(dateStr);
        if (!this.isValidDate(date)) return dateStr;
        
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    static normalize(text) {
        return String(text ?? '').toLowerCase().trim();
    }

    static debounce(func, wait = CONFIG.TIMING.DEBOUNCE_DELAY, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    static generateId(prefix = '') {
        return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    static generateGuestUsername() {
        return `游客${Math.floor(Math.random() * 10000)}`;
    }

    static safeJsonParse(str, fallback = null) {
        try {
            return JSON.parse(str);
        } catch {
            return fallback;
        }
    }
}

// ==================== 通知管理器 ====================
class NotificationManager {
    static #container = null;
    static #notifications = new Set();

    static init() {
        this.#createContainer();
    }

    static #createContainer() {
        if (this.#container) return;
        this.#container = document.createElement('div');
        this.#container.className = 'notification-container';
        document.body.appendChild(this.#container);
    }

    static show(message, type = 'info', duration = CONFIG.TIMING.NOTIFICATION_DURATION) {
        if (!this.#container) this.init();
        const notification = this.#createNotificationElement(message, type);
        this.#container.appendChild(notification);
        this.#notifications.add(notification);

        const removeTimer = setTimeout(() => {
            this.remove(notification);
        }, duration);

        notification.addEventListener('click', () => {
            clearTimeout(removeTimer);
            this.remove(notification);
        });

        return notification;
    }

    static #createNotificationElement(message, type) {
        const iconMap = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };

        const icon = iconMap[type] || 'info-circle';
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${Utils.escapeHtml(message)}</span>
            <button class="notification-close" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notification);
        });

        return notification;
    }

    static remove(notification) {
        if (!this.#notifications.has(notification)) return;
        notification.style.animation = 'notificationSlideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.#notifications.delete(notification);
        }, 300);
    }

    static clearAll() {
        this.#notifications.forEach(notification => this.remove(notification));
    }
}

// ==================== 语言管理器 ====================
class LanguageManager {
    static #translations = {
        zh: {
            successTitle: '成功日记时间轴',
            searchPlaceholder: '搜索标题、标签、心情...',
            noResults: '暂无内容',
            timeJustNow: '刚刚',
            timeMinutesAgo: (data) => `${data.minutes}分钟前`,
            timeHoursAgo: (data) => `${data.hours}小时前`,
            timeYesterday: '昨天',
            timeDaysAgo: (data) => `${data.days}天前`,
            loadingComments: '加载评论中...',
            loadingData: '加载中...',
            commentPlaceholder: '说点什么...',
            commentSubmit: '发表',
            commentEmpty: '暂无评论，快来抢沙发吧！',
            likeSuccess: '点赞成功！',
            unlikeSuccess: '已取消点赞',
            operationFailed: '操作失败，请重试',
            pageInitFailed: '页面初始化失败，请刷新重试'
        }
    };

    static t(key, data = {}) {
        const langPack = this.#translations[appState.currentLanguage] || this.#translations.zh;
        let value = langPack[key] ?? key;
        if (typeof value === 'function') {
            return value(data);
        }
        return value;
    }
}

// ==================== LeanCloud处理器（仅用于朋友圈） ====================
class LeanCloudHandler {
    constructor() {
        this.initialized = false;
        this.useLocalStorage = false;
        this.#init();
    }

    #init() {
        console.log('[LeanCloudHandler] 初始化（用于朋友圈点赞/评论）');
        
        if (typeof AV === 'undefined') {
            console.warn('LeanCloud SDK 未加载，将降级为本地存储');
            this.useLocalStorage = true;
            return;
        }

        try {
            AV.init({
                appId: CONFIG.LEANCLOUD.APP_ID,
                appKey: CONFIG.LEANCLOUD.APP_KEY,
                serverURL: CONFIG.LEANCLOUD.SERVER_URL
            });
            
            this.initialized = true;
            this.useLocalStorage = false;
            console.log('[LeanCloudHandler] LeanCloud初始化完成');
        } catch (error) {
            console.error('LeanCloud 初始化失败，降级为本地存储:', error);
            this.useLocalStorage = true;
        }
    }

    async getLikes(momentId) {
        if (this.useLocalStorage) {
            return this.#getLocalLikes(momentId);
        }

        try {
            const query = new AV.Query('Likes');
            query.equalTo('momentId', momentId);
            const result = await query.first();
            return result ? result.get('count') : 0;
        } catch (error) {
            console.error('云端获取点赞数失败，降级本地:', error);
            return this.#getLocalLikes(momentId);
        }
    }

    async addLike(momentId) {
        if (this.useLocalStorage) {
            return this.#handleLocalLike(momentId, 1);
        }

        try {
            const query = new AV.Query('Likes');
            query.equalTo('momentId', momentId);
            let likeObj = await query.first();

            if (likeObj) {
                likeObj.increment('count', 1);
                await likeObj.save();
            } else {
                const Likes = AV.Object.extend('Likes');
                likeObj = new Likes();
                likeObj.set('momentId', momentId);
                likeObj.set('count', 1);
                await likeObj.save();
            }

            return likeObj.get('count');
        } catch (error) {
            console.error('云端点赞失败，降级本地:', error);
            return this.#handleLocalLike(momentId, 1);
        }
    }

    async removeLike(momentId) {
        if (this.useLocalStorage) {
            return this.#handleLocalLike(momentId, -1);
        }

        try {
            const query = new AV.Query('Likes');
            query.equalTo('momentId', momentId);
            const likeObj = await query.first();

            if (likeObj) {
                const currentCount = likeObj.get('count');
                if (currentCount > 0) {
                    likeObj.increment('count', -1);
                    await likeObj.save();
                    return likeObj.get('count');
                }
            }
            return 0;
        } catch (error) {
            console.error('云端取消点赞失败，降级本地:', error);
            return this.#handleLocalLike(momentId, -1);
        }
    }

    async getComments(momentId) {
        if (this.useLocalStorage) {
            return this.#getLocalComments(momentId);
        }

        try {
            const query = new AV.Query('Comments');
            query.equalTo('momentId', momentId);
            query.descending('createdAt');
            const results = await query.find();

            return results.map(comment => ({
                id: comment.id,
                text: comment.get('text'),
                author: comment.get('author'),
                timestamp: comment.get('createdAt').getTime()
            }));
        } catch (error) {
            console.error('云端获取评论失败，降级本地:', error);
            return this.#getLocalComments(momentId);
        }
    }

    async addComment(momentId, commentText, author) {
        if (this.useLocalStorage) {
            return this.#handleLocalComment(momentId, commentText, author);
        }

        try {
            const Comment = AV.Object.extend('Comments');
            const comment = new Comment();
            comment.set('momentId', momentId);
            comment.set('text', commentText);
            comment.set('author', author);
            await comment.save();

            return {
                id: comment.id,
                text: commentText,
                author: author,
                timestamp: comment.get('createdAt').getTime()
            };
        } catch (error) {
            console.error('云端添加评论失败，降级本地:', error);
            return this.#handleLocalComment(momentId, commentText, author);
        }
    }

    #getLocalLikes(momentId) {
        return parseInt(localStorage.getItem(`likes_${momentId}`)) || 0;
    }

    #handleLocalLike(momentId, delta) {
        const current = this.#getLocalLikes(momentId);
        const newLikes = Math.max(0, current + delta);
        localStorage.setItem(`likes_${momentId}`, newLikes.toString());
        return newLikes;
    }

    #getLocalComments(momentId) {
        const stored = localStorage.getItem(`comments_${momentId}`);
        return Utils.safeJsonParse(stored, []);
    }

    #handleLocalComment(momentId, commentText, author) {
        const comments = this.#getLocalComments(momentId);
        const comment = {
            id: Utils.generateId('comment_'),
            text: commentText,
            timestamp: Date.now(),
            author: author
        };
        
        comments.unshift(comment);
        localStorage.setItem(`comments_${momentId}`, JSON.stringify(comments));
        return comment;
    }
}

if (typeof window.cloudHandler === 'undefined') {
    window.cloudHandler = new LeanCloudHandler();
}

// ==================== 朋友圈页面管理器 ====================
class MomentsPageManager {
    static #data = [];
    static #eventListeners = new Map();
    static #likeProcessing = new Set();

    static async init() {
        await this.#loadData();
        this.#bindEvents();
        await this.render();
    }

    static async #loadData() {
        try {
            const savedData = this.#loadFromStorage();
            const defaultData = window.momentsData || [];
            
            this.#data = this.#mergeData(savedData, defaultData);
            this.#ensureDataIds();
            this.#saveData();
        } catch (error) {
            console.error('加载朋友圈数据失败:', error);
            this.#data = window.momentsData || [];
        }
    }

    static #loadFromStorage() {
        try {
            const saved = appState.loadFromStorage(CONFIG.STORAGE_KEYS.moments);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    }

    static #mergeData(saved, defaults) {
        const allIds = new Set();
        const merged = [];

        [saved, defaults].forEach(source => {
            if (!source) return;
            source.forEach(item => {
                if (item.id && !allIds.has(item.id)) {
                    allIds.add(item.id);
                    merged.push(item);
                }
            });
        });

        return merged;
    }

    static #ensureDataIds() {
        this.#data = this.#data.map(m => ({
            ...m,
            id: m.id || Utils.generateId('moment_')
        }));
    }

    static #saveData() {
        try {
            appState.saveToStorage(CONFIG.STORAGE_KEYS.moments, JSON.stringify(this.#data));
        } catch (error) {
            console.error('保存朋友圈数据失败:', error);
        }
    }

    static #bindEvents() {
        this.#clearEventListeners();
        this.#bindSearch();
        this.#bindCategories();
        this.#initCommentModal();
    }

    static #clearEventListeners() {
        this.#eventListeners.forEach((handler, element) => {
            element.removeEventListener('click', handler);
        });
        this.#eventListeners.clear();
    }

    static #bindSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const handler = Utils.debounce((e) => {
                this.#handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('input', handler);
            this.#eventListeners.set(searchInput, handler);
        }
    }

    static #handleSearch(query) {
        const normalizedQuery = Utils.normalize(query);
        if (!normalizedQuery) {
            this.render();
            return;
        }

        const filtered = this.#data.filter(moment => {
            return Utils.normalize(moment.content).includes(normalizedQuery) ||
                   Utils.normalize(moment.username).includes(normalizedQuery) ||
                   (moment.category && Utils.normalize(moment.category).includes(normalizedQuery));
        });

        this.render(filtered);
    }

    static #bindCategories() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            const handler = () => {
                this.#handleCategoryChange(button);
            };
            
            button.addEventListener('click', handler);
            this.#eventListeners.set(button, handler);
        });
    }

    static #handleCategoryChange(button) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        appState.currentCategory = button.dataset.category;
        this.render();
    }

    static #initCommentModal() {
        const modal = document.getElementById('commentModal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.close');
        const submitBtn = document.getElementById('submitComment');
        const commentInput = document.getElementById('commentInput');

        if (closeBtn) {
            const handler = () => this.#closeCommentModal();
            closeBtn.addEventListener('click', handler);
            this.#eventListeners.set(closeBtn, handler);
        }

        if (submitBtn) {
            const handler = () => this.#submitComment();
            submitBtn.addEventListener('click', handler);
            this.#eventListeners.set(submitBtn, handler);
        }

        if (commentInput) {
            const handler = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.#submitComment();
                }
            };
            
            commentInput.addEventListener('keypress', handler);
            this.#eventListeners.set(commentInput, handler);
        }

        const modalHandler = (e) => {
            if (e.target === modal) {
                this.#closeCommentModal();
            }
        };
        
        modal.addEventListener('click', modalHandler);
        this.#eventListeners.set(modal, modalHandler);
    }

    static async render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        container.innerHTML = '<div class="loading-spinner">加载中...</div>';

        const dataToRender = filteredData || this.#data;
        const filtered = this.#filterByCategory(dataToRender);
        const sorted = this.#sortByDate(filtered);

        if (sorted.length === 0) {
            container.innerHTML = '<div class="no-results">暂无内容</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');

        for (let i = 0; i < sorted.length; i++) {
            const moment = sorted[i];
            const likes = await window.cloudHandler.getLikes(moment.id);
            const comments = await window.cloudHandler.getComments(moment.id);

            tempContainer.innerHTML = this.#renderMomentCard(moment, i, likes, comments.length);
            
            if (tempContainer.firstElementChild) {
                fragment.appendChild(tempContainer.firstElementChild);
            }
        }

        container.innerHTML = '';
        container.appendChild(fragment);

        sorted.forEach(moment => this.#setupRealtimeListeners(moment.id));
    }

    static #filterByCategory(data) {
        return appState.currentCategory === 'all' ?
            data : data.filter(m => m.category === appState.currentCategory);
    }

    static #sortByDate(data) {
        return [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    static #renderMomentCard(moment, index, likes, commentCount) {
        return `
            <div class="moment-card" data-category="${moment.category || 'all'}" style="animation-delay: ${index * CONFIG.TIMING.ANIMATION_DELAY}s">
                <div class="moment-header">
                    <img src="${moment.avatar || 'https://picsum.photos/seed/default/100/100.jpg'}" alt="${moment.username}" class="avatar">
                    <div class="moment-info">
                        <div class="username">${Utils.escapeHtml(moment.username)}</div>
                        <div class="time">${Utils.formatTime(moment.time)}</div>
                    </div>
                </div>
                <div class="moment-content">
                    <p>${Utils.formatMultiline(moment.content)}</p>
                </div>
                ${moment.images && moment.images.length > 0 ? `
                    <div class="moment-images">
                        ${moment.images.map(img => `
                            <img src="${img}" alt="朋友圈图片" loading="lazy">
                        `).join('')}
                    </div>
                ` : ''}
                <div class="moment-actions">
                    <button class="like-btn" data-like-id="${moment.id}">
                        <i class="fas fa-heart"></i>
                        <span>${likes}</span>
                    </button>
                    <button class="comment-btn" data-comment-id="${moment.id}">
                        <i class="fas fa-comment"></i>
                        <span>${commentCount}</span>
                    </button>
                </div>
            </div>
        `;
    }

    static #setupRealtimeListeners(momentId) {
        const likeBtn = document.querySelector(`button[data-like-id="${momentId}"]`);
        if (likeBtn) {
            const handler = () => this.handleLike(momentId);
            likeBtn.addEventListener('click', handler);
            this.#eventListeners.set(likeBtn, handler);
        }

        const commentBtn = document.querySelector(`button[data-comment-id="${momentId}"]`);
        if (commentBtn) {
            const handler = () => this.#openCommentModal(momentId);
            commentBtn.addEventListener('click', handler);
            this.#eventListeners.set(commentBtn, handler);
        }
    }

    static async handleLike(momentId) {
        if (this.#likeProcessing.has(momentId)) return;
        
        this.#likeProcessing.add(momentId);
        const likeBtn = document.querySelector(`button[data-like-id="${momentId}"]`);
        if (likeBtn) likeBtn.disabled = true;

        try {
            const userLikeKey = `user_liked_${momentId}`;
            const hasUserLiked = localStorage.getItem(userLikeKey) === 'true';

            if (hasUserLiked) {
                const newLikes = await window.cloudHandler.removeLike(momentId);
                localStorage.removeItem(userLikeKey);
                NotificationManager.show('已取消点赞', 'info');
                
                const likeBtnSpan = likeBtn.querySelector('span');
                if (likeBtnSpan) likeBtnSpan.textContent = newLikes;
            } else {
                const newLikes = await window.cloudHandler.addLike(momentId);
                localStorage.setItem(userLikeKey, 'true');
                this.#animateLikeButton(likeBtn);
                NotificationManager.show('点赞成功！', 'success');
                
                const likeBtnSpan = likeBtn.querySelector('span');
                if (likeBtnSpan) likeBtnSpan.textContent = newLikes;
            }
        } catch (error) {
            console.error('点赞操作失败:', error);
            NotificationManager.show('操作失败，请重试', 'error');
        } finally {
            this.#likeProcessing.delete(momentId);
            if (likeBtn) likeBtn.disabled = false;
        }
    }

    static #animateLikeButton(button) {
        if (!button) return;
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, CONFIG.TIMING.LIKE_ANIMATION);
    }

    static #openCommentModal(momentId) {
        appState.currentMomentId = momentId;
        const modal = document.getElementById('commentModal');
        if (modal) {
            modal.style.display = 'block';
            this.#loadComments(momentId);
        }
    }

    static #closeCommentModal() {
        const modal = document.getElementById('commentModal');
        if (modal) {
            modal.style.display = 'none';
        }
        appState.currentMomentId = null;
        const input = document.getElementById('commentInput');
        if (input) input.value = '';
    }

    static async #loadComments(momentId) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        commentsList.innerHTML = '<div class="loading-spinner">加载评论中...</div>';

        try {
            const comments = await window.cloudHandler.getComments(momentId);
            
            if (comments.length === 0) {
                commentsList.innerHTML = '<div class="comment-empty">暂无评论，快来抢沙发吧！</div>';
            } else {
                commentsList.innerHTML = comments.map(comment => `
                    <div class="comment-item">
                        <div class="comment-author">${Utils.escapeHtml(comment.author)}</div>
                        <div class="comment-text">${Utils.escapeHtml(comment.text)}</div>
                        <div class="comment-time">${Utils.formatTime(comment.timestamp)}</div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('加载评论失败:', error);
            commentsList.innerHTML = '<div class="comment-error">加载评论失败</div>';
        }
    }

    static async #submitComment() {
        const input = document.getElementById('commentInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text) {
            NotificationManager.show('请输入评论内容', 'warning');
            return;
        }

        if (text.length > CONFIG.LIMITS.MAX_COMMENT_LENGTH) {
            NotificationManager.show('评论内容不能超过500字', 'warning');
            return;
        }

        if (!appState.currentMomentId) return;

        const submitBtn = document.getElementById('submitComment');
        if (!submitBtn) return;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        try {
            const username = appState.loadFromStorage(CONFIG.STORAGE_KEYS.username) || Utils.generateGuestUsername();
            
            await window.cloudHandler.addComment(
                appState.currentMomentId,
                text,
                username
            );

            input.value = '';
            await this.#loadComments(appState.currentMomentId);
            
            const comments = await window.cloudHandler.getComments(appState.currentMomentId);
            const commentBtn = document.querySelector(`button[data-comment-id="${appState.currentMomentId}"] span`);
            if (commentBtn) commentBtn.textContent = comments.length;
            
            NotificationManager.show('评论发表成功！', 'success');
        } catch (error) {
            console.error('评论发表失败:', error);
            NotificationManager.show('评论失败，请重试', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ==================== 成功日记页面管理器 ====================
class SuccessPageManager {
    static #data = [];
    static #filteredData = [];
    static #eventListeners = new Map();

    static async init() {
        console.log('✅ 初始化成功日记页面管理器');
        await this.#loadData();
        this.#initFilters();
        this.#bindEvents();
        this.render();
    }

    static async #loadData() {
        try {
            this.#data = window.successDiaryData || [];
            console.log(`📝 加载成功日记数据：${this.#data.length} 条记录`);
            this.#filteredData = [...this.#data];
        } catch (error) {
            console.error('加载成功日记数据失败:', error);
            this.#data = [];
            this.#filteredData = [];
        }
    }

    static #initFilters() {
        this.#initTagFilter();
        this.#initMoodFilter();
    }

    static #initTagFilter() {
        const tagFilterContainer = document.getElementById('diaryTagFilter');
        if (!tagFilterContainer) return;

        const allTags = new Set();
        this.#data.forEach(entry => {
            if (entry.tags && Array.isArray(entry.tags)) {
                entry.tags.forEach(tag => allTags.add(tag));
            }
        });

        const sortedTags = Array.from(allTags).sort();
        
        tagFilterContainer.innerHTML = `
            <button class="filter-chip active" data-tag="all">
                <i class="fas fa-globe"></i>
                全部
            </button>
            ${sortedTags.map(tag => `
                <button class="filter-chip" data-tag="${Utils.escapeHtml(tag)}">
                    <i class="fas fa-tag"></i>
                    ${Utils.escapeHtml(tag)}
                </button>
            `).join('')}
        `;
    }

    static #initMoodFilter() {
        const moodSelect = document.getElementById('diaryMoodSelect');
        if (!moodSelect) return;

        const allMoods = new Set();
        this.#data.forEach(entry => {
            if (entry.mood) {
                allMoods.add(entry.mood);
            }
        });

        const sortedMoods = Array.from(allMoods).sort();
        
        moodSelect.innerHTML = `
            <option value="all">全部心情</option>
            ${sortedMoods.map(mood => `
                <option value="${Utils.escapeHtml(mood)}">${Utils.escapeHtml(mood)}</option>
            `).join('')}
        `;
    }

    static #bindEvents() {
        this.#clearEventListeners();
        this.#bindSearch();
        this.#bindTagFilter();
        this.#bindMoodFilter();
        this.#bindSortFilter();
        this.#bindResetButton();
        this.#bindViewToggle();
    }

    static #clearEventListeners() {
        this.#eventListeners.forEach((handler, element) => {
            const eventType = handler.eventType || 'click';
            element.removeEventListener(eventType, handler);
        });
        this.#eventListeners.clear();
    }

    static #bindSearch() {
        const searchInput = document.getElementById('diarySearchInput');
        const clearBtn = document.getElementById('searchClear');
        
        if (searchInput) {
            const handler = Utils.debounce((e) => {
                appState.diarySearchKeyword = e.target.value;
                if (clearBtn) {
                    clearBtn.style.display = e.target.value ? 'block' : 'none';
                }
                this.#applyFilters();
            });
            handler.eventType = 'input';
            
            searchInput.addEventListener('input', handler);
            this.#eventListeners.set(searchInput, handler);
        }

        if (clearBtn) {
            const handler = () => {
                if (searchInput) {
                    searchInput.value = '';
                    appState.diarySearchKeyword = '';
                    clearBtn.style.display = 'none';
                    this.#applyFilters();
                }
            };
            
            clearBtn.addEventListener('click', handler);
            this.#eventListeners.set(clearBtn, handler);
        }
    }

    static #bindTagFilter() {
        const tagButtons = document.querySelectorAll('#diaryTagFilter .filter-chip');
        
        tagButtons.forEach(button => {
            const handler = () => {
                const tag = button.dataset.tag;
                
                if (tag === 'all') {
                    appState.selectedDiaryTags.clear();
                    tagButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                } else {
                    document.querySelector('[data-tag="all"]')?.classList.remove('active');
                    
                    if (appState.selectedDiaryTags.has(tag)) {
                        appState.selectedDiaryTags.delete(tag);
                        button.classList.remove('active');
                        
                        if (appState.selectedDiaryTags.size === 0) {
                            document.querySelector('[data-tag="all"]')?.classList.add('active');
                        }
                    } else {
                        appState.selectedDiaryTags.add(tag);
                        button.classList.add('active');
                    }
                }
                
                this.#applyFilters();
            };
            
            button.addEventListener('click', handler);
            this.#eventListeners.set(button, handler);
        });
    }

    static #bindMoodFilter() {
        const moodSelect = document.getElementById('diaryMoodSelect');
        
        if (moodSelect) {
            const handler = (e) => {
                appState.diaryMoodFilter = e.target.value;
                this.#applyFilters();
            };
            handler.eventType = 'change';
            
            moodSelect.addEventListener('change', handler);
            this.#eventListeners.set(moodSelect, handler);
        }
    }

    static #bindSortFilter() {
        const sortSelect = document.getElementById('diarySortSelect');
        
        if (sortSelect) {
            const handler = (e) => {
                appState.diarySortBy = e.target.value;
                this.render();
            };
            handler.eventType = 'change';
            
            sortSelect.addEventListener('change', handler);
            this.#eventListeners.set(sortSelect, handler);
        }
    }

    static #bindResetButton() {
        const resetBtn = document.getElementById('diaryResetFilters');
        
        if (resetBtn) {
            const handler = () => {
                appState.selectedDiaryTags.clear();
                appState.diaryMoodFilter = 'all';
                appState.diarySortBy = 'dateDesc';
                appState.diarySearchKeyword = '';
                
                const searchInput = document.getElementById('diarySearchInput');
                const clearBtn = document.getElementById('searchClear');
                const moodSelect = document.getElementById('diaryMoodSelect');
                const sortSelect = document.getElementById('diarySortSelect');
                
                if (searchInput) searchInput.value = '';
                if (clearBtn) clearBtn.style.display = 'none';
                if (moodSelect) moodSelect.value = 'all';
                if (sortSelect) sortSelect.value = 'dateDesc';
                
                document.querySelectorAll('#diaryTagFilter .filter-chip').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector('[data-tag="all"]')?.classList.add('active');
                
                this.#applyFilters();
                NotificationManager.show('已重置所有筛选条件', 'info');
            };
            
            resetBtn.addEventListener('click', handler);
            this.#eventListeners.set(resetBtn, handler);
        }
    }

    static #bindViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        
        viewButtons.forEach(button => {
            const handler = () => {
                viewButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                const timeline = document.getElementById('diaryTimeline');
                if (timeline) {
                    const view = button.dataset.view;
                    timeline.className = view === 'grid' ? 'timeline grid-view' : 'timeline';
                }
            };
            
            button.addEventListener('click', handler);
            this.#eventListeners.set(button, handler);
        });
    }

    static #applyFilters() {
        let filtered = [...this.#data];

        // 搜索过滤
        if (appState.diarySearchKeyword) {
            const keyword = Utils.normalize(appState.diarySearchKeyword);
            filtered = filtered.filter(entry => {
                return Utils.normalize(entry.title).includes(keyword) ||
                       Utils.normalize(entry.content).includes(keyword) ||
                       (entry.tags && entry.tags.some(tag => Utils.normalize(tag).includes(keyword))) ||
                       (entry.mood && Utils.normalize(entry.mood).includes(keyword));
            });
        }

        // 标签过滤
        if (appState.selectedDiaryTags.size > 0) {
            filtered = filtered.filter(entry => {
                if (!entry.tags || !Array.isArray(entry.tags)) return false;
                return Array.from(appState.selectedDiaryTags).some(tag => 
                    entry.tags.includes(tag)
                );
            });
        }

        // 心情过滤
        if (appState.diaryMoodFilter !== 'all') {
            filtered = filtered.filter(entry => 
                entry.mood === appState.diaryMoodFilter
            );
        }

        this.#filteredData = filtered;
        this.render();
    }

    static render() {
        const timeline = document.getElementById('diaryTimeline');
        const emptyState = document.querySelector('.empty-state');
        const counter = document.getElementById('diaryCounter');

        if (!timeline) return;

        // 更新计数器
        if (counter) {
            const count = this.#filteredData.length;
            counter.innerHTML = `
                <i class="fas fa-chart-line"></i>
                <span>共 <strong>${count}</strong> 条记录</span>
            `;
        }

        // 排序
        const sorted = this.#sortData([...this.#filteredData]);

        // 空状态处理
        if (sorted.length === 0) {
            timeline.innerHTML = '';
            if (emptyState) {
                emptyState.classList.remove('hidden');
            }
            return;
        }

        if (emptyState) {
            emptyState.classList.add('hidden');
        }

        // 渲染时间轴
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');

        sorted.forEach((entry, index) => {
            tempContainer.innerHTML = this.#renderDiaryCard(entry, index);
            if (tempContainer.firstElementChild) {
                fragment.appendChild(tempContainer.firstElementChild);
            }
        });

        timeline.innerHTML = '';
        timeline.appendChild(fragment);
    }

    static #sortData(data) {
        const sortFunctions = {
            dateDesc: (a, b) => new Date(b.date) - new Date(a.date),
            dateAsc: (a, b) => new Date(a.date) - new Date(b.date),
            achievementDesc: (a, b) => (b.achievement || 0) - (a.achievement || 0),
            achievementAsc: (a, b) => (a.achievement || 0) - (b.achievement || 0)
        };

        const sortFn = sortFunctions[appState.diarySortBy] || sortFunctions.dateDesc;
        return data.sort(sortFn);
    }

    static #renderDiaryCard(entry, index) {
        const achievement = entry.achievement || 0;
        const achievementStars = '⭐'.repeat(Math.min(5, achievement));
        
        return `
            <div class="timeline-item" style="animation-delay: ${index * CONFIG.TIMING.ANIMATION_DELAY}s">
                <div class="timeline-date">${Utils.formatDate(entry.date)}</div>
                <div class="timeline-content">
                    <div class="diary-header">
                        <h3 class="diary-title">${Utils.escapeHtml(entry.title)}</h3>
                        ${entry.mood ? `<span class="diary-mood">${Utils.escapeHtml(entry.mood)}</span>` : ''}
                    </div>
                    <div class="diary-body">
                        <p class="diary-text">${Utils.formatMultiline(entry.content)}</p>
                    </div>
                    ${entry.tags && entry.tags.length > 0 ? `
                        <div class="diary-tags">
                            ${entry.tags.map(tag => `
                                <span class="diary-tag">
                                    <i class="fas fa-tag"></i>
                                    ${Utils.escapeHtml(tag)}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                    ${achievement > 0 ? `
                        <div class="diary-achievement">
                            <span class="achievement-label">成就值:</span>
                            <span class="achievement-stars">${achievementStars}</span>
                            <span class="achievement-value">${achievement}/5</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// ==================== 主题管理器 ====================
class ThemeManager {
    static THEME_KEY = 'theme';
    static THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    static init() {
        this.applySavedTheme();
        this.#bindThemeToggle();
    }

    static applySavedTheme() {
        const savedTheme = appState.loadFromStorage(this.THEME_KEY) || this.THEMES.LIGHT;
        document.body.classList.toggle('dark-theme', savedTheme === this.THEMES.DARK);
        this.updateThemeToggleButton();
    }

    static #bindThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }

    static toggle() {
        const isDark = document.body.classList.toggle('dark-theme');
        const theme = isDark ? this.THEMES.DARK : this.THEMES.LIGHT;
        appState.saveToStorage(this.THEME_KEY, theme);
        this.updateThemeToggleButton();
    }

    static updateThemeToggleButton() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        const isDark = document.body.classList.contains('dark-theme');
        
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ==================== 应用控制器 ====================
class AppController {
    static async init() {
        try {
            this.#detectPageType();
            await this.#initializeServices();
            this.#initializeGlobalControls();
            await this.#initializePage();
            console.log(`✅ 应用初始化完成 [页面: ${appState.currentPage}]`);
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
            NotificationManager.show('页面初始化失败，请刷新重试', 'error');
        }
    }

    static #detectPageType() {
        const pageElement = document.querySelector('[data-page]');
        appState.currentPage = pageElement ?
            pageElement.dataset.page : CONFIG.PAGE_TYPES.MOMENTS;
        
        console.log(`📄 检测到页面类型: ${appState.currentPage}`);
    }

    static async #initializeServices() {
        ThemeManager.init();
        NotificationManager.init();
        await this.#waitForCriticalResources();
    }

    static #waitForCriticalResources() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    static #initializeGlobalControls() {
        // 可以添加全局控制逻辑
    }

    static async #initializePage() {
        switch (appState.currentPage) {
            case CONFIG.PAGE_TYPES.MOMENTS:
                console.log('🎭 初始化朋友圈页面（启用LeanCloud）');
                await MomentsPageManager.init();
                break;
            case CONFIG.PAGE_TYPES.SUCCESS:
                console.log('📔 初始化成功日记页面（本地数据）');
                await SuccessPageManager.init();
                break;
            default:
                console.warn('⚠️ 未知页面类型:', appState.currentPage);
        }
    }
}

// ==================== 全局暴露和初始化 ====================
window.MomentsPageManager = MomentsPageManager;
window.SuccessPageManager = SuccessPageManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM加载完成，准备初始化应用...');
    console.log('📦 LeanCloud SDK状态:', typeof AV !== 'undefined' ? '已加载' : '未加载（朋友圈将降级本地）');
    
    setTimeout(() => {
        AppController.init().catch(error => {
            console.error('💥 应用启动失败:', error);
        });
    }, 100);
});

window.addEventListener('error', (event) => {
    console.error('🔥 全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🔥 未处理的Promise拒绝:', event.reason);
});
