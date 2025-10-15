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
    FIREBASE: {
        CONFIG: {
            apiKey: "AIzaSyD9NwlJxYiRjFh3cPjpJGmQAhogmrFpU4M",
            authDomain: "kuangke-galaxy.firebaseapp.com",
            projectId: "kuangke-galaxy",
            storageBucket: "kuangke-galaxy.firebasestorage.app",
            messagingSenderId: "416862048915",
            appId: "1:416862048915:web:6578fcd23d8cf882c53366",
            measurementId: "G-VZCQM1H4BR"
        },
        DB_URL: 'https://kuangke-galaxy-default-rtdb.asia-southeast1.firebasedatabase.app'
    }
});

// ==================== 优化版全局状态管理 ====================
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
        this.activeFirebaseListeners = new Map();
        this.pendingOperations = new Map();
    }

    loadInitialState() {
        this.currentLanguage = this.loadFromStorage(CONFIG.STORAGE_KEYS.language) || 'zh';
    }

    // 优化的存储操作
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

    // 事件监听系统
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

    // Firebase 监听器管理
    setFirebaseListener(type, id, ref, eventType, callback) {
        const key = this._getListenerKey(type, id, eventType);
        this.stopFirebaseListener(type, id, eventType);
        
        ref.on(eventType, callback);
        this.activeFirebaseListeners.set(key, { ref, eventType, callback });
    }

    stopFirebaseListener(type, id, eventType) {
        const key = this._getListenerKey(type, id, eventType);
        const listener = this.activeFirebaseListeners.get(key);
        if (listener) {
            listener.ref.off(listener.eventType, listener.callback);
            this.activeFirebaseListeners.delete(key);
        }
    }

    stopAllFirebaseListeners() {
        this.activeFirebaseListeners.forEach(({ ref, eventType, callback }) => {
            ref.off(eventType, callback);
        });
        this.activeFirebaseListeners.clear();
    }

    _getListenerKey(type, id, eventType) {
        return `${type}_${id}_${eventType}`;
    }

    // 操作锁机制
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

// ==================== 优化版工具函数 ====================
class Utils {
    static #textEncoder = new TextEncoder();
    
    // 安全的HTML转义
    static escapeHtml(text) {
        if (text == null) return '';
        
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    // 多行文本格式化
    static formatMultiline(text) {
        if (!text) return '';
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    }

    // 优化的时间格式化
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

        if (diff < ranges.minute) return LanguageManager.t('timeJustNow');
        if (diff < ranges.hour) return LanguageManager.t('timeMinutesAgo', { 
            minutes: Math.floor(diff / ranges.minute) 
        });
        if (diff < ranges.day) return LanguageManager.t('timeHoursAgo', { 
            hours: Math.floor(diff / ranges.hour) 
        });
        if (diff < ranges.day * 2) return LanguageManager.t('timeYesterday');
        if (diff < ranges.day * 7) return LanguageManager.t('timeDaysAgo', { 
            days: Math.floor(diff / ranges.day) 
        });

        return date.toLocaleDateString(appState.currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static formatDiaryDate(dateStr, lang) {
        const date = new Date(dateStr);
        if (!this.isValidDate(date)) return dateStr;

        return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        });
    }

    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    // 文本处理
    static normalize(text) {
        return String(text ?? '').toLowerCase().trim();
    }

    // 性能优化的防抖
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

    // 节流函数
    static throttle(func, limit) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    }

    // 生成唯一ID
    static generateId(prefix = '') {
        return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    static generateGuestUsername() {
        return `${LanguageManager.t('guest')}${Math.floor(Math.random() * 10000)}`;
    }

    // 安全的JSON解析
    static safeJsonParse(str, fallback = null) {
        try {
            return JSON.parse(str);
        } catch {
            return fallback;
        }
    }

    // 图片预加载
    static preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}

// ==================== 优化版通知管理器 ====================
class NotificationManager {
    static #container = null;
    static #notifications = new Set();

    static init() {
        this.#createContainer();
    }

