import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const paths=[...new Set([...html.matchAll(/(?:src|href|poster|data-src)="(\/assets\/[^"]+)"/g)].map(m=>'public'+m[1]))];
const missing=paths.filter(p=>!fs.existsSync(p));
if(missing.length)throw new Error(`Missing assets: ${missing.join(', ')}. Run pnpm media:setup first.`);
for(const p of paths)if(fs.statSync(p).size>=100*1024*1024)throw new Error(`Asset exceeds 100 MB: ${p}`);
console.log(`Verified ${paths.length} local assets.`);
