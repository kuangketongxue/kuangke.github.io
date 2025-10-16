// ==================== 工具函数 ====================

/**
 * 验证日记条目的有效性
 * @param {Object} entry - 待验证的日记条目对象
 * @param {Array} diaryTagLibrary - 有效的分类标签库（每个元素含code属性）
 * @param {Object} moodLibrary - 有效的心情代码库（键为心情代码）
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateDiaryEntry(entry, diaryTagLibrary, moodLibrary) {
    let isValid = true;
    
    // 1. 检查必填字段
    const requiredFields = ['id', 'date', 'categories', 'headline', 'content', 'moodCode'];
    const missingFields = requiredFields.filter(field => !(field in entry));
    if (missingFields.length > 0) {
        console.error('❌ 日记条目 ' + (entry.id || '未知ID') + ' 缺少必需字段：', missingFields);
        isValid = false;
    }
    
    // 2. 验证分类
    if ('categories' in entry) {
        if (!Array.isArray(entry.categories)) {
            console.warn('⚠️ 日记条目 ' + (entry.id || '未知ID') + ' 的categories不是数组');
            isValid = false;
        } else {
            const validCategoryCodes = diaryTagLibrary.map(tag => tag.code);
            const invalidCategories = entry.categories.filter(cat => !validCategoryCodes.includes(cat));
            if (invalidCategories.length > 0) {
                console.warn('⚠️ 日记条目 ' + (entry.id || '未知ID') + ' 包含无效分类：', invalidCategories);
                isValid = false;
            }
        }
    }
    
    // 3. 验证心情代码
    if ('moodCode' in entry) {
        if (!(entry.moodCode in moodLibrary)) {
            console.warn('⚠️ 日记条目 ' + (entry.id || '未知ID') + ' 包含无效心情代码：' + entry.moodCode);
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * 获取标签信息
 * @param {string} code - 标签代码
 * @param {string} lang - 语言('zh' | 'en')
 * @returns {Object|null} 标签信息对象
 */
function getTagInfo(code, lang = 'zh') {
    const tag = diaryTagLibrary.find(t => t.code === code);
    return tag || null;
}

/**
 * 获取标签名称(含图标)
 * @param {string} code - 标签代码
 * @param {string} lang - 语言('zh' | 'en')
 * @returns {string} 标签名称
 */
function getTagName(code, lang = 'zh') {
    const tag = diaryTagLibrary.find(t => t.code === code);
    if (!tag) return code;
    return tag[lang] + ' ' + tag.icon;
}

/**
 * 获取心情信息
 * @param {string} code - 心情代码
 * @param {string} lang - 语言('zh' | 'en')
 * @returns {Object} 心情信息对象
 */
function getMoodInfo(code, lang = 'zh') {
    const mood = moodLibrary[code];
    if (!mood) {
        return {
            text: '未知',
            color: '#6b7280',
            emoji: '❓'
        };
    }
    return {
        text: mood[lang],
        color: mood.color,
        emoji: mood.emoji
    };
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @param {string} lang - 语言('zh' | 'en')
 * @param {Object} options - 日期格式化选项
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString, lang = 'zh', options = {}) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error('❌ 无效的日期格式:', dateString);
        return dateString;
    }
    
    const defaultOptions = {
        year: 'numeric',
        month: lang === 'en' ? 'short' : 'long',
        day: 'numeric'
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const locale = lang === 'en' ? 'en-US' : 'zh-CN';
    return date.toLocaleDateString(locale, mergedOptions);
}

/**
 * 按日期排序日记
 * @param {Array} diaries - 日记数组
 * @param {boolean} descending - 是否降序排列(默认 true)
 * @returns {Array} 排序后的日记数组
 */
function sortDiariesByDate(diaries, descending = true) {
    return [...diaries].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return descending ? dateB - dateA : dateA - dateB;
    });
}

/**
 * 按分类筛选日记
 * @param {Array} diaries - 日记数组
 * @param {string} category - 分类代码
 * @returns {Array} 筛选后的日记数组
 */
function filterDiariesByCategory(diaries, category) {
    if (!category || category === 'all') return diaries;
    return diaries.filter(diary => diary.categories.includes(category));
}

/**
 * 按心情筛选日记
 * @param {Array} diaries - 日记数组
 * @param {string} moodCode - 心情代码
 * @returns {Array} 筛选后的日记数组
 */
function filterDiariesByMood(diaries, moodCode) {
    if (!moodCode) return diaries;
    return diaries.filter(diary => diary.moodCode === moodCode);
}

/**
 * 获取日记统计信息
 * @param {Array} diaries - 日记数组
 * @returns {Object} 统计信息
 */
function getDiaryStats(diaries) {
    const stats = {
        total: diaries.length,
        categories: {},
        moods: {},
        achievementLevels: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0
        }
    };
    
    diaries.forEach(diary => {
        // 统计分类
        diary.categories.forEach(cat => {
            stats.categories[cat] = (stats.categories[cat] || 0) + 1;
        });
        
        // 统计心情
        stats.moods[diary.moodCode] = (stats.moods[diary.moodCode] || 0) + 1;
        
        // 统计成就等级
        stats.achievementLevels[diary.achievementLevel]++;
    });
    
    return stats;
}

// ==================== 浏览器环境全局暴露 ====================
if (typeof window !== 'undefined') {
    window.getTagInfo = getTagInfo;
    window.getTagName = getTagName;
    window.getMoodInfo = getMoodInfo;
    window.formatDate = formatDate;
    window.validateDiaryEntry = validateDiaryEntry;
    window.sortDiariesByDate = sortDiariesByDate;
    window.filterDiariesByCategory = filterDiariesByCategory;
    window.filterDiariesByMood = filterDiariesByMood;
    window.getDiaryStats = getDiaryStats;
}

// ==================== Node.js 环境模块导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTagInfo,
        getTagName,
        getMoodInfo,
        formatDate,
        validateDiaryEntry,
        sortDiariesByDate,
        filterDiariesByCategory,
        filterDiariesByMood,
        getDiaryStats
    };
}
