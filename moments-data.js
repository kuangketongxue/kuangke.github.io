// ==================== 朋友圈数据 ====================
/**
 * 朋友圈数据集
 * @type {Array<Object>}
 */
let momentsData = [
    {
        id: 22,
        content: '马斯克与弗里费德曼的播客不错-https://youtu.be/JN3KPFbWCy8?si=z0HMVS7Jw-GSO5zC',
        value: 5,
        category: '问答互动',
        time: '2025-10-14 19:17',
        image: '',
        likes: 0,
        comments: []
    },
    // ... 其他朋友圈数据保持不变
];

// ==================== 浏览器环境全局暴露 ====================
if (typeof window !== 'undefined') {
    window.momentsData = momentsData;
}

// ==================== Node.js 环境模块导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        momentsData
    };
}
