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

// ==================== 增强的存储管理器 ====================
class EnhancedStorageManager {
    static STORAGE_PREFIX = 'kuangke_galaxy_';
    static COMPRESS_THRESHOLD = 1024 * 1024; // 1MB
    
    static getStorageKey(key) {
        return this.STORAGE_PREFIX + key;
    }
    
    static saveData(key, data) {
        try {
            // 检查 localStorage 是否可用
            if (typeof localStorage === 'undefined') {
                console.error('localStorage 不可用');
                return false;
            }
            
            const storageKey = this.getStorageKey(key);
            const serialized = JSON.stringify(data);
            
            // 检查数据大小
            if (serialized.length > this.COMPRESS_THRESHOLD) {
                console.warn(`数据较大 (${(serialized.length/1024/1024).toFixed(2)}MB)，建议定期清理`);
            }
            
            localStorage.setItem(storageKey, serialized);
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            
            if (error.name === 'QuotaExceededError') {
                console.error('存储空间不足，尝试清理...');
                this.cleanupStorage();
                
                // 重试一次
                try {
                    const storageKey = this.getStorageKey(key);
                    const serialized = JSON.stringify(data);
                    localStorage.setItem(storageKey, serialized);
                    return true;
                } catch (retryError) {
                    console.error('重试保存失败:', retryError);
                    NotificationManager.show('存储空间不足，请清理数据', 'error');
                    return false;
                }
            } else if (error.name === 'SecurityError') {
                console.error('存储访问被阻止，可能处于隐私模式');
                NotificationManager.show('存储访问被阻止，请检查浏览器设置', 'error');
                return false;
            } else {
                NotificationManager.show('数据保存失败', 'error');
                return false;
            }
        }
    }
    
    static loadData(key) {
        try {
            if (typeof localStorage === 'undefined') {
                console.error('localStorage 不可用');
                return null;
            }
            
            const storageKey = this.getStorageKey(key);
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('加载数据失败:', error);
            
            // 尝试清理损坏的数据
            try {
                const storageKey = this.getStorageKey(key);
                localStorage.removeItem(storageKey);
                console.log('已清理损坏的数据:', key);
            } catch (cleanupError) {
                console.error('清理损坏数据失败:', cleanupError);
            }
            
            return null;
        }
    }
    
    static cleanupStorage() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.STORAGE_PREFIX)) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        // 清理超过30天的备份
                        if (key.includes('backup') && data && data.timestamp) {
                            const age = Date.now() - data.timestamp;
                            if (age > 30 * 24 * 60 * 60 * 1000) { // 30天
                                keysToRemove.push(key);
                            }
                        }
                    } catch (e) {
                        keysToRemove.push(key);
                    }
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                console.log('清理旧数据:', key);
            });
            
            if (keysToRemove.length > 0) {
                NotificationManager.show(`清理了${keysToRemove.length}个旧数据`, 'info');
            }
        } catch (error) {
            console.error('清理存储失败:', error);
        }
    }
    
    static getStorageUsage() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return {
                used: total,
                usedMB: (total / 1024 / 1024).toFixed(2),
                available: (5 * 1024 * 1024 - total), // 假设总限制5MB
                availableMB: ((5 * 1024 * 1024 - total) / 1024 / 1024).toFixed(2)
            };
        } catch (error) {
            console.error('获取存储使用情况失败:', error);
            return { used: 0, usedMB: '0.00', available: 0, availableMB: '0.00' };
        }
    }
}

// ==================== 数据备份管理器 ====================
class DataBackupManager {
    static BACKUP_INTERVAL = 60000; // 1分钟备份一次
    static MAX_BACKUPS = 10; // 最多保留10个备份
    static backupInterval = null;
    
