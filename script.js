// ==================== 常量定义 ====================
const STORAGE_KEYS = {
    moments: 'momentsData',
    diary: 'successDiaryData',
    theme: 'theme',
    language: 'language'
};

const DEBOUNCE_DELAY = 300;
const ANIMATION_DELAY = 0.1;
const NOTIFICATION_DURATION = 3000;

// ==================== 全局状态 ====================
const AppState = {
    // 朋友圈相关
    currentCategory: 'all',
    currentMomentId: null,
    
    // 日记相关
    selectedDiaryTags: new Set(),
    diaryMoodFilter: 'all',
    diarySortBy: 'dateDesc',
    diarySearchKeyword: '',
    
    // 通用
    currentLanguage: localStorage.getItem(STORAGE_KEYS.language) || 'zh',
    currentPage: 'moments'
};

// ==================== 国际化配置 ====================
const translations = {
    zh: {
        successTitle: '成功日记时间轴',
        successSubtitle: '当你写成功日记的时候，你会对自己，对世界，还有对成功的规律作更深入的思考，会越来越多地了解自己和自己的愿望，这样你才会有能力去理解别人。彻底了解自己和世界上的所有秘密，是我们无法完全实现的一种理想，但我们可以一步一步地慢慢接近这种理想。一个人挣钱的多少是和他的自信心联系在一起的。另外,他的精力究竟是集中在自己的能力范围之内,还是放到了他力所不能及的事情上,这也是很重要的一点。没有我的成功日记本,我就不会去思考自己适合在哪些方面赚钱。',
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
        timelineNotes: '小结',
        attachments: '附件',
        entryCount: (count) => `共 ${count} 条记录`,
        commentPlaceholder: '说点什么...',
        commentSubmit: '发表',
        commentEmpty: '暂无评论，快来抢沙发吧！',
        noResults: '暂无内容'
    },
    en: {
        successTitle: 'Success Diary Timeline',
        successSubtitle: 'When you write a success journal, you will reflect more deeply on yourself, the world, and the principles of success. You will gain a better understanding of yourself and your desires, which will enable you to comprehend others. Completely understanding oneself and all the secrets of the world is an ideal that may not be fully achievable, but we can gradually work towards it step by step. The amount of money one earns is closely linked to their level of self-confidence. Additionally, it is crucial to determine whether one\'s energy is focused on endeavors within their capabilities or on tasks that are beyond their reach. Without my success journal, I would not have considered which areas might be suitable for me to make money in.',
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
        timelineNotes: 'Notes',
        attachments: 'Attachments',
        entryCount: (count) => `${count} entries`,
        commentPlaceholder: 'Write a comment...',
        commentSubmit: 'Post',
        commentEmpty: 'No comments yet. Be the first!',
        noResults: 'No content available'
    }
};

// ==================== 工具函数 ====================
const Utils = {
    /**
     * HTML转义
     */
    escapeHtml(text) {
        if (text === undefined || text === null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * 多行文本格式化
     */
    formatMultiline(text) {
        if (!text) return '';
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    },

    /**
     * 时间格式化
     */
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

    /**
     * 日记日期格式化
     */
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

    /**
     * 文本标准化（用于搜索）
     */
    normalize(text) {
        return (text || '').toString().toLowerCase().trim();
    },

    /**
     * 防抖函数
     */
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

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
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
            <span>${this.escapeHtml(message)}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${colorMap[type]};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease-out;
            font-size: 0.95rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, NOTIFICATION_DURATION);
    }
};

// ==================== 国际化模块 ====================
const I18n = {
    /**
     * 获取翻译文本
     */
    t(key) {
        const langPack = translations[AppState.currentLanguage] || translations.zh;
        const fallbackPack = translations.zh;
        const value = langPack[key] !== undefined ? langPack[key] : fallbackPack[key];
        return value !== undefined ? value : key;
    },

    /**
     * 切换语言
     */
    toggleLanguage() {
        AppState.currentLanguage = AppState.currentLanguage === 'zh' ? 'en' : 'zh';
        localStorage.setItem(STORAGE_KEYS.language, AppState.currentLanguage);
        
        this.updateLanguageToggleButton();
        
        if (AppState.currentPage === 'success') {
            SuccessDiaryPage.updatePageTexts();
            SuccessDiaryPage.render();
        }
    },

    /**
     * 更新语言切换按钮
     */
    updateLanguageToggleButton() {
        const button = document.getElementById('languageToggle');
        if (!button) return;
        
        const icon = button.querySelector('i');
        const span = button.querySelector('span');
        
        if (icon) icon.className = 'fas fa-language';
        if (span) span.textContent = AppState.currentLanguage === 'zh' ? '中 → EN' : 'EN → 中';
    }
};

