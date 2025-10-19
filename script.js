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

// ==================== 朋友圈页面管理器 ====================
class MomentsPageManager {
    static data = [];
    static eventListeners = new Map();

    static init() {
        this.loadData();
        this.bindEvents();
        this.render();
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
            const handler = () => modal.style.display = 'none';
            closeBtn.addEventListener('click', handler);
            this.eventListeners.set('modalClose', { element: closeBtn, handler });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
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

    static render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        const dataToRender = filteredData || this.data;
        const filtered = this.filterByCategory(dataToRender);
        const sorted = this.sortByDate(filtered);

        if (sorted.length === 0) {
            container.innerHTML = `<div class="no-results">${LanguageManager.t('noResults')}</div>`;
            return;
        }

        container.innerHTML = sorted.map((moment, index) =>
            this.renderMomentCard(moment, index)
        ).join('');
    }

    static filterByCategory(data) {
        return appState.currentCategory === 'all' ? data : data.filter(m => m.category === appState.currentCategory);
    }

    static sortByDate(data) {
        return [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    static renderMomentCard(moment, index) {
        const hasImage = moment.image && moment.image.trim();
        const hasComments = moment.comments && moment.comments.length > 0;
        const hasLikes = moment.likes > 0;

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
                            ${hasLikes ? `<span>${moment.likes}</span>` : ''}
                        </button>
                        <button class="action-btn"
                                onclick="MomentsPageManager.openCommentModal(${moment.id})"
                                aria-label="评论">
                            <i class="far fa-comment"></i>
                            ${hasComments ? `<span>${moment.comments.length}</span>` : ''}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static handleLike(id) {
        const moment = this.data.find(m => m.id === id);
        if (!moment) return;

        const hasLiked = moment.likes > 0;
        moment.likes = hasLiked ? 0 : 1;

        if (this.saveData()) {
            this.render();
            if (!hasLiked) {
                const btn = document.querySelector(`button[data-like-id="${id}"]`);
                if (btn) {
                    btn.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        }
    }

    static openCommentModal(id) {
        appState.currentMomentId = id;
        const moment = this.data.find(m => m.id === id);
        if (!moment) return;

        const modal = document.getElementById('commentModal');
        if (!modal) return;

        modal.style.display = 'block';

        if (!moment.comments) {
            moment.comments = [];
        }

        this.renderComments(moment.comments);

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
                    <i class="far fa-user-circle"></i> 访客 • ${Utils.escapeHtml(comment.time)}
                </div>
                <div style="line-height: 1.6;">${Utils.escapeHtml(comment.content)}</div>
            </div>
        `).join('');
    }

    static handleCommentSubmit() {
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

        const moment = this.data.find(m => m.id === appState.currentMomentId);
        if (!moment) return;

        if (!moment.comments) {
            moment.comments = [];
        }

        const comment = {
            content,
            time: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        moment.comments.unshift(comment);

        if (this.saveData()) {
            this.renderComments(moment.comments);
            this.render();
            input.value = '';
            NotificationManager.show('评论发表成功！', 'success');
        }
    }

    static handleSearch(keyword) {
        const normalizedKeyword = Utils.normalize(keyword);
        if (!normalizedKeyword) {
            this.render();
            return;
        }

        const filtered = this.data.filter(moment =>
            Utils.normalize(moment.content).includes(normalizedKeyword) ||
            Utils.normalize(moment.category).includes(normalizedKeyword)
        );

        this.render(filtered);
    }
}
/**
 * 渲染朋友圈统计信息
 */
function renderMomentsStats() {
    const stats = getMomentsStats(momentsData);
    const today = new Date().toISOString().split('T')[0];
    
    // 统计今日发布数量
    const todayCount = momentsData.filter(moment => 
        moment.time && moment.time.startsWith(today)
    ).length;
    
    // 更新统计数字
    animateNumber('totalMoments', stats.total);
    animateNumber('highValueMoments', stats.highValue);
    animateNumber('todayMoments', todayCount);
    
    // 添加详细统计提示
    const statsContainer = document.querySelector('.moments-stats');
    const tooltip = document.createElement('div');
    tooltip.className = 'stats-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h4>详细统计</h4>
            <p>价值分布：⭐${stats.valueDistribution[1]} ⭐⭐⭐${stats.valueDistribution[3]} ⭐⭐⭐⭐⭐${stats.valueDistribution[5]}</p>
            <p>分类最多：${getMostFrequentCategory(stats.categories)}</p>
        </div>
    `;
    
    // 添加悬停显示详细信息
    statsContainer.addEventListener('mouseenter', function() {
        this.appendChild(tooltip);
    });
    
    statsContainer.addEventListener('mouseleave', function() {
        if (tooltip.parentNode === this) {
            this.removeChild(tooltip);
        }
    });
}

/**
 * 数字动画效果
 */
function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 20;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 30);
}

/**
 * 获取最频繁的分类
 */
function getMostFrequentCategory(categories) {
    let maxCount = 0;
    let mostFrequent = '';
    
    for (const [category, count] of Object.entries(categories)) {
        if (count > maxCount) {
            maxCount = count;
            mostFrequent = category;
        }
    }
    
    return mostFrequent || '无';
}

/**
 * 获取朋友圈统计信息（如果之前没有定义）
 */
function getMomentsStats(moments) {
    const stats = {
        total: moments.length,
        highValue: 0,
        categories: {},
        valueDistribution: {
            0: 0,
            1: 0,
            3: 0,
            5: 0
        }
    };

    moments.forEach(moment => {
        if (moment.value >= 5) {
            stats.highValue++;
        }

        if (moment.value in stats.valueDistribution) {
            stats.valueDistribution[moment.value]++;
        }

        stats.categories[moment.category] = (stats.categories[moment.category] || 0) + 1;
    });

    return stats;
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

    // ==================== 核心优化：完全单语言显示 ====================
    static renderDiaryCard(entry) {
        const lang = appState.currentLanguage;
        
        // 只获取当前语言的内容，如果没有则留空
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

window.MomentsPageManager = MomentsPageManager;
window.SuccessPageManager = SuccessPageManager;

document.addEventListener('DOMContentLoaded', () => {
    try {
        AppController.init();
    } catch (error) {
        console.error('页面初始化失败:', error);
        NotificationManager.show('页面初始化失败，请刷新重试', 'error');
    }
});

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
`;
document.head.appendChild(style);
// ==================== 浏览器环境全局暴露 ====================
if (typeof window !== 'undefined') {
    // ... 现有代码 ...
    window.getDiaryStats = getDiaryStats;
    window.getMomentsStats = getMomentsStats;  // 🆕 添加这行
}

// ==================== Node.js 环境模块导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // ... 现有导出 ...
        getDiaryStats,
        getMomentsStats  // 🆕 添加这行
    };
}
// ==================== 朋友圈统计功能 ====================

// 更新统计数字
function updateStatsDisplay() {
    if (!window.momentsData) return;
    
    const stats = getMomentsStats(momentsData);
    
    // 更新统计卡片
    const totalEl = document.getElementById('totalMoments');
    const highValueEl = document.getElementById('highValueMoments');
    const todayEl = document.getElementById('todayMoments');
    
    if (totalEl) {
        animateCounter(totalEl, 0, stats.total, 1000);
    }
    if (highValueEl) {
        animateCounter(highValueEl, 0, stats.highValue, 1200);
    }
    if (todayEl) {
        animateCounter(todayEl, 0, stats.today, 800);
    }
}

// 简单的数字动画
function animateCounter(element, start, end, duration) {
    const startTime = Date.now();
    const range = end - start;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动效果
        const value = Math.floor(start + range * easeOutQuart(progress));
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// 缓动函数
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// 页面加载完成后更新统计
document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点确保数据已加载
    setTimeout(updateStatsDisplay, 500);
});

// 监听分类变化
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('category-btn')) {
        setTimeout(updateStatsDisplay, 100);
    }
});
// ==================== 修复 NaN 问题 ====================

// 安全的数字解析
function safeNumber(value, defaultValue = 0) {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

// 修复后的统计更新
function updateStatsDisplay() {
    if (!window.momentsData || !Array.isArray(momentsData)) {
        console.warn('⚠️ momentsData 不可用');
        return;
    }
    
    try {
        const today = new Date().toISOString().split('T')[0];
        let total = 0;
        let highValue = 0;
        let todayCount = 0;
        
        momentsData.forEach(moment => {
            if (!moment) return;
            
            total++;
            
            const value = safeNumber(moment.value, 0);
            if (value >= 5) highValue++;
            
            if (moment.time && moment.time.split(' ')[0] === today) {
                todayCount++;
            }
        });
        
        // 更新显示
        const totalEl = document.getElementById('totalMoments');
        const highValueEl = document.getElementById('highValueMoments');
        const todayEl = document.getElementById('todayMoments');
        
        if (totalEl) animateCounter(totalEl, 0, total, 1000);
        if (highValueEl) animateCounter(highValueEl, 0, highValue, 1200);
        if (todayEl) animateCounter(todayEl, 0, todayCount, 800);
        
        console.log('📊 统计更新:', { total, highValue, today: todayCount });
        
    } catch (error) {
        console.error('❌ 统计更新失败:', error);
    }
}

// 页面加载完成后更新
setTimeout(() => {
    if (typeof momentsData !== 'undefined') {
        updateStatsDisplay();
    }
}, 1000);
