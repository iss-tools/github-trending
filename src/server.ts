import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const app = express();
const PORT = process.env.PORT || 3001;

// Setup marked extensions
marked.use(markedKatex({ throwOnError: false }));

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Expose marked to all templates
app.locals.marked = marked;

// Static assets
app.use(express.static(path.join(__dirname, '../public')));

// Helper to load JSON
const loadData = (filename: string) => {
    try {
        const filePath = path.join(__dirname, '../data', filename);
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch(e) {
        console.error('Error loading data:', filename, e);
    }
    return null;
};

// Routes
app.get('/', (req, res) => renderPage(req, res, 'all'));

app.get('/privacy', (req, res) => {
    const meta = loadData('meta.json') || { topTags: [], topStars: [], topAppearances: [] };
    res.render('layouts/main', {
        body: '../privacy',
        type: 'privacy',
        meta
    });
});

['daily', 'weekly', 'monthly'].forEach(type => {
    app.get(`/${type}`, (req, res) => {
        renderPage(req, res, type);
    });

    app.get(`/${type}/:date.html`, (req, res) => {
        renderPage(req, res, type, req.params.date);
    });
});

['tag', 'category', 'suitable', 'topic', 'language', 'keyword'].forEach(filterType => {
    app.get(`/${filterType}/:value.html`, (req, res) => {
        renderFilterPage(req, res, filterType, req.params.value);
    });
});

app.get('/repo/:owner/:name.html', (req, res) => {
    const { owner, name } = req.params;
    const repoName = `${owner}/${name}`;
    
    const data = loadData('all.json') || {};
    const meta = loadData('meta.json') || { topTags: [], topStars: [], topAppearances: [] };
    
    const list = data['all'] || [];
    const item = list.find((i: any) => i.repo === repoName);
    
    if (!item) {
        return res.status(404).send('Repository not found');
    }
    
    const seoTitle = `${item.repo} - GitHub 热门项目 AI 深度分析`;
    const summary = item.summaryData?.summary ? item.summaryData.summary.substring(0, 150).replace(/\n/g, ' ') : `查看 ${item.repo} 的详细 AI 总结。`;
    const seoDescription = summary;
    let keys = [item.repo, 'github', 'trending'];
    if (item.language) keys.push(item.language);
    if (item.summaryData?.tags) keys.push(...item.summaryData.tags);
    const seoKeywords = keys.join(', ');
    
    res.render('layouts/main', {
        body: '../repo',
        type: 'repo',
        item,
        meta,
        seoTitle,
        seoDescription,
        seoKeywords
    });
});

const renderPage = (req: express.Request, res: express.Response, type: string, pathDate?: string) => {
    const data = loadData(`${type}.json`) || {};
    const meta = loadData('meta.json') || { topTags: [], topStars: [], topAppearances: [] };
    
    // keys are dates (e.g. 20260101, 202635, or 'all')
    const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));
    
    let selectedDate = pathDate;
    if (type === 'all') {
        selectedDate = 'all';
    }
    
    const list = selectedDate && data[selectedDate] ? data[selectedDate] : [];
    const isListView = !selectedDate;
    
    // filter languages
    const langs = new Set<string>();
    list.forEach((i: any) => { if(i.language) langs.add(i.language) });
    const languages = Array.from(langs);
    
    const selectedLang = req.query.lang as string;
    const searchQuery = (req.query.q as string || '').toLowerCase().trim();
    
    let filteredList = list;
    
    if (selectedLang) {
        filteredList = filteredList.filter((i: any) => i.language === selectedLang);
    }
    
    if (searchQuery) {
        filteredList = filteredList.filter((i: any) => 
            i.repo.toLowerCase().includes(searchQuery) || 
            (i.description && i.description.toLowerCase().includes(searchQuery))
        );
    }
    
    // pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    let itemsPerPage = 10;
    let totalItems = 0;
    let totalPages = 1;
    let currentPage = 1;
    let paginatedList: any[] = [];
    let dateCards: any[] = [];
    
    if (isListView) {
        itemsPerPage = 20;
        totalItems = dates.length;
        totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        currentPage = Math.max(1, Math.min(page, totalPages));
        
        const paginatedDates = dates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        
        paginatedDates.forEach(dateStr => {
            const items = data[dateStr] || [];
            const langCounts: Record<string, number> = {};
            items.forEach((item: any) => {
                const lang = item.language || 'Unknown';
                langCounts[lang] = (langCounts[lang] || 0) + 1;
            });
            const langStats = Object.entries(langCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5) // top 5 languages
                                    .map(([lang, count]) => ({ lang, count }));
            dateCards.push({
                dateStr,
                total: items.length,
                langStats
            });
        });
    } else {
        if (type === 'all') {
            itemsPerPage = 10;
            totalItems = filteredList.length;
            totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
            currentPage = Math.max(1, Math.min(page, totalPages));
            paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        } else {
            // For specific date views (daily, weekly, monthly), show all items without pagination
            // so we can group them perfectly by language.
            itemsPerPage = filteredList.length || 20;
            totalItems = filteredList.length;
            totalPages = 1;
            currentPage = 1;
            paginatedList = filteredList;
        }
    }
    
    let seoTitle = 'GitHub 热门项目追踪 | Trending';
    let seoDescription = '本项目持续追踪 GitHub 上的热门开源项目，并提供由 AI 生成的深度总结与技术分析。';
    let seoKeywords = 'github, trending, ai, open source, 开源项目, 热门项目';

    if (type === 'daily' && pathDate) {
        seoTitle = `GitHub 今日热门 (${pathDate}) - 每日追踪`;
        seoDescription = `查看 ${pathDate} 的 GitHub 今日热门项目榜单，获取 AI 深度代码分析与架构拆解。`;
        seoKeywords = `github daily trending, ${pathDate}, 今日热门, github开源, AI分析`;
    } else if (type === 'weekly' && pathDate) {
        seoTitle = `GitHub 本周热门 (${pathDate}) - 每周追踪`;
        seoDescription = `查看 ${pathDate} 的 GitHub 本周热门项目榜单，获取本周最火开源项目的深度解析。`;
        seoKeywords = `github weekly trending, ${pathDate}, 本周热门, 开源项目`;
    } else if (type === 'monthly' && pathDate) {
        seoTitle = `GitHub 本月热门 (${pathDate}) - 每月追踪`;
        seoDescription = `查看 ${pathDate} 的 GitHub 本月热门项目榜单，掌握月度开源生态风向。`;
        seoKeywords = `github monthly trending, ${pathDate}, 本月热门, 最佳开源项目`;
    } else if (type === 'daily') {
        seoTitle = 'GitHub 每日热门榜单历史记录';
        seoDescription = '浏览所有的 GitHub 每日热门榜单历史数据。';
    } else if (type === 'weekly') {
        seoTitle = 'GitHub 每周热门榜单历史记录';
        seoDescription = '浏览所有的 GitHub 每周热门榜单历史数据。';
    } else if (type === 'monthly') {
        seoTitle = 'GitHub 每月热门榜单历史记录';
        seoDescription = '浏览所有的 GitHub 每月热门榜单历史数据。';
    } else if (searchQuery) {
        seoTitle = `搜索: ${searchQuery} | GitHub 热门项目追踪`;
        seoDescription = `关于 ${searchQuery} 的搜索结果。`;
        seoKeywords = `${searchQuery}, github search, trending`;
    } else if (selectedLang) {
        seoTitle = `${selectedLang} - GitHub 热门项目追踪`;
        seoDescription = `筛选语言为 ${selectedLang} 的 GitHub 热门开源项目。`;
        seoKeywords = `${selectedLang}, github, 编程语言排行`;
    }
    
    res.render('layouts/main', {
        body: `../${type}`, // will include views/${type}.ejs inside main
        type,
        dates,
        dateCards,
        selectedDate,
        languages,
        selectedLang,
        list: paginatedList,
        totalItems,
        currentPage,
        totalPages,
        itemsPerPage,
        searchQuery,
        meta,
        isListView,
        seoTitle,
        seoDescription,
        seoKeywords
    });
};

