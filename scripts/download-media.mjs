import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const manifest=JSON.parse(fs.readFileSync('ASSETS.json','utf8'));
fs.mkdirSync('raw',{recursive:true});
for(const item of manifest.selected.filter(i=>i.used)){
  const target='raw/'+item.filename;
  const matches=()=>fs.existsSync(target)&&createHash('sha256').update(fs.readFileSync(target)).digest('hex')===item.sha256;
  if(matches()){console.log('Already downloaded:',item.filename);continue;}
  console.log('Downloading:',item.title);
  const response=await fetch(item.download_url);
  if(!response.ok)throw new Error(`Download failed (${response.status}). Get this clip from ${item.source_url}; do not bypass provider restrictions.`);
  fs.writeFileSync(target,Buffer.from(await response.arrayBuffer()));
  if(!matches())throw new Error(`Provider file changed: ${item.source_url}. Verify the source and licence before updating the checksum.`);
}
const result=spawnSync(process.execPath,['scripts/prepare-media.mjs','raw'],{stdio:'inherit'});
process.exitCode=result.status??1;
