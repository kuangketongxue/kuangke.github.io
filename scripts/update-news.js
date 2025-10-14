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
        
        // NewAPI配置
        this.newApiConfig = {
            apiKey: process.env.NEWAPI_KEY,
            baseUrl: process.env.NEWAPI_BASE_URL || 'https://api.openai.com/v1',
            model: process.env.NEWAPI_MODEL || 'gpt-4'
        };
        
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
            }
        ];
    }

    // 🆕 使用AI生成优质中文资讯
    async generateAINews() {
        if (!this.newApiConfig.apiKey) {
            console.log('⚠️ 未配置NEWAPI_KEY，跳过AI生成');
            return [];
        }

        console.log('\n🤖 ===== 开始AI生成资讯 =====');
        const today = new Date().toISOString().split('T')[0];
        
        const prompt = `作为AI领域资深分析师，请生成${today}的6条高质量AI前沿资讯。

要求：
1. 内容真实可信，基于近期AI领域的实际发展
2. 覆盖不同领域：大语言模型、计算机视觉、AI应用、AI伦理、研究突破、行业动态
3. 标题要吸引人且准确（20-40字）
4. 描述详细专业（120-180字），突出技术细节和影响
5. 来源要真实（OpenAI、Google、Meta、Stanford等知名机构）

严格按照以下JSON格式输出（不要任何额外说明）：
[
  {
    "title": "具体标题",
    "description": "详细描述，包含技术细节和影响分析",
    "category": "分类（从六个中选一）",
    "source": "来源机构"
  }
]`;

        try {
            const response = await axios.post(
                `${this.newApiConfig.baseUrl}/chat/completions`,
                {
                    model: this.newApiConfig.model,
                    messages: [
                        {
                            role: 'system',
                            content: '你是AI领域资深分析师，专注于提供最新、准确、深度的AI行业资讯。你的分析基于真实的技术发展和行业动态。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.8,
                    max_tokens: 4000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.newApiConfig.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const content = response.data.choices[0].message.content;
            console.log('📝 AI原始响应:\n', content.substring(0, 200) + '...');
            
            // 提取JSON
            const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (!jsonMatch) {
                throw new Error('无法从AI响应中提取JSON数据');
            }

            const aiNews = JSON.parse(jsonMatch[0]);
            
            // 为AI生成的资讯添加完整字段
            const processedNews = aiNews.map((item, index) => ({
                id: Date.now() + index,
                title: item.title,
                description: item.description,
                category: item.category,
                date: today,
                source: item.source,
                link: `#ai-news-${Date.now() + index}`,
                image: this.getRandomAIImage(),
                isAIGenerated: true  // 标记为AI生成
            }));

            console.log(`✅ AI成功生成 ${processedNews.length} 条资讯`);
            return processedNews;

        } catch (error) {
            console.error('❌ AI生成失败:', error.message);
            if (error.response) {
                console.error('API响应错误:', error.response.data);
            }
            return [];
        }
    }

    // 🆕 AI优化RSS文章（翻译+润色）
    async enhanceArticleWithAI(article) {
        if (!this.newApiConfig.apiKey) {
            return article;
        }

        try {
            const prompt = `请将以下英文AI资讯优化为中文：

标题: ${article.title}
描述: ${article.description}

要求：
1. 翻译成专业、流畅的简体中文
2. 保持技术准确性
3. 标题简洁有力（20-40字）
4. 描述详细专业（120-180字）

输出JSON格式：
{
  "title": "中文标题",
  "description": "中文描述"
}`;

            const response = await axios.post(
                `${this.newApiConfig.baseUrl}/chat/completions`,
                {
                    model: this.newApiConfig.model,
                    messages: [
                        { role: 'system', content: '你是专业的AI技术翻译和内容优化专家。' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 800
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.newApiConfig.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            const content = response.data.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const enhanced = JSON.parse(jsonMatch[0]);
                return {
                    ...article,
                    title: enhanced.title,
                    description: enhanced.description,
                    isEnhanced: true
                };
            }
        } catch (error) {
            console.log(`⚠️ ${article.source} 文章优化失败，使用原文`);
        }

        return article;
    }

    // 获取随机AI图片
    getRandomAIImage() {
        const images = [
            'https://images.unsplash.com/photo-1677442136019-21780ecad995',
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
            'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
            'https://images.unsplash.com/photo-1677756119517-756a188d2d94',
            'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea',
            'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1',
            'https://images.unsplash.com/photo-1655720828018-edd2daec9349'
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
            
            // 只取最新2篇（减少数量，因为有AI生成补充）
            const items = feed.items.slice(0, 2);
            
            for (const item of items) {
                const article = {
                    id: this.generateId(item.title),
                    title: this.cleanTitle(item.title),
                    description: this.cleanDescription(item.contentSnippet || item.content || item.description),
                    category: source.category,
                    date: this.formatDate(item.pubDate || item.isoDate),
                    source: source.name,
                    link: item.link,
                    image: this.extractImage(item),
                    isRSS: true
                };
                
                if (article.title && article.description) {
                    // 🆕 使用AI优化RSS文章
                    const enhanced = await this.enhanceArticleWithAI(article);
                    articles.push(enhanced);
                    await this.sleep(500); // 避免API限流
                }
            }
            
            console.log(`✅ ${source.name}: 成功获取并优化 ${articles.length} 篇文章`);
            return articles;
            
        } catch (error) {
            console.error(`❌ ${source.name} 抓取失败:`, error.message);
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
            .substring(0, 150);
    }

    // 清理描述
    cleanDescription(description) {
        if (!description) return '';
        return description
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 300);
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

    // 🆕 主更新函数（整合RSS和AI）
    async updateNews() {
        console.log('\n🚀 ===== AI资讯智能更新系统 =====');
        console.log('📅 更新时间:', new Date().toLocaleString('zh-CN'));
        console.log('🤖 模式: RSS抓取 + AI生成 + AI优化');
        console.log('');

        try {
            // 读取现有数据
            let existingNews = [];
            if (fs.existsSync(this.newsFile)) {
                const data = fs.readFileSync(this.newsFile, 'utf8');
                existingNews = JSON.parse(data);
                console.log(`📂 已加载现有资讯: ${existingNews.length} 条`);
            }

            const allArticles = [];

            // 1️⃣ AI生成高质量资讯（优先）
            console.log('\n--- 第一步：AI生成原创资讯 ---');
            const aiGeneratedNews = await this.generateAINews();
            allArticles.push(...aiGeneratedNews);

            // 2️⃣ RSS抓取真实资讯（补充）
            console.log('\n--- 第二步：RSS抓取并AI优化 ---');
            const enabledSources = this.rssSources.filter(s => s.enabled);
            console.log(`🌐 准备从 ${enabledSources.length} 个RSS源抓取...\n`);
            
            for (const source of enabledSources) {
                const articles = await this.fetchFromRSS(source);
                allArticles.push(...articles);
                await this.sleep(1000);
            }

            console.log(`\n📊 本次共获取: ${allArticles.length} 篇资讯`);
            console.log(`   - AI生成: ${aiGeneratedNews.length} 篇`);
            console.log(`   - RSS抓取: ${allArticles.length - aiGeneratedNews.length} 篇`);

            // 3️⃣ 合并去重
            const mergedNews = [...allArticles, ...existingNews];
            const uniqueNews = this.removeDuplicates(mergedNews);

            // 4️⃣ 智能排序（AI生成的优先）
            const sortedNews = uniqueNews
                .sort((a, b) => {
                    // AI生成的优先
                    if (a.isAIGenerated && !b.isAIGenerated) return -1;
                    if (!a.isAIGenerated && b.isAIGenerated) return 1;
                    // 否则按日期排序
                    return new Date(b.date) - new Date(a.date);
                })
                .slice(0, 50); // 保留最新50条

            // 5️⃣ 保存到文件
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
            .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 保留中文字符
            .replace(/\s+/g, ' ')
            .trim();
    }

    // 🆕 增强的统计报告
    generateReport(news) {
        const categories = {};
        const sources = {};
        let aiCount = 0;
        let rssCount = 0;
        let enhancedCount = 0;

        news.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
            sources[item.source] = (sources[item.source] || 0) + 1;
            if (item.isAIGenerated) aiCount++;
            if (item.isRSS) rssCount++;
            if (item.isEnhanced) enhancedCount++;
        });

        console.log('📊 ===== 分类统计 =====');
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                const bar = '█'.repeat(Math.ceil(count / 2));
                console.log(`  ${cat.padEnd(12)} ${bar} ${count} 条`);
            });

        console.log('\n📰 ===== 来源统计 =====');
        Object.entries(sources)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .forEach(([source, count]) => {
                console.log(`  ${source.padEnd(25)} ${count} 条`);
            });

        console.log('\n🔍 ===== 内容来源分析 =====');
        console.log(`  🤖 AI原创生成: ${aiCount} 条`);
        console.log(`  📡 RSS源抓取: ${rssCount} 条`);
        console.log(`  ✨ AI优化翻译: ${enhancedCount} 条`);
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
