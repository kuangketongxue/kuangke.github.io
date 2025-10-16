// moments-data.js - 朋友圈数据管理

// ==================== LeanCloud 数据管理 ====================
class MomentsData {
    constructor() {
        this.className = 'Moments';
    }

    // 获取所有朋友圈数据
    async getAllMoments() {
        try {
            // 优先使用本地数据
            if (window.localMomentsData && window.localMomentsData.length > 0) {
                console.log('使用本地朋友圈数据');
                return window.localMomentsData;
            }

            // 如果没有本地数据，尝试从LeanCloud获取
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
                console.log('LeanCloud未初始化，使用默认数据');
                return this.getDefaultMoments();
            }
        } catch (error) {
            console.error('获取朋友圈数据失败:', error);
            return this.getDefaultMoments();
        }
    }

    // 从_User表获取用户数据作为朋友圈内容
    async getUserMoments() {
        try {
            if (typeof AV === 'undefined') {
                return this.getDefaultMoments();
            }

            const query = new AV.Query('_User');
            const users = await query.find();
            
            return users.map((user, index) => {
                const userData = user.toJSON();
                return {
                    id: userData.objectId || `user-${index}`,
                    username: userData.username || '用户' + (index + 1),
                    avatar: userData.avatar || 'https://picsum.photos/100/100?random=' + index,
                    content: userData.bio || '这是我的第一条朋友圈！',
                    images: userData.images || [],
                    category: this.getRandomCategory(),
                    timestamp: this.formatTime(userData.createdAt),
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

    // 获取默认朋友圈数据
    getDefaultMoments() {
        return [
            {
                id: 'default-1',
                username: '狂客同学',
                avatar: 'https://picsum.photos/100/100?random=100',
                content: '🌟 欢迎来到狂客·银河朋友圈！\n\n这里是分享生活点滴、记录美好时光的地方。无论是日常琐事、学习心得还是旅行见闻，都可以在这里分享。\n\n让我们一起在这片星空中，记录属于自己的精彩瞬间！✨',
                images: [],
                category: '生活日常',
                timestamp: '刚刚',
                likes: 42,
                comments: 8,
                isLiked: false
            }
        ];
    }

    // 随机获取分类
    getRandomCategory() {
        const categories = ['生活日常', '美食分享', '旅行见闻', '工作相关', '学习成长'];
        return categories[Math.floor(Math.random() * categories.length)];
    }

    // 根据分类获取朋友圈数据
    async getMomentsByCategory(category) {
        try {
            // 优先使用本地数据
            if (window.localMomentsData && window.localMomentsData.length > 0) {
                if (category === 'all') {
                    return window.localMomentsData;
                } else {
                    return window.localMomentsData.filter(moment => moment.category === category);
                }
            }

            // 尝试从LeanCloud获取
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

    // 格式化朋友圈数据
    formatMoments(results) {
        return results.map(item => {
            const data = item.toJSON();
            const author = data.author || {};
            
            return {
                id: data.objectId,
                username: author.username || '匿名用户',
                avatar: author.avatar || 'https://picsum.photos/100/100?random=default',
                content: data.content || '分享了一条内容',
                images: data.images || [],
                category: data.category || '生活日常',
                timestamp: this.formatTime(data.createdAt),
                likes: data.likes || 0,
                comments: data.commentCount || 0,
                isLiked: false
            };
        });
    }

    // 格式化时间
    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
        
        return date.toLocaleDateString('zh-CN');
    }

    // 点赞
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

    // 取消点赞
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

    // 创建新的朋友圈
    async createMoment(content, images = [], category = '生活日常') {
        try {
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
                return moment.toJSON();
            }
            return null;
        } catch (error) {
            console.error('创建朋友圈失败:', error);
            throw error;
        }
    }
}

// ==================== 本地朋友圈数据 ====================
const localMomentsData = [
    {
        id: 22,
        username: '狂客同学',
        avatar: 'images/favicon.ico',
        content: '马斯克与弗里费德曼的播客不错-https://youtu.be/JN3KPFbWCy8?si=z0HMVS7Jw-GSO5zC',
        images: [],
        category: '问答互动',
        timestamp: '2小时前',
        likes: 5,
        comments: 0,
        isLiked: false
    },
    {
        id: 21,
        username: '狂客同学',
        avatar: 'images/favicon.ico',
        content: '无人扶我青云志,我自踏雪至山巅。\n若是命中无此运,孤身亦可登昆仑。\n红尘赠我三尺剑,酒看瘦马一世街。\n世人朝路乃绝润,独见众生止步前。\n海到尽头天作岸,山登绝顶我为峰。\n如若东山能再起,大鹏展翅九万里。\n一入红尘梦易真,一朝悟透心境名。\n一朝悟道见真我,昔日枷锁皆云烟。\n天门将至百运开,拂尘轻笑问仙来。',
        images: [],
        category: '问答互动',
        timestamp: '6小时前',
        likes: 8,
        comments: 2,
        isLiked: false
    },
    {
        id: 20,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=20',
        content: '生活标准这个东西，最好就是以年为单位去考量，且很长时间都不要发生改变，这个标准是我的被动收入——我的另一个我不用我操心的，能够过的生活。',
        images: [],
        category: '财经理财',
        timestamp: '1天前',
        likes: 12,
        comments: 3,
        isLiked: false
    },
    {
        id: 19,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=19',
        content: 'The journey is the reward.',
        images: [],
        category: '工作相关',
        timestamp: '2天前',
        likes: 6,
        comments: 1,
        isLiked: false
    },
    {
        id: 18,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=18',
        content: '当海盗，不要当海军 ，像侠盗一样行事：既为自己的工作感到自豪，又愿意去窃取别人的灵感，快速行动，做成事情',
        images: [],
        category: '工作相关',
        timestamp: '2天前',
        likes: 9,
        comments: 2,
        isLiked: false
    },
    {
        id: 17,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=17',
        content: '本来已经看着一辆公交车走了（要再等15分钟）结果没一会就来了，哇~哇~哇~，当时感受💗',
        images: [],
        category: '生活日常',
        timestamp: '3天前',
        likes: 3,
        comments: 0,
        isLiked: false
    },
    {
        id: 16,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=16',
        content: '值得关注的外部，事实上很少，因为外部的绝大多数事情与提高自身生产效率毫无关系，毕竟我的所有财富,不管是物质财富还是精神财富,全来自我的时间,或者准确地讲,来自我的时间的体积。我哪有什么时间可以浪费呢?又有什么道理浪费在它们身上呢?时时刻刻专注提高效率才是正事',
        images: [],
        category: '工作相关',
        timestamp: '3天前',
        likes: 15,
        comments: 4,
        isLiked: false
    },
    {
        id: 15,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=15',
        content: '从一开始就建立严格的筛选机制,尽量只挑值得做很久很久的事。仅此一条,就能引发天壤之别。因为一上来选的就是值得做很久很久的事,所以,自然而然地只能长期践行。又因为的确做了很久,自然有积累,自然有改良,效率自然有发展',
        images: [],
        category: '工作相关',
        timestamp: '4天前',
        likes: 18,
        comments: 5,
        isLiked: false
    },
    {
        id: 14,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=14',
        content: '当你感觉你去参与这个东西的时候，有很大的负担，甚至要到负债的级别就不要报了，哪怕他是一个真正有用的东西；超过 200 元的花费，提供全面的信息给 ai ，让他帮你避坑',
        images: [],
        category: '工作相关',
        timestamp: '4天前',
        likes: 11,
        comments: 2,
        isLiked: false
    },
    {
        id: 13,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=13',
        content: '哪有那么多天时地利人和都比不过两个字,勤奋。幸运没那么重要,如果还看幸运,说明你还不够勤奋',
        images: [],
        category: '工作相关',
        timestamp: '5天前',
        likes: 22,
        comments: 6,
        isLiked: false
    },
    {
        id: 12,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=12',
        content: '生活黑客都说了,凡是有系统一定有 bug,正常人才会去排队,你黑客都是找 bug 就直接进去了。确实这个世界所谓的炒台班子是哪哪都是千疮百孔的,你正儿八经排队就能排到猴年马月去。你要是不想排队的话,哪有洞你都可以钻进去',
        images: [],
        category: '生活日常',
        timestamp: '5天前',
        likes: 7,
        comments: 1,
        isLiked: false
    },
    {
        id: 11,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=11',
        content: '用来替代自己的另一个"我"所产生的稳定现金流对应的数值,就是衡量自己配得上什么的标准',
        images: [],
        category: '财经理财',
        timestamp: '6天前',
        likes: 14,
        comments: 3,
        isLiked: false
    },
    {
        id: 10,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=10',
        content: '你可能没有那么潮,但是没有人可以讲你错,如果你没错,那你就可以按照自己的想法,让自己在自己的世界观里面足够的对,且对很久很久——等我几年后,无压力拿下它;成为有能力严肃面对严肃问题的人,成为不依托于群体娱乐化共识的独立精彩有趣的人(eg.Kanye)',
        images: [],
        category: '工作相关',
        timestamp: '1周前',
        likes: 19,
        comments: 4,
        isLiked: false
    },
    {
        id: 9,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=9',
        content: '以项目为导向,明确要解决的问题和创造的价值,缺什么学什么,能提高学习的针对性和效率。出一本教材:框架搭建、内容补充、风格打磨、案例整理、排版设计。先确定项目目标和结果,再推导所需学习内容。',
        images: [],
        category: '工作相关',
        timestamp: '1周前',
        likes: 16,
        comments: 2,
        isLiked: false
    },
    {
        id: 8,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=8',
        content: '正常工作者用年富力强的35年赚钱覆盖一生80年,去除节假日和不能出售时间,真正用于改变自己生活的出售时间一年仅10.5天(3652/3【节假日】*1/3【每天工作时长】*1/2【受教育成本】*1/4【家庭】);很多人因出售时间少难以改命,而增加工作时间能提升竞争力和收入。',
        images: [],
        category: '工作相关',
        timestamp: '2周前',
        likes: 25,
        comments: 8,
        isLiked: false
    },
    {
        id: 7,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=7',
        content: '今天 8:15 到的市图书馆,已经有 4 个人在我前面了 😮',
        images: [],
        category: '生活日常',
        timestamp: '2周前',
        likes: 4,
        comments: 0,
        isLiked: false
    },
    {
        id: 6,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=6',
        content: '今天去图书馆学习,一堆学生在图书馆打游戏的,不安静💢',
        images: [],
        category: '生活日常',
        timestamp: '3周前',
        likes: 2,
        comments: 1,
        isLiked: false
    },
    {
        id: 5,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=5',
        content: '电脑充电线坏了,好在通过重新拆拼花了 3 个多小时解决了',
        images: [],
        category: '生活日常',
        timestamp: '3周前',
        likes: 6,
        comments: 2,
        isLiked: false
    },
    {
        id: 4,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=4',
        content: '疯狂动物城 2 电影 11 月来啦',
        images: [],
        category: '艺术文化',
        timestamp: '1个月前',
        likes: 8,
        comments: 1,
        isLiked: false
    },
    {
        id: 3,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=3',
        content: '发国庆祝福时发现有一百多个单删我了。真正值得的人,会留在你的生活里;删掉你的人,也是在帮你腾出空间给更合拍的人;能坦诚交流、愿意回应的人才最值得投入精力。',
        images: [],
        category: '情感表达',
        timestamp: '1个月前',
        likes: 13,
        comments: 5,
        isLiked: false
    },
    {
        id: 2,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=2',
        content: '真挤,回来时 504 人真多🥵,应该 16 点就出发的',
        images: [],
        category: '生活日常',
        timestamp: '1个月前',
        likes: 3,
        comments: 0,
        isLiked: false
    },
    {
        id: 1,
        username: '狂客同学',
        avatar: 'https://picsum.photos/100/100?random=1',
        content: '好好好,Claude 也赶中国国庆发模型的节奏',
        images: ['https://picsum.photos/400/300?random=100'],
        category: '科技数码',
        timestamp: '1个月前',
        likes: 10,
        comments: 2,
        isLiked: false
    }
];

// ==================== 全局暴露 ====================
// 浏览器环境
if (typeof window !== 'undefined') {
    // 暴露本地数据
    window.localMomentsData = localMomentsData;
    
    // 暴露LeanCloud数据管理类
    window.MomentsData = MomentsData;
    
    // 创建全局实例
    window.momentsData = new MomentsData();
    
    console.log('朋友圈数据加载完成:', localMomentsData.length, '条记录');
}

// Node.js环境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MomentsData,
        localMomentsData
    };
}
