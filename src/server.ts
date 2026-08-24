import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

const renderPage = (req: express.Request, res: express.Response, type: string) => {
    const data = loadData(`${type}.json`) || {};
    const meta = loadData('meta.json') || { topTags: [], topStars: [], topAppearances: [] };
    
    // keys are dates (e.g. 20260101, 202635, or 'all')
    const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));
    
    let selectedDate = req.query.date as string | undefined;
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
    const itemsPerPage = 10;
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    res.render('layouts/main', {
        body: `../${type}`, // will include views/${type}.ejs inside main
        type,
        dates,
        selectedDate,
        languages,
        selectedLang,
        list: paginatedList,
        totalItems,
        currentPage,
        totalPages,
        searchQuery,
        meta,
        isListView,
    });
};

app.get('/daily', (req, res) => renderPage(req, res, 'daily'));
app.get('/weekly', (req, res) => renderPage(req, res, 'weekly'));
app.get('/monthly', (req, res) => renderPage(req, res, 'monthly'));

app.listen(PORT, () => {
    console.log(`Trending CMS running at http://localhost:${PORT}`);
});
