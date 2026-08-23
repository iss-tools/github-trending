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
app.get('/', (req, res) => {
    res.redirect('/daily');
});

const renderPage = (req: express.Request, res: express.Response, type: string) => {
    const data = loadData(`${type}.json`) || {};
    const meta = loadData('meta.json') || { topTags: [], topStars: [], topAppearances: [] };
    
    // keys are dates (e.g. 20260101, 202635)
    const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));
    const selectedDate = (req.query.date as string) || (dates.length > 0 ? dates[0] : null);
    const list = selectedDate ? data[selectedDate] : [];
    
    // filter languages
    const langs = new Set<string>();
    list.forEach((i: any) => { if(i.language) langs.add(i.language) });
    const languages = Array.from(langs);
    
    const selectedLang = req.query.lang as string;
    const filteredList = selectedLang ? list.filter((i: any) => i.language === selectedLang) : list;
    
    res.render('layouts/main', {
        body: `../${type}`, // will include views/${type}.ejs inside main
        type,
        dates,
        selectedDate,
        languages,
        selectedLang,
        list: filteredList,
        meta,
    });
};

app.get('/daily', (req, res) => renderPage(req, res, 'daily'));
app.get('/weekly', (req, res) => renderPage(req, res, 'weekly'));
app.get('/monthly', (req, res) => renderPage(req, res, 'monthly'));

app.listen(PORT, () => {
    console.log(`Trending CMS running at http://localhost:${PORT}`);
});