// ==================== 主题模块 ====================
const ThemeManager = {
    /**
     * 应用保存的主题
     */
    applySavedTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    },

    /**
     * 切换主题
     */
    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEYS.theme, theme);
        this.updateThemeToggleButton();
    },

    /**
     * 更新主题切换按钮
     */
    updateThemeToggleButton() {
        const button = document.getElementById('themeToggle');
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (!icon) return;
        
        icon.className = document.body.classList.contains('light-mode') 
            ? 'fas fa-sun' 
            : 'fas fa-moon';
    }
};

// ==================== 本地存储模块 ====================
const StorageManager = {
    /**
     * 加载朋友圈数据
     */
    loadMomentsData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.moments);
            if (!saved) return null;
            
            return JSON.parse(saved);
        } catch (error) {
            console.error('加载朋友圈数据失败:', error);
            Utils.showNotification('数据加载失败', 'error');
            return null;
        }
    },

    /**
     * 保存朋友圈数据
     */
    saveMomentsData(data) {
        try {
            localStorage.setItem(STORAGE_KEYS.moments, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存朋友圈数据失败:', error);
            Utils.showNotification('数据保存失败', 'error');
            return false;
        }
    }
};

// ==================== 朋友圈页面模块 ====================
const MomentsPage = {
    data: [],

    /**
     * 初始化
     */
    init() {
        this.loadData();
        this.bindEvents();
        this.render();
    },

    /**
     * 加载数据
     */
    loadData() {
        const savedData = StorageManager.loadMomentsData();
        
        if (savedData) {
            const savedIds = savedData.map(m => m.id);
            const newDefaults = (window.momentsData || []).filter(m => !savedIds.includes(m.id));
            this.data = [...savedData, ...newDefaults];
        } else {
            this.data = window.momentsData || [];
        }
    },

    /**
     * 保存数据
     */
    saveData() {
        return StorageManager.saveMomentsData(this.data);
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.handleSearch(e.target.value);
            }));
        }

        // 分类筛选
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.currentCategory = btn.dataset.category;
                this.render();
            });
        });

        // 评论模态框
        this.initCommentModal();
    },

    /**
     * 初始化评论模态框
     */
    initCommentModal() {
        const modal = document.getElementById('commentModal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => (modal.style.display = 'none');
        }

        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };

        const submitBtn = document.getElementById('submitComment');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleCommentSubmit());
        }

        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleCommentSubmit();
                }
            });
        }
    },

    /**
     * 渲染页面
     */
    render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        const dataToRender = filteredData || this.data;
        const filtered = this.filterByCategory(dataToRender);
        const sorted = this.sortByDate(filtered);

        if (sorted.length === 0) {
            container.innerHTML = `<div class="no-results">${I18n.t('noResults')}</div>`;
            return;
        }

        container.innerHTML = sorted.map((moment, index) => 
            this.renderMomentCard(moment, index)
        ).join('');
    },

    /**
     * 按分类筛选
     */
    filterByCategory(data) {
        return AppState.currentCategory === 'all'
            ? data
            : data.filter(m => m.category === AppState.currentCategory);
    },

    /**
     * 按日期排序
     */
    sortByDate(data) {
        return [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
    },

    /**
     * 渲染朋友圈卡片
     */
    renderMomentCard(moment, index) {
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
                                onclick="MomentsPage.handleLike(${moment.id})"
                                aria-label="点赞">
                            <i class="${hasLikes ? 'fas' : 'far'} fa-heart"></i>
                            ${hasLikes ? `<span>${moment.likes}</span>` : ''}
                        </button>
                        <button class="action-btn" 
                                onclick="MomentsPage.openCommentModal(${moment.id})"
                                aria-label="评论">
                            <i class="far fa-comment"></i>
                            ${hasComments ? `<span>${moment.comments.length}</span>` : ''}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 处理点赞
     */
    handleLike(id) {
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
    },

    /**
     * 打开评论模态框
     */
    openCommentModal(id) {
        AppState.currentMomentId = id;
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
    },

    /**
     * 渲染评论列表
     */
    renderComments(comments) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        if (!comments || comments.length === 0) {
            commentsList.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    ${I18n.t('commentEmpty')}
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
    },

    /**
     * 处理评论提交
     */
    handleCommentSubmit() {
        const input = document.getElementById('commentInput');
        if (!input) return;

        const content = input.value.trim();
        
        if (!content) {
            Utils.showNotification('请输入评论内容', 'warning');
            return;
        }

        if (content.length > 500) {
            Utils.showNotification('评论内容不能超过500字', 'warning');
            return;
        }

        const moment = this.data.find(m => m.id === AppState.currentMomentId);
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
            Utils.showNotification('评论发表成功！', 'success');
        }
    },

    /**
     * 处理搜索
     */
    handleSearch(keyword) {
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
};

// ==================== 成功日记页面模块 ====================
const SuccessDiaryPage = {
    /**
     * 初始化
     */
    init() {
        this.updatePageTexts();
        this.populateMoodFilter();
        this.renderTagFilters();
        this.bindEvents();
        this.render();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 搜索
        const searchInput = document.getElementById('diarySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                AppState.diarySearchKeyword = Utils.normalize(e.target.value);
                this.render();
            }));
        }

        // 心情筛选
        const moodSelect = document.getElementById('diaryMoodSelect');
        if (moodSelect) {
            moodSelect.addEventListener('change', (e) => {
                AppState.diaryMoodFilter = e.target.value;
                this.render();
            });
        }

        // 排序
        const sortSelect = document.getElementById('diarySortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                AppState.diarySortBy = e.target.value;
                this.render();
            });
        }

        // 重置筛选
        const resetBtn = document.getElementById('diaryResetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    },

    /**
     * 重置筛选条件
     */
    resetFilters() {
        AppState.selectedDiaryTags.clear();
        AppState.diaryMoodFilter = 'all';
        AppState.diarySortBy = 'dateDesc';
        AppState.diarySearchKeyword = '';

        const searchInput = document.getElementById('diarySearchInput');
        const moodSelect = document.getElementById('diaryMoodSelect');
        const sortSelect = document.getElementById('diarySortSelect');

        if (searchInput) searchInput.value = '';
        if (moodSelect) moodSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'dateDesc';

        this.renderTagFilters();
        this.render();
    },

    /**
     * 更新页面文本
     */
    updatePageTexts() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = I18n.t(key);
            if (typeof value === 'string') {
                element.textContent = value;
            }
        });

        // 更新搜索框占位符
        const searchInput = document.getElementById('diarySearchInput');
        if (searchInput) {
            searchInput.placeholder = I18n.t('searchPlaceholder');
        }

        // 更新排序选项
        this.updateSortOptions();
    },

    /**
     * 更新排序选项文本
     */
    updateSortOptions() {
        const sortSelect = document.getElementById('diarySortSelect');
        if (!sortSelect) return;

        const options = sortSelect.options;
        if (options.length >= 4) {
            options[0].textContent = I18n.t('sortDateDesc');
            options[1].textContent = I18n.t('sortDateAsc');
            options[2].textContent = I18n.t('sortAchievementDesc');
            options[3].textContent = I18n.t('sortAchievementAsc');
        }
    },

    /**
     * 填充心情筛选器
     */
    populateMoodFilter() {
        const moodSelect = document.getElementById('diaryMoodSelect');
        if (!moodSelect) return;

        const currentValue = moodSelect.value || 'all';
        const moodLibrary = window.moodLibrary || {};

        let optionsHtml = `<option value="all">${I18n.t('moodAll')}</option>`;
        
        Object.keys(moodLibrary).forEach(code => {
            const mood = moodLibrary[code];
            const label = mood[AppState.currentLanguage] || mood.zh || code;
            optionsHtml += `<option value="${code}">${Utils.escapeHtml(label)}</option>`;
        });

        moodSelect.innerHTML = optionsHtml;
        moodSelect.value = currentValue;
    },

    /**
     * 渲染标签筛选器
     */
    renderTagFilters() {
        const container = document.getElementById('diaryTagFilter');
        if (!container) return;

        const tagLibrary = window.diaryTagLibrary || [];

        container.innerHTML = tagLibrary.map(tag => {
            const isActive = AppState.selectedDiaryTags.has(tag.code);
            const label = tag[AppState.currentLanguage] || tag.zh || tag.code;
            
            return `
                <button type="button" 
                        class="filter-chip ${isActive ? 'active' : ''}" 
                        data-tag="${tag.code}">
                    ${Utils.escapeHtml(label)}
                </button>
            `;
        }).join('');

        // 绑定标签点击事件
        container.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.dataset.tag;
                if (AppState.selectedDiaryTags.has(code)) {
                    AppState.selectedDiaryTags.delete(code);
                } else {
                    AppState.selectedDiaryTags.add(code);
                }
                this.renderTagFilters();
                this.render();
            });
        });
    },

    /**
     * 渲染日记时间轴
     */
    render() {
        const container = document.getElementById('diaryTimeline');
        if (!container) return;

        const filtered = this.getFilteredData();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="diary-empty">${I18n.t('timelineEmpty')}</div>
            `;
            this.updateCounter(0);
            return;
        }

        container.innerHTML = filtered.map(entry => 
            this.renderDiaryCard(entry)
        ).join('');

        this.updateCounter(filtered.length);
    },

    /**
     * 获取筛选后的数据
     */
    getFilteredData() {
        const diaryData = window.successDiaryData || [];
        let data = [...diaryData];

        // 标签筛选
        if (AppState.selectedDiaryTags.size > 0) {
            data = data.filter(entry => {
                return Array.from(AppState.selectedDiaryTags).every(tag => 
                    entry.categories.includes(tag)
                );
            });
        }

        // 心情筛选
        if (AppState.diaryMoodFilter !== 'all') {
            data = data.filter(entry => 
                entry.moodCode === AppState.diaryMoodFilter
            );
        }

        // 关键词搜索
        if (AppState.diarySearchKeyword) {
            data = data.filter(entry => 
                this.matchSearch(entry, AppState.diarySearchKeyword)
            );
        }

        // 排序
        data.sort((a, b) => this.compareEntries(a, b));

        return data;
    },

    /**
     * 匹配搜索关键词
     */
    matchSearch(entry, keyword) {
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

        return fields.some(field => 
            field && Utils.normalize(field).includes(keyword)
        );
    },

    /**
     * 比较两个日记条目（用于排序）
     */
    compareEntries(a, b) {
        switch (AppState.diarySortBy) {
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
    },

    /**
     * 渲染日记卡片
     */
    renderDiaryCard(entry) {
        const lang = AppState.currentLanguage;
        const altLang = lang === 'zh' ? 'en' : 'zh';

        const headline = entry.headline?.[lang] || entry.headline?.[altLang] || '';
        const headlineAlt = entry.headline?.[altLang] || '';
        const content = entry.content?.[lang] || entry.content?.[altLang] || '';
        const contentAlt = entry.content?.[altLang] || '';
        const highlight = entry.highlight?.[lang] || entry.highlight?.[altLang] || '';
        const highlightAlt = entry.highlight?.[altLang] || '';

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
                            <header class="diary-card-header">
                                <h3 class="diary-title">
                                    ${Utils.formatMultiline(headline)}
                                </h3>
                                ${headlineAlt && headlineAlt !== headline ? `
                                    <p class="diary-alt">
                                        ${Utils.formatMultiline(headlineAlt)}
                                    </p>
                                ` : ''}我将为你优化这个JavaScript代码，主要改进包括：代码结构优化、性能提升、错误处理增强、可维护性提升等。

```javascript
// ==================== 常量和配置 ====================
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

const ANIMATION_DELAY = 100; // 毫秒
const NOTIFICATION_DURATION = 3000; // 毫秒
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
        this.currentPage = PAGE_TYPES.MOMENTS;
        this.currentLanguage = this.loadFromStorage(STORAGE_KEYS.language) || 'zh';
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
    /**
     * HTML转义，防止XSS攻击
     */
    escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * 格式化时间显示
     */
    formatTime(timeStr) {
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr;
        
        const now = new Date();
        const diff = now - date;
        const timeUnits = [
            { name: '分钟', value: 1000 * 60 },
            { name: '小时', value: 1000 * 60 * 60 },
            { name: '天', value: 1000 * 60 * 60 * 24 }
        ];

        if (diff < timeUnits[0].value) return '刚刚';
        if (diff < timeUnits[1].value) return `${Math.floor(diff / timeUnits[0].value)}分钟前`;
        if (diff < timeUnits[2].value) return `${Math.floor(diff / timeUnits[1].value)}小时前`;
        if (diff < timeUnits[2].value * 2) return '昨天';
        if (diff < timeUnits[2].value * 7) return `${Math.floor(diff / timeUnits[2].value)}天前`;
        
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * 格式化日记日期
     */
    formatDiaryDate(dateStr, lang) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        });
    },

    /**
     * 处理多行文本
     */
    formatMultiline(text) {
        if (!text) return '';
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    },

    /**
     * 文本标准化（用于搜索）
     */
    normalize(text) {
        return (text || '').toString().toLowerCase();
    },

    /**
     * 防抖函数
     */
    debounce(func, wait) {
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

    /**
     * 节流函数
     */
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

// ==================== 主题管理器 ====================
class ThemeManager {
    static applySavedTheme() {
        const savedTheme = appState.loadFromStorage(STORAGE_KEYS.theme);
        const isLight = savedTheme === 'light';
        document.body.classList.toggle('light-mode', isLight);
    }

    static toggle() {
        document.body.classList.toggle('light-mode');
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        appState.saveToStorage(STORAGE_KEYS.theme, theme);
        this.updateIcon();
    }

    static updateIcon() {
        const button = document.getElementById('themeToggle');
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ==================== 语言管理器 ====================
class LanguageManager {
    static translations = {
        zh: {
            successTitle: '成功日记时间轴',
            successSubtitle: '当你写成功日记的时候，你会对自己，对世界，还有对成功的规律作更深入的思考，会越来越多地了解自己和自己的愿望，这样你才有能力去理解别人。彻底了解自己和世界上的所有秘密，是我们无法完全实现的一种理想，但我们可以一步一步地慢慢接近这种理想。一个人挣钱的多少是和他的自信心联系在一起的。另外,他的精力究竟是集中在自己的能力范围之内,还是放到了他力所不能及的事情上,这也是很重要的一点。没有我的成功日记本,我就不会去思考自己适合在哪些方面赚钱。',
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
            timelineNotes: '小结',
            attachments: '附件',
            entryCount: (count) => `共 ${count} 条记录`
        },
        en: {
            successTitle: 'Success Diary Timeline',
            successSubtitle: 'When you write a success journal, you will reflect more deeply on yourself, the world, and the principles of success. You will gain a better understanding of yourself and your desires, which will enable you to comprehend others. Completely understanding oneself and all the secrets of the world is an ideal that may not be fully achievable, but we can gradually work towards it step by step.The amount of money one earns is closely linked to their level of self-confidence. Additionally, it is crucial to determine whether one\'s energy is focused on endeavors within their capabilities or on tasks that are beyond their reach. Without my success journal, I would not have considered which areas might be suitable for me to make money in.',
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
            timelineNotes: 'Notes',
            attachments: 'Attachments',
            entryCount: (count) => `${count} entries`
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
        this.updateButtonLabel();
        
        if (appState.currentPage === PAGE_TYPES.SUCCESS) {
            SuccessPageManager.updatePage();
        }
    }

    static updateButtonLabel() {
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
        if (searchInput) searchInput.placeholder = this.t('searchPlaceholder');
    }
}

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

        notification.innerHTML = `
            <i class="fas fa-${iconMap[type] || iconMap.info}"></i>
            <span>${Utils.escapeHtml(message)}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: this.getBackgroundColor(type),
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideInRight 0.3s ease-out',
            fontSize: '0.95rem',
            maxWidth: '300px'
        });

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, NOTIFICATION_DURATION);
    }

    static getBackgroundColor(type) {
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }
}

// ==================== 朋友圈页面管理器 ====================
class MomentsPageManager {
    static init() {
        this.loadData();
        this.render();
        this.bindEvents();
    }

    static loadData() {
        const saved = appState.loadFromStorage(STORAGE_KEYS.moments);
        if (saved) {
            try {
                const loaded = JSON.parse(saved);
                const savedIds = loaded.map(m => m.id);
                const newDefaults = momentsData.filter(m => !savedIds.includes(m.id));
                momentsData = [...loaded, ...newDefaults];
            } catch (error) {
                console.error('加载朋友圈数据失败:', error);
                NotificationManager.show('数据加载失败，使用默认数据', 'warning');
            }
        }
    }

    static saveData() {
        try {
            appState.saveToStorage(STORAGE_KEYS.moments, JSON.stringify(momentsData));
        } catch (error) {
            console.error('保存朋友圈数据失败:', error);
            NotificationManager.show('数据保存失败', 'error');
        }
    }

    static render(filteredData = null) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;

        const dataToRender = filteredData || momentsData;
        const filtered = appState.currentCategory === 'all' 
            ? dataToRender 
            : dataToRender.filter(m => m.category === appState.currentCategory);

        filtered.sort((a, b) => new Date(b.time) - new Date(a.time));

        if (filtered.length === 0) {
            container.innerHTML = '<div class="no-results">暂无内容</div>';
            return;
        }

        container.innerHTML = filtered.map((moment, index) => 
            this.createMomentCard(moment, index)
        ).join('');
    }

    static createMomentCard(moment, index) {
        return `
            <div class="moment-card" style="animation-delay: ${index * 0.1}s">
                <div class="moment-header">
                    <span class="category-tag">${Utils.escapeHtml(moment.category)}</span>
                    <span class="value-badge">⭐ ${moment.value}</span>
                </div>
                <div class="moment-content">${Utils.escapeHtml(moment.content)}</div>
                ${moment.image ? `<img src="${Utils.escapeHtml(moment.image)}" alt="图片" class="moment-image" onerror="this.style.display='none'">` : ''}
                <div class="moment-footer">
                    <span class="moment-time">
                        <i class="far fa-clock"></i> ${Utils.formatTime(moment.time)}
                    </span>
                    <div class="moment-actions">
                        <button class="action-btn ${moment.likes > 0 ? 'liked' : ''}" data-like-id="${moment.id}" onclick="MomentsPageManager.handleLike(${moment.id})">
                            <i class="${moment.likes > 0 ? 'fas' : 'far'} fa-heart"></i>
                            <span>${moment.likes > 0 ? moment.likes : ''}</span>
                        </button>
                        <button class="action-btn" onclick="MomentsPageManager.openCommentModal(${moment.id})">
                            <i class="far fa-comment"></i>
                            <span>${moment.comments && moment.comments.length > 0 ? moment.comments.length : ''}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static bindEvents() {
        // 搜索事件
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(this.handleSearch.bind(this), 300));
        }

        // 分类按钮事件
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                appState.currentCategory = e.currentTarget.dataset.category;
                this.render();
            });
        });

        // 评论模态框事件
        this.bindModalEvents();
    }

    static bindModalEvents() {
        const modal = document.getElementById('commentModal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }

        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };

        const submitComment = document.getElementById('submitComment');
        if (submitComment) {
            submitComment.addEventListener('click', this.handleCommentSubmit.bind(this));
        }

        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleCommentSubmit();
            });
        }
    }

    static handleLike(id) {
        const moment = momentsData.find(m => m.id === id);
        if (!moment) return;

        const hasLiked = moment.likes > 0;
        moment.likes = hasLiked ? 0 : 1;
        this.saveData();
        this.render();

        const btn = document.querySelector(`.action-btn[data-like-id="${id}"]`);
        if (btn && !hasLiked) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
        }
    }

    static openCommentModal(id) {
        appState.currentMomentId = id;
        const moment = momentsData.find(m => m.id === id);
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
            commentsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">暂无评论，快来抢沙发吧！</p>';
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

        const moment = momentsData.find(m => m.id === appState.currentMomentId);
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
        this.saveData();
        this.renderComments(moment.comments);
        this.render();
        input.value = '';
        NotificationManager.show('评论发表成功！', 'success');
    }

    static handleSearch(e) {
        const keyword = Utils.normalize(e.target.value);
        if (!keyword) {
            this.render();
            return;
        }

        const filtered = momentsData.filter(moment =>
            Utils.normalize(moment.content).includes(keyword) ||
            Utils.normalize(moment.category).includes(keyword)
        );
        
        this.render(filtered);
    }
}

