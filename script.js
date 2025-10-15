// ==================== 常量定义 ====================
const STORAGE_KEYS = Object.freeze({
    moments: 'momentsData',
    diary: 'successDiaryData',
    theme: 'theme',
    language: 'language'
});

const PAGE_TYPES = Object.freeze({
    MOMENTS: 'moments',
    SUCCESS: 'success'
});

const DEBOUNCE_DELAY = 300;
const ANIMATION_DELAY = 0.1;
const NOTIFICATION_DURATION = 3000;
const MAX_COMMENT_LENGTH = 500;

// ==================== 全局状态管理 ====================
class AppState {
    constructor() {
        this.currentCategory = 'all';
        this.currentMomentId = null;
        this.selectedDiaryTags = new Set();
        this.diaryMoodFilter = 'all';
        this.diarySortBy = 'dateDesc';
        this.diarySearchKeyword = '';
        this.currentLanguage = this.loadFromStorage(STORAGE_KEYS.language) || 'zh';
        this.currentPage = PAGE_TYPES.MOMENTS;
    }

    loadFromStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`Failed to load from storage: ${key}`, error);
            return null;
        }
    }

    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn(`Failed to save to storage: ${key}`, error);
        }
    }

    resetDiaryFilters() {
        this.selectedDiaryTags.clear();
        this.diaryMoodFilter = 'all';
        this.diarySortBy = 'dateDesc';
        this.diarySearchKeyword = '';
    }
}

const appState = new AppState();