const renderFilterPage = (req: express.Request, res: express.Response, filterType: string, value: string) => {
    const decodedValue = decodeURIComponent(value);
    const data = loadData('all.json') || {};
    const meta = loadData('meta.json') || { topTags: [], topCategories: [], topSuitable: [], topTopics: [], topLanguages: [], topStars: [], topAppearances: [] };
    
    const list = data['all'] || [];
    
    const propName = filterType === 'tag' ? 'tags' : filterType;
    const lowerValue = decodedValue.toLowerCase();
    
    let filteredList = list;
    
    if (filterType !== 'keyword') {
        filteredList = list.filter((item: any) => {
            if (filterType === 'topic') {
                return item.githubData && item.githubData.topics && 
                       item.githubData.topics.some((t: string) => t.toLowerCase() === lowerValue);
            }
            if (filterType === 'language') {
                return item.language && item.language.toLowerCase() === lowerValue;
            }
            
            if (!item.summaryData || !item.summaryData[propName]) return false;
            
            if (Array.isArray(item.summaryData[propName])) {
                return item.summaryData[propName].some((t: string) => t.toLowerCase() === lowerValue);
            }
            
            return typeof item.summaryData[propName] === 'string' && 
                   item.summaryData[propName].toLowerCase() === lowerValue;
        });
    }

    const searchQuery = filterType === 'keyword' ? decodedValue : (req.query.q as string | undefined);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filteredList = filteredList.filter((item: any) => 
            (item.repo && item.repo.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
    }
    
    const page = parseInt(req.query.page as string, 10) || 1;
    const itemsPerPage = 10;
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    const typeLabelMap: Record<string, string> = {
        'tag': '标签',
        'category': '分类',
        'suitable': '适合人群',
        'topic': 'Topic',
        'language': '编程语言',
        'keyword': '搜索结果'
    };
    const label = typeLabelMap[filterType] || filterType;
    const seoTitle = `${decodedValue} - ${label} | GitHub 热门项目追踪`;
    const seoDescription = `查看与 ${decodedValue} (${label}) 相关的 GitHub 热门项目与 AI 深度分析总结。`;
    const seoKeywords = `${decodedValue}, ${label}, github trending, ai总结`;
    
    res.render('layouts/main', {
        body: '../filter',
        type: filterType,
        filterValue: decodedValue,
        list: paginatedList,
        totalItems,
        currentPage,
        totalPages,
        itemsPerPage,
        searchQuery,
        meta,
        isListView: false,
        seoTitle,
        seoDescription,
        seoKeywords
    });
};

app.get('/daily', (req, res) => renderPage(req, res, 'daily'));
app.get('/weekly', (req, res) => renderPage(req, res, 'weekly'));
app.get('/monthly', (req, res) => renderPage(req, res, 'monthly'));

app.listen(PORT, () => {
    console.log(`Trending CMS running at http://localhost:${PORT}`);
});
