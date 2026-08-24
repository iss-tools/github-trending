import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generateSitemapRss = (allArray: any[], dailyGrouped: any, weeklyGrouped: any, monthlyGrouped: any, meta: any) => {
    const DOMAIN = process.env.DOMAIN || 'https://trending.example.com';
    const publicDir = path.resolve(__dirname, '../../public');
    
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Generate Sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    const addUrl = (urlPath: string, priority: string = '0.5') => {
        sitemap += `  <url>\n    <loc>${DOMAIN}${urlPath}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    };

    // Core pages
    addUrl('/', '1.0');
    addUrl('/daily', '0.9');
    addUrl('/weekly', '0.9');
    addUrl('/monthly', '0.9');
    
    // Dates
    Object.keys(dailyGrouped).forEach(date => addUrl(`/daily/${date}.html`, '0.8'));
    Object.keys(weeklyGrouped).forEach(date => addUrl(`/weekly/${date}.html`, '0.8'));
    Object.keys(monthlyGrouped).forEach(date => addUrl(`/monthly/${date}.html`, '0.8'));
    
    // Repos
    allArray.forEach(item => addUrl(`/repo/${item.repo}.html`, '0.7'));
    
    // Filters
    meta.topTags.forEach((t: any) => addUrl(`/tag/${encodeURIComponent(t.tag)}.html`, '0.6'));
    meta.topCategories.forEach((t: any) => addUrl(`/category/${encodeURIComponent(t.name)}.html`, '0.6'));
    meta.topLanguages.forEach((t: any) => addUrl(`/language/${encodeURIComponent(t.name)}.html`, '0.6'));

    sitemap += `</urlset>`;
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    
    // 2. Generate RSS
    // Sort allArray by dateAdded (newest first) to get latest items
    const latestItems = [...allArray].sort((a, b) => {
        const dateA = a.dateAdded || '';
        const dateB = b.dateAdded || '';
        return dateB.localeCompare(dateA);
    }).slice(0, 50);

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
    rss += `<rss version="2.0">\n`;
    rss += `  <channel>\n`;
    rss += `    <title>GitHub Trending AI</title>\n`;
    rss += `    <link>${DOMAIN}</link>\n`;
    rss += `    <description>AI generated insights for GitHub trending repositories</description>\n`;
    
    latestItems.forEach(item => {
        const itemUrl = `${DOMAIN}/repo/${item.repo}.html`;
        let pubDate = new Date().toUTCString();
        if (item.dateAdded && item.dateAdded.length === 8) { // format: YYYYMMDD
            const y = item.dateAdded.substring(0, 4);
            const m = item.dateAdded.substring(4, 6);
            const d = item.dateAdded.substring(6, 8);
            pubDate = new Date(`${y}-${m}-${d}`).toUTCString();
        }
        
        let desc = item.description || '';
        if (item.summaryData?.summary) {
            desc = item.summaryData.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        
        rss += `    <item>\n`;
        rss += `      <title>${item.repo}</title>\n`;
        rss += `      <link>${itemUrl}</link>\n`;
        rss += `      <description>${desc}</description>\n`;
        rss += `      <pubDate>${pubDate}</pubDate>\n`;
        rss += `      <guid>${itemUrl}</guid>\n`;
        rss += `    </item>\n`;
    });
    
    rss += `  </channel>\n</rss>`;
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss);
};