// ==================== 工具函数 ====================
const Utils = {
    escapeHtml(text) {
        if (text === undefined || text === null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatMultiline(text) {
        if (!text) return '';
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    },

    formatTime(timeStr) {
        const date = new Date(timeStr);
        if (Number.isNaN(date.getTime())) return timeStr;
        
        const now = new Date();
        const diff = now - date;
        const oneMinute = 60 * 1000;
        const oneHour = 60 * oneMinute;
        const oneDay = 24 * oneHour;

        if (diff < oneMinute) return '刚刚';
        if (diff < oneHour) return `${Math.floor(diff / oneMinute)}分钟前`;
        if (diff < oneDay) return `${Math.floor(diff / oneHour)}小时前`;
        if (diff < oneDay * 2) return '昨天';
        if (diff < oneDay * 7) return `${Math.floor(diff / oneDay)}天前`;

        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDiaryDate(dateStr, lang) {
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return dateStr;

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        };

        return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', options);
    },

    normalize(text) {
        return (text || '').toString().toLowerCase().trim();
    },

    debounce(func, wait = DEBOUNCE_DELAY) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ==================== 通知管理器 ====================
class NotificationManager {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const iconMap = {
            success: 'check-circle',
            warning: 'exclamation-circle',
            error: 'times-circle',
            info: 'info-circle'
        };

        const colorMap = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };

        notification.innerHTML = `
            <i class="fas fa-${iconMap[type]}"></i>
            <span>${Utils.escapeHtml(message)}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: colorMap[type],
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideInRight 0.3s ease-out',
            fontSize: '0.95rem'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, NOTIFICATION_DURATION);
    }
}

// ==================== 语言管理器 ====================
class LanguageManager {
    static translations = {
        zh: {
            successTitle: '成功日记时间轴',
            successSubtitle: '当你写成功日记的时候，你会对自己，对世界，还有对成功的规律作更深入的思考...',
            searchPlaceholder: '搜索标题、标签、心情...',
            moodAll: '全部心情',
            sortLabel: '排序',
            sortDateDesc: '日期：最新优先',
            sortDateAsc: '日期：最旧优先',
            sortAchievementDesc: '成就值：最高优先',
            sortAchievementAsc: '成就值：最低优先',
            moodLabel: '心情',
            tagLabel: '分类标签',
            resetFilters: '重置筛选',
            timelineEmpty: '暂无符合条件的成功日记',
            timelineTags: '标签',
            timelineMood: '心情',
            timelineAchievement: '成就值',
            timelineNotes: '意外收获',
            attachments: '附件',
            entryCount: (count) => `共 ${count} 条记录`,
            commentPlaceholder: '说点什么...',
            commentSubmit: '发表',
            commentEmpty: '暂无评论，快来抢沙发吧！',
            noResults: '暂无内容'
        },
        en: {
            successTitle: 'Success Diary Timeline',
            successSubtitle: 'When you write a success journal, you will reflect more deeply...',
            searchPlaceholder: 'Search title, tags, moods...',
            moodAll: 'All moods',
            sortLabel: 'Sort',
            sortDateDesc: 'Date: newest first',
            sortDateAsc: 'Date: oldest first',
            sortAchievementDesc: 'Achievement: highest first',
            sortAchievementAsc: 'Achievement: lowest first',
            moodLabel: 'Mood',
            tagLabel: 'Tags',
            resetFilters: 'Reset filters',
            timelineEmpty: 'No diary entries match the filters yet.',
            timelineTags: 'Tags',
            timelineMood: 'Mood',
            timelineAchievement: 'Achievement',
            timelineNotes: 'serendipity',
            attachments: 'Attachments',
            entryCount: (count) => `${count} entries`,
            commentPlaceholder: 'Write a comment...',
            commentSubmit: 'Post',
            commentEmpty: 'No comments yet. Be the first!',
            noResults: 'No content available'
        }
    };

    static t(key) {
        const langPack = this.translations[appState.currentLanguage] || this.translations.zh;
        const fallbackPack = this.translations.zh;
        const value = langPack[key] !== undefined ? langPack[key] : fallbackPack[key];
        return value !== undefined ? value : key;
    }

    static toggle() {
        appState.currentLanguage = appState.currentLanguage === 'zh' ? 'en' : 'zh';
        appState.saveToStorage(STORAGE_KEYS.language, appState.currentLanguage);
        this.updateLanguageToggleButton();

        if (appState.currentPage === PAGE_TYPES.SUCCESS) {
            SuccessPageManager.updatePage();
        }
    }

    static updateLanguageToggleButton() {
        const button = document.getElementById('languageToggle');
        if (!button) return;

        const icon = button.querySelector('i');
        const span = button.querySelector('span');

        if (icon) icon.className = 'fas fa-language';
        if (span) span.textContent = appState.currentLanguage === 'zh' ? '中 → EN' : 'EN → 中';
    }

    static updatePageTexts() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.t(key);
            if (typeof value === 'string') {
                element.textContent = value;
            }
        });

        const searchInput = document.getElementById('diarySearchInput');
        if (searchInput) {
            searchInput.placeholder = this.t('searchPlaceholder');
        }
    }
}

// ==================== 主题管理器 ====================
class ThemeManager {
    static applySavedTheme() {
        const savedTheme = appState.loadFromStorage(STORAGE_KEYS.theme);
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    }

    static toggle() {
        document.body.classList.toggle('light-mode');
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        appState.saveToStorage(STORAGE_KEYS.theme, theme);
        this.updateThemeToggleButton();
    }

    static updateThemeToggleButton() {
        const button = document.getElementById('themeToggle');
        if (!button) return;

        const icon = button.querySelector('i');
        if (icon) {
            icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ==================== Firebase Handler (已集成) ====================
constructor() {
    // 检查 Firebase 是否已加载且已初始化
    if (typeof firebase === 'undefined' || !firebase.apps || firebase.apps.length === 0) {
        console.warn('Firebase SDK 未加载或未初始化，将使用本地存储模式');
        this.useLocalStorage = true;
        return;
    }
    
    try {
        this.database = firebase.database();
        this.likesRef = this.database.ref('likes');
        this.commentsRef = this.database.ref('comments');
        this.useLocalStorage = false;
        console.log('FirebaseHandler 初始化完成');
    } catch (error) {
        console.error('Firebase 初始化失败:', error);
        this.useLocalStorage = true;
    }
}
    // ============ 点赞相关方法 ============
    async getLikes(momentId) {
        if (this.useLocalStorage) {
            return parseInt(localStorage.getItem(`likes_${momentId}`) || '0');
        }

        try {
            const snapshot = await this.likesRef.child(momentId).once('value');
            const likes = snapshot.val();
            return likes !== null ? likes : 0;
        } catch (error) {
            console.error(`获取点赞数失败 [${momentId}]:`, error);
            return 0;
        }
    }

    async addLike(momentId) {
        if (this.useLocalStorage) {
            const current = await this.getLikes(momentId);
            const newLikes = current + 1;
            localStorage.setItem(`likes_${momentId}`, newLikes.toString());
            return newLikes;
        }

        try {
            const currentLikes = await this.getLikes(momentId);
            const newLikes = currentLikes + 1;
            await this.likesRef.child(momentId).set(newLikes);
            console.log(`点赞成功 [${momentId}]: ${currentLikes} → ${newLikes}`);
            return newLikes;
        } catch (error) {
            console.error(`点赞失败 [${momentId}]:`, error);
            return null;
        }
    }

    async removeLike(momentId) {
        if (this.useLocalStorage) {
            const current = await this.getLikes(momentId);
            const newLikes = Math.max(0, current - 1);
            localStorage.setItem(`likes_${momentId}`, newLikes.toString());
            return newLikes;
        }

        try {
            const currentLikes = await this.getLikes(momentId);
            const newLikes = Math.max(0, currentLikes - 1);
            await this.likesRef.child(momentId).set(newLikes);
            console.log(`取消点赞成功 [${momentId}]: ${currentLikes} → ${newLikes}`);
            return newLikes;
        } catch (error) {
            console.error(`取消点赞失败 [${momentId}]:`, error);
            return null;
        }
    }

    onLikesChange(momentId, callback) {
        if (this.useLocalStorage) {
            // 本地存储模式不支持实时监听
            return;
        }

        this.likesRef.child(momentId).on('value', (snapshot) => {
            const likes = snapshot.val() !== null ? snapshot.val() : 0;
            callback(likes);
        });
    }

    // ============ 评论相关方法 ============
    async getComments(momentId) {
        if (this.useLocalStorage) {
            const stored = localStorage.getItem(`comments_${momentId}`);
            return stored ? JSON.parse(stored) : [];
        }

        try {
            const snapshot = await this.commentsRef.child(momentId).once('value');
            const commentsData = snapshot.val();
            
            if (!commentsData) {
                return [];
            }

            const commentsArray = Object.values(commentsData);
            commentsArray.sort((a, b) => b.timestamp - a.timestamp);
            
            return commentsArray;
        } catch (error) {
            console.error(`获取评论失败 [${momentId}]:`, error);
            return [];
        }
    }

    async addComment(momentId, commentText, author = '访客') {
        if (this.useLocalStorage) {
            const comments = await this.getComments(momentId);
            const comment = {
                id: Date.now().toString(),
                text: commentText,
                timestamp: Date.now(),
                author: author
            };
            comments.unshift(comment);
            localStorage.setItem(`comments_${momentId}`, JSON.stringify(comments));
            return comment;
        }

        try {
            const newCommentRef = this.commentsRef.child(momentId).push();
            const comment = {
                id: newCommentRef.key,
                text: commentText,
                timestamp: Date.now(),
                author: author
            };
            
            await newCommentRef.set(comment);
            console.log(`评论添加成功 [${momentId}]:`, comment);
            return comment;
        } catch (error) {
            console.error(`添加评论失败 [${momentId}]:`, error);
            return null;
        }
    }

    onCommentsChange(momentId, callback) {
        if (this.useLocalStorage) {
            // 本地存储模式不支持实时监听
            return;
        }

        this.commentsRef.child(momentId).on('value', (snapshot) => {
            const commentsData = snapshot.val();
            
            if (!commentsData) {
                callback([]);
                return;
            }

            const commentsArray = Object.values(commentsData);
            commentsArray.sort((a, b) => b.timestamp - a.timestamp);
            callback(commentsArray);
        });
    }

    stopListening(momentId = null) {
        if (this.useLocalStorage) return;

        if (momentId) {
            this.likesRef.child(momentId).off();
            this.commentsRef.child(momentId).off();
        } else {
            this.likesRef.off();
            this.commentsRef.off();
        }
    }
}

// 创建全局 Firebase 处理器实例
const firebaseHandler = new FirebaseHandler();

// ==================== 本地存储管理器 ====================
class StorageManager {
    static loadMomentsData() {
        try {
            const saved = appState.loadFromStorage(STORAGE_KEYS.moments);
            if (!saved) return null;
            return JSON.parse(saved);
        } catch (error) {
            console.error('加载朋友圈数据失败:', error);
            NotificationManager.show('数据加载失败', 'error');
            return null;
        }
    }

    static saveMomentsData(data) {
        try {
            appState.saveToStorage(STORAGE_KEYS.moments, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存朋友圈数据失败:', error);
            NotificationManager.show('数据保存失败', 'error');
            return false;
        }
    }
}

// ==================== 朋友圈页面管理器（已集成 Firebase）====================
class MomentsPageManager {
    static data = [];
    static eventListeners = new Map();

    static async init() {
        this.loadData();
        this.bindEvents();
        await this.render();
    }

    static loadData() {
        const savedData = StorageManager.loadMomentsData();
        if (savedData) {
            const savedIds = savedData.map(m => m.id);
            const newDefaults = (window.momentsData || []).filter(m => !savedIds.includes(m.id));
            this.data = [...savedData, ...newDefaults];
        } else {
            this.data = window.momentsData || [];
        }
    }

    static saveData() {
        return StorageManager.saveMomentsData(this.data);
    }

    static bindEvents() {
        this.clearEventListeners();

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const debouncedSearch = Utils.debounce((e) => {
                this.handleSearch(e.target.value);
            });
            searchInput.addEventListener('input', debouncedSearch);
            this.eventListeners.set('searchInput', { element: searchInput, handler: debouncedSearch });
        }

        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            const handler = () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                appState.currentCategory = btn.dataset.category;
                this.render();
            };
            btn.addEventListener('click', handler);
            this.eventListeners.set(`category-${btn.dataset.category}`, { element: btn, handler });
        });

        this.initCommentModal();
    }

    static clearEventListeners() {
        this.eventListeners.forEach(({ element, handler }, key) => {
            if (element && handler) {
                element.removeEventListener('click', handler);
                element.removeEventListener('input', handler);
            }
        });
        this.eventListeners.clear();
    }

    static initCommentModal() {
        const modal = document.getElementById('commentModal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            const handler = () => {
                modal.style.display = 'none';
                if (appState.currentMomentId) {
                    firebaseHandler.stopListening(appState.currentMomentId);
                    appState.currentMomentId = null;
                }
            };
            closeBtn.addEventListener('click', handler);
            this.eventListeners.set('modalClose', { element: closeBtn, handler });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (appState.currentMomentId) {
                    firebaseHandler.stopListening(appState.currentMomentId);
                    appState.currentMomentId = null;
                }
            }
        });

        const submitBtn = document.getElementById('submitComment');
        if (submitBtn) {
            const handler = () => this.handleCommentSubmit();
            submitBtn.addEventListener('click', handler);
            this.eventListeners.set('submitComment', { element: submitBtn, handler });
        }

        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            const handler = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleCommentSubmit();
                }
            };
            commentInput.addEventListener('keypress', handler);
            this.eventListeners.set('commentInput', { element: commentInput, handler });
        }
    }

    static async render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        const dataToRender = filteredData || this.data;
        const filtered = this.filterByCategory(dataToRender);
        const sorted = this.sortByDate(filtered);

        if (sorted.length === 0) {
            container.innerHTML = `<div class="no-results">${LanguageManager.t('noResults')}</div>`;
            return;
        }

        // 显示加载状态
        container.innerHTML = '<div class="loading-spinner">加载中...</div>';

        // 渲染卡片
        const cardsHtml = [];
        for (let i = 0; i < sorted.length; i++) {
            const moment = sorted[i];
            const likes = await firebaseHandler.getLikes(moment.id);
            const comments = await firebaseHandler.getComments(moment.id);
            cardsHtml.push(this.renderMomentCard(moment, i, likes, comments.length));
        }

        container.innerHTML = cardsHtml.join('');

        // 设置实时监听
        sorted.forEach(moment => {
            this.setupRealtimeListeners(moment.id);
        });
    }

    static setupRealtimeListeners(momentId) {
        // 监听点赞变化
        firebaseHandler.onLikesChange(momentId, (newLikes) => {
            const likeBtn = document.querySelector(`button[data-like-id="${momentId}"]`);
            if (!likeBtn) return;

            const likeCount = likeBtn.querySelector('.like-count');
            if (newLikes > 0) {
                if (!likeCount) {
                    likeBtn.innerHTML = `
                        <i class="fas fa-heart"></i>
                        <span class="like-count">${newLikes}</span>
                    `;
                } else {
                    likeCount.textContent = newLikes;
                }
                likeBtn.classList.add('liked');
            } else {
                likeBtn.innerHTML = '<i class="far fa-heart"></i>';
                likeBtn.classList.remove('liked');
            }
        });

        // 监听评论变化
        firebaseHandler.onCommentsChange(momentId, (newComments) => {
            const commentBtn = document.querySelector(`button[data-comment-id="${momentId}"]`);
            if (!commentBtn) return;

            const commentCount = commentBtn.querySelector('.comment-count');
            if (newComments.length > 0) {
                if (!commentCount) {
                    commentBtn.innerHTML = `
                        <i class="far fa-comment"></i>
                        <span class="comment-count">${newComments.length}</span>
                    `;
                } else {
                    commentCount.textContent = newComments.length;
                }
            } else {
                commentBtn.innerHTML = '<i class="far fa-comment"></i>';
            }
        });
    }

    static filterByCategory(data) {
        return appState.currentCategory === 'all' ? data : data.filter(m => m.category === appState.currentCategory);
    }

    static sortByDate(data) {
        return [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    static renderMomentCard(moment, index, likes = 0, commentsCount = 0) {
        const hasImage = moment.image && moment.image.trim();
        const hasComments = commentsCount > 0;
        const hasLikes = likes > 0;

        return `
            <div class="moment-card" style="animation-delay: ${index * ANIMATION_DELAY}s">
                <div class="moment-header">
                    <span class="category-tag">${Utils.escapeHtml(moment.category)}</span>
                    <span class="value-badge">⭐ ${moment.value}</span>
                </div>
                <div class="moment-content">${Utils.escapeHtml(moment.content)}</div>
                ${hasImage ? `
                    <img src="${Utils.escapeHtml(moment.image)}"
                         alt="图片"
                         class="moment-image"
                         onerror="this.style.display='none'"
                         loading="lazy">
                ` : ''}
                <div class="moment-footer">
                    <span class="moment-time">
                        <i class="far fa-clock"></i> ${Utils.formatTime(moment.time)}
                    </span>
                    <div class="moment-actions">
                        <button class="action-btn ${hasLikes ? 'liked' : ''}"
                                data-like-id="${moment.id}"
                                onclick="MomentsPageManager.handleLike(${moment.id})"
                                aria-label="点赞">
                            <i class="${hasLikes ? 'fas' : 'far'} fa-heart"></i>
                            ${hasLikes ? `<span class="like-count">${likes}</span>` : ''}
                        </button>
                        <button class="action-btn"
                                data-comment-id="${moment.id}"
                                onclick="MomentsPageManager.openCommentModal(${moment.id})"
                                aria-label="评论">
                            <i class="far fa-comment"></i>
                            ${hasComments ? `<span class="comment-count">${commentsCount}</span>` : ''}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static async handleLike(id) {
        const moment = this.data.find(m => m.id === id);
        if (!moment) return;

        const likeBtn = document.querySelector(`button[data-like-id="${id}"]`);
        if (!likeBtn) return;

        // 防止重复点击
        if (likeBtn.disabled) return;
        likeBtn.disabled = true;

        const hasLiked = likeBtn.classList.contains('liked');
        
        try {
            if (hasLiked) {
                await firebaseHandler.removeLike(id);
            } else {
                await firebaseHandler.addLike(id);
                // 添加点赞动画
                likeBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    likeBtn.style.transform = 'scale(1)';
                }, 200);
            }
        } catch (error) {
            console.error('点赞操作失败:', error);
            NotificationManager.show('操作失败，请重试', 'error');
        } finally {
            setTimeout(() => {
                likeBtn.disabled = false;
            }, 300);
        }
    }

    static async openCommentModal(id) {
        appState.currentMomentId = id;
        const moment = this.data.find(m => m.id === id);
        if (!moment) return;

        const modal = document.getElementById('commentModal');
        if (!modal) return;

        modal.style.display = 'block';

        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
            commentsList.innerHTML = '<div class="loading">加载评论中...</div>';
        }

        // 获取并显示评论
        const comments = await firebaseHandler.getComments(id);
        this.renderComments(comments);

        // 设置实时监听
        firebaseHandler.onCommentsChange(id, (newComments) => {
            this.renderComments(newComments);
        });

        setTimeout(() => {
            const input = document.getElementById('commentInput');
            if (input) input.focus();
        }, 100);
    }

    static renderComments(comments) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        if (!comments || comments.length === 0) {
            commentsList.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    ${LanguageManager.t('commentEmpty')}
                </p>
            `;
            return;
        }

        commentsList.innerHTML = comments.map((comment, index) => `
            <div class="comment-item" style="animation-delay: ${index * 0.05}s">
                <div style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                    <i class="far fa-user-circle"></i> ${Utils.escapeHtml(comment.author)} • 
                    ${this.formatCommentTime(comment.timestamp)}
                </div>
                <div style="line-height: 1.6;">${Utils.escapeHtml(comment.text)}</div>
            </div>
        `).join('');
    }

    static formatCommentTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
        
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static async handleCommentSubmit() {
        const input = document.getElementById('commentInput');
        if (!input) return;

        const content = input.value.trim();
        if (!content) {
            NotificationManager.show('请输入评论内容', 'warning');
            return;
        }

        if (content.length > MAX_COMMENT_LENGTH) {
            NotificationManager.show('评论内容不能超过500字', 'warning');
            return;
        }

        if (!appState.currentMomentId) {
            NotificationManager.show('评论失败，请重试', 'error');
            return;
        }

        try {
            await firebaseHandler.addComment(appState.currentMomentId, content);
            input.value = '';
            NotificationManager.show('评论发表成功！', 'success');
        } catch (error) {
            console.error('评论失败:', error);
            NotificationManager.show('评论失败，请重试', 'error');
        }
    }

    static async handleSearch(keyword) {
        const normalizedKeyword = Utils.normalize(keyword);
        if (!normalizedKeyword) {
            await this.render();
            return;
        }

        const filtered = this.data.filter(moment =>
            Utils.normalize(moment.content).includes(normalizedKeyword) ||
            Utils.normalize(moment.category).includes(normalizedKeyword)
        );

        await this.render(filtered);
    }
}

// ==================== 成功日记页面管理器 ====================
class SuccessPageManager {
    static init() {
        this.updatePageTexts();
        this.populateMoodFilter();
        this.renderTagFilters();
        this.bindEvents();
        this.render();
    }

    static updatePage() {
        this.updatePageTexts();
        this.populateMoodFilter();
        this.renderTagFilters();
        this.render();
    }

    static bindEvents() {
        const searchInput = document.getElementById('diarySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                appState.diarySearchKeyword = Utils.normalize(e.target.value);
                this.render();
            }));
        }

        const moodSelect = document.getElementById('diaryMoodSelect');
        if (moodSelect) {
            moodSelect.addEventListener('change', (e) => {
                appState.diaryMoodFilter = e.target.value;
                this.render();
            });
        }

        const sortSelect = document.getElementById('diarySortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                appState.diarySortBy = e.target.value;
                this.render();
            });
            this.updateSortOptions();
        }

        const resetBtn = document.getElementById('diaryResetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                const viewType = btn.dataset.view;
                const timeline = document.getElementById('diaryTimeline');
                if (timeline) {
                    if (viewType === 'grid') {
                        timeline.classList.add('grid-view');
                        timeline.classList.remove('timeline-view');
                    } else {
                        timeline.classList.add('timeline-view');
                        timeline.classList.remove('grid-view');
                    }
                }
            });
        });
    }

    static resetFilters() {
        appState.resetDiaryFilters();

        const searchInput = document.getElementById('diarySearchInput');
        const moodSelect = document.getElementById('diaryMoodSelect');
        const sortSelect = document.getElementById('diarySortSelect');

        if (searchInput) searchInput.value = '';
        if (moodSelect) moodSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'dateDesc';

        this.renderTagFilters();
        this.render();
    }

    static updatePageTexts() {
        LanguageManager.updatePageTexts();
        this.updateSortOptions();
    }

    static updateSortOptions() {
        const sortSelect = document.getElementById('diarySortSelect');
        if (!sortSelect || sortSelect.options.length < 4) return;

        const options = sortSelect.options;
        options[0].textContent = LanguageManager.t('sortDateDesc');
        options[1].textContent = LanguageManager.t('sortDateAsc');
        options[2].textContent = LanguageManager.t('sortAchievementDesc');
        options[3].textContent = LanguageManager.t('sortAchievementAsc');
    }

    static populateMoodFilter() {
        const moodSelect = document.getElementById('diaryMoodSelect');
        if (!moodSelect) return;

        const currentValue = moodSelect.value || 'all';
        const moodLibrary = window.moodLibrary || {};

        let optionsHtml = `<option value="all">${LanguageManager.t('moodAll')}</option>`;

        Object.keys(moodLibrary).forEach(code => {
            const mood = moodLibrary[code];
            const label = mood[appState.currentLanguage] || mood.zh || code;
            optionsHtml += `<option value="${code}">${Utils.escapeHtml(label)}</option>`;
        });

        moodSelect.innerHTML = optionsHtml;
        moodSelect.value = currentValue;
    }

    static renderTagFilters() {
        const container = document.getElementById('diaryTagFilter');
        if (!container) return;

        const tagLibrary = window.diaryTagLibrary || [];

        container.innerHTML = tagLibrary.map(tag => {
            const isActive = appState.selectedDiaryTags.has(tag.code);
            const label = tag[appState.currentLanguage] || tag.zh || tag.code;
            return `
                <button type="button"
                        class="filter-chip ${isActive ? 'active' : ''}"
                        data-tag="${tag.code}">
                    ${Utils.escapeHtml(label)}
                </button>
            `;
        }).join('');

        container.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.dataset.tag;
                if (appState.selectedDiaryTags.has(code)) {
                    appState.selectedDiaryTags.delete(code);
                } else {
                    appState.selectedDiaryTags.add(code);
                }
                this.renderTagFilters();
                this.render();
            });
        });
    }

    static render() {
        const container = document.getElementById('diaryTimeline');
        if (!container) return;

        const filtered = this.getFilteredData();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="diary-empty">${LanguageManager.t('timelineEmpty')}</div>
            `;
            this.updateCounter(0);
            return;
        }

        container.innerHTML = filtered.map(entry => this.renderDiaryCard(entry)).join('');
        this.updateCounter(filtered.length);
    }

    static getFilteredData() {
        const diaryData = window.successDiaryData || [];
        let data = [...diaryData];

        if (appState.selectedDiaryTags.size > 0) {
            data = data.filter(entry => {
                return Array.from(appState.selectedDiaryTags).every(tag =>
                    entry.categories.includes(tag)
                );
            });
        }

        if (appState.diaryMoodFilter !== 'all') {
            data = data.filter(entry => entry.moodCode === appState.diaryMoodFilter);
        }

        if (appState.diarySearchKeyword) {
            data = data.filter(entry => this.matchSearch(entry, appState.diarySearchKeyword));
        }

        data.sort((a, b) => this.compareEntries(a, b));

        return data;
    }

    static matchSearch(entry, keyword) {
        const fields = [
            entry.headline?.zh,
            entry.headline?.en,
            entry.content?.zh,
            entry.content?.en,
            entry.highlight?.zh,
            entry.highlight?.en,
            entry.notes?.zh,
            entry.notes?.en,
            ...entry.categories.map(code => this.getTagLabel(code)),
            this.getMoodLabel(entry.moodCode)
        ];

        return fields.some(field => field && Utils.normalize(field).includes(keyword));
    }

    static compareEntries(a, b) {
        switch (appState.diarySortBy) {
            case 'dateAsc':
                return new Date(a.date) - new Date(b.date);
            case 'achievementDesc':
                return b.achievementLevel - a.achievementLevel;
            case 'achievementAsc':
                return a.achievementLevel - b.achievementLevel;
            case 'dateDesc':
            default:
                return new Date(b.date) - new Date(a.date);
        }
    }

    static renderDiaryCard(entry) {
        const lang = appState.currentLanguage;
        const headline = entry.headline?.[lang] || '';
        const content = entry.content?.[lang] || '';
        const highlight = entry.highlight?.[lang] || '';
        const mood = this.getMood(entry.moodCode);
        const tagsHtml = this.renderTags(entry.categories);
        const attachmentsHtml = this.renderAttachments(entry.attachments);
        const coverHtml = this.renderCover(entry.coverImage);

        return `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-card">
                    <div class="diary-date">
                        ${Utils.formatDiaryDate(entry.date, lang)}
                    </div>
                    <article class="diary-card-body">
                        ${coverHtml}
                        <div class="diary-card-content">
                            ${headline ? `
                                <header class="diary-card-header">
                                    <h3 class="diary-title">
                                        ${Utils.formatMultiline(headline)}
                                    </h3>
                                </header>
                            ` : ''}
                            ${content ? `
                                <div class="diary-text">
                                    <p>${Utils.formatMultiline(content)}</p>
                                </div>
                            ` : ''}
                            ${highlight ? `
                                <div class="diary-highlight">
                                    <strong>${LanguageManager.t('timelineNotes')}：</strong>
                                    <span>${Utils.formatMultiline(highlight)}</span>
                                </div>
                            ` : ''}
                            <div class="diary-meta">
                                <div>
                                    <span class="meta-title">${LanguageManager.t('timelineTags')}：</span>
                                    <span class="meta-content">${tagsHtml || '—'}</span>
                                </div>
                                <div>
                                    <span class="meta-title">${LanguageManager.t('timelineMood')}：</span>
                                    <span class="meta-content">
                                        ${mood ? `<span class="mood-badge" style="border-color:${mood.color}; color:${mood.color};">${Utils.escapeHtml(mood[lang] || mood.zh)}</span>` : '—'}
                                    </span>
                                </div>
                                <div>
                                    <span class="meta-title">${LanguageManager.t('timelineAchievement')}：</span>
                                    <span class="achievement-badge">⭐ ${entry.achievementLevel}</span>
                                </div>
                            </div>
                            ${attachmentsHtml}
                        </div>
                    </article>
                </div>
            </div>
        `;
    }

    static renderTags(categories) {
        if (!categories || !categories.length) return '';
        return categories.map(code => {
            const label = this.getTagLabel(code);
            return `<span class="tag-pill">${Utils.escapeHtml(label)}</span>`;
        }).join('');
    }

    static renderAttachments(attachments) {
        if (!Array.isArray(attachments) || attachments.length === 0) return '';

        const items = attachments.map(path => {
            const trimmed = path.trim();
            if (!trimmed) return '';

            const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(trimmed);
            if (isImage) {
                return `<img src="${Utils.escapeHtml(trimmed)}" alt="附件" class="diary-attachment" onerror="this.style.display='none'">`;
            }

            return `<a href="${Utils.escapeHtml(trimmed)}" target="_blank" rel="noopener" class="diary-attachment-link">${Utils.escapeHtml(trimmed)}</a>`;
        }).filter(Boolean).join('');

        return items ? `
            <div class="diary-attachments">
                <span class="meta-title">${LanguageManager.t('attachments')}：</span>
                ${items}
            </div>
        ` : '';
    }

    static renderCover(coverImage) {
        if (!coverImage) return '';
        return `
            <img src="${Utils.escapeHtml(coverImage)}"
                 alt="封面图片"
                 class="diary-cover"
                 onerror="this.style.display='none'"
                 loading="lazy">
        `;
    }

    static getMood(code) {
        const moodLibrary = window.moodLibrary || {};
        return moodLibrary[code] || null;
    }

    static getMoodLabel(code) {
        const mood = this.getMood(code);
        if (!mood) return code || '';
        return mood[appState.currentLanguage] || mood.zh || code;
    }

    static getTagLabel(code) {
        const tagLibrary = window.diaryTagLibrary || [];
        const tag = tagLibrary.find(item => item.code === code);
        if (!tag) return code || '';
        return tag[appState.currentLanguage] || tag.zh || code;
    }

    static updateCounter(count) {
        const counter = document.getElementById('diaryCounter');
        if (!counter) return;

        const text = LanguageManager.t('entryCount');
        counter.textContent = typeof text === 'function' ? text(count) : text;
    }
}

