import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
const CONFIG={fps:24,firstHold:.09,lastHold:.10,demoSeconds:15,maxDpr:1.5};
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const phone=matchMedia('(max-width:600px)');
const assetUrl=p=>import.meta.env.BASE_URL+p.replace(/^\/?assets\//,'assets/');
const scenes=[...document.querySelectorAll('.scene')];
const links=[...document.querySelectorAll('.chapters a')];
const allChapters=[...document.querySelectorAll('[data-chapter]')];
const isDemo=new URLSearchParams(location.search).get('demo')==='1';
const videoStates=[];
let cleanups=[],sceneTriggers=[],modeCleanup=()=>{},lenis,activeChapter=-1;
let demoGeneration=0;
let demoPlaying=false,demoStart=0,demoOffset=0,demoMax=0;
const controls=document.querySelector('.demo-controls'),play=document.querySelector('#demo-play');
const dialog=document.querySelector('#enquiry');
const canvas=document.querySelector('#bloom-canvas'),ctx=canvas.getContext('2d');
let particles=[],cw=0,ch=0,lastCanvasProgress=0;
const icon=new Image();icon.src=assetUrl('assets/brand-botanical.png');
icon.onload=()=>{
 const sample=document.createElement('canvas');sample.width=sample.height=240;
 const c=sample.getContext('2d',{willReadFrequently:true});c.drawImage(icon,0,0,240,240);
 const data=c.getImageData(0,0,240,240).data;
 for(let y=50;y<180;y+=2)for(let x=55;x<180;x+=2){const k=(y*240+x)*4;if(data[k]>125&&data[k+1]>115)particles.push({x:(x-120)/120,y:(y-120)/120,seed:((x*73+y*37)%997)/997});}
 particles=particles.filter((_,i)=>i%2===0);resizeCanvas();
};
function resizeCanvas(){cw=innerWidth;ch=innerHeight;const dpr=Math.min(devicePixelRatio||1,CONFIG.maxDpr);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(!reduce.matches)drawCanvas(lastCanvasProgress);}
function drawCanvas(p){lastCanvasProgress=p;ctx.clearRect(0,0,cw,ch);if(p<=.14||p>=.88||!particles.length)return;
 const form=smooth((p-.14)/.24),burst=smooth((p-.45)/.28),alpha=smooth((p-.14)/.1)*(1-smooth((p-.70)/.18));
 ctx.fillStyle=`rgba(19,34,25,${alpha*.55})`;ctx.fillRect(0,0,cw,ch);
 const size=Math.min(cw*.49,ch*.65),limit=cw<850?Math.ceil(particles.length*.7):particles.length;
 for(let i=0;i<limit;i++){const a=particles[Math.floor(i*particles.length/limit)],angle=a.seed*Math.PI*8,radius=(.3+a.seed)*Math.max(cw,ch);const tx=cw*.5+a.x*size,ty=ch*.5+a.y*size;const x=lerp(cw*.5+Math.cos(angle)*radius,tx,form)+Math.cos(angle)*radius*burst;const y=lerp(ch*.5+Math.sin(angle)*radius,ty,form)+Math.sin(angle)*radius*burst;ctx.globalAlpha=alpha*(.45+a.seed*.55);ctx.fillStyle=a.seed>.75?'#fff5d5':'#cebc98';ctx.beginPath();ctx.arc(x,y,1.1+a.seed*1.5,0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=1;
}
function setChapter(i){if(i===activeChapter)return;activeChapter=i;links.forEach((a,k)=>{if(k===i)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});}
function setupVideo(section){
 const video=section.querySelector('video'),state={section,video,source:video.getAttribute('src')||assetUrl(video.dataset.src),p:0,active:false,target:0,failed:false,loaded:!!video.getAttribute('src')};
 section.style.setProperty('--fallback',`url("${video.poster}")`);
 const onError=()=>{state.failed=true;section.classList.add('media-failed');};
 const seek=()=>{if(state.failed||video.readyState<1||video.seeking)return;if(Math.abs(video.currentTime-state.target)>1/(CONFIG.fps*2)){try{video.currentTime=state.target}catch{onError()}}};
 state.update=p=>{state.p=p;if(reduce.matches)return;const d=video.duration;if(Number.isFinite(d)&&d>0){const t=clamp((p-CONFIG.firstHold)/(1-CONFIG.firstHold-CONFIG.lastHold));const final=Math.max(0,d-1/CONFIG.fps);state.target=Math.min(final,Math.round(t*final*CONFIG.fps)/CONFIG.fps);section.dataset.targetTime=state.target.toFixed(3);video.pause();seek();}};
 state.load=()=>{if(state.loaded||state.failed||reduce.matches)return;state.loaded=true;video.src=state.source;video.preload='auto';video.load();};
 const meta=()=>state.update(state.p),ended=()=>{if(state.active||state.p===0||state.p===1)seek();};
 video.addEventListener('loadedmetadata',meta);video.addEventListener('seeked',ended);video.addEventListener('error',onError);
 cleanups.push(()=>{video.removeEventListener('loadedmetadata',meta);video.removeEventListener('seeked',ended);video.removeEventListener('error',onError)});
 videoStates.push(state);return state;
}
scenes.forEach(setupVideo);
function setupMotion(){
 modeCleanup();sceneTriggers=[];
 const staticMode=reduce.matches;
 document.body.classList.toggle('static-motion',staticMode);
 if(staticMode){videoStates.forEach(s=>{s.video.pause();if(s.video.hasAttribute('src')){s.video.removeAttribute('src');s.video.load();s.loaded=false;}});ctx.clearRect(0,0,cw,ch);}
 const observers=[];
 const nearby=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)videoStates.find(s=>s.section===e.target)?.load()}),{rootMargin:'120% 0px'});
 if(!staticMode)scenes.forEach(s=>nearby.observe(s));observers.push(nearby);
 const gsapContext=gsap.context(()=>{
 if(!staticMode)scenes.forEach((section,i)=>{
 const v=videoStates[i],kind=section.dataset.kind,copy=section.querySelector('.scene-copy,.hero-copy'),frame=section.querySelector('.media-frame'),bar=section.querySelector('.scene-progress'),ghost=section.querySelector('.english-ghost');
 const render=st=>{const p=st.progress;v.active=st.isActive;v.update(p);section.dataset.progress=p.toFixed(4);section.style.setProperty('--progress',p);gsap.set(bar,{scaleX:p});
 
 const tail=smooth((p-.91)/.09);
 gsap.set(copy,{y:kind==='hero'?-p*48:lerp(32,-26,p),opacity:1-tail*.30});
 if(kind==='hero')gsap.set(frame,{scale:1+p*.10});
 if(kind==='bloom'){const reveal=smooth((p-.12)/.25)*(1-smooth((p-.72)/.2));gsap.set(copy,{y:lerp(20,-35,p),opacity:1-reveal*(phone.matches?.92:.72)});gsap.set(frame,{scale:1.02+p*.12});gsap.set(ghost,{x:p*60,opacity:.6+p*.4});}
 if(kind==='material')gsap.set(frame,{xPercent:-p*5,scale:1.05+p*.05});
 if(kind==='craft')gsap.set(frame,{scale:1.12-p*.12});
 if(kind==='celebration'){gsap.set(frame,{scale:1.07-p*.07});const dim=smooth((p-.20)/.15)*(1-smooth((p-.68)/.15));gsap.set(copy,{opacity:1-dim*.92});if(st.isActive||p===0||p===1)drawCanvas(p);}
 };
 const trigger=ScrollTrigger.create({trigger:section,start:'top top',end:'bottom bottom',onUpdate:render,onToggle:render,onRefresh:render,invalidateOnRefresh:true});sceneTriggers.push(trigger);render(trigger);
 });
 });
 let chapterPositions=[];
 const updateChapter=()=>{const y=scrollY+innerHeight*.35;let index=0;chapterPositions.forEach((top,i)=>{if(y>=top)index=i});setChapter(index);};
 const measureChapters=()=>{chapterPositions=allChapters.map(el=>el.offsetTop);updateChapter();};
 addEventListener('scroll',updateChapter,{passive:true});ScrollTrigger.addEventListener('refresh',measureChapters);measureChapters();
 modeCleanup=()=>{observers.forEach(o=>o.disconnect());gsapContext.revert();removeEventListener('scroll',updateChapter);ScrollTrigger.removeEventListener('refresh',measureChapters);};
 ScrollTrigger.refresh();resizeCanvas();
}
setupMotion();reduce.addEventListener('change',setupMotion);phone.addEventListener('change',setupMotion);
lenis=new Lenis({smoothWheel:false,syncTouch:false,anchors:false});lenis.on('scroll',ScrollTrigger.update);
function tick(time){lenis.raf(time*1000);if(demoPlaying){const t=clamp((performance.now()-demoStart)/1000/CONFIG.demoSeconds);lenis.scrollTo(t*demoMax,{immediate:true,force:true});if(t>=1){demoOffset=1;pauseDemo();}}}
gsap.ticker.add(tick);
function pauseDemo(){demoGeneration++;play.disabled=false;if(demoPlaying)demoOffset=demoMax?clamp(scrollY/demoMax):0;demoPlaying=false;play.textContent='تشغيل العرض';}
async function toggleDemo(){if(play.disabled){pauseDemo();return;}if(demoPlaying){pauseDemo();return;}const generation=++demoGeneration;play.disabled=true;play.textContent='تهيئة العرض…';
 if(!reduce.matches){videoStates.forEach(s=>s.load());await Promise.all(videoStates.map(s=>new Promise(resolve=>{if(s.video.readyState>=2||s.failed)return resolve();const done=()=>{s.video.removeEventListener('loadeddata',done);s.video.removeEventListener('canplay',done);s.video.removeEventListener('seeked',done);s.video.removeEventListener('error',done);clearTimeout(timeout);resolve()};const timeout=setTimeout(done,8000);s.video.addEventListener('loadeddata',done,{once:true});s.video.addEventListener('canplay',done,{once:true});s.video.addEventListener('seeked',done,{once:true});s.video.addEventListener('error',done,{once:true});})));}
 if(generation!==demoGeneration)return;play.disabled=false;ScrollTrigger.refresh();demoMax=document.documentElement.scrollHeight-innerHeight;if(demoOffset>=.999){demoOffset=0;lenis.scrollTo(0,{immediate:true,force:true});}else demoOffset=clamp(scrollY/demoMax);demoStart=performance.now()-demoOffset*CONFIG.demoSeconds*1000;demoPlaying=true;play.textContent='إيقاف العرض';}
