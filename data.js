// ==================== 数据字典 & 配置 ====================

/**
 * 日记标签库
 * @type {Array<{code: string, zh: string, en: string}>}
 */
const diaryTagLibrary = [
    { code: 'reading', zh: '阅读 📖', en: 'Reading 📖' },
    { code: 'fitness', zh: '运动 🏃‍♀️', en: 'Fitness 🏃‍♀️' },
    { code: 'work', zh: '工作 💼', en: 'Work 💼' },
    { code: 'study', zh: '学习 📚', en: 'Study 📚' },
    { code: 'nature', zh: '自然 🌳', en: 'Nature 🌳' },
    { code: 'creative', zh: '创作 ✍️', en: 'Creative ✍️' },
    { code: 'film', zh: '追剧/电影 🎬', en: 'Films 🎬' },
    { code: 'music', zh: '音乐 🎶', en: 'Music 🎶' },
    { code: 'finance', zh: '理财 💰', en: 'Finance 💰' },
    { code: 'travel', zh: '旅行 ✈️', en: 'Travel ✈️' }
];

/**
 * 心情库
 * @type {Object<string, {zh: string, en: string, color: string}>}
 */
const moodLibrary = {
    satisfied: {
        zh: '✨ 满足',
        en: '✨ Satisfied',
        color: '#10b981'
    },
    calm: {
        zh: '😌 平静',
        en: '😌 Calm',
        color: '#38bdf8'
    },
    hungry: {
        zh: '(｡´•﹃•)っ🍜 保持饥渴感',
        en: '(｡´•﹃•)っ🍜 Stay hungry',
        color: '#f97316'
    },
    happy: {
        zh: '😊 开心',
        en: '😊 Happy',
        color: '#facc15'
    }
};

/**
 * 朋友圈分类
 * @type {Array<{code: string, zh: string, en: string}>}
 */
const momentCategories = [
    { code: 'all', zh: '全部', en: 'All' },
    { code: '生活日常', zh: '生活日常', en: 'Daily Life' },
    { code: '工作相关', zh: '工作相关', en: 'Work' },
    { code: '科技数码', zh: '科技数码', en: 'Tech' },
    { code: '艺术文化', zh: '艺术文化', en: 'Culture' },
    { code: '情感表达', zh: '情感表达', en: 'Emotions' },
    { code: '财经理财', zh: '财经理财', en: 'Finance' }
];

// ==================== 成功日记数据 ====================

/**
 * 成功日记数据集
 * @type {Array<Object>}
 */