    static init() {
        try {
            // 延迟初始化，确保数据已加载
            setTimeout(() => {
                this.backupData();
                // 定期备份
                this.backupInterval = setInterval(() => {
                    this.backupData();
                }, this.BACKUP_INTERVAL);
            }, 1000);
            
            // 页面卸载前备份
            window.addEventListener('beforeunload', () => {
                this.backupData();
            });
        } catch (error) {
            console.error('❌ 备份系统初始化失败:', error);
            ErrorRecoverySystem.handleError(error, 'Backup System Init');
        }
    }
    
    static backupData() {
        try {
            // 检查数据是否存在
            if (!MomentsPageManager.data || !Array.isArray(MomentsPageManager.data)) {
                console.warn('⚠️ 暂无数据需要备份');
                return false;
            }
            
            const backupData = {
                moments: MomentsPageManager.data,
                timestamp: Date.now(),
                version: '1.0',
                count: MomentsPageManager.data.length
            };
            
            const backups = this.getBackups();
            backups.push(backupData);
            
            // 保留最新的备份
            if (backups.length > this.MAX_BACKUPS) {
                backups.splice(0, backups.length - this.MAX_BACKUPS);
            }
            
            const success = EnhancedStorageManager.saveData('moments_backups', backups);
            if (success) {
                console.log('✅ 数据备份成功');
                return true;
            } else {
                console.error('❌ 数据备份保存失败');
                return false;
            }
        } catch (error) {
            console.error('❌ 数据备份失败:', error);
            ErrorRecoverySystem.handleError(error, 'Data Backup');
            return false;
        }
    }
    
    static getBackups() {
        try {
            const backups = EnhancedStorageManager.loadData('moments_backups');
            return Array.isArray(backups) ? backups : [];
        } catch (error) {
            console.error('❌ 读取备份失败:', error);
            return [];
        }
    }
    
    static restoreFromBackup(backupIndex = -1) {
        try {
            const backups = this.getBackups();
            if (backups.length === 0) {
                NotificationManager.show('没有可用的备份', 'warning');
                return false;
            }
            
            const backup = backups[backupIndex === -1 ? backups.length - 1 : backupIndex];
            if (backup && backup.moments && Array.isArray(backup.moments)) {
                // 验证备份数据
                if (DataValidator.validateMomentsData(backup.moments)) {
                    MomentsPageManager.data = backup.moments;
                    const success = EnhancedStorageManager.saveData(STORAGE_KEYS.moments, MomentsPageManager.data);
                    if (success) {
                        NotificationManager.show('数据恢复成功', 'success');
                        MomentsPageManager.paginationManager?.render();
                        return true;
                    }
                } else {
                    NotificationManager.show('备份数据格式错误', 'error');
                }
            }
            return false;
        } catch (error) {
            console.error('❌ 恢复备份失败:', error);
            NotificationManager.show('恢复备份失败', 'error');
            return false;
        }
    }
    