function resetDemo(){pauseDemo();demoOffset=0;lenis.scrollTo(0,{immediate:true,force:true});videoStates.forEach(s=>s.update(0));ScrollTrigger.update();drawCanvas(0);}
if(isDemo){controls.hidden=false;play.addEventListener('click',toggleDemo);document.querySelector('#demo-reset').addEventListener('click',resetDemo);}
const keyHandler=e=>{if(!isDemo||dialog.open||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();toggleDemo()}if(e.code==='KeyR'){e.preventDefault();resetDemo()}};
addEventListener('keydown',keyHandler);addEventListener('wheel',pauseDemo,{passive:true});addEventListener('touchstart',pauseDemo,{passive:true});
const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-nav');
menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();pauseDemo();menu.hidden=true;menuButton.setAttribute('aria-expanded','false');lenis.scrollTo(target,{duration:reduce.matches?0:1.05,immediate:reduce.matches,onComplete:()=>{history.replaceState(null,'',a.getAttribute('href'));}})}));
let opener;
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>{pauseDemo();opener=b;dialog.showModal();lenis.stop();document.querySelector('#name').focus();}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{lenis.start();opener?.focus();});
const form=document.querySelector('#enquiry-form'),ready=document.querySelector('#message-ready');
form.addEventListener('input',()=>ready.hidden=true);
form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const message=['مرحباً لا بيزل، أود الاستفسار عن تجهيز مناسبة.',`الاسم: ${String(d.get('name')).trim()}`,`نوع المناسبة: ${d.get('occasion')}`,d.get('date')?`التاريخ: ${d.get('date')}`:'',d.get('details')?`التفاصيل: ${String(d.get('details')).trim()}`:''].filter(Boolean).join('\n');const url='https://wa.me/966507871110?text='+encodeURIComponent(message);document.querySelector('#whatsapp-link').href=url;document.querySelector('#email-link').href='mailto:info@labasil.com?subject='+encodeURIComponent('استفسار عن مناسبة — لا بيزل')+'&body='+encodeURIComponent(message);ready.hidden=false;window.open(url,'_blank','noopener,noreferrer');});
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>ScrollTrigger.refresh()));
let resizeTimer;const resize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{resizeCanvas();demoMax=document.documentElement.scrollHeight-innerHeight;},150)};addEventListener('resize',resize);
document.fonts.ready.then(()=>ScrollTrigger.refresh());
const visibility=()=>{if(document.hidden)pauseDemo()};document.addEventListener('visibilitychange',visibility);
function cleanup(){modeCleanup();cleanups.forEach(f=>f());lenis.destroy();gsap.ticker.remove(tick);reduce.removeEventListener('change',setupMotion);phone.removeEventListener('change',setupMotion);removeEventListener('resize',resize);removeEventListener('keydown',keyHandler);removeEventListener('wheel',pauseDemo);removeEventListener('touchstart',pauseDemo);document.removeEventListener('visibilitychange',visibility);clearTimeout(resizeTimer);}
if(import.meta.hot)import.meta.hot.dispose(cleanup);


