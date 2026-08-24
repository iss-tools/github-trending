import express from 'express';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';

const app = express();
const PORT = process.env.PORT || 3001;

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

['daily', 'weekly', 'monthly'].forEach(type => {
    app.get(`/${type}`, (req, res) => {
        renderPage(req, res, type);
    });

    app.get(`/${type}/:date.html`, (req, res) => {
        renderPage(req, res, type, req.params.date);
    });
});

['tag', 'category', 'suitable', 'topic'].forEach(filterType => {
    app.get(`/${filterType}/:value.html`, (req, res) => {
        renderFilterPage(req, res, filterType, req.params.value);
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
        itemsPerPage = type === 'all' ? 10 : 20;
        totalItems = filteredList.length;
        totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        currentPage = Math.max(1, Math.min(page, totalPages));
        paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
    });
};

const renderFilterPage = (req: express.Request, res: express.Response, filterType: string, value: string) => {
    const decodedValue = decodeURIComponent(value);
    const data = loadData('all.json') || {};
    const meta = loadData('meta.json') || { topTags: [], topCategories: [], topSuitable: [], topTopics: [], topStars: [], topAppearances: [] };
    
    const list = data['all'] || [];
    
    const propName = filterType === 'tag' ? 'tags' : filterType;
    let filteredList = list.filter((item: any) => {
        if (filterType === 'topic') {
            return item.githubData && item.githubData.topics && item.githubData.topics.includes(decodedValue);
        }
        if (!item.summaryData || !item.summaryData[propName]) return false;
        if (Array.isArray(item.summaryData[propName])) {
            return item.summaryData[propName].includes(decodedValue);
        }
        return item.summaryData[propName] === decodedValue;
    });

    const searchQuery = req.query.q as string | undefined;
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
    });
};

app.get('/daily', (req, res) => renderPage(req, res, 'daily'));
app.get('/weekly', (req, res) => renderPage(req, res, 'weekly'));
app.get('/monthly', (req, res) => renderPage(req, res, 'monthly'));

app.listen(PORT, () => {
    console.log(`Trending CMS running at http://localhost:${PORT}`);
});
