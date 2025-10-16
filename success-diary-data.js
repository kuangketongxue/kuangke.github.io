// ==================== 成功日记专属数据模块 ====================

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
 * 成功日记数据集
 * @type {Array<Object>}
 */
let successDiaryData = [
    {
        id: 33,
        date: '2025-10-14',
        categories: ['study', 'creative'],
        headline: {
            zh: '财务系统优化+精力补充',
            en: 'Optimization of the financial system + energy replenishment'
        },
        content: {
            zh: '阅读10本书+。\n持续搭建个人网站,加了N个功能+自我介绍网站+......\n优化原始财务系统表。\n学习11小时+。',
            en: 'Read 10+ books.\nContinuously building a personal website, Added numerous features + self-introduction website +.......\noptimize the original financial system tables.\nStudie我来帮你把"成功日记"和"朋友圈"的数据分开。基于你的代码结构，我建议创建两个独立的数据文件。

## 1. 创建成功日记数据文件 (success-diary-data.js)

```javascript
// ==================== 成功日记数据 ====================
/**
 * 成功日记数据集
 * @type {Array<Object>}
 */
let successDiaryData = [
    {
        id: 33,
        date: '2025-10-14',
        categories: ['study', 'creative'],
        headline: {
            zh: '财务系统优化+精力补充',
            en: 'Optimization of the financial system + energy replenishment'
        },
        content: {
            zh: '阅读10本书+。\n持续搭建个人网站,加了N个功能+自我介绍网站+......\n优化原始财务系统表。\n学习11小时+。',
            en: 'Read 10+ books.\nContinuously building a personal website,is, Added numerous features + self-introduction website +.......\noptimize the original financial system tables.\nStudied for 8+ hours'
        },
        highlight: {
            zh: 'RSS订阅搭建',
            en: 'RSS subscription setup'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    },
    // ... 其他成功日记数据保持不变
];

// 深拷贝默认数据
const successDiaryDefaults = JSON.parse(JSON.stringify(successDiaryData));

// ==================== 浏览器环境全局暴露 ====================
if (typeof window !== 'undefined') {
    window.successDiaryData = successDiaryData;
    window.successDiaries = successDiaryData;
    window.successDiaryDefaults = successDiaryDefaults;
}

// ==================== Node.js 环境模块导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        successDiaryData,
        successDiaries: successDiaryData,
        successDiaryDefaults
    };
}