let successDiaryData = [
    {
        id: 28,
        date: '2025-10-09',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '阅读+产品测试',
            en: 'Reading + Product Testing'
        },
        content: {
            zh: '阅读10本书+。\n产品在淘宝闲鱼测试。\n持续搭建个人网站,补充了启发值。\n睡眠充足。\n学习14小时+',
            en: 'Read 10 books.\nThe product is being tested on Taobao Xianyu platform.\nKept building the personal website, Enhanced the enlightening value.\nAdequate sleep.\nStudying for more than 14 hours'
        },
        highlight: {
            zh: '前哨战关于时间负债的实操👍',
            en: 'Practical Implementation of Time Debt in a Pre-Battle Scenario👍'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 4,
        coverImage: '',
        attachments: []
    },
    {
        id: 27,
        date: '2025-10-08',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '阅读+产品测试',
            en: 'Reading + Product Testing'
        },
        content: {
            zh: '阅读10本书+且读完《区块链革命》。\n产品在淘宝闲鱼测试。\n持续搭建个人网站,加了一键回到顶部的功能。\n睡眠充足。\n学习14小时+',
            en: 'Read 10 books and finish "The Blockchain Revolution".\nThe product is being tested on Taobao Xianyu platform.\nKept building the personal website, added a one-click feature to return to the top.\nAdequate sleep.\nStudying for more than 14 hours'
        },
        highlight: {
            zh: '榴莲不错;罗永浩*TIM双厨狂喜',
            en: 'Durian is quite good😌. Luo Yonghao and TIM are over the moon with excitement.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 4,
        coverImage: '',
        attachments: []
    },
    {
        id: 26,
        date: '2025-10-07',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '阅读+产品测试',
            en: 'Reading + Product Testing'
        },
        content: {
            zh: '阅读10本书+。\n产品在淘宝闲鱼测试。\n持续搭建个人网站,加了背景。\n睡眠充足。\n学习7小时+',
            en: 'Read 10 books or more.\nThe product is being tested on Taobao Xianyu platform.\nKept building the personal website, added background.\nAdequate sleep.\nStudying for more than 7 hours'
        },
        highlight: {
            zh: '寿司不错😌;凡人修仙传不错',
            en: 'The sushi looks nice😌. The Legend of Immortals is quite good.'
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
    {
        id: 25,
        date: '2025-10-06',
        categories: ['study', 'creative'],
        headline: {
            zh: '阅读+产品测试',
            en: 'Reading + Product Testing'
        },
        content: {
            zh: '阅读10本书+。\n产品在淘宝闲鱼测试。\n持续搭建个人网站,加了背景。\n睡眠充足。\n学习10小时+',
            en: 'Read 10 books or more.\nThe product is being tested on Taobao Xianyu platform.\nKept building the personal website, added background.\nAdequate sleep.\nStudying for more than 10 hours'
        },
        highlight: {
            zh: '椰子水不错😌',
            en: 'The coconut water looks nice😌'
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
    {
        id: 24,
        date: '2025-10-05',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '阅读+前哨战"以项目为导向"',
            en: 'Reading + Frontline Battle: Projects-Oriented Approach'
        },
        content: {
            zh: '阅读10本书+。\n写产品商业书。\n持续搭建个人网站。\n睡眠充足。',
            en: 'Read 10 books or more.\nWriting a commercial book about the product.\nKept building the personal website.\nAdequate sleep.'
        },
        highlight: {
            zh: 'Linksphotograph的视频"在世界上最孤独的房子里过一夜!"好看',
            en: 'The video "Spending a Night in the Most Isolated House in the World!" by Linksphotograph is quite captivating.'
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
    {
        id: 4,
        date: '2025-10-01',
        categories: ['work', 'study', 'creative'],
        headline: {
            zh: '打造朋友圈数字花园',
            en: 'Launch a bespoke digital haven'
        },
        content: {
            zh: '坚持 7 小时深度学习并上线个人朋友圈站点。',
            en: 'Studied over seven hours and published the personal timeline site.'
        },
        highlight: {
            zh: '《回家的路》真的很好听 🌌',
            en: '"The Road Home" is such a beautiful track 🌌'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 0,
        coverImage: 'images/9884f4b986c88ee9963c735ba193939c.jpg',
        attachments: []
    },
    {
        id: 1,
        date: '2025-10-04',
        categories: ['study', 'creative'],
        headline: {
            zh: '图书馆深耕与网站焕新',
            en: 'Library deep work and site refresh'
        },
        content: {
            zh: '去图书馆学习。\n网站整体翻新迭代。\n学习12个小时+。',
            en: 'Studied at the city library.\nRefreshed the entire website experience.\nStudying for more than 12 hours.'
        },
        highlight: {
            zh: '影视飓风 1300 万粉丝评论区的 BGM 切画面经验值得学习。',
            en: 'Learned useful BGM and cut tips from Cinematic Hurricane\'s 13M-subscriber comments.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 0,
        coverImage: '',
        attachments: []
    },
    {
        id: 2,
        date: '2025-10-03',
        categories: ['reading', 'study'],
        headline: {
            zh: '提前完成阅读记录并整理电脑',
            en: 'Finished the reading log ahead of time'
        },
        content: {
            zh: '提前完成今日阅读记录。\n梳理并整理电脑内容。',
            en: 'Completed the daily reading log early.\nTidied and organized files on the computer.'
        },
        highlight: {
            zh: '双影奇境依旧很好玩 😄',
            en: 'Double Mirage still feels amazing 😄'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 0,
        coverImage: '',
        attachments: []
    },
    {
        id: 3,
        date: '2025-10-02',
        categories: ['work', 'study', 'nature'],
        headline: {
            zh: '读完《小狗钱钱》',
            en: 'Finished "Little Dog Money"'
        },
        content: {
            zh: '完成阅读笔记并沉浸于双影奇境的奇妙体验。',
            en: 'Wrapped up reading notes and enjoyed the immersive Double Mirage journey.'
        },
        highlight: {
            zh: '双影奇境不错 😄',
            en: 'Double Mirage feels great 😄'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 0,
        coverImage: 'images/4dd4a92b00f40efe894d41519c6e675c.jpg',
        attachments: []
    },
    {
        id: 5,
        date: '2025-09-30',
        categories: ['work', 'study', 'fitness', 'nature'],
        headline: {
            zh: '超额完成 10 小时专注学习',
            en: 'Studied over ten hours ahead of schedule'
        },
        content: {
            zh: '图书馆学习氛围满分,提前完成阅读任务。',
            en: 'Great focus at the library; finished the reading list ahead of schedule.'
        },
        highlight: {
            zh: '图书馆学习真不错 ٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ',
            en: 'Loved the study vibe at the library ٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 0,
        coverImage: 'images/a02a02195090841106b5305e8fb14860.jpg',
        attachments: []
    },
    {
        id: 6,
        date: '2025-09-29',
        categories: ['reading', 'fitness'],
        headline: {
            zh: '拥抱清晨,完成每日收官',
            en: 'Embrace the dawn, close the day strong'
        },
        content: {
            zh: '七小时高效心流,计划全部按时完成。',
            en: 'Seven hours of productive flow with every goal checked off.'
        },
        highlight: {
            zh: '收录了两条人生启示录。',
            en: 'Captured two inspiring life insights today.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 0,
        coverImage: 'images/5544bbf9199ddc240c7d14bd98e6cdfd.png',
        attachments: []
    },
    {
        id: 23,
        date: '2025-09-12',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '内容创作与英文日记起步',
            en: 'Content creation and English journaling'
        },
        content: {
            zh: '观看罗永浩广播和直播。\n写公众号文章。\n持续搭建个人网站。\n用英语记录每日成功日记的开端。',
            en: 'Watched Luo Yonghao\'s radio show and live stream.\nWrote a WeChat article.\nKept building the personal website.\nStarted writing daily success notes in English.'
        },
        highlight: {
            zh: '',
            en: ''
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'calm',
        achievementLevel: 0,
        coverImage: '',
        attachments: []
    }
];

// 保存默认数据副本
const successDiaryDefaults = JSON.parse(JSON.stringify(successDiaryData));

// ==================== 朋友圈数据 ====================

/**
 * 朋友圈数据集
 * @type {Array<Object>}
 */
let momentsData = [
    {
        id: 13,
        content: '哪有那么多天时地利人和都比不过两个字,勤奋。幸运没那么重要,如果还看幸运,说明你还不够勤奋',
        value: 5,
        category: '工作相关',
        time: '2025-10-09 19:58',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 12,
        content: '生活黑客都说了,凡是有系统一定有 bug,正常人才会去排队,你黑客都是找 bug 就直接进去了。确实这个世界所谓的炒台班子是哪哪都是千疮百孔的,你正儿八经排队就能排到猴年马月去。你要是不想排队的话,哪有洞你都可以钻进去',
        value: 5,
        category: '生活日常',
        time: '2025-10-09 19:58',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 11,
        content: '用来替代自己的另一个"我"所产生的稳定现金流对应的数值,就是衡量自己配得上什么的标准',
        value: 5,
        category: '财经理财',
        time: '2025-10-09 00:58',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 10,
        content: '你可能没有那么潮,但是没有人可以讲你错,如果你没错,那你就可以按照自己的想法,让自己在自己的世界观里面足够的对,且对很久很久——等我几年后,无压力拿下它;成为有能力严肃面对严肃问题的人,成为不依托于群体娱乐化共识的独立精彩有趣的人(eg.Kanye)',
        value: 5,
        category: '工作相关',
        time: '2025-10-07 23:57',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 9,
        content: '以项目为导向,明确要解决的问题和创造的价值,缺什么学什么,能提高学习的针对性和效率。出一本教材:框架搭建、内容补充、风格打磨、案例整理、排版设计。先确定项目目标和结果,再推导所需学习内容。',
        value: 5,
        category: '工作相关',
        time: '2025-10-06 23:32',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 8,
        content: '正常工作者用年富力强的35年赚钱覆盖一生80年,去除节假日和不能出售时间,真正用于改变自己生活的出售时间一年仅10.5天(3652/3【节假日】*1/3【每天工作时长】*1/2【受教育成本】*1/4【家庭】);很多人因出售时间少难以改命,而增加工作时间能提升竞争力和收入。全世界最牛逼的企业家,对全世界最聪明的学生,在内部培训,以至于他都觉得不能直播的场景,给他们灌输的是这样的理念。你想想看,这个教育的代差,这个人与人之间的差异,这个所谓阶级固化的,鸿沟到底被划在了哪?人家本来已经比你牛逼那么多了,他们接受的是这种跳跃了中层,直接进入上层的,几乎没有任何争辩空间,直接给结论让你就这么做的核心逻辑。人家已经那么聪明了,他们还这么做,而如果我们毫无意识地被更多傻逼的摆烂躺平思想影响的话,我们怎么办?很多人连自己要干什么都不知道的人,他也没有要超过的对象,他也不是那种在中层拼了命就要上去看一眼的人,可能就被带偏了。叫我自由美,自由民主美利坚,都宣传这个东西,这是先进的思想,这是先进的理念,国内如果还不认可,是身边的人太傻逼,他们还不够先进,是吧?他们是老掉牙的,零零后还是要整顿职场。还是要卡点上下班,我觉得那完蛋,我觉得那完蛋。你可以这样选,你这样选呢,你以后就不要抱怨在职场上你比不过在过去五年跟你一起进公司,每天干十四个小时的人。',
        value: 5,
        category: '工作相关',
        time: '2025-10-06 00:39',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 7,
        content: '今天 8:15 到的市图书馆,已经有 4 个人在我前面了 😮',
        value: 1,
        category: '生活日常',
        time: '2025-10-04 21:49',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 6,
        content: '今天去图书馆学习,一堆学生在图书馆打游戏的,不安静💢',
        value: 1,
        category: '生活日常',
        time: '2025-10-02 20:09',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 5,
        content: '电脑充电线坏了,好在通过重新拆拼花了 3 个多小时解决了',
        value: 1,
        category: '生活日常',
        time: '2025-10-02 16:14',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 4,
        content: '疯狂动物城 2 电影 11 月来啦',
        value: 1,
        category: '艺术文化',
        time: '2025-10-01 14:12',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 3,
        content: '发国庆祝福时发现有一百多个单删我了。真正值得的人,会留在你的生活里;删掉你的人,也是在帮你腾出空间给更合拍的人;能坦诚交流、愿意回应的人才最值得投入精力。',
        value: 5,
        category: '情感表达',
        time: '2025-10-01 00:16',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 2,
        content: '真挤,回来时 504 人真多🥵,应该 16 点就出发的',
        value: 1,
        category: '生活日常',
        time: '2025-09-30 18:36',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 1,
        content: '好好好,Claude 也赶中国国庆发模型的节奏',
        value: 3,
        category: '科技数码',
        time: '2025-09-30 12:08',
        image: 'images/d59aff54b056c66e94bc15b5cd3ad78c.png',
        likes: 0,
        comments: []
    }
];

// ==================== 工具函数 ====================

/**
 * 验证日记数据格式
 * @param {Object} entry - 日记条目
 * @returns {boolean} 是否验证通过
 */
function validateDiaryEntry(entry) {
    const requiredFields = ['id', 'date', 'categories', 'headline', 'content', 'moodCode'];
    const missingFields = requiredFields.filter(field => !(field in entry));
    
    if (missingFields.length > 0) {
        console.error(`日记条目 ${entry.id} 缺少字段:`, missingFields);
        return false;
    }
    
    // 验证分类是否存在
    const validCategories = diaryTagLibrary.map(tag => tag.code);
    const invalidCategories = entry.categories.filter(cat => !validCategories.includes(cat));
    
    if (invalidCategories.length > 0) {
        console.warn(`日记条目 ${entry.id} 包含无效分类:`, invalidCategories);
    }
    
    // 验证心情代码
    if (!moodLibrary[entry.moodCode]) {
        console.warn(`日记条目 ${entry.id} 包含无效心情代码: ${entry.moodCode}`);
    }
    
    return true;
}

/**
 * 获取标签名称
 * @param {string} code - 标签代码
 * @param {string} lang - 语言('zh' | 'en')
 * @returns {string} 标签名称
 */
function getTagName(code, lang = 'zh') {
    const tag = diaryTagLibrary.find(t => t.code === code);
    return tag ? tag[lang] : code;
}

/**
 * 获取心情信息
 * @param {string} code - 心情代码
 * @returns {Object} 心情信息对象
 */
function getMoodInfo(code) {
    return moodLibrary[code] || {
        zh: '未知',
        en: 'Unknown',
        color: '#6b7280'
    };
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @param {string} lang - 语言('zh' | 'en')
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString, lang = 'zh') {
    const date = new Date(dateString);
    
    if (lang === 'en') {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==================== 全局暴露(浏览器环境) ====================

if (typeof window !== 'undefined') {
    window.diaryTagLibrary = diaryTagLibrary;
    window.moodLibrary = moodLibrary;
    window.momentCategories = momentCategories;
    window.successDiaryData = successDiaryData;
    window.successDiaries = successDiaryData;
    window.successDiaryDefaults = successDiaryDefaults;
    window.momentsData = momentsData;
    window.getTagName = getTagName;
    window.getMoodInfo = getMoodInfo;
    window.formatDate = formatDate;
    
    console.log('✅ 数据已暴露到全局作用域');
    console.log('📊 日记数量:', successDiaryData.length);
    console.log('📝 朋友圈数量:', momentsData.length);
}

// ==================== 初始化验证 ====================

console.log('🔍 验证成功日记数据...');
successDiaryData.forEach(entry => validateDiaryEntry(entry));
console.log('✅ 数据验证完成');

// ==================== 模块导出(Node.js环境) ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 数据字典
        diaryTagLibrary,
        moodLibrary,
        momentCategories,
        
        // 数据集
        successDiaryData,
        successDiaries: successDiaryData,
        successDiaryDefaults,
        momentsData,
        
        // 工具函数
        getTagName,
        getMoodInfo,
        formatDate,
        validateDiaryEntry
    };
}
