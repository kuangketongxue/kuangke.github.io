// ==================== 常量定义 ====================
const STORAGE_KEYS = Object.freeze({
    moments: 'momentsData',
    diary: 'successDiaryData',
    theme: 'theme',
    language: 'language',
    username: 'username'
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
        this.activeFirebaseListeners = new Map();
    }

    loadFromStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`[AppState] Failed to load from storage: ${key}`, error);
            return null;
        }
    }

    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn(`[AppState] Failed to save to storage: ${key}`, error);
        }
    }

    resetDiaryFilters() {
        this.selectedDiaryTags.clear();
        this.diaryMoodFilter = 'all';
        this.diarySortBy = 'dateDesc';
        this.diarySearchKeyword = '';
    }

    setFirebaseListener(type, id, ref, eventType, callback) {
        const key = `${type}_${id}_${eventType}`;
        if (this.activeFirebaseListeners.has(key)) {
            this.stopFirebaseListener(type, id, eventType);
        }
        ref.on(eventType, callback);
        this.activeFirebaseListeners.set(key, { ref, eventType, callback });
    }

    stopFirebaseListener(type, id, eventType) {
        const key = `${type}_${id}_${eventType}`;
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

        if (diff < oneMinute) return LanguageManager.t('timeJustNow');
        if (diff < oneHour) return LanguageManager.t('timeMinutesAgo', { minutes: Math.floor(diff / oneMinute) });
        if (diff < oneDay) return LanguageManager.t('timeHoursAgo', { hours: Math.floor(diff / oneHour) });
        if (diff < oneDay * 2) return LanguageManager.t('timeYesterday');
        if (diff < oneDay * 7) return LanguageManager.t('timeDaysAgo', { days: Math.floor(diff / oneDay) });

        return date.toLocaleString(appState.currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
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
                func.apply(this, args);
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
    },

    generateGuestUsername() {
        return `${LanguageManager.t('guest')}${Math.floor(Math.random() * 10000)}`;
    }
};

