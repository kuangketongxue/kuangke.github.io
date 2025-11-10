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

// ==================== 成功日记数据 ====================
/**
 * 成功日记数据集
 * @type {Array<Object>}
 */
let successDiaryData = [
       {
        id: 53,
        date: '2025-11-10',
        categories: ['study', 'creative'],
        headline: {
            zh: '阅读快速完成',
            en: 'The reading task can be completed quickly.'
        },
        content: {
            zh: '阅读20本书+。\n学习6小时+',
            en: 'Read 20+ books.\nStudied for 6+ hours'
        },
        highlight: {
            zh: '寿司不错；菠萝不错',
            en: 'The sushi is quite good; the pineapple is also pleasant.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
       {
        id: 52,
        date: '2025-11-09',
        categories: ['study', 'creative'],
        headline: {
            zh: '读完《我们终将变富》和《让时间陪你慢慢变富》',
            en: 'After reading "We Will Ultimately Become Wealthy" and "Let Time Accompany You to Gradually Become Wealthy"'
        },
        content: {
            zh: '阅读18本书+。\n学习6小时+\n周刊功能-每周优化一个点',
            en: 'Read 19+ books.\nStudied for 6+ hours\nWeekly Feature - Optimizing a Point Every Week'
        },
        highlight: {
            zh: '睡眠质量奇高',
            en: 'The quality of sleep is exceptionally high.'
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
        id: 51,
        date: '2025-11-08',
        categories: ['study', 'creative'],
        headline: {
            zh: '报名NCEE-CA',
            en: 'Sign up for NCEE-CA'
        },
        content: {
            zh: '阅读18本书+。\n学习7小时+\n跑3公里\n创作261字',
            en: 'Read 19+ books.\nStudied for 7+ hours\nRun for 3 kilometers.\nCreate a piece of text of 261 words.'
        },
        highlight: {
            zh: '阅读第一阶段快速完成；城际不错',
            en: 'The initial phase of reading can be completed quickly; the inter-city service is quite good.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
     {
        id: 50,
        date: '2025-11-07',
        categories: ['study', 'creative'],
        headline: {
            zh: '读完《beyondfeeling》和《富爸爸穷爸爸》',
            en: 'After reading "Beyondfeeling" and "Rich Dad, Poor Dad"'
        },
        content: {
            zh: '阅读19本书+。\n学习8小时+\n跑3公里\n创作261字',
            en: 'Read 19+ books.\nStudied for 8+ hours\nRun for 3 kilometers.\nCreate a piece of text of 261 words.'
        },
        highlight: {
            zh: '整理马斯克播客内容',
            en: 'Organizing content from Musk is podcasts'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
      {
        id: 49,
        date: '2025-11-06',
        categories: ['study', 'creative'],
        headline: {
            zh: '万维刚精英日课6',
            en: 'Wan Weigang Elite Daily Lesson 6'
        },
        content: {
            zh: '阅读19本书+。\n学习11小时+\n零点前睡',
            en: 'Read 19+ books.\nStudied for 11+ hours\nGo to bed before midnight.'
        },
        highlight: {
            zh: '泡脚；感冒好了头不晕了可以继续高强度工作运动了',
            en: 'Soaking feet; After recovering from a cold, there is no more dizziness, allowing for continued high-intensity work and physical activities.'
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
        id: 48,
        date: '2025-11-05',
        categories: ['study', 'creative'],
        headline: {
            zh: 'API调用',
            en: 'API call'
        },
        content: {
            zh: '阅读19本书+。\n学习11小时+',
            en: 'Read 19+ books.\nStudied for 11+ hours'
        },
        highlight: {
            zh: '《山河旅探》好玩',
            en: '"Traveling Through the Landscapes" is enjoyable'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: 'images/cb081723f2cbc77cfb53a10ff5d705c3.png',
        attachments: []
    },
     {
        id: 47,
        date: '2025-11-04',
        categories: ['study', 'creative'],
        headline: {
            zh: '周刊创作',
            en: 'Weekly creative writing'
        },
        content: {
            zh: '阅读19本书+。\n学习12小时+\n创作100字\n视频剪辑',
            en: 'Read 19+ books.\nStudied for 12+ hours\nWrite a piece of content totaling 100 words.\nVideo editing'
        },
        highlight: {
            zh: '演讲➡️露脸直播；写作➡️公众号；视频剪辑➡️b站发布',
            en: 'speech➡️Live streaming with face visible; writing➡️WeChat account; video editing➡️Published on Bilibili'
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
        id: 46,
        date: '2025-11-03',
        categories: ['study', 'creative','finance'],
        headline: {
            zh: '创建新钱包',
            en: 'Create a new wallet'
        },
        content: {
            zh: '阅读17本书+。\n学习11小时+\n创建新钱包买比特币',
            en: 'Read 17+ books.\nStudied for 11+ hours\nCreate a new wallet to buy Bitcoin'
        },
        highlight: {
            zh: '寿司+烤串不错；“你被困在2025年10月25号”互动视频不错',
            en: 'Sushi and grilled skewers are quite good; the interactive video "You are Trapped in October 25, 2025" is also enjoyable.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: 'images/wallet.jpg',
        attachments: []
    },
     {
        id: 45,
        date: '2025-11-02',
        categories: ['study', 'creative'],
        headline: {
            zh: '读完《自学是门手艺》',
            en: 'After reading "Self-study is a Skill"'
        },
        content: {
            zh: '阅读17本书+。\n网站优化健康提醒系统，优化成功日记白天功能\n早起早到图书馆学习11小时+\n创作字',
            en: 'Read 17+ books.\nWebsite optimization.Successful optimization of the daytime functionalities in the journal feature\nArrive early at the library upon waking up.Studied for 11+ hours\nWrite a piece of content totaling 10000 words.'
        },
        highlight: {
            zh: 'AI自制音乐',
            en: 'AI-generated music'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
      {
        id: 46,
        date: '2025-11-01',
        categories: ['study', 'creative'],
        headline: {
            zh: 'b站专栏创作',
            en: 'Content creation for B-Station is column'
        },
        content: {
            zh: '阅读17本书+。\n网站优化健康提醒系统，优化了“每周必看”排版；增加“效率工具”内容。\n学习8小时+\n创作148+字',
            en: 'Read 17+ books.\nWebsite optimization.The layout of the "Must-Watch Weekly" section has been optimized; additional content related to "Efficiency Tools" has been added.\nStudied for 8+ hours\nWrite a piece of content totaling 148+ words.'
        },
        highlight: {
            zh: '【狂客】极客周刊；Walter Lewin物理老师；榴莲不错',
            en: '[Krazy Guest] Geek Weekly; Walter Lewin, Physics Teacher; Durian is quite tasty'
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
        id: 45,
        date: '2025-10-31',
        categories: ['study', 'creative'],
        headline: {
            zh: '写书《自学突围·给所有人的自学案例启发》',
            en: 'Writing a book titled "Self-Learning Breakthrough: Inspirational Self-Learning Case Studies for Everyone"'
        },
        content: {
            zh: '阅读16本书+。\n网站优化，优化阅读室的那颗大星星+修复朋友圈白天模式无法切换+修复朋友圈显示数量少的问题+优化成功日记记录功能+优化健康提醒系统背景字体+补齐阅读室启发值\n学习11小时+\n创作10000字',
            en: 'Read 16+ books.\nWebsite optimization.Optimization of the prominent star in the reading room, fixing the issue where the daytime mode in WeChat Moments couldn it be switched, resolving the problem where the number of displayed items in WeChat Moments was limited, optimizing the success diary logging feature, optimizing the background font for the health reminder system, and completing the reading room is inspiration value metrics.\nStudied for 11+ hours\nWrite a piece of content totaling 10000 words.'
        },
        highlight: {
            zh: '乌兹别克棉花案（2）',
            en: 'Uzbekistan Cotton Case (2)'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
      {
        id: 44,
        date: '2025-10-30',
        categories: ['study', 'creative'],
        headline: {
            zh: '单词突围四六级第一遍过完',
            en: 'Completing the first pass through the vocabulary section for CET-4 and CET-6 exams'
        },
        content: {
            zh: '阅读16本书+。\n网站优化健康提醒系统，优化阅读思维导图功能。\n学习9小时+\n创作10000字',
            en: 'Read 16+ books.\nWebsite optimization.Optimize the reading mind map function.\nStudied for 9+ hours\nWrite a piece of content totaling 10000 words.'
        },
        highlight: {
            zh: '拍飞机，拍火箭的选题太酷了',
            en: 'The topics of photographing airplanes and rockets are incredibly cool.'
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
        id: 43,
        date: '2025-10-29',
        categories: ['study', 'creative'],
        headline: {
            zh: '死记硬背概念',
            en: 'Rote memorization of concepts'
        },
        content: {
            zh: '阅读16本书+。\n网站优化，新增英语阅读\n学习8小时+\n创作10000字',
            en: 'Read 16+ books.\nWebsite optimization.New addition of English reading materials.\nStudied for 8+ hours\nWrite a piece of content totaling 10000 words.'
        },
        highlight: {
            zh: '罗永浩*贾樟柯播客',
            en: 'Podcast featuring Luo Hongbo and Jia Zhangke'
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
        id: 42,
        date: '2025-10-28',
        categories: ['study', 'creative'],
        headline: {
            zh: '学习17小时+',
            en: 'Studying for more than 17 hours'
        },
        content: {
            zh: '阅读16本书+。\n网站优化\n学习17小时+\n创作1000字',
            en: 'Read 16+ books.\nWebsite optimization.\nStudied for 17+ hours\nWrite a piece of content totaling 1000 words.'
        },
        highlight: {
            zh: '创作比昨天多',
            en: 'More content was created compared to yesterday.'
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
        id: 41,
        date: '2025-10-27',
        categories: ['study', 'creative'],
        headline: {
            zh: '反刍收拾整理电脑收藏工具',
            en: 'Organize and tidy up the computer is collection tools using a specialized tool for this purpose.'
        },
        content: {
            zh: '阅读16本书+。\n网站优化\n学习9小时+\n创作1000字',
            en: 'Read 16+ books.\nWebsite optimization.\nStudied for 9+ hours\nWrite a piece of content totaling 1000 words.'
        },
        highlight: {
            zh: '收拾整理柜子电脑，n8n开发，前哨战复习',
            en: 'Organize and tidy up the cabinets and computer, work on n8n development, review material for the preliminary phase.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: 'images/94f362d41dd229c2182725ee5144c497.jpg',
        attachments: []
    },
      {
        id: 42,
        date: '2025-10-26',
        categories: ['study', 'creative'],
        headline: {
            zh: '一天写作1万字+',
            en: 'Writing 10,000 words or more in a single day'
        },
        content: {
            zh: '阅读16本书+。\n网站优化，新增折叠功能。\n学习13小时+\n早起+早到图书馆+直播',
            en: 'Read 16+ books.\nWebsite optimization.New foldable functionality added.\nStudied for 13+ hours.\nEarly wake-up, early arrival at the library, and live streaming activities.'
        },
        highlight: {
            zh: '云吞不错；前哨战关于信息量的启发：信息量等于你克服的不确定性的大小。我们都在做空/做多',
            en: 'The wontons are quite good; Insights from the Pre-Battle Phase regarding the Volume of Information: The volume of information is directly proportional to the degree of uncertainty that needs to be overcome. We are all either shorting or long positions.'
        },
        notes: {
            zh: '1',
            en: '1'
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
     {
        id: 41,
        date: '2025-10-25',
        categories: ['study', 'creative'],
        headline: {
            zh: '图书馆学习，高专注比',
            en: 'Studying in the library with high levels of focus.'
        },
        content: {
            zh: '阅读16本书+。\n网站优化，新增美食选择聚餐功能。\n学习13小时+\n早起+早到图书馆',
            en: 'Read 16+ books.\nWebsite optimization.A new feature for group dining with diverse food options has been added.\nStudied for 13+ hours.\nGetting up early and arriving at the library early.'
        },
        highlight: {
            zh: '省下了1/10特斯拉股票的钱约400人民币',
            en: 'The equivalent of approximately 400 RMB was saved by avoiding the purchase of 1/10 shares of Tesla stock.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: 'images/0da8914e31d37162788a71d86e8db3f3.png',
        attachments: []
    },
      {
        id: 40,
        date: '2025-10-24',
        categories: ['study', 'creative'],
        headline: {
            zh: '选餐聚餐功能优化',
            en: 'Enhancements to the meal selection and group dining feature'
        },
        content: {
            zh: '阅读16本书+。\n网站优化\n学习12小时+',
            en: 'Read 16+ books.\nWebsite optimization.\nStudied for 12+ hours'
        },
        highlight: {
            zh: '发现需求，记录+做出解决的产品项目',
            en: 'Identify the need, document it, and then create a product or project to address it.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: 'images/99983fa598be438c553ef38b7fe363cd.png',
        attachments: []
    },
      {
        id: 39,
        date: '2025-10-23',
        categories: ['study', 'creative'],
        headline: {
            zh: '读完《PPT设计的艺术》',
            en: 'After reading "The Art of PPT Design",'
        },
        content: {
            zh: '阅读16本书+。\n早起+去图书馆+读完《PPT设计的艺术》。\n学习11小时+',
            en: 'Read 16+ books.\nEarly wake-up + visit to the library + After reading "The Art of PPT Design".\nStudied for 12+ hours'
        },
        highlight: {
            zh: '阅读➡️整理➡️输出➡️检验；现象➡️原因➡️解法',
            en: 'Read➡️Arrangement➡️output➡️Inspection; phenomenon➡️Reason➡️solution'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
     {
        id: 38,
        date: '2025-10-22',
        categories: ['study', 'creative'],
        headline: {
            zh: '创作+网站分享+跑10公里',
            en: 'Creative expression + sharing + running 10 kilometers'
        },
        content: {
            zh: '阅读16本书+。\n早起+去图书馆+网站分享。\n学习11小时+',
            en: 'Read 16+ books.\nEarly wake-up + visit to the library + sharing on a website.\nStudied for 11+ hours'
        },
        highlight: {
            zh: '罗永浩*叶国富播客',
            en: 'Podcast featuring Luo Yonghao and Ye Guofu'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: 'images/31b40dbef5c21fac41704d8ad6400c4f.png',
        attachments: []
    },
     {
        id: 37,
        date: '2025-10-21',
        categories: ['study', 'creative', 'finance'],
        headline: {
            zh: '前哨战小创造，找不到，学不完，不如自己做',
            en: 'A small innovation for a preliminary task; it is hard to find and impossible to master completely. Might as well create it oneself.'
        },
        content: {
            zh: '阅读16本书+。\n睡眠充足。\n学习10小时+',
            en: 'Read 16+ books.\nAdequate sleep.\nStudied for 10+ hours'
        },
        highlight: {
            zh: '前哨战定投社群',
            en: 'Frontline Stakeholder Investment Community'
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
        id: 36,
        date: '2025-10-20',
        categories: ['study', 'creative'],
        headline: {
            zh: '读完《AI时代》+收拾+优化NCEE-CA的打卡方式',
            en: 'Finished reading "The Age of AI" + tidying up+Optimizing the check-in method for NCEE-CA'
        },
        content: {
            zh: '阅读16本书+。\n持续搭建个人网站,给朋友圈加了页面+补充阅读数启发值+补齐星空书柜的内容。\n收拾飞书+浏览器+书柜。\n精读《beyond feeling》，读完《AI时代》\n早起+学习12小时+。\n高强度运动。',
            en: 'Read 10+ books.\nContinuously building a personal website,Added a page to WeChat Moments, supplemented the read count with an inspiring value, and completed the content of the Starry Night Book Shelf.\nOrganizing FlyBook, web browser, and bookshelf.\nCarefully read "Beyond Feeling," followed by "The Age Of AI."\nGetting up early and studying for 12 hours straight.\nHigh-intensity exercise.'
        },
        highlight: {
            zh: '周课录制，2025.10.19：关于学习的三个阶段......',
            en: 'Weekly lesson recording, October 19, 2025: About the Three Stages of Learning ......'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
    {
        id: 35,
        date: '2025-10-19',
        categories: ['study', 'creative'],
        headline: {
            zh: '图书馆学习，高专注比',
            en: 'Studying in the library, high level of focus is essential.'
        },
        content: {
            zh: '阅读16本书+。\n持续搭建个人网站,补全免费课的内容+补齐星空书柜的内容+改阅读室启发值+加了每日思考栏目+优化了小店布局+朋友圈加了统计。\n早起+早到图书馆+学习12小时+。\n高强度运动。',
            en: 'Read 10+ books.\nContinuously building a personal website,Completing the content of the free course, filling in the content of the Starry Sky Bookcase, modifying the inspiration value of the Reading Room, adding a daily reflection section, optimizing the layout of the small shop, and adding statistics to WeChat Moments.\nGetting up early, arriving at the library early, and studying for 12 hours straight..\nHigh-intensity exercise.'
        },
        highlight: {
            zh: '老友记学习，好看爱看',
            en: 'Friends is a great show to learn from; it is enjoyable and worth watching.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 4,
        coverImage: 'images/Friends-S1-E2',
        attachments: []
    },
    {
        id: 34,
        date: '2025-10-18',
        categories: ['study', 'creative'],
        headline: {
            zh: '思维导图构建+信息反刍+教材编写',
            en: 'Mind mapping creation + information reflection + textbook compilation'
        },
        content: {
            zh: '阅读16本书+。\n持续搭建个人网站,新建N+界面细节优化。\n早起+学习8小时+。\n高强度运动。',
            en: 'Read 10+ books.\nContinuously building a personal website,Detailed optimization of the newly created N+ interface.\nGetting up early and studying for 8 hours straight.\nHigh-intensity exercise.'
        },
        highlight: {
            zh: '直播单次观看突破500人，2人下单，赚到第一个100元',
            en: 'Live streaming saw a single-time viewership of over 500 people, with 2 individuals placing orders. The streamer earned their first 100 yuan.'
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
        id: 33,
        date: '2025-10-17',
        categories: ['study', 'creative'],
        headline: {
            zh: '读完《小狗钱钱2》+高专注比',
            en: 'Finished reading "Little Money-Making Pals 2" + High Focus Ratio'
        },
        content: {
            zh: '阅读16本书+。\n持续搭建个人网站,暂时放弃上传到云端服务器，新开一个仓库做实验。\n早起+早到图书馆+学习12小时+。\n高强度运动。\n读完《小狗钱钱2》',
            en: 'Read 10+ books.\nContinuously building a personal website,For the time being, abandon uploading to the cloud server and set up a new warehouse for experimentation.\nGetting up early, arriving at the library early,, and studying for 12 hours straight.\nHigh-intensity exercise.\nFinished reading "Money-Making Puppy 2".'
        },
        highlight: {
            zh: '自己生产的商品上线商店，自己生产的才放心，才能去卖——只卖自己生产的"产品"；罗永浩*宋方金',
            en: 'Only products that are produced in-house can be confidently sold in the store – selling only products that are produced in-house.Luo Yonghao*Song Fangjin'
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
        id: 32,
        date: '2025-10-13',
        categories: ['study', 'creative'],
        headline: {
            zh: '财务系统优化+精力补充',
            en: 'Optimization of the financial system + energy replenishment'
        },
        content: {
            zh: '阅读10本书+。\n持续搭建个人网站,"成功日记"中英互换功能优化+英文Emoji优化+英文左对齐。\n优化原始财务系统表。\n学习8小时+。\n反刍了近500个收集的"今日有价值的互动',
            en: 'Read 10+ books.\nContinuously building a personal website, "Success Diary" features enhanced Chinese-to-English translation functionality, optimized English emojis, and left-aligned text in English.\nOptimizing the original financial system tables.\nStudied for 8+ hours.\nAfter going over nearly 500 "interactions that were valuable today" that had been collected.'
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
    {
        id: 31,
        date: '2025-10-12',
        categories: ['study', 'creative','music'],
        headline: {
            zh: '读完《专注的真相》+前哨战财务系统优化',
            en: 'Getting up early and going to the library.'
        },
        content: {
            zh: '阅读10本书+。\n持续搭建个人网站,加了背景壁纸。\n早起+去图书馆+读完《专注的真相》+优化原始时间负债表。\n学习14小时+',
            en: 'Read 10+ books.\nContinuously building a personal website, Added a background wallpaper.\nGetting up early, going to the library, reading "The Truth About Focus," and optimizing the original time balance sheet..\nStudied for 14+ hours'
        },
        highlight: {
            zh: '公众号一天创作了3篇文稿；以项目为导向的学习，写完了教材大纲',
            en: 'The WeChat public account created three pieces of content in one day; learning with a project-oriented approach resulted in the completion of the outline for a textbook.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
    {
        id: 30,
        date: '2025-10-11',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '早起+去图书馆',
            en: 'Getting up early and going to the library.'
        },
        content: {
            zh: '阅读10本书+。\n持续搭建个人网站,加了"成功日记一键回到顶部的功能"。\n专注比80%。\n学习14小时+',
            en: 'Read 10+ books.\nContinuously building a personal website, Added the feature of "Success Diary: One-click return to top".\nFocus level is around 80%.\nStudied for 14+ hours'
        },
        highlight: {
            zh: '遇到两只小狗可爱😊；图书馆天气好',
            en: 'Two cute little puppies were encountered.😊; Lovely weather at the library.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 5,
        coverImage: '',
        attachments: []
    },
    {
        id: 29,
        date: '2025-10-10',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '阅读+早睡',
            en: 'Reading + Go to bed early'
        },
        content: {
            zh: '阅读10本书+。\n持续搭建个人网站,修改阅读室错别字+修复了没有显示的bug+补充成功日记的成就值+成功日记Emoji优化。\n睡眠充足。\n学习10小时+',
            en: 'Read 10+ books.\nContinuously building a personal website, correcting typos in the Reading Room section, fixing a bug that was not displaying properly, adding achievement points to the Success Diary, and optimizing the emojis in the Success Diary.\nAdequate sleep.\nStudied for 10+ hours'
        },
        highlight: {
            zh: '罗永浩*Tim播客不错',
            en: 'Tim\'s podcast with Luo Yonghao is quite good.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
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
            en: 'Read 10+ books.\nProduct testing on Taobao Xianyu.\nContinued building personal website, enhanced enlightenment value.\nAdequate sleep.\nStudied for 14+ hours'
        },
        highlight: {
            zh: '前哨战关于时间负债的实操👍',
            en: 'Practical implementation of time debt strategy👍'
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
            en: 'Read 10+ books and finished "Blockchain Revolution".\nProduct testing on Taobao Xianyu.\nAdded "back to top" button to website.\nAdequate sleep.\nStudied for 14+ hours'
        },
        highlight: {
            zh: '榴莲不错;罗永浩×TIM双厨狂喜',
            en: 'Great durian😌. Luo Yonghao×TIM double joy'
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
            en: 'Read 10+ books.\nProduct testing on Taobao Xianyu.\nAdded background to website.\nAdequate sleep.\nStudied for 7+ hours'
        },
        highlight: {
            zh: '寿司不错😌;凡人修仙传不错',
            en: 'Nice sushi😌. Enjoyed "A Record of Mortal\'s Journey to Immortality"'
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
            en: 'Read 10+ books.\nProduct testing on Taobao Xianyu.\nAdded background to website.\nAdequate sleep.\nStudied for 10+ hours'
        },
        highlight: {
            zh: '椰子水不错😌',
            en: 'Nice coconut water😌'
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
        id: 24,
        date: '2025-10-05',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '阅读+前哨战"以项目为导向"',
            en: 'Reading + Project-Oriented Strategy'
        },
        content: {
            zh: '阅读10本书+。\n写产品商业书。\n持续搭建个人网站。\n睡眠充足。',
            en: 'Read 10+ books.\nWrote product business book.\nContinued building personal website.\nAdequate sleep.'
        },
        highlight: {
            zh: 'Linksphotograph的视频"在世界上最孤独的房子里过一夜!"好看',
            en: 'Great video by Linksphotograph: "Spending a Night in the World\'s Loneliest House!"'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
    {
        id: 4,
        date: '2025-10-01',
        categories: ['work', 'study', 'creative'],
        headline: {
            zh: '打造朋友圈数字花园',
            en: 'Building Digital Garden'
        },
        content: {
            zh: '坚持 7 小时深度学习并上线个人朋友圈站点。',
            en: 'Deep study for 7 hours and launched personal timeline site.'
        },
        highlight: {
            zh: '《回家的路》真的很好听 🌌',
            en: '"The Road Home" is truly beautiful 🌌'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: 'images/9884f4b986c88ee9963c735ba193939c.jpg',
        attachments: []
    },
    {
        id: 1,
        date: '2025-10-04',
        categories: ['study', 'creative'],
        headline: {
            zh: '图书馆深耕与网站焕新',
            en: 'Library Deep Work & Site Refresh'
        },
        content: {
            zh: '去图书馆学习。\n网站整体翻新迭代。\n学习12个小时+。',
            en: 'Studied at library.\nRefreshed entire website.\nStudied for 12+ hours.'
        },
        highlight: {
            zh: '影视飓风 1300 万粉丝评论区的 BGM 切画面经验值得学习。',
            en: 'Learned valuable BGM editing tips from Cinematic Hurricane\'s 13M-subscriber comments.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
    {
        id: 2,
        date: '2025-10-03',
        categories: ['reading', 'study'],
        headline: {
            zh: '提前完成阅读记录并整理电脑',
            en: 'Completed Reading Log Early'
        },
        content: {
            zh: '提前完成今日阅读记录。\n梳理并整理电脑内容。',
            en: 'Finished daily reading log ahead of schedule.\nOrganized computer files.'
        },
        highlight: {
            zh: '双影奇境依旧很好玩 😄',
            en: 'Double Mirage still amazing 😄'
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
        id: 3,
        date: '2025-10-02',
        categories: ['work', 'study', 'nature'],
        headline: {
            zh: '读完《小狗钱钱》',
            en: 'Finished "Rich Dog, Poor Dog"'
        },
        content: {
            zh: '完成阅读笔记并沉浸于双影奇境的奇妙体验。',
            en: 'Completed reading notes and enjoyed immersive Double Mirage experience.'
        },
        highlight: {
            zh: '双影奇境不错 😄',
            en: 'Double Mirage is great 😄'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: 'images/4dd4a92b00f40efe894d41519c6e675c.jpg',
        attachments: []
    },
    {
        id: 5,
        date: '2025-09-30',
        categories: ['work', 'study', 'fitness', 'nature'],
        headline: {
            zh: '超额完成 10 小时专注学习',
            en: 'Exceeded 10-Hour Study Goal'
        },
        content: {
            zh: '图书馆学习氛围满分,提前完成阅读任务。',
            en: 'Perfect study atmosphere at library, finished reading ahead of schedule.'
        },
        highlight: {
            zh: '图书馆学习真不错 ٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ',
            en: 'Library study is awesome ٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 3,
        coverImage: 'images/a02a02195090841106b5305e8fb14860.jpg',
        attachments: []
    },
    {
        id: 6,
        date: '2025-09-29',
        categories: ['reading', 'fitness'],
        headline: {
            zh: '拥抱清晨,完成每日收官',
            en: 'Embrace Dawn, Strong Close'
        },
        content: {
            zh: '七小时高效心流,计划全部按时完成。',
            en: 'Seven hours of productive flow, all goals achieved on time.'
        },
        highlight: {
            zh: '收录了两条人生启示录。',
            en: 'Captured two inspiring life insights.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 3,
        coverImage: 'images/5544bbf9199ddc240c7d14bd98e6cdfd.png',
        attachments: []
    },
    {
        id: 7,
        date: '2025-09-28',
        categories: ['study', 'fitness'],
        headline: {
            zh: '十本书与课程交付的前哨战',
            en: 'Ten books read and a course shipped'
        },
        content: {
            zh: '成功读完十本书。\n提交 Rising Tide 课程(虽只录了四节)。\n保持活力训练。',
            en: 'Read ten books successfully.\nSubmitted the Rising Tide course, even with four lessons recorded.\nKept the workouts energizing.'
        },
        highlight: {
            zh: '睡眠充足;前哨战;猕猴桃不错 😋',
            en: 'Plenty of sleep; skirmish prep feels good; kiwifruit tastes great 😋'
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
        id: 8,
        date: '2025-09-27',
        categories: ['study'],
        headline: {
            zh: '十本书与两部作品',
            en: 'Ten books and two creations'
        },
        content: {
            zh: '成功阅读十本书。\n创作两部影像作品。',
            en: 'Read ten books successfully.\nCrafted two cinematic pieces.'
        },
        highlight: {
            zh: '睡眠充足,状态在线。',
            en: 'Well rested and fully energized.'
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
        id: 9,
        date: '2025-09-26',
        categories: ['study', 'nature'],
        headline: {
            zh: '图书馆深度学习日',
            en: 'Deep study day at the library'
        },
        content: {
            zh: '专程前往图书馆学习,保持高效节奏。',
            en: 'Went to the library for focused study and kept the pace steady.'
        },
        highlight: {
            zh: '图书馆学习氛围一如既往的好。',
            en: 'The library ambience was as inspiring as ever.'
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
        id: 10,
        date: '2025-09-25',
        categories: ['reading', 'creative'],
        headline: {
            zh: '阅读九本书与作品发布',
            en: 'Nine books read and new videos released'
        },
        content: {
            zh: '阅读九本书。\n发布两部视频作品。',
            en: 'Read nine books.\nReleased two video projects.'
        },
        highlight: {
            zh: '罗永浩 × 西门子的内容带来灵感。',
            en: 'Inspired by Luo Yonghao × Siemens collaboration.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    },
    {
        id: 11,
        date: '2025-09-24',
        categories: ['reading', 'film'],
        headline: {
            zh: '九本书与公众号文章输出',
            en: 'Nine books and a public account article'
        },
        content: {
            zh: '一天读完九本书并输出成公众号文章。',
            en: 'Read nine different books in one day and published a WeChat article.'
        },
        highlight: {
            zh: '罗永浩 × 周鸿祎 3 小时播客双厨狂喜。',
            en: 'Loved the 3-hour podcast by Luo Yonghao & Zhou Hongyi.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: 'images/1c2cde0fb8c866662a89a21de464caf7.png',
        attachments: []
    },
    {
        id: 12,
        date: '2025-09-23',
        categories: ['travel', 'nature'],
        headline: {
            zh: '山川与自然疗愈日',
            en: 'Travel day embraced by nature'
        },
        content: {
            zh: '出行感受自然,给自己放个假。',
            en: 'Took a short trip into nature and gifted myself a pause.'
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
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    },
    {
        id: 13,
        date: '2025-09-22',
        categories: ['reading', 'study', 'fitness'],
        headline: {
            zh: '《真需求》与自动化工作流',
            en: 'Finishing "Real Demand" and automations'
        },
        content: {
            zh: '读完《真需求》。\n阅读 7 本书并完成输出。\n打造小程序自动化工作流。\n早睡并坚持体能训练。\n控制每日开销 15 元。',
            en: 'Finished reading "Real Demand".\nRead 7+ books with outputs.\nBuilt automation workflows for the mini program.\nSlept early with steady workouts.\nKept daily spending within 15 RMB.'
        },
        highlight: {
            zh: '',
            en: ''
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
        id: 14,
        date: '2025-09-21',
        categories: ['study', 'work'],
        headline: {
            zh: '电影清单清空与十篇初稿',
            en: 'Cleared the film backlog and drafted ten posts'
        },
        content: {
            zh: '把所有标记成黄色的电影全部看完清空。\n读完《每周工作四小时》。\n根据前哨战反馈调整表格。\n写完 10 篇公众号文章初稿。',
            en: 'Cleared every yellow-tagged movie.\nFinished "The 4-Hour Workweek".\nTweaked spreadsheets per the skirmish insights.\nDrafted ten WeChat articles.'
        },
        highlight: {
            zh: '',
            en: ''
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
        id: 15,
        date: '2025-09-20',
        categories: ['study', 'reading'],
        headline: {
            zh: '成功日记 0920',
            en: 'Success diary 0920'
        },
        content: {
            zh: '完成 NCEE-CA。\n保持专注度 > 80%。\n完成 S 卷。\n观看《小约翰可汗的苏联大案》《科技补全》《凡人修仙传》。',
            en: 'Completed NCEE-CA.\nMaintained focus rate above 80%.\nFinished the S paper.\nWatched "Little John Cohan\'s Soviet Case", "Tech Completion", and "A Record of a Mortal\'s Journey".'
        },
        highlight: {
            zh: '',
            en: ''
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
    {
        id: 16,
        date: '2025-09-19',
        categories: ['fitness', 'study', 'reading'],
        headline: {
            zh: '成功日记 0919',
            en: 'Success diary 0919'
        },
        content: {
            zh: '早起完成晨间习惯。\n阅读 6+ 本书。\n冥想 6 分钟。\n平板支撑 1 分钟。\n看《老友记》S1E01。\n补充极客 AI 周刊内容。\n整理宿舍并加入人工智能协会。',
            en: 'Started early with morning rituals.\nRead 6+ books.\nMeditated for six minutes.\nHeld a one-minute plank.\nWatched Friends S1E01.\nExtended the Geek AI Weekly article.\nTidied the dorm and joined the AI association.'
        },
        highlight: {
            zh: '',
            en: ''
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'happy',
        achievementLevel: 3,
        coverImage: '',
        attachments: []
    },
    {
        id: 17,
        date: '2025-09-18',
        categories: ['creative', 'study', 'fitness'],
        headline: {
            zh: '拥抱问题并保持饥渴感',
            en: 'Embrace hurdles and stay hungry'
        },
        content: {
            zh: '保证充足睡眠。\n持续为公众号创作并获得打赏。\n完成 NCEE-CA,拿到 74 分。\n提醒自己:容忍小麻烦才能成就大事。\n遇到问题时保持积极,并思考自己是在崩溃边缘还是突破前夕。',
            en: 'Slept well.\nKept creating for the public account and received rewards.\nFinished NCEE-CA with a 74 score.\nReminded myself: tolerate small issues to achieve big things.\nReframed challenges—am I collapsing or about to break through?'
        },
        highlight: {
            zh: '',
            en: ''
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    },
    {
        id: 18,
        date: '2025-09-17',
        categories: ['study', 'fitness'],
        headline: {
            zh: '小程序上线与成功日记成形',
            en: 'Mini program launched, diary system complete'
        },
        content: {
            zh: '完成个人小程序。\n录制日课 01。\n阅读 7 本书。\n23 点前早睡。\n把小确幸改造成成功日记系统。\n公众号文章为保证深度推迟到 27 号。\n节流拒绝不必要消费。',
            en: 'Built my own mini program.\nRecorded Daily Lesson 01.\nRead seven books.\nWent to bed before 23:00.\nUpgraded the happiness log into a success diary system.\nPostponed the public account article to the 27th for depth.\nCut unnecessary spending.'
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
        achievementLevel: 3,
        coverImage: 'images/1aa6b078b1577770e866e1afcc4b9074.png',
        attachments: []
    },
    {
        id: 19,
        date: '2025-09-16',
        categories: ['study', 'reading', 'creative'],
        headline: {
            zh: '老王 Agent 1.0 与首次赞赏',
            en: 'Laowang Agent 1.0 and first WeChat reward'
        },
        content: {
            zh: '搭建 laowang Agent 1.0。\n收到 Passion T-shirt。\n保持充足睡眠。\n人生首次收到公众号赞赏,激动又惊喜。',
            en: 'Created Laowang Agent 1.0.\nReceived the Passion T-shirt.\nSlept adequately.\nGot the first tip on my WeChat account—thrilled and surprised.'
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
        achievementLevel: 5,
        coverImage: '',
        attachments: []
    },
    {
        id: 20,
        date: '2025-09-15',
        categories: ['study', 'reading', 'creative'],
        headline: {
            zh: '日课录制与浪潮纪念',
            en: 'Daily lessons recorded and Wave Ahead tee'
        },
        content: {
            zh: '跑步 3 公里。\n保证充足睡眠。\n公众号写作输出。\n录制高考 650+、日课、潮前先锋营 01、网站搭建指南四套课程。\n收到 Wave Ahead T 恤。',
            en: 'Ran 3 km.\nSlept sufficiently.\nPublished a public account article.\nRecorded four courses: Gaokao 650+, Daily Lessons, Trendsetter Pioneer Camp 01, Website Creation Guide.\nReceived the Wave Ahead T-shirt.'
        },
        highlight: {
            zh: '',
            en: ''
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 2,
        coverImage: '',
        attachments: []
    },
    {
        id: 21,
        date: '2025-09-14',
        categories: ['study', 'finance'],
        headline: {
            zh: 'Neuron 学习与理财自律',
            en: 'Neuron learning and financial discipline'
        },
        content: {
            zh: '学习 Neuron。\n续费 chatST。\n跑步 30 分钟。\n观看《前哨战》并用其优化飞书表格。\n保证充足睡眠。',
            en: 'Studied the Neuron course.\nRenewed chatST.\nRan for 30 minutes.\nWatched "Skirmish" and used it to refine the Feishu sheet.\nSlept well.'
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
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    },
    {
        id: 22,
        date: '2025-09-13',
        categories: ['study', 'film', 'music'],
        headline: {
            zh: '持续迭代的学习日',
            en: 'A day of relentless iteration'
        },
        content: {
            zh: '重温《小黑的奇幻冒险》。\n在云晨图书馆学习。\n决定把每日俯卧撑改为 10 组×3 次。\n高频迭代反思。\n坚持早睡。',
            en: 'Rewatched "The Chronicles of Little Black".\nStudied at Yunchen Library.\nReplaced push-ups with 10 sets of three reps.\nIterated at a high frequency.\nWent to bed early.'
        },
        highlight: {
            zh: '',
            en: ''
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'satisfied',
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    },
    {
        id: 23,
        date: '2025-09-12',
        categories: ['study', 'film', 'creative'],
        headline: {
            zh: '内容创作与英文日记起步',
            en: 'Content Creation & English Journaling'
        },
        content: {
            zh: '观看罗永浩广播和直播。\n写公众号文章。\n持续搭建个人网站。\n用英语记录每日成功日记的开端。',
            en: 'Watched Luo Yonghao\'s show.\nWrote WeChat article.\nBuilt personal website.\nStarted daily English journaling.'
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
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    }
];

// 深拷贝默认数据
const successDiaryDefaults = JSON.parse(JSON.stringify(successDiaryData));

// ==================== 朋友圈数据 ====================
/**
 * 获取朋友圈统计信息
 * @param {Array} moments - 朋友圈数组
 * @returns {Object} 统计信息
 */
function getMomentsStats(moments) {
    // 获取今天的日期 (格式: YYYY-MM-DD)
    const today = new Date();
    const todayString = today.getFullYear() + '-' +
                       String(today.getMonth() + 1).padStart(2, '0') + '-' +
                       String(today.getDate()).padStart(2, '0');
    console.log('📅 今天的日期:', todayString);
    
    const stats = {
        total: moments.length,
        highValue: 0,
        today: 0,
        categories: {},
        valueDistribution: {
            0: 0,
            1: 0,
            3: 0,
            5: 0
        }
    };
    
    moments.forEach(moment => {
        // 统计高价值内容 (value >= 5)
        if (moment.value >= 5) {
            stats.highValue++;
        }
        
        // 统计今日发布 - 修复日期比较逻辑
        try {
            // moment.time 格式: "2025-10-19 13:05"
            const momentDate = moment.time ? moment.time.split(' ')[0] : null;
            if (momentDate && momentDate === todayString) {
                stats.today++;
                console.log('✅ 今日发布:', moment.content.substring(0, 20));
            }
        } catch (e) {
            console.warn('⚠️ 日期解析错误:', moment.time, e.message);
        }
        
        // 统计价值分布
        if (moment.value in stats.valueDistribution) {
            stats.valueDistribution[moment.value]++;
        }
        
        // 统计分类
        if (moment.category) {
            stats.categories[moment.category] = (stats.categories[moment.category] || 0) + 1;
        }
    });
    
    console.log('📊 统计结果:', stats);
    return stats;
}

/**
 * 朋友圈数据集
 * @type {Array<Object>}
 */
let momentsData = [
     {
    id: 35,
    content: '直播输出阅读笔记：【即将到来的富足时代，我们这一代人可能是人类历史上最幸运的一代。如果你早出生几十年，你可能不得不用大部分精力为基本生活奔波，你真正的才华无法施展，你没有条件探索和体验世界的美好。而如果再晚出生几十年，你的生活可能会过于容易，我们身边很多悬念到时候都已经有了答案，也许不会有这么刺激的探索和挑战，而我们赶上了拐点，我们将见证人类从短缺迈向富足。而且我们中的许多人正在亲手推动富足时代的到来，会被后世的英雄豪杰羡慕。不过，如果有个穿越者回来采访我们，他可能会惊讶地发现，我们中的多数人并没有看到富足生活即将到来，因为我们的时代充满令人困惑的矛盾。一方面，人们很担心老龄化社会，害怕没有足够多的年轻人缴纳社保。可另一方面，大量年轻人找不到工作，甚至很多大学生毕业就失业。一方面人们担心AI抢走白领的工作，而另一方面，白领员工们却都在疯狂加班，搞996。一方面我们正在大规模、无比便宜地制造各种商品，中国制造在许多领域出现了产能过剩，而另一方面却有大量的人不敢消费或者没钱消费，这些矛盾的出现是好消息，因为单纯的短缺时代绝对不是这样的，这些都是正在走向富足的迹象。可为什么会有这些矛盾呢？可能因为技术进步的速度总是远高于社会组织形态变革的速度。这些都是转型期的阵痛，接下来讲的东西尚未成为全民共识，但是相当一部分学者、企业家和关心科技进步的人的看法。如果你仔细考察各种硬条件和软条件，你可以安全地推论我们这代人将在有生之年看到富足时代。为了理解这一点，我们需要三个基本认知。**第一个认知是世界上的资源本质上是无限的**，当然这并不是说世界上的物质是无穷无尽的，而是相对于人类的使用需求，考虑到各种物质都可以循环利用，地球资源足够每个人都过上很好的生活，你用过的物质并不会消失，你喝一杯水也好，洗个澡也好，水并没有因此而减少，它只是重新进入自然循环，等待被下一个人使用。只要不发生核反应，不管你怎么用，你连一个原子都改变不了，你只是给原子们排个序，改变排列组合的方式而已。当我们说使用什么东西的时候，我们其实只是暂时借用而已。人们的思维习惯，包括传统经济学的基本假设是资源稀缺，就这么点东西是我的，就不能是你的，一切的政治和经济问题归结于应该怎么分配这点资源，但是现在回头看，那并不是因为资源本身有限，而是我们利用资源的能力不足，如果你只能依靠这块土地上的这点产出，资源当然不足，那就好像坐拥金山却只能挨饿一样。现实是，**只要你有足够的能量和知识，就可以无限循环利用各种资源，等于是取之不尽用之不竭的**。什么是食物？无非是把太阳能转化为化学能的一种载体。嗯，确实，现实是只要你有足够的能量和知识，就可以无限循环利用各种资源，所以就等于取之不尽用之不竭，要发挥主观能动性。你把这个馒头吃掉，只是利用了其中的化学能而已，组成馒头的每个原子都不会消失，它们从你的身体中流过，也许将来组成另一个馒头。现在我们获得能量的能力、我们的知识储备与过去不可同日而语，我们有更大的自由度去组织那些原子，所以我们把物质变得越来越便宜。在消费端观察会误导你。你可能觉得超市里那些衣服特别高级，餐馆菜单上的菜很贵，但是如果你走进生产端，看到那衣服如何在流水线上被生产出来，知道餐馆采购的预制菜成本只有菜单价格的1/10，你就意识到物质其实不值钱。物质其实不值钱。确实，生产效率提高了。值钱的不是那堆原子，而是另外两个东西，一个是那堆原子的排列组合也就是**信息**，另一个是那堆原子的经历也就是**服务**。值钱的不是那一堆原子，而是排列组合形成的信息和经历、服务。餐馆的菜不在于菜本身，而在于它提供了用餐环境、服务和体验，信息是虚拟的东西，可以无限复制，所以不用担心，我们信息付费是为了奖励原创，只要用的人足够多，价格就会下来，这就是为什么打游戏花不了多少钱，服务之所以贵，是因为人总是宝贵的，越是富足就越是如此。这是对的，这是道德底线。服务是贵的，因为人是宝贵的，越富足就越是如此，这是对的。嗯，确实。当然在富足时代，总会有一些资源永远稀缺，比如主要是土地之类天生有限的东西，无论科技如何进步，北京二环内的土地也并不会增加一倍生产力。再发达，世界杯决赛门票的数量也只有那么多。如果你非要住好地段，非要让人而不是机器人为你服务，非要在第一时间用最新的发明创造，非要亲临现场观看比赛，任何时候都可以出高价，但如果你只想过普通生活，富足时代将满足你的需求。**第二个认知是科技进步是加速进行的**。第一个认知是世界上的资源本质上是无限的，因为现实中只要有足够能量支持，就可以无限循环利用各种物质资源，等于是取之不尽用之不竭的。值钱的不是那一堆原子，而是原子排列组合成的信息和原子的经历以及服务，而信息是可以无限复制的，服务也类似。第二个认知是科技进步是加速进行的，我们目睹的不是线性增长，而是**指数增长**。最简单的例子就是计算机算力，也就是众所周知的**摩尔定律**，同样的价格所能购买的算力每隔18个月就会增加一倍。同样的价格，所能购买的算力每12个月增加一倍。这意味着，当你预测人类10年后的算力时，你要考虑的不是增加10%或者50%，而是增加几百甚至上千倍，人类几十年后的算力将是现在的百倍甚至千倍。摩尔定律并不是一个规定，而是一个观察，它没有义务一直有效，我们只能庆幸它一直有效。为什么有指数增长呢？一方面是边做边学，叫做**莱特定律**，一个东西刚被发明出来时，生产者还不熟练，所以卖得比较贵。随着用户越来越多，产量越来越大，生产者越来越有经验，就会发明各种窍门，改进性能、降低成本，当然这条路不会永远走下去。所以第二个增长动力是**突破式创新**，比如电子管的发展遇到瓶颈后，改进为晶体管，晶体管再发展为集成电路，然后是微处理器，还有极紫外光刻等技术突破。没有人敢说科学家总能发明让摩尔定律继续的新机制，但是目前为止他们总能做到，这是因为其他领域比如物理学也在进步。各领域的进步组合在一起互相启发，带来了1+1大于2的效应，保证了进一步的加速增长。只要你能搭上这算力快车，你的领域就会一直跟着指数增长。万幸的是我们对能量的提取能力正在指数增长。这是因为光伏发电本质上是个电子项目，特别容易更新换代。过去几十年间，光伏发电的成本降低了几百倍，目前已经低于传统石化能源。考虑到太阳每年照射到地球上的能量，人类只利用了万分之一，未来光伏的潜力巨大，美国家庭只要是独立房子，花2万美元装个太阳能板，再配一个特斯拉电池，就可以脱离电网，过上能源自给自足的生活。而中国拥有全世界80%的光伏产能，哪怕国际上无法取得突破，我们只靠光伏也能获得无限能源。**第三个认知是AGI即将实现**。第二个认知是科技进步加速进行，摩尔定律推动算力指数增长，光伏能源足够，只凭光伏我们就能获得无限的能量。第三个认知是AGI即将实现，过去这么多年最大的进步就是大语言模型，已经具备相当厉害的智能。如果当前的趋势正确，我们将在几年内实现AGI，也就是**通用人工智能**。AGI将帮人类解决一系列科技难题，以及取代现在的很多工作，不用担心，人会发明AI无法取代的新工作，我们更关心AI什么时候才能把我们从繁琐无聊的工作中彻底解脱出来。人会发明AI无法取代的工作，我们更关心的是AI什么时候能把我们从繁琐无聊的工作中解脱出来，这需要机器人技术的进一步突破，肯定还需要一些重大进步。但是现在看，这里没有绝对的难点，也许十年之内每家每户都买得起会做各种家务活的机器人，其实在工厂里机器人已经大行其道了，而且中国是最大的玩家，机器人很快就会取代流水线的工人，现在我们已经不需要很多工人了，大部分工作都是与人而非机器人设备打交道。资源是无限的，意味着富足时代一定会到来。科技的指数进步明确了通向富足的道路，当前的AI进展则预示富足时代很快就会到来。资源是无限的，推导出富足时代一定会到来。科技指数进步明确了通往富足的道路。当前AI进展预示了富足时代很快就会到来。其实很多迹象表明，我们一只脚已经跨入了富足时代，只是并非所有人都能立即感受到而已。世界粮食的总产量早就足够喂饱地球上的每一个人。如果**垂直农业**普及，我们相当于直接用太阳能合成食物，每个地区都可以实现食品自给自足。世界绝对贫困人口的比例已经低于10%，而这在很大程度上要感谢中国，是中国制造给全世界人民提供了优质而廉价的商品，让全世界各国普通人都能享受现代化生活。而正因如此，中国制造正面临产能过剩。中国制造有多厉害呢？现在中国大约有2亿个农村家庭，而中国汽车产量已经达到3000万辆。鉴于我们钢铁产能严重过剩，只要愿意，汽车产量还能大大提高。如果中国政府突发奇想，要迅速给每个农村家庭配一辆汽车，我敢说这个任务两三年就能完成。有人说谁来养活中国？什么？如果中国人都过上美国人的生活，地球会怎样？这是无稽之谈。现实是没有任何物理定律禁止所有中国人都过上中产阶级的生活。事实上，就算从今年起科技进步完全停止，我们有足够的资源和能力让所有人都过上好生活，但是需要社会组织方式的改变。最需要改变的是对经济增长的认识，传统上我们奉行**供给侧经济学**，认为增长是由投资而不是消费带来的，我们相信是因为有人把闲散资金集中起来投资到市场，才有了新的GDP。各国竞争则是鼓励投资，甚至不惜牺牲消费。一个最重要的表现就是资本利得税的税率总是低于劳动所得税。其实你想想，这是不公平的，炒股赚钱的人只要交很小比例的税，甚至在很多国家包括中国不用交税，而辛苦挣工资却要交税，这种劫贫济富的政策只是为了鼓励投资。但是你要考察经济史，美国早在1920年代以后，资本就不再是稀缺的了，有好的投资机会，资本自然会主动投资。进一步给资本减税，并不会带来更多的投资，也不会带来更高的增长。对中国来说，改革之初严重缺少资金，一点投资就能明显拉动经济增长，加上中国经济是出口导向，也需要大量投资，分税制改革、基础设施建设、四万亿刺激计划都是政府主导的投资，拉动了经济增长，但这一切是有限度的，我们只要看看中国现在的增量资本产出率（ICOR）就知道，投资拉动增长已经出现强烈的边际效应递减，中国制造产能已经过剩，利润已经过低，更多的投资不再是为了让中国老百姓受益，而是以更便宜的价格、更低的利润给外国人提供商品，投资促进增长是短缺思维，**富足时代是消费的时代**。如果大部分人工作都交给机器人去做，大部分人对经济活动的主要贡献就是消费。是的，消费也是做贡献。你这是在为产品投票，你在告诉生产者应该往哪个方向走，更何况你在照顾家人，你可以参与更多社会活动，你的自我实现就是在帮助文明进步。各国迟早会在某一个时刻提供某种相当于**全民基本收入**的东西，用消费拉动经济增长。试想，如果自动化让生产过程本身变得更便宜，我们就可以专门对土地这种被占有的稀缺资源收税，对产品的附加值收税，让产品依然保持比较高的价格，因为只有这样才能防止通货膨胀，然后我们把税直接发给老百姓，你可能担心这些发钱会把人变懒，这种担心是多余的，你只要考察历史就知道，其实人类在历史上早就有过富足时代。农业革命之前所有人都是采集狩猎者，而对于采集狩猎者来说，资源几乎是无限的。你猎杀几头猪，过段时间还会有；果实今天摘了，明年还会再长。只要你对大自然足够尊重，这种生活方式是可持续的，而且持续了几万年。采集狩猎者的生活非常悠闲，每周只工作两三天，每天几个小时而已。如果追踪猎物一整天，他们接下来会休息好几天。考古发现他们的平均寿命、各项身体指标都比农业社会的人好得多，也就是说累死累活地上班并不是人们的正常状态，少工作才是更自然的，我们还可以跟中国春秋时代的贵族比，那时候中国自然环境特别好，土地广袤，人口并没有那么多，你只要干点活，就能得到不少粮食，以至于贵族完全不干活，但是并没有堕落，反而比为生计奔波的人们有更高的道德追求。也许我们可以说他们定义了中国人的道德标准，我们还可以跟大清八旗子弟做类比，大清政府直接禁止八旗子弟工作，他们只能要么当兵要么做官。他们中的绝大多数人靠朝廷给的基本收入生活。从战斗力来讲，八旗子弟是堕落了，但毕竟没有太多打仗的机会。但是我们看口述历史，比如老舍先生的《正红旗下》，八旗子弟大多是讲究人，他们很重视自己的社会形象，守规矩、讲道德，还精通文化艺术。或者我们可以看看身边那些事业单位退休老人，他们生活丰富多彩，只可惜没有太多花钱的需求，也许我们未来要做的不是延迟退休，而是提前退休，甚至直接给有需要的年轻人提供学习机会，让他们率先拥有基本收入。如果你认可这些物质条件不是我们通往富足的障碍，我们的社会将会变得更好，人们工作将不再是为了谋生，而是为了**自我实现**，为了有所贡献，人们交往将更少只为利益，更多是出于友情和道义。人与人之间的关系将更少竞争，更多是合作。我们将会更崇尚创新文化和精神生活。我们会有更多的自组织，而不是指望系统的恩赐。我们会更有尊严，更不受驱使，更像人。我们会认为之前所有的苦难都是暂时的偏离，这并不是人类本该如此。】',
    value: 8,
    category: '学习成长',
    date: '2025-11-08T01:15:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
      {
    id: 34,
    content: '伯远：“今天看儿子回来有感：父母不要做孩子成长道路上的绊脚石。        我刚从我儿子那里回来，我儿子在北京临时上个幼儿园，我今晚飞机飞雅典，看我儿子的爷爷奶奶告诉我：        北京的幼儿园老师想见我，因为我不同意我儿子报名很多课程，所以老师想跟我聊聊，总结一句话：幼儿园不想我儿子输在起跑线上。我让爷爷奶奶告诉幼儿园老师：        绝大多数孩子的一生的终点在出生的一刹那就已经注定了，我儿子出生时候的起点，是99%孩子一生都无法企及的终点……卷孩子不如卷自己己所不欲勿施于        每个孩子出生的那一刻都是好苗子。但经过父母20年的“精心培育”，把99%的好苗子培育成了傻子，这些父母还认为这是为了自己孩子好。人生最大的悲哀莫过于此。富不过三代是大概率，话不好听但是事实。        幼儿园老师是真心的为我儿子好，这一点我非常确信。       但是，老师不知道什么是“好”，这是问题的关键，和99%的父母一模一样，都是真心的为了自己的孩子“好”。但最后亲手把每一个好苗子培养成了“废物”        几千年以来，每个人都有起跑线。比如你姓什么        金正恩姓金，而且是金日成、金正日的金，这就是起跑线。红三带、官三代、油三代、银三代、医三代、学三代……太多太多了        别人家三代人的努力，凭什么败给你十年寒窗苦读？        太多人想让自己孩子用十年寒窗苦读去战胜别人家三代人的努力了……        这个地球上95%的人存在的意义，只是让另外5%的人生活的更好，仅此而已。        我如果是个穷人，我也会每天告诉我的孩子：你的爸爸、爷爷、太爷爷、都是没太大出息的人，你如果想改变整个家族的命运，那就要从你这一代人开始，不要听我的话，因为我的思想已经经过这个社会几十年的检验了，检验的结果就是，我是个没出息的人，所以你如果听我的话，那你大概率也会没出息        我会告诉孩子这个世界的真相，并且承认自己的没出息，没出息并没有特别丢人，因为95%的人都没出息     不要用谎言欺骗孩子，知耻方能后勇！自己和孩子都不知道耻辱，何来的后勇       最后，祝所有的父母和孩子都能够变得更好[玫瑰][玫瑰]                                        伯远2025.11.6日于北京',
    value: 10,
    category: '学习成长',
    date: '2025-11-06T22:36:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
     {
    id: 33,
    content: '减负的本质是降低标准而不是提高支持；点化的特点是施法时间短，作用时间长，结果不可逆。用李白的话说叫「仙人抚我顶，结发受长生」。「我给你这些评语是因为我有很高的标准，我知道你能达到这些标准」。对难题来说，共同钻研好处多多，而且你给别人讲题自己会有个地位提升感；给个仪式感，强调学习微积分是一种全新的体验；对原理的深刻理解和举一反三的能力；试想还有什么故事比自己迎难而上更值得吹嘘的呢？这就是最好的性格养成——你需要在每天的冒险活动之后，让学生有个反思、复盘（reflection）的环节。大家一起聊聊，今天怎么克服逆境的，这个事儿和自己的价值观、身份认同，和各种品质如何对齐，将来我如何用同样的精神迎接别的挑战。就多了这么简单的一步，效应就变成了长期的。我私下觉得这可能跟大脑的长期记忆机制有关，也许你需要把模糊的印象强化成显性记忆。给你的学生带来一个决定性的、不可逆的正面影响，成就感将是巨大的。你要成为你们那一片儿的「人物」：将来谁写回忆录，说此生对我影响最大的几个人是这几位老师 —— 你希望他提到你的名字。「我们都比自己知道的自己要好。一旦意识到这一点，我们就再也不会甘于平庸。」',
    value: 10,
    category: '学习成长',
    date: '2025-11-06T14:10:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
     {
    id: 32,
    content: '想把《beyond feelings》翻译为中文。查了查目前公开信息显示，《Beyond Feelings》（《超越感觉》）的中文翻译版本至少有8次，但是被反映效果不好。这本书我又非常喜欢，被我归为“最值得读的书”之列，我明天开始尝试，我的规划是1天翻译一页，大概半年后出结果。主要步骤分为打大纲➡️内容翻译创作➡️内容补充校对➡️风格打磨➡️排版布局完善➡️封面美观优化➡️联系出版商，如果没人愿意出版则公开在网上（公众号+GitHub+b站）',
    value: 6,
    category: '工作相关',
    date: '2025-11-05T00:42:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
     {
    id: 31,
    content: '现在全球大学面对人工智能（Al）的选择，路径完全不一样。美国那边，OpenAI和Google这些科技巨头正在疯狂进校园。2025年2月，加州州立大学系统宣布给全系统52万师生配上ChatGPTEdu——这是OpenAl专门给高校定制的教育版。好家伙，这可是52万人，OpenAl自己说这是“全世界任何单一组织或公司中ChatGPT最大规模的部署”；',
    value: 10,
    category: '工作相关',
    date: '2025-10-31T23:30:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 30,
    content: '这个时代最精妙的骗局是让大多数人相信自己没在赌桌上，当所有人都在被动参与资产轮盘的时候，清醒的投机者至少知道自己在冒险在赌什么，而蒙眼的群众却把枷锁当作护身，命运当作确定性。',
    value: 10,
    category: '工作相关',
    date: '2025-10-26T16:11:00+08:00',
    images: ['images/4d590198a4b3d2ec92ec88c5b2b06deb.jpg'],
    likes: 0,
    comments: []
  },
  {
    id: 29,
    content: '凡事在明规则的外表下都有另一套隐规则的黑箱；我自己决定干什么和怎么干，而不是随大流；理解原理，推崇技术，不急不躁不上情绪，想方设法解决问题；不断刺激和试探系统的边界线，探索背后那套规则；把一切事物、包括自己的身体，都看成系统。系统是模块化的，你可以把各个部分拆开再重组。系统是按照算法运行的，你可以理解这个算法。系统是可以优化的........ 而且是可以破解的；',
    value: 10,
    category: '工作相关',
    date: '2025-10-25T12:55:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 28,
    content: 'i personally could have a gallon of Alan',
    value: 0,
    category: '幽默段子',
    date: '2025-10-23T21:59:00+08:00',
    images: ['images/88d728fe4c308de4520527786fa68d78.png'],
    likes: 0,
    comments: []
  },
  {
    id: 27,
    content: '用特斯拉股票计价：你到底是要吃这顿老板都不知道是谁给你做的饭还是失去让马斯克给我打工的一部分机会。不断定投马斯克给我打工——这世界上还有谁给我打工比马斯克效率更高的？1股=448usd=3197人民币；你吃一顿花个几百就相当于失去了几分之几的特',
    value: 10,
    category: '工作相关',
    date: '2025-10-21T21:45:00+08:00',
    images: ['images/laowang.jpg'],
    likes: 0,
    comments: []
  },
  {
    id: 26,
    content: '找不到，学不完，不如自己做；调用AI到70/80分足够了；生产者➡️创造者',
    value: 10,
    category: '工作相关',
    date: '2025-10-21T20:20:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 25,
    content: '给机构做英语教学视频，用即梦和可灵的AI数字人，剪映剪辑，海螺AI配音和声音克隆',
    value: 6,
    category: '工作相关',
    date: '2025-10-20T18:10:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 24,
    content: '过去的事情是无法更改的,现在的烦恼是无济于事的。但是,将来的尴尬也许是可以避免的--如果现在的行动没有出错的话。换句话讲,为了避免将来的尴尬,必须在今天采取正确的行动。',
    value: 8,
    category: '问答互动',
    date: '2025-10-20T17:50:00+08:00',
    images: ['images/4bb08fa59a50e5d379c4f2260797d26d.png'],
    likes: 0,
    comments: []
  },
  {
    id: 23,
    content: '我们认真对待我们的周遭环境,我们知道自己很容易被环境所听影响、所塑造;又因为我们一向是以主动为荣的人,所以会时时刻刻提防环境对我们的影响向。我们不花时间与他人争论,我们只为了弄清楚事实而讨论。我们不鄙视他人的能力--我们自己曾经也能力不足,我们倒是不怕自黑,不过,我们更愿意与那些欣赏我们的人共同,成长。我们懂得如何调整焦点，我们会主动尝试从多个角度去看待问题;我们不会把时间浪费在无谓的情绪之中,我们会用时间精力改变那些能够改变的事情。',
    value: 8,
    category: '问答互动',
    date: '2025-10-19T13:05:00+08:00',
    images: ['images/msk.jpg'],
    likes: 0,
    comments: []
  },
  {
    id: 22,
    content: '马斯克与弗里费德曼的播客不错-https://youtu.be/JN3KPFbWCy8?si=z0HMVS7Jw-GSO5zC',
    value: 6,
    category: '问答互动',
    date: '2025-10-14T19:17:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 21,
    content: '无人扶我青云志,我自踏雪至山巅。\n若是命中无此运,孤身亦可登昆仑。\n红尘赠我三尺剑,酒看瘦马一世街。\n世人朝路乃绝润,独见众生止步前。\n海到尽头天作岸,山登绝顶我为峰。\n如若东山能再起,大鹏展翅九万里。\n一入红尘梦易真,一朝悟透心境名。\n一朝悟道见真我,昔日枷锁皆云烟。\n天门将至百运开,拂尘轻笑问仙来。',
    value: 9,
    category: '问答互动',
    date: '2025-10-14T13:16:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 20,
    content: '生活标准这个东西，最好就是以年为单位去考量，且很长时间都不要发生改变，这个标准是我的被动收入——我的另一个我不用我操心的，能够过的生活。',
    value: 6,
    category: '财经理财',
    date: '2025-10-13T22:40:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 19,
    content: 'The journey is the reward.',
    value: 6,
    category: '工作相关',
    date: '2025-10-12T15:04:00+08:00',
    images: ['images/The-journey-is-the-reward.jpg'],
    likes: 0,
    comments: []
  },
  {
    id: 18,
    content: '当海盗，不要当海军 ，像侠盗一样行事：既为自己的工作感到自豪，又愿意去窃取别人的灵感，快速行动，做成事情',
    value: 6,
    category: '工作相关',
    date: '2025-10-12T15:04:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 17,
    content: '本来已经看着一辆公交车走了（要再等15分钟）结果没一会就来了，哇~哇~哇~，当时感受💗',
    value: 0,
    category: '生活日常',
    date: '2025-10-12T09:50:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 16,
    content: '值得关注的外部，事实上很少，因为外部的绝大多数事情与提高自身生产效率毫无关系，毕竟我的所有财富,不管是物质财富还是精神财富,全来自我的时间,或者准确地讲,来自我的时间的体积。我哪有什么时间可以浪费呢?又有什么道理浪费在它们身上呢?时时刻刻专注提高效率才是正事',
    value: 8,
    category: '工作相关',
    date: '2025-10-11T22:50:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 15,
    content: '从一开始就建立严格的筛选机制,尽量只挑值得做很久很久的事。仅此一条,就能引发天壤之别。因为一上来选的就是值得做很久很久的事,所以,自然而然地只能长期践行。又因为的确做了很久,自然有积累,自然有改良,效率自然有发展',
    value: 8,
    category: '工作相关',
    date: '2025-10-11T22:50:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 14,
    content: '当你感觉你去参与这个东西的时候，有很大的负担，甚至要到负债的级别就不要报了，哪怕他是一个真正有用的东西——超过 200 元的花费，提供全面的信息给 ai ，让他帮你避坑',
    value: 6,
    category: '工作相关',
    date: '2025-10-11T22:49:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 13,
    content: '哪有那么多天时地利人和都比不过两个字,勤奋。幸运没那么重要,如果还看幸运,说明你还不够勤奋',
    value: 8,
    category: '工作相关',
    date: '2025-10-09T19:58:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 12,
    content: '生活黑客都说了,凡是有系统一定有 bug,正常人才会去排队,你黑客都是找 bug 就直接进去了。确实这个世界所谓的炒台班子是哪哪都是千疮百孔的,你正儿八经排队就能排到猴年马月去。你要是不想排队的话,哪有洞你都可以钻进去',
    value: 8,
    category: '生活日常',
    date: '2025-10-09T19:58:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 11,
    content: '用来替代自己的另一个"我"所产生的稳定现金流对应的数值,就是衡量自己配得上什么的标准',
    value: 6,
    category: '财经理财',
    date: '2025-10-09T00:58:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 10,
    content: '你可能没有那么潮,但是没有人可以讲你错,如果你没错,那你就可以按照自己的想法,让自己在自己的世界观里面足够的对,且对很久很久——等我几年后,无压力拿下它;成为有能力严肃面对严肃问题的人,成为不依托于群体娱乐化共识的独立精彩有趣的人(eg.Kanye)',
    value: 8,
    category: '工作相关',
    date: '2025-10-07T23:57:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 9,
    content: '以项目为导向,明确要解决的问题和创造的价值,缺什么学什么,能提高学习的针对性和效率。出一本教材:框架搭建、内容补充、风格打磨、案例整理、排版设计。先确定项目目标和结果,再推导所需学习内容。',
    value: 8,
    category: '工作相关',
    date: '2025-10-06T23:32:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 8,
    content: '正常工作者用年富力强的35年赚钱覆盖一生80年,去除节假日和不能出售时间,真正用于改变自己生活的出售时间一年仅10.5天(3652/3【节假日】*1/3【每天工作时长】*1/2【受教育成本】*1/4【家庭】);很多人因出售时间少难以改命,而增加工作时间能提升竞争力和收入。全世界最牛逼的企业家,对全世界最聪明的学生,在内部培训,以至于他都觉得不能直播的场景,给他们灌输的是这样的理念。你想想看,这个教育的代差,这个人与人之间的差异,这个所谓阶级固化的,鸿沟到底被划在了哪?人家本来已经比你牛逼那么多了,他们接受的是这种跳跃了中层,直接进入上层的,几乎没有任何争辩空间,直接给结论让你就这么做的核心逻辑。人家已经那么聪明了,他们还这么做,而如果我们毫无意识地被更多傻逼的摆烂躺平思想影响的话,我们怎么办?很多人连自己要干什么都不知道的人,他也没有要超过的对象,他也不是那种在中层拼了命就要上去看一眼的人,可能就被带偏了。叫我自由美,自由民主美利坚,都宣传这个东西,这是先进的思想,这是先进的理念,国内如果还不认可,是身边的人太傻逼,他们还不够先进,是吧?他们是老掉牙的,零零后还是要整顿职场。还是要卡点上下班,我觉得那完蛋,我觉得那完蛋。你可以这样选,你这样选呢,你以后就不要抱怨在职场上你比不过在过去五年跟你一起进公司,每天干十四个小时的人。',
    value: 8,
    category: '工作相关',
    date: '2025-10-06T00:39:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 7,
    content: '今天 8:15 到的市图书馆,已经有 4 个人在我前面了 😮',
    value: 1,
    category: '生活日常',
    date: '2025-10-04T21:49:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 6,
    content: '今天去图书馆学习,一堆学生在图书馆打游戏的,不安静💢',
    value: 1,
    category: '生活日常',
    date: '2025-10-02T20:09:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 5,
    content: '电脑充电线坏了,好在通过重新拆拼花了 3 个多小时解决了',
    value: 1,
    category: '生活日常',
    date: '2025-10-02T16:14:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 4,
    content: '疯狂动物城 2 电影 11 月来啦',
    value: 1,
    category: '艺术文化',
    date: '2025-10-01T14:12:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 3,
    content: '发国庆祝福时发现有一百多个单删我了。真正值得的人,会留在你的生活里;删掉你的人,也是在帮你腾出空间给更合拍的人;能坦诚交流、愿意回应的人才最值得投入精力。',
    value: 6,
    category: '情感表达',
    date: '2025-10-01T00:16:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 2,
    content: '真挤,回来时 504 人真多🥵,应该 16 点就出发的',
    value: 0,
    category: '生活日常',
    date: '2025-09-30T18:36:00+08:00',
    images: [],
    likes: 0,
    comments: []
  },
  {
    id: 1,
    content: '好好好,Claude 也赶中国国庆发模型的节奏',
    value: 1,
    category: '科技数码',
    date: '2025-09-30T12:08:00+08:00',
    images: ['images/d59aff54b056c66e94bc15b5cd3ad78c.png'],
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
        console.error(`❌ 日记条目 ${entry.id} 缺少必需字段:`, missingFields);
        return false;
    }
    
    // 验证分类
    const validCategories = diaryTagLibrary.map(tag => tag.code);
    const invalidCategories = entry.categories.filter(cat => !validCategories.includes(cat));
    if (invalidCategories.length > 0) {
        console.warn(`⚠️ 日记条目 ${entry.id} 包含无效分类:`, invalidCategories);
    }
    
    // 验证心情代码
    if (!moodLibrary[entry.moodCode]) {
        console.warn(`⚠️ 日记条目 ${entry.id} 包含无效心情代码: ${entry.moodCode}`);
    }
    
    return true;
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
    return `${tag[lang]} ${tag.icon}`;
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

// ==================== 初始化与验证 ====================
console.log('🚀 开始加载数据模块...');

// 验证所有日记数据
console.log('🔍 验证成功日记数据...');
const validationResults = successDiaryData.map(entry => ({
    id: entry.id,
    valid: validateDiaryEntry(entry)
}));

const invalidCount = validationResults.filter(r => !r.valid).length;
if (invalidCount > 0) {
    console.error(`❌ 发现 ${invalidCount} 条无效日记数据`);
} else {
    console.log('✅ 所有日记数据验证通过');
}

// 数据统计
const stats = getDiaryStats(successDiaryData);
const momentsStats = getMomentsStats(momentsData);

console.log('📊 数据统计:', {
    日记总数: stats.total,
    朋友圈总数: momentsStats.total,
    高价值朋友圈: momentsStats.highValue,
    分类分布: stats.categories,
    心情分布: stats.moods
});

// ==================== 浏览器环境全局暴露 ====================
if (typeof window !== 'undefined') {
    // 数据字典
    window.diaryTagLibrary = diaryTagLibrary;
    window.moodLibrary = moodLibrary;
    window.momentCategories = momentCategories;
    
    // 数据集
    window.successDiaryData = successDiaryData;
    window.successDiaries = successDiaryData;
    window.successDiaryDefaults = successDiaryDefaults;
    window.momentsData = momentsData;
    
    // 工具函数
    window.getTagInfo = getTagInfo;
    window.getTagName = getTagName;
    window.getMoodInfo = getMoodInfo;
    window.formatDate = formatDate;
    window.validateDiaryEntry = validateDiaryEntry;
    window.sortDiariesByDate = sortDiariesByDate;
    window.filterDiariesByCategory = filterDiariesByCategory;
    window.filterDiariesByMood = filterDiariesByMood;
    window.getDiaryStats = getDiaryStats;
    window.getMomentsStats = getMomentsStats;
    
    console.log('✅ 数据模块已成功加载到全局作用域');
}

// ==================== Node.js 环境模块导出 ====================
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
        getTagInfo,
        getTagName,
        getMoodInfo,
        formatDate,
        validateDiaryEntry,
        sortDiariesByDate,
        filterDiariesByCategory,
        filterDiariesByMood,
        getDiaryStats,
        getMomentsStats
    };
}
