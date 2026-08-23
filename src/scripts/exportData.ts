import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../api/data/analysis.db');
const db = new Database(dbPath, { readonly: true });

console.log('Exporting data from SQLite to JSON...');

const rows = db.prepare(`
  SELECT t.*, a.githubData, a.summaryData, a.contentDetail 
  FROM Trending t
  LEFT JOIN AnalysisRecord a ON t.url = a.query
`).all() as any[];

const daily: any[] = [];
const weekly: any[] = [];
const monthly: any[] = [];

// Stats
const tagsMap: Record<string, number> = {};
const repoMap: Record<string, any> = {};

rows.forEach(row => {
  // Parse JSON
  let summary = null;
  if (row.summaryData) {
    try {
       summary = JSON.parse(row.summaryData);
       if (summary.tags && Array.isArray(summary.tags)) {
           summary.tags.forEach((tag: string) => {
               tagsMap[tag] = (tagsMap[tag] || 0) + 1;
           });
       }
    } catch(e){}
  }
  
  let github = null;
  if (row.githubData) {
      try {
          github = JSON.parse(row.githubData);
      } catch(e){}
  }
  
  const item = { ...row, summaryData: summary, githubData: github };

  if (row.type.includes('daily')) daily.push(item);
  else if (row.type.includes('weekly')) weekly.push(item);
  else if (row.type.includes('monthly')) monthly.push(item);

  // For Repo Map (Star ranking & appearance count)
  if (!repoMap[row.repo]) {
      repoMap[row.repo] = {
          repo: row.repo,
          url: row.url,
          stars: row.stars,
          appearances: 0
      };
  }
  // take max stars
  repoMap[row.repo].stars = Math.max(repoMap[row.repo].stars, row.stars);
  repoMap[row.repo].appearances += 1;
});

const topTags = Object.entries(tagsMap).sort((a, b) => b[1] - a[1]).slice(0, 20).map(i => ({ tag: i[0], count: i[1] }));
const repos = Object.values(repoMap);
const topStars = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 10);
const topAppearances = [...repos].sort((a, b) => b.appearances - a.appearances).slice(0, 10);

// Grouping by dateAdded for daily, weekly, monthly
const groupByDate = (arr: any[]) => {
   // return object with dateAdded as keys, and arrays of items as values, sorted by date (newest first)
   const grouped = arr.reduce((acc, curr) => {
      if(!acc[curr.dateAdded]) acc[curr.dateAdded] = [];
      acc[curr.dateAdded].push(curr);
      return acc;
   }, {} as Record<string, any[]>);
   
   // Sort items in each group by stars (highest first)
   for (const key in grouped) {
       grouped[key].sort((a: any, b: any) => b.stars - a.stars);
   }
   
   return grouped;
};

const dataDir = path.resolve(__dirname, '../../data');
fs.writeFileSync(path.join(dataDir, 'daily.json'), JSON.stringify(groupByDate(daily), null, 2));
fs.writeFileSync(path.join(dataDir, 'weekly.json'), JSON.stringify(groupByDate(weekly), null, 2));
fs.writeFileSync(path.join(dataDir, 'monthly.json'), JSON.stringify(groupByDate(monthly), null, 2));
fs.writeFileSync(path.join(dataDir, 'meta.json'), JSON.stringify({ topTags, topStars, topAppearances }, null, 2));

console.log('Export complete!');
