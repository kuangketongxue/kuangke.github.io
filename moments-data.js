// moments-data.js - 朋友圈数据管理（本地优先+LeanCloud云端补充）

// ==================== 工具函数（新增：用于时间实时计算） ====================
const TimeUtils = {
    // 生成指定时间差的ISO时间字符串（用于模拟历史动态的具体时间）
    getPastTime(diffHours = 0) {
        const date = new Date();
        date.setHours(date.getHours() - diffHours);
        return date.toISOString(); // 输出如 "2025-10-15T10:30:00.000Z"
    },

    // 实时计算时间差描述（替代固定字符串）
    formatRealTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        // 时间差单位（毫秒）
        const second = 1000;
        const minute = 60 * second;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        const month = 30 * day;

        // 实时计算并返回描述
        if (diff < 30 * second) return '刚刚';
        if (diff < minute) return `${Math.floor(diff / second)}秒前`;
        if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
        if (diff < day) return `${Math.floor(diff / hour)}小时前`;
        if (diff < week) return `${Math.floor(diff / day)}天前`;
        if (diff < month) return `${Math.floor(diff / week)}周前`;
        return `${Math.floor(diff / month)}个月前`;
    }
};

// ==================== LeanCloud 数据管理 ====================
class MomentsData {
    constructor() {
        this.className = 'Moments';
    }

    // 获取所有朋友圈数据（本地优先，时间实时计算）
    async getAllMoments() {
        try {
            // 优先使用本地数据，同时处理实时时间
            if (window.localMomentsData && window.localMomentsData.length > 0) {
                console.log('使用本地朋友圈数据（实时时间）');
                // 对本地数据的时间进行实时计算，不修改原数据
                return window.localMomentsData.map(item => ({
                    ...item,
                    timestamp: TimeUtils.formatRealTime(item.rawTime) // 用rawTime计算实时描述
                }));
            }

            // 云端数据逻辑（保持不变，时间自动实时）
            if (typeof AV !== 'undefined') {
                const query = new AV.Query(this.className);
                query.descending('createdAt');
                query.include('author');
                const results = await query.find();
                
                if (results.length === 0) {
                    return await this.getUserMoments();
                }
                return this.formatMoments(results);
            } else {
                console.log('LeanCloud未初始化，使用默认数据（实时时间）');
                return this.getDefaultMoments();
            }
        } catch (error) {
            console.error('获取朋友圈数据失败:', error);
            return this.getDefaultMoments();
        }
    }

    // 从_User表获取用户数据（头像统一，时间实时）
    async getUserMoments() {
        try {
            if (typeof AV === 'undefined') {
                return this.getDefaultMoments();
            }

            const query = new AV.Query('_User');
            const users = await query.find();
            
            return users.map((user, index) => {
                const userData = user.toJSON();
                // 计算实时时间（基于用户创建时间或模拟时间）
                const rawTime = userData.createdAt || TimeUtils.getPastTime(index * 2); // 模拟时间差
                return {
                    id: userData.objectId || `user-${index}`,
                    username: userData.username || '用户' + (index + 1),
                    avatar: 'images/favicon.ico', // 统一头像
                    content: userData.bio || '这是我的第一条朋友圈！',
                    images: userData.images || [],
                    category: this.getRandomCategory(),
                    rawTime: rawTime, // 存储原始时间，用于实时计算
                    timestamp: TimeUtils.formatRealTime(rawTime), // 实时时间描述
                    likes: Math.floor(Math.random() * 50),
                    comments: Math.floor(Math.random() * 20),
                    isLiked: false
                };
            });
        } catch (error) {
            console.error('获取用户数据失败:', error);
            return this.getDefaultMoments();
        }
    }

    // 默认数据（头像统一，时间实时）
    getDefaultMoments() {
        const defaultRawTime = TimeUtils.getPastTime(1); // 模拟1小时前
        return [
            {
                id: 'default-1',
                username: '狂客同学',
                avatar: 'images/favicon.ico', // 统一头像
                content: '🌟 欢迎来到狂客·银河朋友圈！\n\n这里是分享生活点滴、记录美好时光的地方。无论是日常琐事、学习心得还是旅行见闻，都可以在这里分享。\n\n让我们一起在这片星空中，记录属于自己的精彩瞬间！✨',
                images: [],
                category: '生活日常',
                rawTime: defaultRawTime, // 原始时间
                timestamp: TimeUtils.formatRealTime(defaultRawTime), // 实时描述
                likes: 42,
                comments: 8,
                isLiked: false
            }
        ];
    }