    static #createContainer() {
        this.#container = document.createElement('div');
        this.#container.className = 'notification-container';
        Object.assign(this.#container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '10000',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });
        document.body.appendChild(this.#container);
    }

    static show(message, type = 'info', duration = CONFIG.TIMING.NOTIFICATION_DURATION) {
        if (!this.#container) this.init();

        const notification = this.#createNotificationElement(message, type);
        this.#container.appendChild(notification);
        this.#notifications.add(notification);

        // 自动移除
        const removeTimer = setTimeout(() => {
            this.remove(notification);
        }, duration);

        // 点击移除
        notification.addEventListener('click', () => {
            clearTimeout(removeTimer);
            this.remove(notification);
        });

        return notification;
    }

    static #createNotificationElement(message, type) {
        const config = {
            success: { icon: 'check-circle', color: '#10b981' },
            warning: { icon: 'exclamation-triangle', color: '#f59e0b' },
            error: { icon: 'times-circle', color: '#ef4444' },
            info: { icon: 'info-circle', color: '#3b82f6' }
        }[type] || config.info;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${config.icon}"></i>
            <span>${Utils.escapeHtml(message)}</span>
            <button class="notification-close" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
        `;

        Object.assign(notification.style, {
            background: config.color,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            animation: 'notificationSlideIn 0.3s ease-out',
            maxWidth: '300px',
            wordBreak: 'break-word'
        });

        // 关闭按钮事件
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

// ==================== 优化版语言管理器 ====================
class LanguageManager {
    static #translations = {
        zh: {
            successTitle: '成功日记时间轴',
            successSubtitle: '当你写成功日记的时候,你会对自己,对世界,还有对成功的规律作更深入的思考...',
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
            noResults: '暂无内容',
            timeJustNow: '刚刚',
            timeMinutesAgo: (data) => `${data.minutes}分钟前`,
            timeHoursAgo: (data) => `${data.hours}小时前`,
            timeYesterday: '昨天',
            timeDaysAgo: (data) => `${data.days}天前`,
            loadingComments: '加载评论中...',
            loadingData: '加载中...',
            enterCommentContent: '请输入评论内容',
            commentTooLong: '评论内容不能超过500字',
            commentFailed: '评论失败，请重试',
            commentSuccess: '评论发表成功！',
            operationFailed: '操作失败，请重试',
            likeSuccess: '点赞成功！',
            unlikeSuccess: '已取消点赞',
            pageInitFailed: '页面初始化失败，请刷新重试',
            firebaseWarnLocal: 'Firebase SDK 未加载或未初始化，将使用本地存储模式',
            firebaseErrorInit: 'Firebase 初始化失败',
            guest: '游客',
            likeAriaLabel: '点赞',
            commentAriaLabel: '评论'
        },
        en: {
            // English translations...
        }
    };

    static t(key, data = {}) {
        const langPack = this.#translations[appState.currentLanguage] || this.#translations.zh;
        const fallbackPack = this.#translations.zh;
        
        let value = langPack[key] ?? fallbackPack[key] ?? key;

        if (typeof value === 'function') {
            return value(data);
        }
        return value;
    }

    static toggle() {
        appState.currentLanguage = appState.currentLanguage === 'zh' ? 'en' : 'zh';
        appState.saveToStorage(CONFIG.STORAGE_KEYS.language, appState.currentLanguage);
        
        this.updateLanguageToggleButton();
        this.updatePageTexts();
        
        // 通知页面更新
        appState.emit('languageChanged', appState.currentLanguage);
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
        // 更新所有带data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.t(key);
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        });

        // 更新特定元素的文本
        this.#updateSpecificElements();
    }

    static #updateSpecificElements() {
        const elements = {
            '#diarySearchInput': 'searchPlaceholder',
            '#commentInput': 'commentPlaceholder',
            '#submitComment': 'commentSubmit'
        };

        Object.entries(elements).forEach(([selector, key]) => {
            const element = document.querySelector(selector);
            if (element) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.t(key);
                } else {
                    element.textContent = this.t(key);
                }
            }
        });
    }
}

// ==================== 优化版Firebase处理器 ====================
class FirebaseHandler {
    constructor() {
        this.#init();
    }

    #init() {
        console.log('[FirebaseHandler] 初始化开始');
        
        if (this.#isFirebaseUnavailable()) {
            console.warn(LanguageManager.t('firebaseWarnLocal'));
            this.useLocalStorage = true;
            return;
        }

        try {
            this.#initializeFirebase();
            this.useLocalStorage = false;
            console.log('[FirebaseHandler] Firebase模式初始化完成');
        } catch (error) {
            console.error(LanguageManager.t('firebaseErrorInit'), error);
            this.useLocalStorage = true;
        }
    }

    #isFirebaseUnavailable() {
        return typeof firebase === 'undefined' || !firebase.apps || firebase.apps.length === 0;
    }

    #initializeFirebase() {
        if (!firebase.apps.length) {
            firebase.initializeApp(CONFIG.FIREBASE.CONFIG);
        }
        
        this.database = firebase.database(CONFIG.FIREBASE.DB_URL);
        this.likesRef = this.database.ref('likes');
        this.commentsRef = this.database.ref('comments');
        this.momentsRef = this.database.ref('moments');
    }

    // 重试机制
    async #withRetry(operation, maxAttempts = CONFIG.LIMITS.MAX_RETRY_ATTEMPTS) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                if (attempt < maxAttempts) {
                    await this.#delay(attempt * 1000); // 指数退避
                }
            }
        }
        
        throw lastError;
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 数据同步
    async syncMomentsData() {
        if (this.useLocalStorage) {
            return window.momentsData || [];
        }
        
        return this.#withRetry(async () => {
            const snapshot = await this.momentsRef.once('value');
            const fbMoments = snapshot.val() || [];
            const localMoments = window.momentsData || [];

            // 合并去重
            const fbIds = new Set(fbMoments.map(m => m.id));
            const merged = [
                ...fbMoments,
                ...localMoments.filter(m => !fbIds.has(m.id))
            ];
            
            return merged;
        });
    }

    async saveMomentsToFirebase(moments) {
        if (this.useLocalStorage) return false;
        
        return this.#withRetry(async () => {
            await this.momentsRef.set(moments);
            return true;
        });
    }

    // 点赞相关方法
    async getLikes(momentId) {
        if (this.useLocalStorage) {
            return parseInt(localStorage.getItem(`likes_${momentId}`) || '0');
        }

        return this.#withRetry(async () => {
            const snapshot = await this.likesRef.child(momentId).once('value');
            return snapshot.val() || 0;
        });
    }

    async addLike(momentId) {
        return this.#modifyLikeCount(momentId, 1);
    }

    async removeLike(momentId) {
        return this.#modifyLikeCount(momentId, -1);
    }

    async #modifyLikeCount(momentId, delta) {
        if (this.useLocalStorage) {
            return this.#handleLocalLike(momentId, delta);
        }

        return this.#withRetry(async () => {
            let newLikes = 0;
            await this.likesRef.child(momentId).transaction((currentLikes) => {
                newLikes = Math.max(0, (currentLikes || 0) + delta);
                return newLikes;
            });
            return newLikes;
        });
    }

    #handleLocalLike(momentId, delta) {
        const current = parseInt(localStorage.getItem(`likes_${momentId}`) || '0');
        const newLikes = Math.max(0, current + delta);
        localStorage.setItem(`likes_${momentId}`, newLikes.toString());
        return newLikes;
    }

    // 评论相关方法
    async getComments(momentId) {
        if (this.useLocalStorage) {
            const stored = localStorage.getItem(`comments_${momentId}`);
            return Utils.safeJsonParse(stored, []);
        }

        return this.#withRetry(async () => {
            const snapshot = await this.commentsRef.child(momentId).once('value');
            const commentsData = snapshot.val();
            
            if (!commentsData) return [];
            
            return Object.values(commentsData)
                .sort((a, b) => b.timestamp - a.timestamp);
        });
    }

    async addComment(momentId, commentText, author) {
        if (this.useLocalStorage) {
            return this.#handleLocalComment(momentId, commentText, author);
        }

        return this.#withRetry(async () => {
            const newCommentRef = this.commentsRef.child(momentId).push();
            const comment = {
                id: newCommentRef.key,
                text: commentText,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                author: author
            };
            
            await newCommentRef.set(comment);
            return comment;
        });
    }

    #handleLocalComment(momentId, commentText, author) {
        const comments = this.getComments(momentId);
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

    // 监听器方法保持不变...
    onLikesChange(momentId, callback) {
        if (this.useLocalStorage) return;
        
        const ref = this.likesRef.child(momentId);
        appState.setFirebaseListener('likes', momentId, ref, 'value', (snapshot) => {
            callback(snapshot.val() || 0);
        });
    }

    onCommentsChange(momentId, callback) {
        if (this.useLocalStorage) return;
        
        const ref = this.commentsRef.child(momentId);
        appState.setFirebaseListener('comments', momentId, ref, 'value', (snapshot) => {
            const commentsData = snapshot.val();
            const commentsArray = commentsData ? Object.values(commentsData) : [];
            commentsArray.sort((a, b) => b.timestamp - a.timestamp);
            callback(commentsArray);
        });
    }

    stopListening(momentId = null) {
        if (this.useLocalStorage) return;

        if (momentId) {
            appState.stopFirebaseListener('likes', momentId, 'value');
            appState.stopFirebaseListener('comments', momentId, 'value');
        } else {
            appState.stopAllFirebaseListeners();
        }
    }
}

// 单例模式确保FirebaseHandler唯一实例
if (typeof window.firebaseHandler === 'undefined') {
    window.firebaseHandler = new FirebaseHandler();
}

// ==================== 优化版朋友圈页面管理器 ====================
class MomentsPageManager {
    static #data = [];
    static #eventListeners = new Map();
    static #likeProcessing = new Set();

    static async init() {
        await this.#loadData();
        this.#bindEvents();
        await this.render();
        
        // 监听语言变化
        appState.on('languageChanged', () => this.render());
    }

    static async #loadData() {
        try {
            const savedData = this.#loadFromStorage();
            const defaultData = window.momentsData || [];
            const fbSyncedData = await this.#syncFirebaseData();

            this.#data = this.#mergeData(savedData, fbSyncedData, defaultData);
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

    static async #syncFirebaseData() {
        if (window.firebaseHandler.useLocalStorage) return [];
        
        try {
            return await window.firebaseHandler.syncMomentsData();
        } catch (error) {
            console.error('Firebase数据同步失败:', error);
            return [];
        }
    }

    static #mergeData(saved, firebase, defaults) {
        const allIds = new Set();
        const merged = [];

        // 按优先级合并数据
        [firebase, saved, defaults].forEach(source => {
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
            // 异步同步到Firebase
            if (!window.firebaseHandler.useLocalStorage) {
                window.firebaseHandler.saveMomentsToFirebase(this.#data).catch(console.error);
            }
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    static #bindEvents() {
        this.#clearEventListeners();
        this.#bindSearch();
        this.#bindCategories();
        this.#initCommentModal();
        LanguageManager.updatePageTexts();
    }

    // 其他方法保持类似优化模式...
    static async render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        window.firebaseHandler.stopListening();

        const dataToRender = filteredData || this.#data;
        const filtered = this.#filterByCategory(dataToRender);
        const sorted = this.#sortByDate(filtered);

        if (sorted.length === 0) {
            container.innerHTML = this.#renderEmptyState();
            return;
        }

        // 使用文档片段优化DOM操作
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');
        
        for (let i = 0; i < sorted.length; i++) {
            const moment = sorted[i];
            const [likes, comments] = await Promise.all([
                window.firebaseHandler.getLikes(moment.id),
                window.firebaseHandler.getComments(moment.id)
            ]);
            
            tempContainer.innerHTML = this.#renderMomentCard(moment, i, likes, comments.length);
            if (tempContainer.firstElementChild) {
                fragment.appendChild(tempContainer.firstElementChild);
            }
        }

        container.innerHTML = '';
        container.appendChild(fragment);

        // 设置实时监听
        sorted.forEach(moment => this.#setupRealtimeListeners(moment.id));
    }

    static async handleLike(momentId) {
        if (this.#likeProcessing.has(momentId)) return;
        
        this.#likeProcessing.add(momentId);
        const likeBtn = document.querySelector(`button[data-like-id="${momentId}"]`);
        
        try {
            const userLikeKey = `user_liked_${momentId}`;
            const hasUserLiked = localStorage.getItem(userLikeKey) === 'true';

            if (hasUserLiked) {
                await window.firebaseHandler.removeLike(momentId);
                localStorage.removeItem(userLikeKey);
                NotificationManager.show(LanguageManager.t('unlikeSuccess'), 'info');
            } else {
                await window.firebaseHandler.addLike(momentId);
                localStorage.setItem(userLikeKey, 'true');
                this.#animateLikeButton(likeBtn);
                NotificationManager.show(LanguageManager.t('likeSuccess'), 'success');
            }
        } catch (error) {
            console.error('点赞操作失败:', error);
            NotificationManager.show(LanguageManager.t('operationFailed'), 'error');
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

    // 其他辅助方法...
    static #filterByCategory(data) {
        return appState.currentCategory === 'all' ? 
            data : data.filter(m => m.category === appState.currentCategory);
    }

    static #sortByDate(data) {
        return [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    static #renderEmptyState() {
        return `<div class="no-results">${LanguageManager.t('noResults')}</div>`;
    }
}

// ==================== 优化的成功日记页面管理器 ====================
class SuccessPageManager {
    static #filters = {
        mood: 'all',
        sort: 'dateDesc',
        search: '',
        tags: new Set()
    };

    static init() {
        this.#bindEvents();
        this.updatePage();
        
        // 监听语言变化
        appState.on('languageChanged', () => this.updatePage());
    }

    static updatePage() {
        this.updatePageTexts();
        this.#populateMoodFilter();
        this.#renderTagFilters();
        this.render();
    }

    static #bindEvents() {
        this.#bindSearch();
        this.#bindFilters();
        this.#bindViewToggle();
    }

    static #bindSearch() {
        const searchInput = document.getElementById('diarySearchInput');
        if (searchInput) {
            const handler = Utils.debounce((e) => {
                this.#filters.search = Utils.normalize(e.target.value);
                this.render();
            });
            searchInput.addEventListener('input', handler);
        }
    }

    // 其他方法类似优化...
}

// ==================== 优化版应用控制器 ====================
class AppController {
    static async init() {
        try {
            this.#detectPageType();
            
            await this.#initializeServices();
            this.#initializeGlobalControls();
            await this.#initializePage();
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            NotificationManager.show(LanguageManager.t('pageInitFailed'), 'error');
        }
    }

    static #detectPageType() {
        const pageElement = document.querySelector('[data-page]');
        appState.currentPage = pageElement ? 
            pageElement.dataset.page : CONFIG.PAGE_TYPES.MOMENTS;
    }

    static async #initializeServices() {
        ThemeManager.applySavedTheme();
        NotificationManager.init();
        
        // 等待关键资源加载
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
        this.#bindThemeToggle();
        this.#bindLanguageToggle();
    }

    static #bindThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => ThemeManager.toggle());
            ThemeManager.updateThemeToggleButton();
        }
    }

    static #bindLanguageToggle() {
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => LanguageManager.toggle());
            LanguageManager.updateLanguageToggleButton();
        }
    }

    static async #initializePage() {
        switch (appState.currentPage) {
            case CONFIG.PAGE_TYPES.MOMENTS:
                await MomentsPageManager.init();
                break;
            case CONFIG.PAGE_TYPES.SUCCESS:
                SuccessPageManager.init();
                break;
            default:
                console.warn('未知页面类型:', appState.currentPage);
        }
    }
}

// ==================== 优化的样式和动画 ====================
class StyleManager {
    static init() {
        this.#injectStyles();
    }

    static #injectStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        document.head.appendChild(style);
    }

    static #getStyles() {
        return `
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes likeJump {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .loading-spinner {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2rem;
                color: var(--text-secondary);
            }

            .loading-spinner::after {
                content: '';
                width: 24px;
                height: 24px;
                margin-left: 12px;
                border: 4px solid var(--border-color-light);
                border-top: 4px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                opacity: 0.7;
                padding: 4px;
                border-radius: 4px;
                transition: opacity 0.2s;
            }

            .notification-close:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }
        `;
    }
}

// ==================== 全局暴露和初始化 ====================
window.MomentsPageManager = MomentsPageManager;
window.SuccessPageManager = SuccessPageManager;

// 优化的事件监听和错误处理
document.addEventListener('DOMContentLoaded', () => {
    // 初始化样式管理器
    StyleManager.init();
    
    // 启动应用
    AppController.init().catch(error => {
        console.error('应用启动失败:', error);
    });
});

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});