    static showRestoreDialog() {
        try {
            const backups = this.getBackups();
            if (backups.length === 0) {
                NotificationManager.show('没有可用的备份', 'warning');
                return;
            }
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 600px;">
                    <h3>选择备份恢复</h3>
                    <div class="backup-list" style="max-height: 400px; overflow-y: auto;">
                        ${backups.map((backup, index) => {
                            if (!backup || !backup.timestamp) return '';
                            const date = new Date(backup.timestamp).toLocaleString();
                            return `
                                <div class="backup-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                                    <span>${date} (${backup.count || 0}条数据)</span>
                                    <button onclick="DataBackupManager.restoreFromBackup(${index})" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                        恢复此备份
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <button onclick="this.closest('.modal').remove()" style="margin-top: 10px; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        关闭
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        } catch (error) {
            console.error('❌ 显示恢复对话框失败:', error);
            NotificationManager.show('显示备份恢复对话框失败', 'error');
        }
    }
    
    static cleanup() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
            this.backupInterval = null;
        }
    }
}

// ==================== 数据验证器 ====================
class DataValidator {
    static validateMomentsData(data) {
        if (!Array.isArray(data)) {
            console.error('朋友圈数据必须是数组');
            return false;
        }
        
        return data.every((item, index) => {
            const errors = [];
            if (!item.id) errors.push('缺少id');
            if (!item.content) errors.push('缺少content');
            if (item.value === undefined) errors.push('缺少value');
            if (!item.category) errors.push('缺少category');
            if (!item.time) errors.push('缺少time');
            
            if (errors.length > 0) {
                console.error(`朋友圈数据[${index}]验证失败:`, errors);
                return false;
            }
            return true;
        });
    }
    
    static repairData(data) {
        return data.map((item, index) => {
            const repaired = { ...item };
            
            // 修复缺失的id
            if (!repaired.id) {
                repaired.id = Date.now() + index;
                console.warn(`修复缺失的id: ${repaired.id}`);
            }
            
            // 修复缺失的时间
            if (!repaired.time) {
                repaired.time = new Date().toISOString();
                console.warn(`修复缺失的时间: ${repaired.id}`);
            }
            
            // 修复缺失的值
            if (repaired.value === undefined) {
                repaired.value = 1;
                console.warn(`修复缺失的value: ${repaired.id}`);
            }
            
            // 确保comments是数组
            if (!Array.isArray(repaired.comments)) {
                repaired.comments = [];
            }
            
            // 确保likes是数字
            if (typeof repaired.likes !== 'number') {
                repaired.likes = parseInt(repaired.likes) || 0;
            }
            
            return repaired;
        });
    }
    
    static validateAndRepair() {
        if (!this.validateMomentsData(MomentsPageManager.data)) {
            console.warn('数据验证失败，尝试修复...');
            MomentsPageManager.data = this.repairData(MomentsPageManager.data);
            if (this.validateMomentsData(MomentsPageManager.data)) {
                console.log('✅ 数据修复成功');
                EnhancedStorageManager.saveData(STORAGE_KEYS.moments, MomentsPageManager.data);
                NotificationManager.show('数据已自动修复', 'success');
            } else {
                console.error('❌ 数据修复失败');
                NotificationManager.show('数据严重损坏，请考虑从备份恢复', 'error');
                DataBackupManager.showRestoreDialog();
            }
        }
    }
}

// ==================== 错误恢复系统 ====================
class ErrorRecoverySystem {
    static init() {
        // 监听全局错误
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });
    }
    
    static handleError(error, type) {
        console.error(`${type}:`, error);
        
        // 记录错误
        this.logError(error, type);
        
        // 根据错误类型提供恢复建议
        if (error.message && error.message.includes('Cannot read property')) {
            NotificationManager.show('数据读取错误，尝试重新加载', 'warning');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else if (error.message && error.message.includes('localStorage')) {
            NotificationManager.show('存储访问失败，检查浏览器设置', 'error');
        }
    }
    
    static logError(error, type) {
        const errorLog = {
            type,
            message: error.message,
            stack: error.stack,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        try {
            const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
            logs.push(errorLog);
            
            // 只保留最近50条错误
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('error_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('记录错误日志失败:', e);
        }
    }
    
    static getErrorLogs() {
        try {
            return JSON.parse(localStorage.getItem('error_logs') || '[]');
        } catch (e) {
            return [];
        }
    }
    
    static clearErrorLogs() {
        try {
            localStorage.removeItem('error_logs');
        } catch (e) {
            console.error('清除错误日志失败:', e);
        }
    }
}

// ==================== 分页管理器 ====================
class PaginationManager {
    constructor(options = {}) {
        this.itemsPerPage = options.itemsPerPage || 12;
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 0;
        this.maxVisiblePages = options.maxVisiblePages || 5;
        
        // DOM元素
        this.container = document.getElementById('momentsContainer');
        this.firstPageBtn = document.getElementById('firstPage');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.lastPageBtn = document.getElementById('lastPage');
        this.pageNumbersContainer = document.getElementById('pageNumbers');
        this.itemsPerPageSelect = document.getElementById('itemsPerPage');
        this.showingStart = document.getElementById('showingStart');
        this.showingEnd = document.getElementById('showingEnd');
        this.totalItemsSpan = document.getElementById('totalItems');
        this.announcer = document.getElementById('announcer');
        
        // 数据存储
        this.allItems = [];
        this.filteredItems = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.firstPageBtn?.addEventListener('click', () => this.goToPage(1));
        this.prevPageBtn?.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPageBtn?.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.lastPageBtn?.addEventListener('click', () => this.goToPage(this.totalPages));
        this.itemsPerPageSelect?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.render();
        });
    }
    
    setData(allItems, filteredItems = null) {
        this.allItems = allItems;
        this.filteredItems = filteredItems || allItems;
        this.totalItems = this.filteredItems.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = 1;
        }
        
        this.render();
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.render();
        this.scrollToTop();
        this.announce(`已跳转到第 ${page} 页`);
    }
    
    render() {
        this.renderItems();
        this.renderControls();
        this.updateInfo();
    }
    
    renderItems() {
        if (!this.container) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
        const pageItems = this.filteredItems.slice(startIndex, endIndex);
        
        const event = new CustomEvent('paginationRender', {
            detail: {
                items: pageItems,
                page: this.currentPage,
                totalPages: this.totalPages
            }
        });
        
        document.dispatchEvent(event);
    }
    
    renderControls() {
        this.updateButtonStates();
        this.renderPageNumbers();
    }
    
    updateButtonStates() {
        const isFirstPage = this.currentPage === 1;
        const isLastPage = this.currentPage === this.totalPages || this.totalPages === 0;
        
        if (this.firstPageBtn) this.firstPageBtn.disabled = isFirstPage;
        if (this.prevPageBtn) this.prevPageBtn.disabled = isFirstPage;
        if (this.nextPageBtn) this.nextPageBtn.disabled = isLastPage;
        if (this.lastPageBtn) this.lastPageBtn.disabled = isLastPage;
    }
    
    renderPageNumbers() {
        if (!this.pageNumbersContainer) return;
        
        this.pageNumbersContainer.innerHTML = '';
        const pages = this.getPageNumbers();
        
        pages.forEach(page => {
            if (page === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.setAttribute('aria-hidden', 'true');
                this.pageNumbersContainer.appendChild(ellipsis);
            } else {
                const button = document.createElement('button');
                button.className = 'page-number';
                button.textContent = page;
                button.setAttribute('aria-label', `第 ${page} 页`);
                
                if (page === this.currentPage) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'page');
                }
                
                button.addEventListener('click', () => this.goToPage(page));
                this.pageNumbersContainer.appendChild(button);
            }
        });
    }
    
    getPageNumbers() {
        const pages = [];
        const half = Math.floor(this.maxVisiblePages / 2);
        
        if (this.totalPages <= this.maxVisiblePages) {
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, this.currentPage - half);
            let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
            
            if (end - start < this.maxVisiblePages - 1) {
                start = Math.max(1, end - this.maxVisiblePages + 1);
            }
            
            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < this.totalPages) {
                if (end < this.totalPages - 1) pages.push('...');
                pages.push(this.totalPages);
            }
        }
        
        return pages;
    }
    
    updateInfo() {
        const startIndex = this.totalItems > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        
        if (this.showingStart) this.showingStart.textContent = startIndex;
        if (this.showingEnd) this.showingEnd.textContent = endIndex;
        if (this.totalItemsSpan) this.totalItemsSpan.textContent = this.totalItems;
    }
    
    scrollToTop() {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const categoryHeight = document.querySelector('.category-nav')?.offsetHeight || 0;
        const offset = headerHeight + categoryHeight + 20;
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
    
    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
    
    reset() {
        this.currentPage = 1;
    }
}

// ==================== 朋友圈页面管理器 ====================
class MomentsPageManager {
    static data = [];
    static eventListeners = new Map();
    static paginationManager = null;
    
    static init() {
        try {
            this.loadData();
            this.initPagination();
            this.bindEvents();
            this.updateStats();
        } catch (error) {
            console.error('朋友圈页面初始化失败:', error);
            ErrorRecoverySystem.handleError(error, 'Moments Page Init');
        }
    }
    
    static initPagination() {
        this.paginationManager = new PaginationManager({
            itemsPerPage: 12,
            maxVisiblePages: 5
        });
        
        // 监听分页渲染事件
        document.addEventListener('paginationRender', (e) => {
            const { items } = e.detail;
            this.renderMoments(items);
        });
        
        // 设置初始数据
        this.paginationManager.setData(this.data);
    }
    
    static loadData() {
        try {
            const savedData = EnhancedStorageManager.loadData(STORAGE_KEYS.moments);
            if (savedData) {
                const savedIds = savedData.map(m => m.id);
                const newDefaults = (window.momentsData || []).filter(m => !savedIds.includes(m.id));
                this.data = [...savedData, ...newDefaults];
            } else {
                this.data = window.momentsData || [];
            }
        } catch (error) {
            console.error('加载朋友圈数据失败:', error);
            this.data = window.momentsData || [];
        }
    }
    
    static saveData() {
        return EnhancedStorageManager.saveData(STORAGE_KEYS.moments, this.data);
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
                categoryBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                appState.currentCategory = btn.dataset.category;
                this.filterByCategory();
            };
            btn.addEventListener('click', handler);
            this.eventListeners.set(`category-${btn.dataset.category}`, { element: btn, handler });
        });
        
        this.initCommentModal();
    }
    
    static clearEventListeners() {
        this.eventListeners.forEach(({ element, handler }) => {
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
                modal.setAttribute('aria-hidden', 'true');
            };
            closeBtn.addEventListener('click', handler);
            this.eventListeners.set('modalClose', { element: closeBtn, handler });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
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
    
    static filterByCategory() {
        const filtered = appState.currentCategory === 'all'
            ? this.data
            : this.data.filter(m => m.category === appState.currentCategory);
        
        this.paginationManager.reset();
        this.paginationManager.setData(this.data, filtered);
        this.updateStats();
    }
    
    static renderMoments(moments) {
        const container = document.getElementById('momentsContainer');
        if (!container) return;
        
        container.setAttribute('aria-busy', 'true');
        
        if (moments.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>${LanguageManager.t('noResults')}</p>
                </div>
            `;
            container.setAttribute('aria-busy', 'false');
            return;
        }
        
        const sorted = this.sortByDate(moments);
        container.innerHTML = sorted.map((moment, index) =>
            this.renderMomentCard(moment, index)
        ).join('');
        
        container.setAttribute('aria-busy', 'false');
    }
    
    static sortByDate(data) {
        return [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    
    static renderMomentCard(moment, index) {
        const hasImage = moment.image && moment.image.trim();
        const hasComments = moment.comments && moment.comments.length > 0;
        const hasLikes = moment.likes > 0;
        
        return `
            <article class="moment-card" style="animation-delay: ${index * ANIMATION_DELAY}s">
                <div class="moment-header">
                    <span class="category-tag">${Utils.escapeHtml(moment.category)}</span>
                    <span class="value-badge">⭐ ${moment.value}</span>
                </div>
                <div class="moment-content">${Utils.formatMultiline(moment.content)}</div>
                ${hasImage ? `
                    <img src="${Utils.escapeHtml(moment.image)}"
                         alt="朋友圈图片"
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
                                aria-label="点赞"
                                aria-pressed="${hasLikes}">
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
            </article>
        `;
    }
    
    static handleLike(id) {
        try {
            const moment = this.data.find(m => m.id === id);
            if (!moment) return;
            
            const hasLiked = moment.likes > 0;
            moment.likes = hasLiked ? 0 : 1;
            
            if (this.saveData()) {
                // 重新渲染当前页
                this.paginationManager.render();
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
        } catch (error) {
            console.error('点赞操作失败:', error);
            NotificationManager.show('点赞失败', 'error');
        }
    }
    
    static openCommentModal(id) {
        try {
            appState.currentMomentId = id;
            const moment = this.data.find(m => m.id === id);
            if (!moment) return;
            
            const modal = document.getElementById('commentModal');
            if (!modal) return;
            
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            
            if (!moment.comments) {
                moment.comments = [];
            }
            
            this.renderComments(moment.comments);
            
            setTimeout(() => {
                const input = document.getElementById('commentInput');
                if (input) input.focus();
            }, 100);
        } catch (error) {
            console.error('打开评论框失败:', error);
            NotificationManager.show('打开评论失败', 'error');
        }
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
            <div class="comment-item" style="animation-delay: ${index * 0.05}s" role="listitem">
                <div style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                    <i class="far fa-user-circle"></i> 访客 • ${Utils.escapeHtml(comment.time)}
                </div>
                <div style="line-height: 1.6;">${Utils.formatMultiline(comment.content)}</div>
            </div>
        `).join('');
    }
    
    static handleCommentSubmit() {
        try {
            const input = document.getElementById('commentInput');
            if (!input) return;
            
            const content = input.value.trim();
            if (!content) {
                NotificationManager.show('请输入评论内容', 'warning');
                return;
            }
            
            if (content.length > MAX_COMMENT_LENGTH) {
                NotificationManager.show(`评论内容不能超过${MAX_COMMENT_LENGTH}字`, 'warning');
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
                this.paginationManager.render();
                input.value = '';
                NotificationManager.show('评论发表成功！', 'success');
            }
        } catch (error) {
            console.error('发表评论失败:', error);
            NotificationManager.show('评论发表失败', 'error');
        }
    }
    
    static handleSearch(keyword) {
        const normalizedKeyword = Utils.normalize(keyword);
        if (!normalizedKeyword) {
            this.paginationManager.reset();
            this.paginationManager.setData(this.data);
            this.updateStats();
            return;
        }
        
        const filtered = this.data.filter(moment =>
            Utils.normalize(moment.content).includes(normalizedKeyword) ||
            Utils.normalize(moment.category).includes(normalizedKeyword)
        );
        
        this.paginationManager.reset();
        this.paginationManager.setData(this.data, filtered);
        this.updateStats();
    }
    
    static updateStats() {
        if (!this.paginationManager) return;
        
        const filteredData = this.paginationManager.filteredItems;
        const today = new Date().toISOString().split('T')[0];
        let highValue = 0;
        let todayCount = 0;
        
        filteredData.forEach(moment => {
            const value = parseInt(moment.value) || 0;
            if (value >= 5) highValue++;
            if (moment.time && moment.time.split(' ')[0] === today) {
                todayCount++;
            }
        });
        
        // 使用动画更新统计
        const totalEl = document.getElementById('totalMoments');
        const highValueEl = document.getElementById('highValueMoments');
        const todayEl = document.getElementById('todayMoments');
        
        if (totalEl) this.animateCounter(totalEl, parseInt(totalEl.textContent) || 0, filteredData.length, 800);
        if (highValueEl) this.animateCounter(highValueEl, parseInt(highValueEl.textContent) || 0, highValue, 1000);
        if (todayEl) this.animateCounter(todayEl, parseInt(todayEl.textContent) || 0, todayCount, 600);
    }
    
    static animateCounter(element, start, end, duration) {
        const startTime = Date.now();
        const range = end - start;
        
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(start + range * this.easeOutQuart(progress));
            element.textContent = value;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    }
    
    static easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

// ==================== 成功日记页面管理器 ====================
class SuccessPageManager {
    static init() {
        try {
            this.updatePageTexts();
            this.populateMoodFilter();
            this.renderTagFilters();
            this.bindEvents();
            this.render();
        } catch (error) {
            console.error('成功日记页面初始化失败:', error);
            ErrorRecoverySystem.handleError(error, 'Success Page Init');
        }
    }
    
    static updatePage() {
        try {
            this.updatePageTexts();
            this.populateMoodFilter();
            this.renderTagFilters();
            this.render();
        } catch (error) {
            console.error('更新成功日记页面失败:', error);
        }
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
                        data-tag="${tag.code}"
                        aria-pressed="${isActive}">
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
                <div class="diary-empty">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>${LanguageManager.t('timelineEmpty')}</p>
                </div>
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
                return `<img src="${Utils.escapeHtml(trimmed)}" alt="附件图片" class="diary-attachment" onerror="this.style.display='none'" loading="lazy">`;
            }
            return `<a href="${Utils.escapeHtml(trimmed)}" target="_blank" rel="noopener noreferrer" class="diary-attachment-link">${Utils.escapeHtml(trimmed)}</a>`;
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
        try {
            // 获取页面类型
            const pageElement = document.querySelector('[data-page]');
            appState.currentPage = pageElement ? pageElement.dataset.page : PAGE_TYPES.MOMENTS;
            
            // 初始化错误恢复系统
            ErrorRecoverySystem.init();
            
            // 应用主题
            ThemeManager.applySavedTheme();
            ThemeManager.updateThemeToggleButton();
            
            // 初始化全局控件
            this.initializeGlobalControls();
            
            // 初始化页面
            this.initializePage();
            
            // 初始化备份系统（最后初始化）
            if (appState.currentPage === PAGE_TYPES.MOMENTS) {
                // 验证和修复数据
                DataValidator.validateAndRepair();
                
                // 延迟初始化备份系统
                setTimeout(() => {
                    DataBackupManager.init();
                }, 2000);
            }
            
            // 显示存储使用情况
            this.showStorageInfo();
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            NotificationManager.show('应用初始化失败，请刷新重试', 'error');
            
            // 尝试恢复
            setTimeout(() => {
                if (confirm('初始化失败，是否尝试从备份恢复？')) {
                    DataBackupManager.showRestoreDialog();
                }
            }, 1000);
        }
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
        try {
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
        } catch (error) {
            console.error('页面初始化失败:', error);
            throw error;
        }
    }
    
    static showStorageInfo() {
        const usage = EnhancedStorageManager.getStorageUsage();
        if (usage.usedMB > 4) { // 超过4MB时提醒
            console.warn(`存储使用量较高: ${usage.usedMB}MB`);
        }
    }
}

// ==================== 全局暴露 ====================
window.MomentsPageManager = MomentsPageManager;
window.SuccessPageManager = SuccessPageManager;
window.PaginationManager = PaginationManager;
window.DataBackupManager = DataBackupManager;
window.DataValidator = DataValidator;
window.ErrorRecoverySystem = ErrorRecoverySystem;
window.EnhancedStorageManager = EnhancedStorageManager;

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    try {
        AppController.init();
    } catch (error) {
        console.error('页面初始化失败:', error);
        NotificationManager.show('页面初始化失败，请刷新重试', 'error');
    }
});

// ==================== 样式注入 ====================
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
    .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        color: var(--text-secondary);
        grid-column: 1 / -1;
    }
    .diary-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        color: var(--text-secondary);
    }
    .backup-item:hover {
        background-color: #f8f9fa;
    }
    .modal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: none;
    }
    .modal-content {
        background-color: white;
        margin: 10% auto;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);

// ==================== 图片错误处理 ====================
document.addEventListener('DOMContentLoaded', function() {
    const handleImageError = (img) => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="200" y="150" text-anchor="middle" fill="%23999" font-size="16">图片加载失败</text></svg>';
        img.style.opacity = '0.5';
    };
    
    // 使用事件委托处理所有图片错误
    document.body.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            handleImageError(e.target);
        }
    }, true);
});