    // 随机获取分类（保持不变）
    getRandomCategory() {
        const categories = ['生活日常', '美食分享', '旅行见闻', '工作相关', '学习成长'];
        return categories[Math.floor(Math.random() * categories.length)];
    }

    // 根据分类获取数据（时间实时计算）
    async getMomentsByCategory(category) {
        try {
            // 本地数据+实时时间
            if (window.localMomentsData && window.localMomentsData.length > 0) {
                const processedData = window.localMomentsData.map(item => ({
                    ...item,
                    timestamp: TimeUtils.formatRealTime(item.rawTime)
                }));
                return category === 'all' 
                    ? processedData 
                    : processedData.filter(moment => moment.category === category);
            }

            // 云端数据逻辑（保持不变）
            if (typeof AV !== 'undefined') {
                const query = new AV.Query(this.className);
                if (category !== 'all') {
                    query.equalTo('category', category);
                }
                query.descending('createdAt');
                query.include('author');
                const results = await query.find();
                
                if (results.length === 0) {
                    const userMoments = await this.getUserMoments();
                    return category === 'all' ? userMoments : 
                           userMoments.filter(moment => moment.category === category);
                }
                return this.formatMoments(results);
            } else {
                const defaultMoments = this.getDefaultMoments();
                return category === 'all' ? defaultMoments : 
                       defaultMoments.filter(moment => moment.category === category);
            }
        } catch (error) {
            console.error('按分类获取数据失败:', error);
            return this.getDefaultMoments();
        }
    }

    // 格式化云端数据（头像统一，时间实时）
    formatMoments(results) {
        return results.map(item => {
            const data = item.toJSON();
            const author = data.author || {};
            const rawTime = data.createdAt || TimeUtils.getPastTime(); // 原始时间
            return {
                id: data.objectId,
                username: author.username || '匿名用户',
                avatar: 'images/favicon.ico', // 统一头像
                content: data.content || '分享了一条内容',
                images: data.images || [],
                category: data.category || '生活日常',
                rawTime: rawTime, // 存储原始时间
                timestamp: TimeUtils.formatRealTime(rawTime), // 实时描述
                likes: data.likes || 0,
                comments: data.commentCount || 0,
                isLiked: false
            };
        });
    }

    // 点赞（保持不变，云端存储）
    async likeMoment(momentId) {
        try {
            if (typeof AV !== 'undefined') {
                const moment = AV.Object.createWithoutData(this.className, momentId);
                moment.increment('likes');
                await moment.save();
            }
            return true;
        } catch (error) {
            console.error('点赞失败:', error);
            return false;
        }
    }

    // 取消点赞（保持不变，云端存储）
    async unlikeMoment(momentId) {
        try {
            if (typeof AV !== 'undefined') {
                const moment = AV.Object.createWithoutData(this.className, momentId);
                moment.increment('likes', -1);
                await moment.save();
            }
            return true;
        } catch (error) {
            console.error('取消点赞失败:', error);
            return false;
        }
    }

    // 创建新的朋友圈（头像统一，时间实时）
    async createMoment(content, images = [], category = '生活日常') {
        try {
            const rawTime = new Date().toISOString(); // 实时创建时间
            if (typeof AV !== 'undefined') {
                const Moment = AV.Object.extend(this.className);
                const moment = new Moment();
                
                moment.set('content', content);
                moment.set('images', images);
                moment.set('category', category);
                moment.set('likes', 0);
                moment.set('commentCount', 0);
                
                const currentUser = AV.User.current();
                if (currentUser) {
                    moment.set('author', currentUser);
                }
                
                await moment.save();
                const data = moment.toJSON();
                // 返回时补充实时时间和统一头像
                return {
                    ...data,
                    avatar: 'images/favicon.ico',
                    rawTime: rawTime,
                    timestamp: TimeUtils.formatRealTime(rawTime)
                };
            }
            // 本地创建时的返回格式
            return {
                id: TimeUtils.getPastTime().replace(/\D/g, ''), // 用时间生成唯一ID
                username: '狂客同学',
                avatar: 'images/favicon.ico',
                content: content,
                images: images,
                category: category,
                rawTime: rawTime,
                timestamp: TimeUtils.formatRealTime(rawTime),
                likes: 0,
                comments: 0,
                isLiked: false
            };
        } catch (error) {
            console.error('创建朋友圈失败:', error);
            throw error;
        }
    }
}