// ==================== 全局控制器 ====================
class AppController {
    static init() {
        const pageElement = document.querySelector('[data-page]');
        appState.currentPage = pageElement ? pageElement.dataset.page : PAGE_TYPES.MOMENTS;

        ThemeManager.applySavedTheme();
        ThemeManager.updateThemeToggleButton();

        this.initializeGlobalControls();
        this.initializePage();
    }

    static initializeGlobalControls() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => ThemeManager.toggle());
        }

        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => LanguageManager.toggle());
            LanguageManager.updateLanguageToggleButton();
        }
    }

    static initializePage() {
        switch (appState.currentPage) {
            case PAGE_TYPES.MOMENTS:
                MomentsPageManager.init();
                break;
            case PAGE_TYPES.SUCCESS:
                SuccessPageManager.init();
                break;
            default:
                console.warn('Unknown page type:', appState.currentPage);
        }
    }
}

// ==================== 全局暴露 ====================
window.MomentsPageManager = MomentsPageManager;
window.SuccessPageManager = SuccessPageManager;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    try {
        AppController.init();
    } catch (error) {
        console.error('页面初始化失败:', error);
        NotificationManager.show('页面初始化失败，请刷新重试', 'error');
    }
});

// ==================== 动画样式 ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        transform-origin: top right;
    }

    .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        color: #999;
    }

    .loading-spinner::after {
        content: '';
        width: 20px;
        height: 20px;
        margin-left: 10px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .like-btn.liked {
        animation: likeJump 0.3s ease;
    }

    @keyframes likeJump {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);



