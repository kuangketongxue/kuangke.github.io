// ==================== 视频数据配置文件 ====================
// 每周必看视频数据
// 格式说明：
// - date: 视频日期，格式 'YYYY-MM-DD'（必填）
// - url: 视频链接（必填）
// - thumbnail: 封面图片路径（可选，留空则显示默认图标）
// - title: 视频标题（必填）
// - desc: 视频描述（必填）

const videosData = [
    // ==================== 2024年第2周 ====================
    {
        date: '2025-11-01',
        url: 'https://b23.tv/iogh4mJ',
        thumbnail: 'images/weekly/2025-w44-1.jpg',
        title: 'AI大模型周报2025年11月a',
        desc: 'minimax更新，世界模拟器，Sora2角色客串......'
    },
    {
        date: '2024-01-09',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Docker容器化实战',
        desc: '从零开始学习Docker，实现应用快速部署和迁移'
    },
    {
        date: '2024-01-10',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Vue3组合式API深度解析',
        desc: '深入理解Vue3 Composition API，构建更优雅的组件'
    },
    {
        date: '2024-01-11',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'MySQL性能优化指南',
        desc: '学习索引优化、查询优化等技巧，提升数据库性能'
    },
    {
        date: '2024-01-12',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Git进阶使用技巧',
        desc: '掌握Git分支管理、冲突解决等高级操作'
    },
    {
        date: '2024-01-13',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'TypeScript类型体操',
        desc: '深入学习TypeScript高级类型，写出更安全的代码'
    },
    {
        date: '2024-01-14',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Nginx配置从入门到精通',
        desc: '学习Nginx反向代理、负载均衡等核心功能'
    },
    {
        date: '2024-01-08',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Redis缓存设计模式',
        desc: '掌握Redis常见使用场景和最佳实践'
    },
    {
        date: '2024-01-09',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Linux命令行技巧大全',
        desc: '提升Linux使用效率，成为命令行高手'
    },
    {
        date: '2024-01-10',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: '前端性能优化实战',
        desc: '从多个维度优化网页性能，提升用户体验'
    },

    // ==================== 2024年第1周 ====================
    {
        date: '2024-01-02',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: '2024新年第一课：如何制定年度计划',
        desc: '新的一年，教你科学制定年度目标，让2024更有方向感'
    },
    {
        date: '2024-01-03',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'AI编程助手使用指南',
        desc: '深度体验各类AI编程工具，提升开发效率10倍'
    },
    {
        date: '2024-01-04',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Web3.0技术趋势解析',
        desc: '了解区块链和去中心化应用的最新发展动态'
    },
    {
        date: '2024-01-05',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'ChatGPT实用技巧分享',
        desc: '掌握ChatGPT高效使用方法，释放AI生产力'
    },
    {
        date: '2024-01-06',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'React Server Components详解',
        desc: '深入理解React最新特性，构建更快的应用'
    },
    {
        date: '2024-01-07',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Node.js性能优化实践',
        desc: '从代码到架构，全方位优化Node.js应用性能'
    },
    {
        date: '2024-01-02',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'CSS现代布局技术',
        desc: '学习Grid、Flexbox等现代CSS布局方案'
    },
    {
        date: '2024-01-03',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: '微服务架构设计实战',
        desc: '从单体到微服务，构建可扩展的系统架构'
    },
    {
        date: '2024-01-04',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'GraphQL入门到实战',
        desc: '学习GraphQL，构建更灵活的API接口'
    },
    {
        date: '2024-01-05',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: '算法与数据结构精讲',
        desc: '掌握常用算法和数据结构，提升编程能力'
    },

    // ==================== 2023年第52周 ====================
    {
        date: '2023-12-25',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: '2023年度技术回顾',
        desc: '盘点2023年最重要的技术突破和发展趋势'
    },
    {
        date: '2023-12-26',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'React 19新特性详解',
        desc: 'React 19带来的革命性变化，开发体验大幅提升'
    },
    {
        date: '2023-12-27',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Vite 5.0深度解析',
        desc: '了解Vite 5.0的新功能和性能优化'
    },
    {
        date: '2023-12-28',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Tailwind CSS实战技巧',
        desc: '掌握原子化CSS，快速构建精美界面'
    },
    {
        date: '2023-12-29',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Next.js 14完全指南',
        desc: 'Next.js 14新特性全面解析，构建全栈应用'
    },
    {
        date: '2023-12-30',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Rust语言入门指南',
        desc: '学习Rust语言，体验系统级编程的魅力'
    },
    {
        date: '2023-12-31',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'Kubernetes容器编排',
        desc: '掌握K8s基础知识，实现容器化应用部署'
    },
    {
        date: '2023-12-25',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'MongoDB数据建模',
        desc: '学习NoSQL数据库设计，构建灵活的数据模型'
    },
    {
        date: '2023-12-26',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: 'WebAssembly实战',
        desc: '探索WebAssembly，为Web应用带来原生性能'
    },
    {
        date: '2023-12-27',
        url: 'https://www.bilibili.com/video/BV1xx4y1x7xx',
        thumbnail: '',
        title: '前端自动化测试',
        desc: '学习Jest、Cypress等测试工具，保证代码质量'
    },

    // ==================== 添加更多周的数据 ====================
    // 继续按照上面的格式添加更多视频...
    
];

// 导出数据（如果使用模块化）
// export default videosData;