// ==================== 本地朋友圈数据（头像统一+实时时间） ====================
const localMomentsData = [
    {
        id: 22,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '马斯克与弗里费德曼的播客不错-https://youtu.be/JN3KPFbWCy8?si=z0HMVS7Jw-GSO5zC',
        images: [],
        category: '问答互动',
        rawTime: TimeUtils.getPastTime(2), // 模拟2小时前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(2)), // 实时描述
        likes: 5,
        comments: 0,
        isLiked: false
    },
    {
        id: 21,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '无人扶我青云志,我自踏雪至山巅。\n若是命中无此运,孤身亦可登昆仑。\n红尘赠我三尺剑,酒看瘦马一世街。\n世人朝路乃绝润,独见众生止步前。\n海到尽头天作岸,山登绝顶我为峰。\n如若东山能再起,大鹏展翅九万里。\n一入红尘梦易真,一朝悟透心境名。\n一朝悟道见真我,昔日枷锁皆云烟。\n天门将至百运开,拂尘轻笑问仙来。',
        images: [],
        category: '问答互动',
        rawTime: TimeUtils.getPastTime(6), // 模拟6小时前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(6)), // 实时描述
        likes: 8,
        comments: 2,
        isLiked: false
    },
    {
        id: 20,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '生活标准这个东西，最好就是以年为单位去考量，且很长时间都不要发生改变，这个标准是我的被动收入——我的另一个我不用我操心的，能够过的生活。',
        images: [],
        category: '财经理财',
        rawTime: TimeUtils.getPastTime(24), // 模拟1天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(24)), // 实时描述
        likes: 12,
        comments: 3,
        isLiked: false
    },
    {
        id: 19,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: 'The journey is the reward.',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(48), // 模拟2天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(48)), // 实时描述
        likes: 6,
        comments: 1,
        isLiked: false
    },
    {
        id: 18,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '当海盗，不要当海军 ，像侠盗一样行事：既为自己的工作感到自豪，又愿意去窃取别人的灵感，快速行动，做成事情',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(48), // 模拟2天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(48)), // 实时描述
        likes: 9,
        comments: 2,
        isLiked: false
    },
    {
        id: 17,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '本来已经看着一辆公交车走了（要再等15分钟）结果没一会就来了，哇~哇~哇~，当时感受💗',
        images: [],
        category: '生活日常',
        rawTime: TimeUtils.getPastTime(72), // 模拟3天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(72)), // 实时描述
        likes: 3,
        comments: 0,
        isLiked: false
    },
    {
        id: 16,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '值得关注的外部，事实上很少，因为外部的绝大多数事情与提高自身生产效率毫无关系，毕竟我的所有财富,不管是物质财富还是精神财富,全来自我的时间,或者准确地讲,来自我的时间的体积。我哪有什么时间可以浪费呢?又有什么道理浪费在它们身上呢?时时刻刻专注提高效率才是正事',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(72), // 模拟3天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(72)), // 实时描述
        likes: 15,
        comments: 4,
        isLiked: false
    },
    {
        id: 15,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '从一开始就建立严格的筛选机制,尽量只挑值得做很久很久的事。仅此一条,就能引发天壤之别。因为一上来选的就是值得做很久很久的事,所以,自然而然地只能长期践行。又因为的确做了很久,自然有积累,自然有改良,效率自然有发展',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(96), // 模拟4天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(96)), // 实时描述
        likes: 18,
        comments: 5,
        isLiked: false
    },
    {
        id: 14,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '当你感觉你去参与这个东西的时候，有很大的负担，甚至要到负债的级别就不要报了，哪怕他是一个真正有用的东西；超过 200 元的花费，提供全面的信息给 ai ，让他帮你避坑',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(96), // 模拟4天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(96)), // 实时描述
        likes: 11,
        comments: 2,
        isLiked: false
    },
    {
        id: 13,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '哪有那么多天时地利人和都比不过两个字,勤奋。幸运没那么重要,如果还看幸运,说明你还不够勤奋',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(120), // 模拟5天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(120)), // 实时描述
        likes: 22,
        comments: 6,
        isLiked: false
    },
    {
        id: 12,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '生活黑客都说了,凡是有系统一定有 bug,正常人才会去排队,你黑客都是找 bug 就直接进去了。确实这个世界所谓的炒台班子是哪哪都是千疮百孔的,你正儿八经排队就能排到猴年马月去。你要是不想排队的话,哪有洞你都可以钻进去',
        images: [],
        category: '生活日常',
        rawTime: TimeUtils.getPastTime(120), // 模拟5天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(120)), // 实时描述
        likes: 7,
        comments: 1,
        isLiked: false
    },
    {
        id: 11,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '用来替代自己的另一个"我"所产生的稳定现金流对应的数值,就是衡量自己配得上什么的标准',
        images: [],
        category: '财经理财',
        rawTime: TimeUtils.getPastTime(144), // 模拟6天前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(144)), // 实时描述
        likes: 14,
        comments: 3,
        isLiked: false
    },
    {
        id: 10,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '你可能没有那么潮,但是没有人可以讲你错,如果你没错,那你就可以按照自己的想法,让自己在自己的世界观里面足够的对,且对很久很久——等我几年后,无压力拿下它;成为有能力严肃面对严肃问题的人,成为不依托于群体娱乐化共识的独立精彩有趣的人(eg.Kanye)',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(168), // 模拟1周前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(168)), // 实时描述
        likes: 19,
        comments: 4,
        isLiked: false
    },
    {
        id: 9,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '以项目为导向,明确要解决的问题和创造的价值,缺什么学什么,能提高学习的针对性和效率。出一本教材:框架搭建、内容补充、风格打磨、案例整理、排版设计。先确定项目目标和结果,再推导所需学习内容。',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(168), // 模拟1周前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(168)), // 实时描述
        likes: 16,
        comments: 2,
        isLiked: false
    },
    {
        id: 8,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '正常工作者用年富力强的35年赚钱覆盖一生80年,去除节假日和不能出售时间,真正用于改变自己生活的出售时间一年仅10.5天(3652/3【节假日】*1/3【每天工作时长】*1/2【受教育成本】*1/4【家庭】);很多人因出售时间少难以改命,而增加工作时间能提升竞争力和收入。',
        images: [],
        category: '工作相关',
        rawTime: TimeUtils.getPastTime(336), // 模拟2周前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(336)), // 实时描述
        likes: 25,
        comments: 8,
        isLiked: false
    },
    {
        id: 7,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '今天 8:15 到的市图书馆,已经有 4 个人在我前面了 😮',
        images: [],
        category: '生活日常',
        rawTime: TimeUtils.getPastTime(336), // 模拟2周前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(336)), // 实时描述
        likes: 4,
        comments: 0,
        isLiked: false
    },
    {
        id: 6,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '今天去图书馆学习,一堆学生在图书馆打游戏的,不安静💢',
        images: [],
        category: '生活日常',
        rawTime: TimeUtils.getPastTime(504), // 模拟3周前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(504)), // 实时描述
        likes: 2,
        comments: 1,
        isLiked: false
    },
    {
        id: 5,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '电脑充电线坏了,好在通过重新拆拼花了 3 个多小时解决了',
        images: [],
        category: '生活日常',
        rawTime: TimeUtils.getPastTime(504), // 模拟3周前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(504)), // 实时描述
        likes: 6,
        comments: 2,
        isLiked: false
    },
    {
        id: 4,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '疯狂动物城 2 电影 11 月来啦',
        images: [],
        category: '艺术文化',
        rawTime: TimeUtils.getPastTime(720), // 模拟1个月前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(720)), // 实时描述
        likes: 8,
        comments: 1,
        isLiked: false
    },
    {
        id: 3,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '发国庆祝福时发现有一百多个单删我了。真正值得的人,会留在你的生活里;删掉你的人,也是在帮你腾出空间给更合拍的人;能坦诚交流、愿意回应的人才最值得投入精力。',
        images: [],
        category: '情感表达',
        rawTime: TimeUtils.getPastTime(720), // 模拟1个月前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(720)), // 实时描述
        likes: 13,
        comments: 5,
        isLiked: false
    },
    {
        id: 2,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '真挤,回来时 504 人真多🥵,应该 16 点就出发的',
        images: [],
        category: '生活日常',
        rawTime: TimeUtils.getPastTime(720), // 模拟1个月前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(720)), // 实时描述
        likes: 3,
        comments: 0,
        isLiked: false
    },
    {
        id: 1,
        username: '狂客同学',
        avatar: 'images/favicon.ico', // 统一头像
        content: '好好好,Claude 也赶中国国庆发模型的节奏',
        images: ['https://picsum.photos/400/300?random=100'],
        category: '科技数码',
        rawTime: TimeUtils.getPastTime(720), // 模拟1个月前
        timestamp: TimeUtils.formatRealTime(TimeUtils.getPastTime(720)), // 实时描述
        likes: 10,
        comments: 2,
        isLiked: false
    }
];

// ==================== 全局暴露（保持与script.js兼容） ====================
if (typeof window !== 'undefined') {
    window.TimeUtils = TimeUtils; // 暴露时间工具函数（可选扩展）
    window.localMomentsData = localMomentsData;
    window.MomentsData = MomentsData;
    window.momentsData = new MomentsData();
    console.log('朋友圈数据加载完成（头像统一+实时时间）:', localMomentsData.length, '条记录');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TimeUtils,
        MomentsData,
        localMomentsData
    };
}
