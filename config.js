// config.js - LeanCloud配置
const APP_ID = '2pmu0Y0IKEfIKXhdJHNEd1uU-gzGzoHsz'; // 替换为你的App ID
const APP_KEY = 'cbLreTdVyxyXuWgmfwdQxPFF'; // 替换为你的App Key
const SERVER_URL = 'https://2pmu0y0i.lc-cn-n1-shared.com'; // 替换为你的服务器URL

// 初始化LeanCloud
AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    serverUrl: SERVER_URL
});

// 导出配置
window.CONFIG = {
    APP_ID,
    APP_KEY,
    SERVER_URL
};
// ==================== 数据字典 & 配置 ====================

/**
 * 日记标签库
 * @type {Array<{code: string, zh: string, en: string, icon: string}>}
 */
const diaryTagLibrary = [
    { code: 'reading',  zh: '📖阅读',       en: '📖Reading',   icon: '📖' },
    { code: 'fitness',  zh: '🏃‍♀️运动',       en: '🏃‍♀️Fitness',   icon: '🏃‍♀️' },
    { code: 'work',     zh: '💼工作',       en: '💼Work',      icon: '💼' },
    { code: 'study',    zh: '📚学习',       en: '📚Study',     icon: '📚' },
    { code: 'nature',   zh: '🌳自然',       en: '🌳Nature',    icon: '🌳' },
    { code: 'creative', zh: '✍️创作',       en: '✍️Creative',  icon: '✍️' },
    { code: 'film',     zh: '🎬追剧/电影',  en: '🎬Films',     icon: '🎬' },
    { code: 'music',    zh: '🎶音乐',       en: '🎶Music',     icon: '🎶' },
    { code: 'finance',  zh: '💰理财',       en: '💰Finance',   icon: '💰' },
    { code: 'travel',   zh: '✈️旅行',       en: '✈️Travel',    icon: '✈️' }
];

/**
 * 心情库
 * @type {Object<string, {zh: string, en: string, color: string, emoji: string}>}
 */
const moodLibrary = {
    satisfied: {
        zh: '✨满足',
        en: '✨Satisfied',
        color: '#10b981',
        emoji: '✨'
    },
    calm: {
        zh: '😌平静',
        en: '😌Calm',
        color: '#38bdf8',
        emoji: '😌'
    },
    hungry: {
        zh: '🍜保持饥渴感',
        en: '🍜Stay hungry',
        color: '#f97316',
        emoji: '🍜'
    },
    happy: {
        zh: '😊开心',
        en: '😊Happy',
        color: '#facc15',
        emoji: '😊'
    }
};

/**
 * 朋友圈分类
 * @type {Array<{code: string, zh: string, en: string}>}
 */
const momentCategories = [
    { code: 'all',      zh: '全部',     en: 'All' },
    { code: '生活日常', zh: '生活日常', en: 'Daily Life' },
    { code: '工作相关', zh: '工作相关', en: 'Work' },
    { code: '科技数码', zh: '科技数码', en: 'Tech' },
    { code: '艺术文化', zh: '艺术文化', en: 'Culture' },
    { code: '情感表达', zh: '情感表达', en: 'Emotions' },
    { code: '财经理财', zh: '财经理财', en: 'Finance' }
];

// ==================== 浏览器环境全局暴露 ====================
if (typeof window !== 'undefined') {
    window.diaryTagLibrary = diaryTagLibrary;
    window.moodLibrary = moodLibrary;
    window.momentCategories = momentCategories;
    console.log('✅ 配置模块已加载');
}

// ==================== Node.js 环境模块导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        diaryTagLibrary,
        moodLibrary,
        momentCategories
    };
}