// ==================== 成功日记页面管理器 ====================
class SuccessPageManager {
    static init() {
        this.populateMoodFilter();
        this.updatePageTexts();
        this.renderTagFilters();
        this.bindControls();
        this.renderTimeline();
    }

    static updatePage() {
        this.populateMoodFilter();
        this.updatePageTexts();
        this.renderTagFilters();
        this.renderTimeline();
    }

    static bindControls() {
        const searchInput = document.getElementById('diarySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                appState.diarySearchKeyword = Utils.normalize(e.target.value);
                this.renderTimeline();
            }, 300));
            searchInput.placeholder = LanguageManager.t('searchPlaceholder');
        }

        const moodSelect = document.getElementById('diaryMoodSelect');
        if (moodSelect) {
            moodSelect.addEventListener('change', (e) => {
                appState.diaryMoodFilter = e.target.value;
                this.renderTimeline();
            });
        }

        const sortSelect = document.getElementById('diarySortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                appState.diarySortBy = e.target.value;
                this.renderTimeline();
            });
            this.updateSortOptions(sortSelect);
        }

        const resetFilters = document.getElementById('diaryResetFilters');
        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                appState.resetDiaryFilters();
                
                if (searchInput) searchInput.value = '';
                if (moodSelect) moodSelect.value = 'all';
                if (sortSelect) sortSelect.value = 'dateDesc';
                
                this.renderTagFilters();
                this.renderTimeline();
            });
        }
    }

    static updateSortOptions(select) {
        if (!select || !select.options) return;
        
        const options = select.options;
        options[0].textContent = LanguageManager.t('sortDateDesc');
        options[1].textContent = LanguageManager.t('sortDateAsc');
        options[2].textContent = LanguageManager.t('sortAchievementDesc');
        options[3].textContent = LanguageManager.t('sortAchievementAsc');
    }

    static renderTagFilters() {
        const container = document.getElementById('diaryTagFilter');
        if (!container) return;

        container.innerHTML = diaryTagLibrary.map(tag => {
            const isActive = appState.selectedDiaryTags.has(tag.code);
            return `
                <button type="button" class="filter-chip ${isActive ? 'active' : ''}" 
                        data-tag="${tag.code}">
                    ${Utils.escapeHtml(this.getTagLabel(tag.code))}
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
                this.renderTimeline();
            });
        });
    }

    static populateMoodFilter() {
        const moodSelect = document.getElementById('diaryMoodSelect');
        if (!moodSelect) return;

        const currentValue = moodSelect.value || 'all';
        let optionsHtml = `<option value="all">${LanguageManager.t('moodAll')}</option>`;
        
        Object.keys(moodLibrary).forEach(code => {
            optionsHtml += `<option value="${code}" data-code="${code}">${Utils.escapeHtml(this.getMoodLabel(code))}</option>`;
        });
        
        moodSelect.innerHTML = optionsHtml;
        moodSelect.value = currentValue;
    }

    static updatePageTexts() {
        LanguageManager.updatePageTexts();
        this.updateSortOptions(document.getElementById('diarySortSelect'));
    }

    static renderTimeline() {
        const container = document.getElementById('diaryTimeline');
        if (!container) return;

        const filtered = this.getFilteredData();
        
        if (filtered.length === 0) {
            container.innerHTML = `<div class="diary-empty">${LanguageManager.t('timelineEmpty')}</div>`;
            this.updateCounter(0);
            return;
        }

        container.innerHTML = filtered.map(entry => this.renderCard(entry)).join('');
        this.updateCounter(filtered.length);
    }

    static getFilteredData() {
        let data = [...successDiaryData];

        // 标签筛选
        if (appState.selectedDiaryTags.size > 0) {
            data = data.filter(entry => {
                return Array.from(appState.selectedDiaryTags).every(tag => 
                    entry.categories.includes(tag)
                );
            });
        }

        // 心情筛选
        if (appState.diaryMoodFilter !== 'all') {
            data = data.filter(entry => entry.moodCode === appState.diaryMoodFilter);
        }

        // 关键词搜索
        if (appState.diarySearchKeyword) {
            data = data.filter(entry => this.matchSearch(entry, appState.diarySearchKeyword));
        }

        // 排序
        data.sort((a, b) => {
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
        });

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

        return fields.some(field => 
            field && Utils.normalize(field).includes(keyword)
        );
    }

    static renderCard(entry) {
        const lang = appState.currentLanguage;
        const altLang = lang === 'zh' ? 'en' : 'zh';
        
        const headline = entry.headline?.[lang] || entry.headline?.[altLang] || '';
        const headlineAlt = entry.headline?.[altLang] || '';
        const content = entry.content?.[lang] || entry.content?.[altLang] || '';
        const contentAlt = entry.content?.[altLang] || '';
        const highlight = entry.highlight?.[lang] || entry.highlight?.[altLang] || '';
        const highlightAlt = entry.highlight?.[altLang] || '';
        
        const mood = this.getMood(entry.moodCode);
        const tagsHtml = entry.categories.map(code => 
            `<span class="tag-pill">${Utils.escapeHtml(this.getTagLabel(code))}</span>`
        ).join('');
        
        const attachmentsHtml = this.renderAttachments(entry.attachments);
        const cover = entry.coverImage ? 
            `<img src="${Utils.escapeHtml(entry.coverImage)}" alt="cover" class="diary-cover" onerror="this.style.display='none'">` : '';

        return `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-card">
                    <div class="diary-date">${Utils.formatDiaryDate(entry.date, lang)}</div>
                    <article class="diary-card-body">
                        ${cover}
                        <div class="diary-card-content">
                            <header class="diary-card-header">
                                <h3 class="diary-title">${Utils.formatMultiline(headline)}</h3>
                                ${headlineAlt && headlineAlt !== headline ? 
                                    `<p class="diary-alt">${Utils.formatMultiline(headlineAlt)}</p>` : ''}
                            </header>
                            <div class="diary-text">
                                ${content ? `<p>${Utils.formatMultiline(content)}</p>` : ''}
                                ${contentAlt && contentAlt !== content ? 
                                    `<p class="diary-alt">${Utils.formatMultiline(contentAlt)}</p>` : ''}
                            </div>
                            ${highlight ? `
                                <div class="diary-highlight">
                                    <strong>${LanguageManager.t('timelineNotes')}：</strong>
                                    <span>${Utils.formatMultiline(highlight)}</span>
                                    ${highlightAlt && highlightAlt !== highlight ? 
                                        `<div class="diary-alt">${Utils.formatMultiline(highlightAlt)}</div>` : ''}
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

    static renderAttachments(attachments) {
        if (!Array.isArray(attachments) || attachments.length === 0) return '';
        
        const items = attachments.map(path => {
            const trimmed = path.trim();
            if (!trimmed) return '';
            
            const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(trimmed);
            if (isImage) {
                return `<img src="${Utils.escapeHtml(trimmed)}" alt="attachment" class="diary-attachment" onerror="this.style.display='none'">`;
            }
            
            return `<a href="${Utils.escapeHtml(trimmed)}" target="_blank" rel="noopener" class="diary-attachment-link">${Utils.escapeHtml(trimmed)}</a>`;
        }).join('');

        return `<div class="diary-attachments"><span class="meta-title">${LanguageManager.t('attachments')}：</span>${items}</div>`;
    }

    static getMood(code) {
        return moodLibrary[code] || null;
    }

    static getMoodLabel(code, lang = appState.currentLanguage) {
        const mood = this.getMood(code);
        if (!mood) return code || '';
        return mood[lang] || mood.zh || code;
    }

    static getTagLabel(code, lang = appState.currentLanguage) {
        const tag = diaryTagLibrary.find(item => item.code === code);
        if (!tag) return code || '';
        return tag[lang] || tag.zh || code;
    }

    static updateCounter(count) {
        const counter = document.getElementById('diaryCounter');
        if (!counter) return;
        
        const text = LanguageManager.t('entryCount');
        counter.textContent = typeof text === 'function' ? text(count) : `${count}`;
    }
}

// ==================== 全局控制器 ====================
class GlobalController {
    static init() {
        // 检测当前页面
        appState.currentPage = document.body?.dataset?.page || PAGE_TYPES.MOMENTS;
        
        // 应用保存的主题
        ThemeManager.applySavedTheme();
        
        // 初始化全局控件
        this.initializeGlobalControls();
        
        // 根据页面类型初始化
        this.initializePage();
    }

    static initializeGlobalControls() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', ThemeManager.toggle.bind(ThemeManager));
            ThemeManager.updateIcon();
        }

        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', LanguageManager.toggle.bind(LanguageManager));
            LanguageManager.updateButtonLabel();
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

// ==================== 全局函数暴露 ====================
window.MomentsPageManager = MomentsPageManager;
window.SuccessPageManager = SuccessPageManager;

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    try {
        GlobalController.init();
    } catch (error) {
        console.error('页面初始化失败:', error);
        NotificationManager.show('页面初始化失败，请刷新重试', 'error');
    }
});

// 添加动画样式
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