// ==================== 通知管理器 ====================
class NotificationManager {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const iconMap = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
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
            fontSize: '0.95rem',
            maxWidth: '300px',
            wordBreak: 'break-word'
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
            noResults: 'No content available',
            timeJustNow: 'Just now',
            timeMinutesAgo: (data) => `${data.minutes} minutes ago`,
            timeHoursAgo: (data) => `${data.hours} hours ago`,
            timeYesterday: 'Yesterday',
            timeDaysAgo: (data) => `${data.days} days ago`,
            loadingComments: 'Loading comments...',
            loadingData: 'Loading...',
            enterCommentContent: 'Please enter comment content',
            commentTooLong: 'Comment content cannot exceed 500 characters',
            commentFailed: 'Comment failed, please try again',
            commentSuccess: 'Comment posted successfully!',
            operationFailed: 'Operation failed, please try again',
            likeSuccess: 'Liked successfully!',
            unlikeSuccess: 'Like removed',
            pageInitFailed: 'Page initialization failed, please refresh and try again',
            firebaseWarnLocal: 'Firebase SDK not loaded or initialized, using local storage mode',
            firebaseErrorInit: 'Firebase initialization failed',
            guest: 'Guest',
            likeAriaLabel: 'Like',
            commentAriaLabel: 'Comment'
        }
    };

    static t(key, data = {}) {
        const langPack = this.translations[appState.currentLanguage] || this.translations.zh;
        const fallbackPack = this.translations.zh;
        let value = langPack[key] !== undefined ? langPack[key] : fallbackPack[key];

        if (typeof value === 'function') {
            return value(data);
        }
        return value !== undefined ? value : key;
    }

    static toggle() {
        appState.currentLanguage = appState.currentLanguage === 'zh' ? 'en' : 'zh';
        appState.saveToStorage(STORAGE_KEYS.language, appState.currentLanguage);
        this.updateLanguageToggleButton();

        if (appState.currentPage === PAGE_TYPES.MOMENTS) {
            MomentsPageManager.render();
        } else if (appState.currentPage === PAGE_TYPES.SUCCESS) {
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

        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            commentInput.placeholder = this.t('commentPlaceholder');
        }

        const submitCommentButton = document.getElementById('submitComment');
        if (submitCommentButton) {
            submitCommentButton.textContent = this.t('commentSubmit');
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

// ==================== Firebase Handler（修复重复声明+实例稳定性） ====================
// 关键修复1：确保类仅定义一次，避免覆盖
if (typeof FirebaseHandler === 'undefined') {
    class FirebaseHandler {
        constructor() {
            console.log('[FirebaseHandler] 初始化开始');
            if (typeof firebase === 'undefined' || !firebase.apps || firebase.apps.length === 0) {
                console.warn(LanguageManager.t('firebaseWarnLocal'));
                this.useLocalStorage = true;
                console.log('[FirebaseHandler] 切换到本地存储模式');
                return;
            }

            try {
                // 完整Firebase配置
                const firebaseConfig = {
                    apiKey: "AIzaSyD9NwlJxYiRjFh3cPjpJGmQAhogmrFpU4M",
                    authDomain: "kuangke-galaxy.firebaseapp.com",
                    projectId: "kuangke-galaxy",
                    storageBucket: "kuangke-galaxy.firebasestorage.app",
                    messagingSenderId: "416862048915",
                    appId: "1:416862048915:web:6578fcd23d8cf882c53366",
                    measurementId: "G-VZCQM1H4BR"
                };
                
                // 初始化Firebase应用（确保仅初始化一次）
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                    console.log('[FirebaseHandler] Firebase应用初始化成功');
                }
                
                // 关键修复2：明确指定数据库区域（解决区域不匹配警告）
                this.database = firebase.database('https://kuangke-galaxy-default-rtdb.asia-southeast1.firebasedatabase.app');
                console.log('[FirebaseHandler] 数据库连接成功（亚洲东南区）');
                
                // 初始化数据引用
                this.likesRef = this.database.ref('likes');
                this.commentsRef = this.database.ref('comments');
                this.momentsRef = this.database.ref('moments');
                this.useLocalStorage = false;
                console.log('[FirebaseHandler] Firebase模式初始化完成');
            } catch (error) {
                console.error(LanguageManager.t('firebaseErrorInit'), error);
                this.useLocalStorage = true;
                console.log('[FirebaseHandler] 初始化失败，切换到本地存储模式');
            }
        }

        // ============ 朋友圈数据同步方法（核心方法，确保存在） ============
        async syncMomentsData() {
            console.log('[FirebaseHandler] 调用syncMomentsData方法');
            if (this.useLocalStorage) {
                console.log('[FirebaseHandler] 使用本地存储数据');
                return window.momentsData || [];
            }
            
            try {
                console.log('[FirebaseHandler] 从Firebase加载朋友圈数据');
                const snapshot = await this.momentsRef.once('value');
                const fbMoments = snapshot.val() || [];
                const localMoments = window.momentsData || [];

                // 合并去重数据（Firebase数据优先）
                const fbIds = new Set(fbMoments.map(m => m.id));
                const merged = [...fbMoments, ...localMoments.filter(m => !fbIds.has(m.id))];
                console.log('[FirebaseHandler] 数据合并完成，共', merged.length, '条');
                return merged;
            } catch (error) {
                console.error('同步Firebase朋友圈数据失败:', error);
                return window.momentsData || [];
            }
        }

        async saveMomentsToFirebase(moments) {
            if (this.useLocalStorage) return false;
            try {
                await this.momentsRef.set(moments);
                console.log('朋友圈数据已同步到Firebase');
                return true;
            } catch (error) {
                console.error('保存朋友圈数据到Firebase失败:', error);
                return false;
            }
        }

        // ============ 点赞相关方法 ============
        async getLikes(momentId) {
            if (this.useLocalStorage) {
                return parseInt(localStorage.getItem(`likes_${momentId}`) || '0');
            }
            try {
                const snapshot = await this.likesRef.child(momentId).once('value');
                return snapshot.val() || 0;
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
                let newLikes = 0;
                await this.likesRef.child(momentId).transaction((currentLikes) => {
                    newLikes = (currentLikes || 0) + 1;
                    return newLikes;
                });
                console.log(`点赞成功 [${momentId}]: → ${newLikes}`);
                return newLikes;
            } catch (error) {
                console.error(`点赞失败 [${momentId}]:`, error);
                throw error;
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
                let newLikes = 0;
                await this.likesRef.child(momentId).transaction((currentLikes) => {
                    newLikes = Math.max(0, (currentLikes || 0) - 1);
                    return newLikes;
                });
                console.log(`取消点赞成功 [${momentId}]: → ${newLikes}`);
                return newLikes;
            } catch (error) {
                console.error(`取消点赞失败 [${momentId}]:`, error);
                throw error;
            }
        }

        onLikesChange(momentId, callback) {
            if (this.useLocalStorage) return;
            const ref = this.likesRef.child(momentId);
            appState.setFirebaseListener('likes', momentId, ref, 'value', (snapshot) => {
                const likes = snapshot.val() || 0;
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

        async addComment(momentId, commentText, author) {
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
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    author: author
                };
                await newCommentRef.set(comment);
                console.log(`评论添加成功 [${momentId}]:`, comment);
                return comment;
            } catch (error) {
                console.error(`添加评论失败 [${momentId}]:`, error);
                throw error;
            }
        }

        onCommentsChange(momentId, callback) {
            if (this.useLocalStorage) return;
            const ref = this.commentsRef.child(momentId);
            appState.setFirebaseListener('comments', momentId, ref, 'value', (snapshot) => {
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
                appState.stopFirebaseListener('likes', momentId, 'value');
                appState.stopFirebaseListener('comments', momentId, 'value');
            } else {
                appState.stopAllFirebaseListeners();
            }
        }
    }
}

// 关键修复3：确保全局实例唯一且类型正确，避免非预期覆盖
if (typeof window.firebaseHandler === 'undefined' || !(window.firebaseHandler instanceof FirebaseHandler)) {
    window.firebaseHandler = new FirebaseHandler();
}

// ==================== 本地存储管理器 ====================
class StorageManager {
    static loadMomentsData() {
        try {
            const saved = appState.loadFromStorage(STORAGE_KEYS.moments);
            if (!saved) return null;
            return JSON.parse(saved);
        } catch (error) {
            console.error('加载朋友圈数据失败:', error);
            NotificationManager.show(LanguageManager.t('operationFailed'), 'error');
            return null;
        }
    }

    static saveMomentsData(data) {
        try {
            appState.saveToStorage(STORAGE_KEYS.moments, JSON.stringify(data));
            // 调用前校验实例，避免方法不存在
            if (window.firebaseHandler instanceof FirebaseHandler) {
                window.firebaseHandler.saveMomentsToFirebase(data).catch(err => {
                    console.error('同步朋友圈数据到Firebase失败:', err);
                });
            }
            return true;
        } catch (error) {
            console.error('保存朋友圈数据失败:', error);
            NotificationManager.show(LanguageManager.t('operationFailed'), 'error');
            return false;
        }
    }
}

// ==================== 朋友圈页面管理器（核心调用处修复） ====================
class MomentsPageManager {
    static data = [];
    static eventListeners = new Map();
    static useLocalStorageOnly = false;

    static async init() {
        console.log('MomentsPageManager初始化开始');
        await this.loadData();
        this.bindEvents();
        await this.render();
    }

    static async loadData() {
        console.log('MomentsPageManager.loadData调用');
        // 关键修复4：调用syncMomentsData前，强制校验实例和方法存在性
        if (!(window.firebaseHandler instanceof FirebaseHandler) || typeof window.firebaseHandler.syncMomentsData !== 'function') {
            console.error('firebaseHandler实例异常，重新初始化');
            window.firebaseHandler = new FirebaseHandler();
        }
        console.log('window.firebaseHandler:', window.firebaseHandler);
        console.log('syncMomentsData类型:', typeof window.firebaseHandler.syncMomentsData);

        const savedData = StorageManager.loadMomentsData();
        const defaultData = window.momentsData || [];
        let fbSyncedData = [];

        // 从Firebase同步数据（确保方法存在才调用）
        if (!this.useLocalStorageOnly && typeof window.firebaseHandler.syncMomentsData === 'function') {
            console.log('开始同步Firebase数据');
            fbSyncedData = await window.firebaseHandler.syncMomentsData();
            console.log('Firebase数据同步完成，共', fbSyncedData.length, '条');
        }

        // 合并数据
        if (savedData && savedData.length > 0) {
            const savedIds = new Set(savedData.map(m => m.id));
            const fbIds = new Set(fbSyncedData.map(m => m.id));
            const newDefaults = defaultData.filter(m => !savedIds.has(m.id) && !fbIds.has(m.id));
            this.data = [...savedData, ...fbSyncedData, ...newDefaults];
        } else {
            const fbIds = new Set(fbSyncedData.map(m => m.id));
            const newDefaults = defaultData.filter(m => !fbIds.has(m.id));
            this.data = [...fbSyncedData, ...newDefaults];
        }

        // 确保每条数据有ID
        this.data = this.data.map(m => ({ 
            ...m, 
            id: m.id || `moment_${Date.now() + Math.random().toString().slice(2, 6)}` 
        }));

        // 保存合并后的数据
        StorageManager.saveMomentsData(this.data);
        console.log('朋友圈数据加载完成，共', this.data.length, '条');
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
            this.eventListeners.set('searchInput', { element: searchInput, handler: debouncedSearch, event: 'input' });
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
            this.eventListeners.set(`category-${btn.dataset.category}`, { element: btn, handler, event: 'click' });
        });

        // 默认选中“全部”分类
        const allBtn = document.querySelector('.category-btn[data-category="all"]');
        if (allBtn) allBtn.classList.add('active');

        this.initCommentModal();
        LanguageManager.updatePageTexts();
    }

    static clearEventListeners() {
        this.eventListeners.forEach(({ element, handler, event }) => {
            if (element && handler) {
                element.removeEventListener(event, handler);
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
                    window.firebaseHandler.stopListening(appState.currentMomentId);
                    appState.currentMomentId = null;
                }
            };
            closeBtn.addEventListener('click', handler);
            this.eventListeners.set('modalClose', { element: closeBtn, handler, event: 'click' });
        }

        const windowClickHandler = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (appState.currentMomentId) {
                    window.firebaseHandler.stopListening(appState.currentMomentId);
                    appState.currentMomentId = null;
                }
            }
        };
        window.addEventListener('click', windowClickHandler);
        this.eventListeners.set('windowModalClose', { element: window, handler: windowClickHandler, event: 'click' });

        const submitBtn = document.getElementById('submitComment');
        if (submitBtn) {
            const handler = () => this.handleCommentSubmit();
            submitBtn.addEventListener('click', handler);
            this.eventListeners.set('submitComment', { element: submitBtn, handler, event: 'click' });
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
            this.eventListeners.set('commentInput', { element: commentInput, handler, event: 'keypress' });
        }
    }

    static async render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        window.firebaseHandler.stopListening();

        const dataToRender = filteredData || this.data;
        const filtered = this.filterByCategory(dataToRender);
        const sorted = this.sortByDate(filtered);

        if (sorted.length === 0) {
            container.innerHTML = `<div class="no-results">${LanguageManager.t('noResults')}</div>`;
            return;
        }

        container.innerHTML = `<div class="loading-spinner">${LanguageManager.t('loadingData')}</div>`;

        const cardsHtml = [];
        for (let i = 0; i < sorted.length; i++) {
            const moment = sorted[i];
            const likes = await window.firebaseHandler.getLikes(moment.id);
            const comments = await window.firebaseHandler.getComments(moment.id);
            cardsHtml.push(this.renderMomentCard(moment, i, likes, comments.length));
        }

        container.innerHTML = cardsHtml.join('');

        sorted.forEach(moment => {
            this.setupRealtimeListeners(moment.id);
        });
    }

    static setupRealtimeListeners(momentId) {
        window.firebaseHandler.onLikesChange(momentId, (newLikes) => {
            const likeBtn = document.querySelector(`button[data-like-id="${momentId}"]`);
            if (!likeBtn) return;

            const userLikeKey = `user_liked_${momentId}`;
            const hasUserLiked = localStorage.getItem(userLikeKey) === 'true';
            const hasActiveLike = newLikes > 0 || hasUserLiked;

            likeBtn.innerHTML = `
                <i class="${hasActiveLike ? 'fas' : 'far'} fa-heart"></i>
                ${newLikes > 0 ? `<span class="like-count">${newLikes}</span>` : ''}
            `;
            likeBtn.classList.toggle('liked', hasActiveLike);
        });

        window.firebaseHandler.onCommentsChange(momentId, (newComments) => {
            const commentBtn = document.querySelector(`button[data-comment-id="${momentId}"]`);
            if (!commentBtn) return;

            const commentsCount = newComments.length;
            commentBtn.innerHTML = `
                <i class="far fa-comment"></i>
                ${commentsCount > 0 ? `<span class="comment-count">${commentsCount}</span>` : ''}
            `;
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
        const userLikeKey = `user_liked_${moment.id}`;
        const hasUserLikedLocally = localStorage.getItem(userLikeKey) === 'true';
        const isLikedClass = (likes > 0 || hasUserLikedLocally) ? 'liked' : '';
        const likeIconClass = (likes > 0 || hasUserLikedLocally) ? 'fas' : 'far';

        return `
            <div class="moment-card" style="animation-delay: ${index * ANIMATION_DELAY}s">
                <div class="moment-header">
                    <span class="category-tag">${Utils.escapeHtml(moment.category)}</span>
                    <span class="value-badge">⭐ ${moment.value}</span>
                </div>
                <div class="moment-content">${Utils.formatMultiline(moment.content)}</div>
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
                        <button class="action-btn ${isLikedClass}"
                                data-like-id="${moment.id}"
                                onclick="MomentsPageManager.handleLike(${moment.id})"
                                aria-label="${LanguageManager.t('likeAriaLabel')}"
                                ${this.likeProcessingId === moment.id ? 'disabled' : ''}>
                            <i class="${likeIconClass} fa-heart"></i>
                            ${likes > 0 ? `<span class="like-count">${likes}</span>` : ''}
                        </button>
                        <button class="action-btn"
                                data-comment-id="${moment.id}"
                                onclick="MomentsPageManager.openCommentModal(${moment.id})"
                                aria-label="${LanguageManager.t('commentAriaLabel')}">
                            <i class="far fa-comment"></i>
                            ${commentsCount > 0 ? `<span class="comment-count">${commentsCount}</span>` : ''}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static likeProcessingId = null;

    static async handleLike(id) {
        if (this.likeProcessingId === id) return;

        const likeBtn = document.querySelector(`button[data-like-id="${id}"]`);
        if (!likeBtn) return;

        this.likeProcessingId = id;
        likeBtn.disabled = true;

        const userLikeKey = `user_liked_${id}`;
        const hasUserLiked = localStorage.getItem(userLikeKey) === 'true';

        try {
            if (hasUserLiked) {
                await window.firebaseHandler.removeLike(id);
                localStorage.removeItem(userLikeKey);
                NotificationManager.show(LanguageManager.t('unlikeSuccess'), 'info');
            } else {
                await window.firebaseHandler.addLike(id);
                localStorage.setItem(userLikeKey, 'true');
                likeBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    likeBtn.style.transform = 'scale(1)';
                }, 200);
                NotificationManager.show(LanguageManager.t('likeSuccess'), 'success');
            }
        } catch (error) {
            console.error('点赞操作失败:', error);
            NotificationManager.show(LanguageManager.t('operationFailed'), 'error');
        } finally {
            this.likeProcessingId = null;
            likeBtn.disabled = false;
        }
    }

    static async openCommentModal(id) {
        if (appState.currentMomentId && appState.currentMomentId !== id) {
            window.firebaseHandler.stopListening(appState.currentMomentId);
        }

        appState.currentMomentId = id;
        const moment = this.data.find(m => m.id === id);
        if (!moment) return;

        const modal = document.getElementById('commentModal');
        if (!modal) return;

        modal.style.display = 'block';
        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
            commentsList.innerHTML = `<div class="loading">${LanguageManager.t('loadingComments')}</div>`;
        }

        try {
            const comments = await window.firebaseHandler.getComments(id);
            this.renderComments(comments);
        } catch (error) {
            console.error("加载评论失败:", error);
            commentsList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">${LanguageManager.t('operationFailed')}</p>`;
        }

        window.firebaseHandler.onCommentsChange(id, (newComments) => {
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
                    ${Utils.formatTime(comment.timestamp)}
                </div>
                <div style="line-height: 1.6;">${Utils.formatMultiline(comment.text)}</div>
            </div>
        `).join('');
    }

    static async handleCommentSubmit() {
        const input = document.getElementById('commentInput');
        if (!input) return;

        const content = input.value.trim();
        if (!content) {
            NotificationManager.show(LanguageManager.t('enterCommentContent'), 'warning');
            return;
        }

        if (content.length > MAX_COMMENT_LENGTH) {
            NotificationManager.show(LanguageManager.t('commentTooLong'), 'warning');
            return;
        }

        if (!appState.currentMomentId) {
            NotificationManager.show(LanguageManager.t('commentFailed'), 'error');
            return;
        }

        const submitBtn = document.getElementById('submitComment');
        if (submitBtn) submitBtn.disabled = true;

        try {
            let username = appState.loadFromStorage(STORAGE_KEYS.username);
            if (!username) {
                username = Utils.generateGuestUsername();
                appState.saveToStorage(STORAGE_KEYS.username, username);
            }

            await window.firebaseHandler.addComment(appState.currentMomentId, content, username);
            input.value = '';
            NotificationManager.show(LanguageManager.t('commentSuccess'), 'success');
        } catch (error) {
            console.error('评论失败:', error);
            NotificationManager.show(LanguageManager.t('commentFailed'), 'error');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
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

                const timeline = document.getElementById('diaryTimeline');
                if (timeline) {
                    if (btn.dataset.view === 'grid') {
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
        const headline = entry.headline?.[lang] || entry.headline?.zh || '';
        const content = entry.content?.[lang] || entry.content?.zh || '';
        const highlight = entry.highlight?.[lang] || entry.highlight?.zh || '';
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
                return `<img src="${Utils.escapeHtml(trimmed)}" alt="${LanguageManager.t('attachments')}" class="diary-attachment" onerror="this.style.display='none'">`;
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
        const textFunction = LanguageManager.t('entryCount');
        counter.textContent = typeof textFunction === 'function' ? textFunction(count) : textFunction;
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
        console.log('页面DOM加载完成，开始初始化应用');
        AppController.init();
    } catch (error) {
        console.error('页面初始化失败:', error);
        NotificationManager.show(LanguageManager.t('pageInitFailed'), 'error');
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
        color: var(--text-secondary, #999);
        font-size: 1.1rem;
    }

    .loading-spinner::after {
        content: '';
        width: 24px;
        height: 24px;
        margin-left: 12px;
        border: 4px solid var(--border-color-light, #f3f3f3);
        border-top: 4px solid var(--primary-color, #667eea);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .action-btn.liked i.fas.fa-heart {
        color: #ef4444;
    }

    .action-btn.liked {
        animation: likeJump 0.3s ease;
    }

    @keyframes likeJump {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }

    .comment-item {
        animation: fadeInUp 0.3s ease forwards;
        opacity: 0;
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

    .no-results, .diary-empty {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary, #666);
        font-size: 1.2rem;
    }

    .action-btn:disabled, #submitComment:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);



