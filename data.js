// 数据字典 & 默认示例
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
        zh: '(｡´•﹃•)っ🍜保持饥渴感',
        en: '(｡´•﹃•)っ🍜 Stay hungry',
        color: '#f97316'
    },
    happy: {
        zh: '😊 开心',
        en: '😊 Happy',
        color: '#facc15'
    }
};

// 成功日记默认示例（GitHub 更新）
let successDiaryData = [
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
            en: 'Learned useful BGM and cut tips from Cinematic Hurricane’s 13M-subscriber comments.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel:null ,
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
        achievementLevel: null,
        coverImage: '',
        attachments: []
    },
    {
        id: 3,
        date: '2025-10-02',
        categories: ['work', 'study', 'nature'],
        headline: {
            zh: '读完《小狗钱钱》',
            en: 'Finished “Little Dog Money”'
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
        achievementLevel: null,
        coverImage: 'images/4dd4a92b00f40efe894d41519c6e675c.jpg',
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
        achievementLevel:null ,
        coverImage: 'images/9884f4b986c88ee9963c735ba193939c.jpg',
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
            zh: '图书馆学习氛围满分，提前完成阅读任务。',
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
        achievementLevel: null,
        coverImage: 'images/a02a02195090841106b5305e8fb14860.jpg',
        attachments: []
    },
    {
        id: 6,
        date: '2025-09-29',
        categories: ['reading', 'fitness'],
        headline: {
            zh: '拥抱清晨，完成每日收官',
            en: 'Embrace the dawn, close the day strong'
        },
        content: {
            zh: '七小时高效心流，计划全部按时完成。',
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
        achievementLevel: null,
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
            zh: '成功读完十本书。\n提交 Rising Tide 课程（虽只录了四节）。\n保持活力训练。',
            en: 'Read ten books successfully.\nSubmitted the Rising Tide course, even with four lessons recorded.\nKept the workouts energizing.'
        },
        highlight: {
            zh: '睡眠充足；前哨战；猕猴桃不错 😋',
            en: 'Plenty of sleep; skirmish prep feels good; kiwifruit tastes great 😋'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: null,
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
            zh: '睡眠充足，状态在线。',
            en: 'Well rested and fully energized.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: null,
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
            zh: '专程前往图书馆学习，保持高效节奏。',
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
        achievementLevel: null,
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
        achievementLevel: null,
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
        achievementLevel: null,
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
            zh: '出行感受自然，给自己放个假。',
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
        achievementLevel:null ,
        coverImage: '',
        attachments: []
    },
    {
        id: 13,
        date: '2025-09-22',
        categories: ['reading', 'study', 'fitness'],
        headline: {
            zh: '《真需求》与自动化工作流',
            en: 'Finishing “Real Demand” and automations'
        },
        content: {
            zh: '读完《真需求》。\n阅读 7 本书并完成输出。\n打造小程序自动化工作流。\n早睡并坚持体能训练。\n控制每日开销 15 元。',
            en: 'Finished reading “Real Demand”.\nRead 7+ books with outputs.\nBuilt automation workflows for the mini program.\nSlept early with steady workouts.\nKept daily spending within 15 RMB.'
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
        achievementLevel:null ,
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
            en: 'Cleared every yellow-tagged movie.\nFinished “The 4-Hour Workweek”.\nTweaked spreadsheets per the skirmish insights.\nDrafted ten WeChat articles.'
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
        achievementLevel:null ,
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
            en: 'Completed NCEE-CA.\nMaintained focus rate above 80%.\nFinished the S paper.\nWatched “Little John Cohan’s Soviet Case”, “Tech Completion”, and “A Record of a Mortal’s Journey”.'
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
        achievementLevel:null ,
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
        achievementLevel: null,
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
            zh: '保证充足睡眠。\n持续为公众号创作并获得打赏。\n完成 NCEE-CA，拿到 74 分。\n提醒自己：容忍小麻烦才能成就大事。\n遇到问题时保持积极，并思考自己是在崩溃边缘还是突破前夕。',
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
        achievementLevel:null ,
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
        achievementLevel:null ,
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
            zh: '搭建 laowang Agent 1.0。\n收到 Passion T-shirt。\n保持充足睡眠。\n人生首次收到公众号赞赏，激动又惊喜。',
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
        achievementLevel:null ,
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
        achievementLevel: null,
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
            en: 'Studied the Neuron course.\nRenewed chatST.\nRan for 30 minutes.\nWatched “Skirmish” and used it to refine the Feishu sheet.\nSlept well.'
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
        achievementLevel:null ,
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
            en: 'Rewatched “The Chronicles of Little Black”.\nStudied at Yunchen Library.\nReplaced push-ups with 10 sets of three reps.\nIterated at a high frequency.\nWent to bed early.'
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
        achievementLevel:null ,
        coverImage: '',
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
            en: 'Watched Luo Yonghao’s radio show and live stream.\nWrote a WeChat article.\nKept building the personal website.\nStarted writing daily success notes in English.'
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
        achievementLevel:null ,
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
            en: 'Read 10 books or more.\nWriting a commercial book about the product.\nKept building the personal website.\nadequate sleep.'
        },
        highlight: {
            zh: 'Linksphotograph的视频"在世界上最孤独的房子里过一夜！"好看',
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
        id: 25,
        date: '2025-10-06',
        categories: ['study', 'creative'],
        headline: {
            zh: '阅读+产品测试',
            en: 'Reading + Product Testing'
        },
        content: {
            zh: '阅读10本书+。\n产品在淘宝闲鱼测试。\n持续搭建个人网站，加了背景。\n睡眠充足。\n学习10小时+',
            en: 'Read 10 books or more.\nThe product is being tested on Taobao Xianyu platform..\nKept building the personal website，added background.\nadequate sleep.\nStudying for more than 10 hours'
        },
        highlight: {
            zh: '椰子水不错😌',
            en: 'The coconut water looks nice😌.'
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
        id: 26,
        date: '2025-10-07',
        categories: ['study', 'film','creative'],
        headline: {
            zh: '阅读+产品测试',
            en: 'Reading + Product Testing'
        },
        content: {
            zh: '阅读10本书+。\n产品在淘宝闲鱼测试。\n持续搭建个人网站，加了背景。\n睡眠充足。\n学习7小时+',
            en: 'Read 10 books or more.\nThe product is being tested on Taobao Xianyu platform..\nKept building the personal website，added background.\nadequate sleep.\nStudying for more than 7 hours'
        },
        highlight: {
            zh: '寿司不错😌；凡人修仙传不错',
            en: 'The sushi looks nice😌.The Legend of Immortals is quite good.'
        },
        notes: {
            zh: '',
            en: ''
        },
        moodCode: 'hungry',
        achievementLevel: 1,
        coverImage: '',
        attachments: []
    }
];

const successDiaryDefaults = JSON.parse(JSON.stringify(successDiaryData));

// 朋友圈数据
let momentsData = [
    {
        id: 1,
        content: '好好好，Claude 也赶中国国庆发模型的节奏',
        value: 3,
        category: '科技数码',
        time: '2025-09-30 12:08',
        image: 'images/d59aff54b056c66e94bc15b5cd3ad78c.png',
        likes: 0,
        comments: []
    },
    {
        id: 2,
        content: '真挤，回来时 504 人真多🥵，应该 16 点就出发的',
        value: 1,
        category: '生活日常',
        time: '2025-09-30 18:36',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 3,
        content: '发国庆祝福时发现有一百多个单删我了。真正值得的人，会留在你的生活里；删掉你的人，也是在帮你腾出空间给更合拍的人；能坦诚交流、愿意回应的人才最值得投入精力。',
        value: 5,
        category: '情感表达',
        time: '2025-10-01 00:16',
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
        id: 5,
        content: '电脑充电线坏了，好在通过重新拆拼花了 3 个多小时解决了',
        value: 1,
        category: '生活日常',
        time: '2025-10-02 16:14',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 6,
        content: '今天去图书馆学习，一堆学生在图书馆打游戏的，不安静💢',
        value: 1,
        category: '生活日常',
        time: '2025-10-02 20:09',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 7,
        content: '今天 8:15 到的市图书馆，已经有 4 个人在我前面了 😮',
        value: 1,
        category: '生活日常',
        time: '2025-10-04 21:49',
        image: '',
        likes: 0,
        comments: []
    },
     {
        id: 8,
        content: '正常工作者用年富力强的35年赚钱覆盖一生80年，去除节假日和不能出售时间，真正用于改变自己生活的出售时间一年仅10.5天（365*2/3【节假日】*1/3【每天工作时长】*1/2【受教育成本】*1/4【家庭】）；很多人因出售时间少难以改命，而增加工作时间能提升竞争力和收入。全世界最牛逼的企业家，对全世界最聪明的学生，在内部培训，以至于他都觉得不能直播的场景，给他们灌输的是这样的理念。你想想看，这个教育的代差，这个人与人之间的差异，这个所谓阶级固化的，鸿沟到底被划在了哪？人家本来已经比你牛逼那么多了，他们接受的是这种跳跃了中层，直接进入上层的，几乎没有任何争辩空间，直接给结论让你就这么做的核心逻辑。人家已经那么聪明了，他们还这么做，而如果我们毫无意识地被更多傻逼的摆烂躺平思想影响的话，我们怎么办？很多人连自己要干什么都不知道的人，他也没有要超过的对象，他也不是那种在中层拼了命就要上去看一眼的人，可能就被带偏了。叫我自由美，自由民主美利坚，都宣传这个东西，这是先进的思想，这是先进的理念，国内如果还不认可，是身边的人太傻逼，他们还不够先进，是吧？他们是老掉牙的，零零后还是要整顿职场。还是要卡点上下班，我觉得那完蛋，我觉得那完蛋。你可以这样选，你这样选呢，你以后就不要抱怨在职场上你比不过在过去五年跟你一起进公司，每天干十四个小时的人。',
        value: 5,
        category: '工作相关',
        time: '2025-10-06 00:39',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 9,
        content: '以项目为导向，明确要解决的问题和创造的价值，缺什么学什么，能提高学习的针对性和效率。出一本教材：框架搭建、内容补充、风格打磨、案例整理、排版设计。先确定项目目标和结果，再推导所需学习内容。',
        value: 5,
        category: '工作相关',
        time: '2025-10-06 23:32',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 10,
        content: '你可能没有那么潮，但是没有人可以讲你错，如果你没错，那你就可以按照自己的想法，让自己在自己的世界观里面足够的对，且对很久很久——等我几年后，无压力拿下它；成为有能力严肃面对严肃问题的人，成为不依托于群体娱乐化共识的独立精彩有趣的人（eg.Kanye）',
        value: 5,
        category: '工作相关',
        time: '2025-10-07 23:57',
        image: '',
        likes: 0,
        comments: []
    }
];
