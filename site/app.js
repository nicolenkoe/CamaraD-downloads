const video=document.getElementById('tutorial'),playOverlay=document.getElementById('videoPlayOverlay');
function refreshDuration(){if(Number.isFinite(video.duration))document.querySelectorAll('[data-video-duration]').forEach(e=>e.textContent=Math.floor(video.duration/60)+':'+String(Math.floor(video.duration%60)).padStart(2,'0'));}
video.addEventListener('loadedmetadata',refreshDuration);refreshDuration();
function startVideo(){video.muted=false;video.volume=1;video.play().catch(()=>{playOverlay.hidden=false;});}
playOverlay.addEventListener('click',startVideo);video.addEventListener('play',()=>playOverlay.hidden=true);video.addEventListener('ended',()=>playOverlay.hidden=false);

async function load(){
 const requests=await Promise.allSettled(['release.json','site-config.json','media/chapters-v4.json'].map(async path=>{const r=await fetch('./'+path);if(!r.ok)throw Error(path);return r.json();}));
 const [release,config,chapters]=requests.map(r=>r.status==='fulfilled'?r.value:null);
 if(release){document.getElementById('currentChannel').textContent=release.channel==='stable'?'Стабильная сборка':'Тестовая сборка';document.querySelectorAll('[data-version]').forEach(e=>e.textContent=release.version);const list=document.getElementById('changes');list.replaceChildren();for(const change of release.changes){const li=document.createElement('li');li.textContent=change;list.append(li);}const date=document.getElementById('releaseDate');date.dateTime=release.date;date.textContent=new Intl.DateTimeFormat('ru',{dateStyle:'long',timeZone:'UTC'}).format(new Date(release.date+'T00:00:00Z'));}
 if(config){for(const [id,key] of [['download','download'],['play','play'],['official','officialSite']]){if(config[key]){const url=new URL(config[key],location.href);if(['https:','http:'].includes(url.protocol))document.getElementById(id).href=url.href;}}}
 if(chapters){for(const c of chapters){const button=document.createElement('button');button.type='button';const stamp=document.createElement('span');stamp.textContent=Math.floor(c.videoStart/60)+':'+String(Math.floor(c.videoStart%60)).padStart(2,'0');button.append(stamp,document.createTextNode(c.title));button.onclick=()=>{video.scrollIntoView({block:'center',behavior:'instant'});video.currentTime=c.videoStart;startVideo();};document.getElementById('chapters').append(button);const article=document.createElement('article'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=c.title;p.textContent=c.text;article.append(h,p);document.getElementById('transcript').append(article);}}
}
load();
