import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generateMarkdown = (allArray: any[], dailyGrouped: any, weeklyGrouped: any, monthlyGrouped: any) => {
    const markdownDir = path.resolve(__dirname, '../../markdown');
    const contentDir = path.join(markdownDir, 'content');
    const rootDir = path.resolve(__dirname, '../../');
    
    // Create dirs
    [markdownDir, contentDir, path.join(markdownDir, 'daily'), path.join(markdownDir, 'weekly'), path.join(markdownDir, 'monthly')].forEach(d => {
        if (!fs.existsSync(d)) {
            fs.mkdirSync(d, { recursive: true });
        }
    });

    // 1. Generate content pages
    allArray.forEach((item: any) => {
        const repoName = item.repo.replace('/', '-');
        const contentPath = path.join(contentDir, `${repoName}.md`);
        
        let md = `# ${item.repo}\n\n`;
        md += `[GitHub URL](${item.url})\n\n`;
        
        if (item.stars) md += `- **Stars**: ${item.stars}\n`;
        if (item.language) md += `- **Language**: ${item.language}\n`;
        
        if (item.summaryData) {
            if (item.summaryData.title) md += `\n## ${item.summaryData.title}\n`;
            if (item.summaryData.summary) md += `\n> ${item.summaryData.summary.replace(/\n/g, '\n> ')}\n`;
            
            md += '\n';
            if (item.summaryData.tags && item.summaryData.tags.length > 0) {
                md += `- **Tags**: ${item.summaryData.tags.join(', ')}\n`;
            }
            if (item.summaryData.category && item.summaryData.category.length > 0) {
                md += `- **Category**: ${item.summaryData.category.join(', ')}\n`;
            }
        }
        
        if (item.contentDetail) {
            md += `\n## Details\n\n${item.contentDetail}\n`;
        }
        
        fs.writeFileSync(contentPath, md);
    });

    // 2. Generate Index Pages
    const generateIndex = (type: string, grouped: any) => {
        const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
        
        dates.forEach((date, index) => {
            const items = grouped[date];
            const filePath = path.join(markdownDir, type, `${date}.md`);
            
            const prevDate = index < dates.length - 1 ? dates[index + 1] : null;
            const nextDate = index > 0 ? dates[index - 1] : null;
            
            let md = `# ${type.charAt(0).toUpperCase() + type.slice(1)} Trending - ${date}\n\n`;
            
            // Nav
            md += `<p align="center">\n`;
            if (prevDate) md += `  <a href="./${prevDate}.md">⬅️ Previous</a> |\n`;
            md += `  <a href="../README.md">🏠 Home</a>\n`;
            if (nextDate) md += `  | <a href="./${nextDate}.md">Next ➡️</a>\n`;
            md += `</p>\n\n`;
            
            md += `| Repository | Language | Stars | Summary |\n`;
            md += `|---|---|---|---|\n`;
            
            items.forEach((item: any) => {
                const repoLink = `../content/${item.repo.replace('/', '-')}.md`;
                const summary = item.summaryData?.summary ? item.summaryData.summary.replace(/\n/g, ' ').substring(0, 100) + '...' : (item.description || '');
                md += `| [${item.repo}](${repoLink}) | ${item.language || '-'} | ⭐ ${item.stars} | ${summary} |\n`;
            });
            
            fs.writeFileSync(filePath, md);
        });
        
        return dates;
    };

    const dailyDates = generateIndex('daily', dailyGrouped);
    const weeklyDates = generateIndex('weekly', weeklyGrouped);
    const monthlyDates = generateIndex('monthly', monthlyGrouped);

    // 3. Generate README
    let readmeMd = `# GitHub 热门项目追踪 (Trending)\n\n本项目持续追踪 GitHub 上的热门开源项目，并提供由 AI 生成的深度总结与技术分析。\n\n`;
    
    readmeMd += `## 最新榜单\n\n`;
    
    if (dailyDates.length > 0) readmeMd += `- [今日热门 (${dailyDates[0]})](markdown/daily/${dailyDates[0]}.md)\n`;
    if (weeklyDates.length > 0) readmeMd += `- [本周热门 (${weeklyDates[0]})](markdown/weekly/${weeklyDates[0]}.md)\n`;
    if (monthlyDates.length > 0) readmeMd += `- [本月热门 (${monthlyDates[0]})](markdown/monthly/${monthlyDates[0]}.md)\n`;
    
    readmeMd += `\n## 历史榜单\n\n`;
    readmeMd += `- [全部日榜索引](markdown/daily/${dailyDates[0] || ''}.md)\n`;
    readmeMd += `- [全部周榜索引](markdown/weekly/${weeklyDates[0] || ''}.md)\n`;
    readmeMd += `- [全部月榜索引](markdown/monthly/${monthlyDates[0] || ''}.md)\n`;

    fs.writeFileSync(path.join(rootDir, 'README.md'), readmeMd);
};
