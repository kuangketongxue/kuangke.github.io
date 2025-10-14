import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Parser from 'rss-parser';
import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AINewsUpdater {
    constructor() {
        this.newsFile = path.join(__dirname, '../data/ai-news.json');
        this.parser = new Parser({
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        // RSS源配置
        this.rssSources = [
            {
                name: 'OpenAI Blog',
                url: 'https://openai.com/blog/rss.xml',
                category: '大语言模型',
                enabled: true
            },
            {
                name: 'Google AI Blog',
                url: 'https://blog.research.google/feeds/posts/default?alt=rss',
                category: '研究突破',
                enabled: true
            },
            {
                name: 'DeepMind',
                url: 'https://www.deepmind.com/blog/rss.xml',
                category: '研究突破',
                enabled: true
            },
            {
                name: 'MIT News - AI',
                url: 'https://news.mit.edu/rss/topic/artificial-intelligence2',
                category: 'AI应用',
                enabled: true
            },
            {
                name: 'NVIDIA AI Blog',
                url: 'https://blogs.nvidia.com/feed/',
                category: '行业动态',
                enabled: true
            },
            {
                name: 'Hugging Face Blog',
                url: 'https://huggingface.co/blog/feed.xml',
                category: '大语言模型',
                enabled: true
            },
            {
                name: 'Towards Data Science',
                url: 'https://towardsdatascience.com/feed',
                category: 'AI应用',
                enabled: true
            }
        ];
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

    // 从RSS源抓取文章
    async fetchFromRSS(source) {
        console.log(`📡 正在抓取: ${source.name}`);
        try {
            const feed = await this.parser.parseURL(source.url);
            const articles = [];

            // 只取最新3篇
            const items = feed.items.slice(0, 3);
            
            for (const item of items) {
                const article = {
                    id: this.generateId(item.title),
                    title: this.cleanTitle(item.title),
                    description: this.cleanDescription(item.contentSnippet || item.content || item.description),
                    category: source.category,
                    date: this.formatDate(item.pubDate || item.isoDate),
                    source: source.name,
                    link: item.link,
                    image: this.extractImage(item)
                };

                // 只添加有效文章
                if (article.title && article.description) {
                    articles.push(article);
                }
            }

            console.log(`✅ ${source.name}: 成功获取 ${articles.length} 篇文章`);
            return articles;

        } catch (error) {
            console.error(`❌ ${source.name} 抓取失败:`, error.message);
            return [];
        }
    }

    // 从News API抓取（可选）
    async fetchFromNewsAPI() {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            console.log('⚠️ 未配置News API，跳过');
            return [];
        }

        console.log('📡 正在从News API抓取...');
        
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

            const articles = response.data.articles.map((article, i) => ({
                id: Date.now() + i,
                title: this.cleanTitle(article.title),
                description: this.cleanDescription(article.description),
                category: '行业动态',
                date: this.formatDate(article.publishedAt),
                source: article.source.name,
                link: article.url,
                image: article.urlToImage || this.getRandomAIImage()
            }));

            console.log(`✅ News API: 成功获取 ${articles.length} 篇文章`);
            return articles;

        } catch (error) {
            console.error('❌ News API 抓取失败:', error.message);
            return [];
        }
    }

    // 清理标题
    cleanTitle(title) {
        if (!title) return '';
        return title
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 100);
    }

    // 清理描述
    cleanDescription(description) {
        if (!description) return '';
        return description
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200) + '...';
    }

    // 格式化日期
    formatDate(dateString) {
        if (!dateString) return new Date().toISOString().split('T')[0];
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
        return date.toISOString().split('T')[0];
    }

    // 生成唯一ID
    generateId(title) {
        const hash = title.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        return Math.abs(hash);
    }

    // 提取图片
    extractImage(item) {
        const imageFields = [
            item.enclosure?.url,
            item['media:content']?.$?.url,
            item['media:thumbnail']?.$?.url,
            item.image?.url
        ];

        for (const url of imageFields) {
            if (url && this.isValidImageUrl(url)) {
                return url;
            }
        }

        return this.getRandomAIImage();
    }

    // 验证图片URL
    isValidImageUrl(url) {
        if (!url) return false;
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const urlLower = url.toLowerCase();
        return validExtensions.some(ext => urlLower.includes(ext)) || 
               urlLower.includes('image') ||
               urlLower.includes('unsplash');
    }

    // 主更新函数
    async updateNews() {
        console.log('\n🚀 ===== AI资讯自动更新开始 =====');
        console.log('📅 更新时间:', new Date().toLocaleString('zh-CN'));
        console.log('');

        try {
            // 读取现有数据
            let existingNews = [];
            if (fs.existsSync(this.newsFile)) {
                const data = fs.readFileSync(this.newsFile, 'utf8');
                existingNews = JSON.parse(data);
                console.log(`📂 已加载现有资讯: ${existingNews.length} 条`);
            }

            // 从所有启用的源抓取
            const allArticles = [];
            const enabledSources = this.rssSources.filter(s => s.enabled);
            
            console.log(`\n🌐 准备从 ${enabledSources.length} 个RSS源抓取资讯...\n`);

            for (const source of enabledSources) {
                const articles = await this.fetchFromRSS(source);
                allArticles.push(...articles);
                
                // 避免请求过快
                await this.sleep(1000);
            }

            // 尝试从News API抓取（如果配置了）
            const newsApiArticles = await this.fetchFromNewsAPI();
            allArticles.push(...newsApiArticles);

            console.log(`\n📊 本次共抓取: ${allArticles.length} 篇新文章`);

            // 合并并去重
            const mergedNews = [...allArticles, ...existingNews];
            const uniqueNews = this.removeDuplicates(mergedNews);
            
            // 按日期排序，保留最新60条
            const sortedNews = uniqueNews
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 60);

            // 保存到文件
            fs.writeFileSync(
                this.newsFile,
                JSON.stringify(sortedNews, null, 2),
                'utf8'
            );

            console.log('\n✅ ===== 更新完成 =====');
            console.log(`📈 总资讯数: ${sortedNews.length} 条`);
            console.log(`🆕 新增资讯: ${allArticles.length} 条`);
            console.log(`🗑️  去重移除: ${mergedNews.length - uniqueNews.length} 条`);
            console.log('');

            // 生成统计报告
            this.generateReport(sortedNews);

        } catch (error) {
            console.error('\n❌ ===== 更新失败 =====');
            console.error('错误信息:', error.message);
            console.error('');
            throw error;
        }
    }

    // 去重
    removeDuplicates(articles) {
        const seen = new Map();
        return articles.filter(article => {
            const key = this.normalizeTitle(article.title);
            if (seen.has(key)) {
                return false;
            }
            seen.set(key, true);
            return true;
        });
    }

    // 标准化标题用于去重
    normalizeTitle(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // 生成统计报告
    generateReport(news) {
        const categories = {};
        const sources = {};

        news.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
            sources[item.source] = (sources[item.source] || 0) + 1;
        });

        console.log('📊 ===== 分类统计 =====');
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                console.log(`   ${cat}: ${count} 条`);
            });

        console.log('\n📰 ===== 来源统计 =====');
        Object.entries(sources)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([source, count]) => {
                console.log(`   ${source}: ${count} 条`);
            });
        console.log('');
    }

    // 延迟函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 执行更新
const updater = new AINewsUpdater();
updater.updateNews()
    .then(() => {
        console.log('🎉 程序执行完成\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 程序执行失败\n');
        process.exit(1);
    });
