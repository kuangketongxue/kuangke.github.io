import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AINewsUpdater {
    constructor() {
        this.newsFile = path.join(__dirname, '../data/ai-news.json');
    }

    // 获取随机AI图片
    getRandomAIImage() {
        const images = [
            'https://images.unsplash.com/photo-1677442136019-21780ecad995',
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
            'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
            'https://images.unsplash.com/photo-1677756119517-756a188d2d94',
            'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea'
        ];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        return `${randomImage}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`;
    }

    // 生成新资讯（模拟数据）
    generateNews() {
        const categories = ['大语言模型', '计算机视觉', 'AI应用', 'AI伦理', '研究突破', '行业动态'];
        const sources = ['OpenAI', 'Google Research', 'DeepMind', 'MIT', 'Stanford', 'Nature', 'Science'];
        
        const titles = [
            'AI大模型在科学研究中取得重大突破',
            '新型神经网络架构提升效率300%',
            '多模态AI助力医疗诊断精准化',
            '开源AI工具赋能中小企业数字化转型',
            '量子计算与AI结合开启新纪元',
            'AI伦理框架获国际认可',
            '计算机视觉技术在自动驾驶领域新进展',
            '对话式AI改变用户交互体验'
        ];

        const descriptions = [
            '研究团队成功开发出新一代AI系统，在复杂任务处理和推理能力上取得显著提升，为人工通用智能发展铺平道路。',
            '最新研究表明，通过创新性架构设计和训练策略优化，AI模型性能大幅提升，同时能耗降低60%以上。',
            '融合多源数据的AI分析平台展现出强大能力，在预测准确性和决策支持方面超越传统方法。',
            '新技术使AI更加易用和可解释，降低应用门槛，推动各行业智能化升级和创新发展。'
        ];

        const newsItems = [];
        const now = new Date();
        
        for (let i = 0; i < 3; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            newsItems.push({
                id: Date.now() + i,
                title: titles[Math.floor(Math.random() * titles.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                category: categories[Math.floor(Math.random() * categories.length)],
                date: date.toISOString().split('T')[0],
                source: sources[Math.floor(Math.random() * sources.length)],
                image: this.getRandomAIImage()
            });
        }
        
        return newsItems;
    }

    // 主更新函数
    async updateNews() {
        console.log('🚀 开始更新AI资讯...');
        console.log('📅', new Date().toLocaleString('zh-CN'));

        try {
            // 读取现有数据
            let existingNews = [];
            if (fs.existsSync(this.newsFile)) {
                const data = fs.readFileSync(this.newsFile, 'utf8');
                existingNews = JSON.parse(data);
            }

            // 生成新资讯
            const newArticles = this.generateNews();
            
            // 合并并去重
            const allNews = [...newArticles, ...existingNews];
            const uniqueNews = this.removeDuplicates(allNews);
            
            // 按日期排序，保留最新50条
            const sortedNews = uniqueNews
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 50);

            // 保存
            fs.writeFileSync(
                this.newsFile,
                JSON.stringify(sortedNews, null, 2),
                'utf8'
            );

            console.log(`✅ 更新完成！共 ${sortedNews.length} 条资讯`);
            console.log(`📊 新增 ${newArticles.length} 条资讯`);
            
        } catch (error) {
            console.error('❌ 更新失败:', error);
            process.exit(1);
        }
    }

    // 去重
    removeDuplicates(articles) {
        const seen = new Set();
        return articles.filter(article => {
            const key = article.title.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
}

// 执行
const updater = new AINewsUpdater();
updater.updateNews();
import dotenv from 'dotenv';
dotenv.config();

// 在类中添加此方法
async fetchFromNewsAPI() {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        console.log('⚠️ 未配置News API，跳过');
        return [];
    }

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'artificial intelligence OR machine learning OR ChatGPT OR GPT',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 10,
                apiKey: apiKey
            }
        });

        return response.data.articles.map((article, i) => ({
            id: Date.now() + i,
            title: this.cleanTitle(article.title),
            description: this.cleanDescription(article.description),
            category: '行业动态',
            date: this.formatDate(article.publishedAt),
            source: article.source.name,
            link: article.url,
            image: article.urlToImage || this.getRandomAIImage()
        }));

    } catch (error) {
        console.error('News API 抓取失败:', error.message);
        return [];
    }
}

// 在 updateNews 方法中调用
const newsApiArticles = await this.fetchFromNewsAPI();
allArticles.push(...newsApiArticles);
