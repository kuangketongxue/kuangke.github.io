// moments-data.js - 朋友圈数据管理
class MomentsData {
    constructor() {
        this.className = 'Moments';
    }

    // 获取所有朋友圈数据
    async getAllMoments() {
        try {
            const query = new AV.Query(this.className);
            query.descending('createdAt');
            query.include('author');
            const results = await query.find();
            
            // 如果Moments表为空，从_User表获取数据作为示例
            if (results.length === 0) {
                return await this.getUserMoments();
            }
            
            return this.formatMoments(results);
        } catch (error) {
            console.error('获取朋友圈数据失败:', error);
            // 如果Moments表不存在，从_User表获取
            return await this.getUserMoments();
        }
    }

    // 从_User表获取用户数据作为朋友圈内容
    async getUserMoments() {
        try {
            const query = new AV.Query('_User');
            const users = await query.find();
            
            return users.map((user, index) => {
                const userData = user.toJSON();
                return {
                    id: userData.objectId,
                    username: userData.username || '用户' + (index + 1),
                    avatar: userData.avatar || 'images/avatar-default.jpg',
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
                avatar: 'images/avatar-default.jpg',
                content: '欢迎使用狂客·银河朋友圈！这里可以分享你的生活点滴。',
                images: [],
                category: '生活日常',
                timestamp: '刚刚',
                likes: 0,
                comments: 0,
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
            const query = new AV.Query(this.className);
            if (category !== 'all') {
                query.equalTo('category', category);
            }
            query.descending('createdAt');
            query.include('author');
            const results = await query.find();
            
            if (results.length === 0) {
                // 如果Moments表为空，从用户数据中筛选
                const userMoments = await this.getUserMoments();
                return category === 'all' ? userMoments : 
                    userMoments.filter(moment => moment.category === category);
            }
            
            return this.formatMoments(results);
        } catch (error) {
            console.error('按分类获取数据失败:', error);
            const userMoments = await this.getUserMoments();
            return category === 'all' ? userMoments : 
                userMoments.filter(moment => moment.category === category);
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
                avatar: author.avatar || 'images/avatar-default.jpg',
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
            const moment = AV.Object.createWithoutData(this.className, momentId);
            moment.increment('likes');
            await moment.save();
            return true;
        } catch (error) {
            console.error('点赞失败:', error);
            return false;
        }
    }

    // 取消点赞
    async unlikeMoment(momentId) {
        try {
            const moment = AV.Object.createWithoutData(this.className, momentId);
            moment.increment('likes', -1);
            await moment.save();
            return true;
        } catch (error) {
            console.error('取消点赞失败:', error);
            return false;
        }
    }

    // 创建新的朋友圈
    async createMoment(content, images = [], category = '生活日常') {
        try {
            const Moment = AV.Object.extend(this.className);
            const moment = new Moment();
            
            moment.set('content', content);
            moment.set('images', images);
            moment.set('category', category);
            moment.set('likes', 0);
            moment.set('commentCount', 0);
            
            // 如果用户已登录，设置为作者
            const currentUser = AV.User.current();
            if (currentUser) {
                moment.set('author', currentUser);
            }
            
            await moment.save();
            return moment.toJSON();
        } catch (error) {
            console.error('创建朋友圈失败:', error);
            throw error;
        }
    }
}

// 创建全局实例
window.momentsData = new MomentsData();

// 创建全局实例
window.momentsData = new MomentsData();
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
     {
        id: 21,
        content: '无人扶我青云志,我自踏雪至山巅。\n若是命中无此运,孤身亦可登昆仑。\n红尘赠我三尺剑,酒看瘦马一世街。\n世人朝路乃绝润,独见众生止步前。\n海到尽头天作岸,山登绝顶我为峰。\n如若东山能再起,大鹏展翅九万里。\n一入红尘梦易真,一朝悟透心境名。\n一朝悟道见真我,昔日枷锁皆云烟。\n天门将至百运开,拂尘轻笑问仙来。',
        value: 5,
        category: '问答互动',
        time: '2025-10-14 13:16',
        image: '',
        likes: 0,
        comments: []
    },
      {
        id: 20,
        content: '生活标准这个东西，最好就是以年为单位去考量，且很长时间都不要发生改变，这个标准是我的被动收入——我的另一个我不用我操心的，能够过的生活。',
        value: 5,
        category: '财经理财',
        time: '2025-10-13 22:40',
        image: '',
        likes: 0,
        comments: []
    },
     {
        id: 19,
        content: 'The journey is the reward.',
        value: 5,
        category: '工作相关',
        time: '2025-10-12 15:04',
        image: 'images/The process itself is the reward.',
        likes: 0,
        comments: []
    },
     {
        id: 18,
        content: '当海盗，不要当海军 ，像侠盗一样行事：既为自己的工作感到自豪，又愿意去窃取别人的灵感，快速行动，做成事情',
        value: 5,
        category: '工作相关',
        time: '2025-10-12 15:04',
        image: '',
        likes: 0,
        comments: []
    },
     {
        id: 17,
        content: '本来已经看着一辆公交车走了（要再等15分钟）结果没一会就来了，哇~哇~哇~，当时感受💗',
        value: 0,
        category: '生活日常',
        time: '2025-10-12 9:50',
        image: '',
        likes: 0,
        comments: []
    },
     {
        id: 16,
        content: '值得关注的外部，事实上很少，因为外部的绝大多数事情与提高自身生产效率毫无关系，毕竟我的所有财富,不管是物质财富还是精神财富,全来自我的时间,或者准确地讲,来自我的时间的体积。我哪有什么时间可以浪费呢?又有什么道理浪费在它们身上呢?时时刻刻专注提高效率才是正事',
        value: 5,
        category: '工作相关',
        time: '2025-10-11 22:50',
        image: '',
        likes: 0,
        comments: []
    },
    {
        id: 15,
        content: '从一开始就建立严格的筛选机制,尽量只挑值得做很久很久的事。仅此一条,就能引发天壤之别。因为一上来选的就是值得做很久很久的事,所以,自然而然地只能长期践行。又因为的确做了很久,自然有积累,自然有改良,效率自然有发展',
        value: 5,
        category: '工作相关',
        time: '2025-10-11 22:50',
        image: '',
        likes: 0,
        comments: []
    },
     {
        id: 14,
        content: '当你感觉你去参与这个东西的时候，有很大的负担，甚至要到负债的级别就不要报了，哪怕他是一个真正有用的东西；超过 200 元的花费，提供全面的信息给 ai ，让他帮你避坑',
        value: 5,
        category: '工作相关',
        time: '2025-10-11 22:49',
        image: '',
        likes: 0,
        comments: []
    },
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
