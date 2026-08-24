import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import supertest from 'supertest';
import app from '../server';

const distDir = path.resolve(__dirname, '../../dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy public directory
const publicDir = path.resolve(__dirname, '../../public');
fs.cpSync(publicDir, distDir, { recursive: true });

const savePage = async (route: string, filename: string) => {
    try {
        const res = await supertest(app).get(route);
        if (res.status === 200) {
            const filePath = path.join(distDir, filename);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, res.text);
            console.log(`✓ Generated ${route}`);
        } else {
            console.error(`✗ Failed to generate ${route}: ${res.status}`);
        }
    } catch (e) {
        console.error(`✗ Error generating ${route}`, e);
    }
};

const generateAll = async () => {
    console.log('Starting static site generation...');
    
    // Core routes
    await savePage('/', 'index.html');
    await savePage('/daily', 'daily/index.html');
    await savePage('/weekly', 'weekly/index.html');
    await savePage('/monthly', 'monthly/index.html');
    await savePage('/privacy', 'privacy/index.html');
    
    const dataDir = path.resolve(__dirname, '../../data');
    const loadJSON = (name: string) => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf-8'));
    
    const dailyData = loadJSON('daily.json');
    const weeklyData = loadJSON('weekly.json');
    const monthlyData = loadJSON('monthly.json');
    const allData = loadJSON('all.json');
    const metaData = loadJSON('meta.json');
    
    // Dates
    for (const date of Object.keys(dailyData)) await savePage(`/daily/${date}.html`, `daily/${date}.html`);
    for (const date of Object.keys(weeklyData)) await savePage(`/weekly/${date}.html`, `weekly/${date}.html`);
    for (const date of Object.keys(monthlyData)) await savePage(`/monthly/${date}.html`, `monthly/${date}.html`);
    
    // Repos
    const repos = allData['all'] || [];
    for (const item of repos) {
        await savePage(`/repo/${item.repo}.html`, `repo/${item.repo}.html`);
    }
    
    // Filters
    if (metaData.topTags) {
        for (const t of metaData.topTags) await savePage(`/tag/${encodeURIComponent(t.tag)}.html`, `tag/${t.tag}.html`);
    }
    if (metaData.topCategories) {
        for (const t of metaData.topCategories) await savePage(`/category/${encodeURIComponent(t.name)}.html`, `category/${t.name}.html`);
    }
    if (metaData.topLanguages) {
        for (const t of metaData.topLanguages) await savePage(`/language/${encodeURIComponent(t.name)}.html`, `language/${t.name}.html`);
    }
    
    console.log('Static site generation complete! Ready for Cloudflare Pages.');
};

generateAll();
