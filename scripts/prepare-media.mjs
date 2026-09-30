import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import probe from 'ffprobe-static';
const raw=process.argv[2]||'raw';
const assets='public/assets';
const clips=[
{source:'mixkit-5189-white-bouquet.mp4',name:'01-first-petal',start:0,length:6,filter:'eq=saturation=0.85:contrast=1.05'},
{source:'mixkit-4484-lilies-opening.mp4',name:'02-natural-unfolding',start:3.5,length:8,filter:'hue=s=0,colorbalance=rs=-0.055:gs=0.01:bs=-0.02:rh=0.04:gh=0.015:bh=-0.07'},
{source:'mixkit-5228-white-orchids.mp4',name:'03-light-and-petals',start:2,length:6,filter:'eq=saturation=0.65:contrast=1.03'},
{source:'mixkit-5223-hands-bouquet.mp4',name:'04-the-human-touch',start:1,length:6,filter:'eq=saturation=0.72:contrast=1.05'},
{source:'mixkit-5224-wedding-table.mp4',name:'05-a-moment-together',start:6.3,length:4,filter:'eq=saturation=0.75:contrast=1.04'},
];
const report=process.argv[3]&&fs.existsSync('MEDIA-REPORT.json')?JSON.parse(fs.readFileSync('MEDIA-REPORT.json','utf8')):[];
for(const c of clips){
if(process.argv[3]&&c.name!==process.argv[3])continue;
const old=report.findIndex(r=>r.name===c.name);if(old>=0)report.splice(old,1);
const src=path.join(raw,c.source),out=path.join(assets,c.name+'.mp4');
const before=JSON.parse(execFileSync(probe.path,['-v','quiet','-show_format','-show_streams','-of','json',src]));
execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-ss',String(c.start),'-i',src,'-t',String(c.length),'-vf','scale=1280:-2,fps=24,'+c.filter,'-an','-c:v','libx264','-preset','medium','-crf','20','-maxrate','7M','-bufsize','14M','-pix_fmt','yuv420p','-g','1','-keyint_min','1','-sc_threshold','0','-bf','0','-movflags','+faststart',out]);
execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',out,'-frames:v','1','-q:v','2',path.join(assets,c.name+'.jpg')]);
const after=JSON.parse(execFileSync(probe.path,['-v','quiet','-show_format','-show_streams','-of','json',out]));
const keyframes=execFileSync(probe.path,['-v','quiet','-select_streams','v:0','-show_entries','frame=key_frame','-of','csv=p=0',out],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
report.push({...c,before,after,allFramesIntra:keyframes.every(x=>x.trim().replace(/,/g,'')==='1')});
console.log(c.name,after.format.size+' bytes',after.format.duration+' seconds');
}
fs.writeFileSync('MEDIA-REPORT.json',JSON.stringify(report,null,2));

