// 成功日记默认示例（可在页面内新增 / 编辑）
let successDiaryData = [
    {
        id: 1,
        date: '2025-09-29',
        categories: ['reading', 'fitness'],
        headline: {
            zh: '拥抱清晨，完成每日收官',
            en: 'Embrace the dawn. Achieve daily closure.'
        },
        content: {
            zh: '七小时高效心流，计划全部按时完成。',
            en: 'Seven hours of productive flow with every goal checked off.'
        },
        highlight: {
            zh: '今日收录了两条人生启示录。',
            en: 'Captured two inspiring life insights today.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 5,
        coverImage: 'images/5544bbf9199ddc240c7d14bd98e6cdfd.png',
        attachments: []
    },
    {
        id: 2,
        date: '2025-09-30',
        categories: ['work', 'study', 'fitness', 'nature'],
        headline: {
            zh: '超时完成 10 小时专注学习',
            en: 'Study for over ten hours ahead of schedule.'
        },
        content: {
            zh: '图书馆学习氛围佳，提前完成阅读任务。',
            en: 'Great focus at the library; finished the reading list early.'
        },
        highlight: {
            zh: '九月的最后一天，收获满满。',
            en: 'The last day of September felt truly rewarding.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 4,
        coverImage: 'images/a02a02195090841106b5305e8fb14860.jpg',
        attachments: []
    },
    {
        id: 3,
        date: '2025-10-01',
        categories: ['work', 'study', 'creative'],
        headline: {
            zh: '打造朋友圈数字花园',
            en: 'Launch a bespoke digital haven for my circle of friends.'
        },
        content: {
            zh: '坚持 7 小时深度学习并上线个人朋友圈站点。',
            en: 'Studied over seven hours and published the personal timeline site.'
        },
        highlight: {
            zh: '“回家的路”真的很好听 🌌',
            en: '"The Road Home" is such a beautiful track 🌌'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 5,
        coverImage: 'images/9884f4b986c88ee9963c735ba193939c.jpg',
        attachments: []
    },
    {
        id: 4,
        date: '2025-10-02',
        categories: ['work', 'study', 'nature'],
        headline: {
            zh: '读完《小狗钱钱》',
            en: 'After finishing "Little Dog Money".'
        },
        content: {
            zh: '完成阅读笔记并沉浸于双影奇境的奇妙体验。',
            en: 'Wrapped up the book and enjoyed the immersive Double Mirage.'
        },
        highlight: {
            zh: '双影奇境不错 😄',
            en: 'Double Mirage feels amazing 😄'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 4,
        coverImage: 'images/4dd4a92b00f40efe894d41519c6e675c.jpg',
        attachments: []
    },
    {
        id: 5,
        date: '2025-09-24',
        categories: ['reading', 'film'],
        headline: {
            zh: '九本书 + 公众号输出',
            en: 'Read nine books and wrote for the public account.'
        },
        content: {
            zh: '完成 9 本书籍阅读并输出成公众号文章。',
            en: 'Read nine different books in a day and published an article.'
        },
        highlight: {
            zh: '罗永浩 × 周鸿祎的 3 小时播客太带感。',
            en: 'Loved the 3-hour podcast by Luo Yonghao & Zhou Hongyi.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 5,
        coverImage: 'images/1c2cde0fb8c866662a89a21de464caf7.png',
        attachments: []
    },
    {
        id: 6,
        date: '2025-09-17',
        categories: ['study', 'fitness'],
        headline: {
            zh: '搭建小程序与成功日记系统',
            en: 'Built my mini-program and the success diary system.'
        },
        content: {
            zh: '制作成功日记模板，完成 7 本书阅读与日课录制。',
            en: 'Shipped the diary template, read seven books, and recorded lessons.'
        },
        highlight: {
            zh: '公众号文章推迟以保证深度。',
            en: 'Postponed the article for more depth.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'calm',
        achievementLevel: 4,
        coverImage: 'images/1aa6b078b1577770e866e1afcc4b9074.png',
        attachments: []
    }
];
const successDiaryDefaults = JSON.parse(JSON.stringify(successDiaryData));
