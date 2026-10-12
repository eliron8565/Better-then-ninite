// AppForge immersive theme engine. Visual-only; never changes installation data.
(() => {
 const picker=document.querySelector('#themePicker');if(!picker)return;
 const themes=['cyberpunk','gta','minecraft','league','apex','siege','cod'];
 const config={
 default:['APPFORGE / COMMAND CENTER','Build your perfect setup','Curated tools. One smooth install.'],
 cyberpunk:['NIGHT CITY // SYSTEM ONLINE','Upgrade your cyberdeck','Neon software drops. Zero corpo bloat.'],
 gta:['LOS SANTOS // TECH GARAGE','Build your next big setup','Your city. Your apps. Your rules.'],
 minecraft:['CRAFTING TABLE // READY','Craft your software loadout','Collect the tools. Build your world.'],
 league:['RUNETERRA // THE ARMORY','Choose your legendary loadout','Equip the tools for your next adventure.'],
 apex:['OUTLANDS // DROP ZONE','Your next loadout awaits','Choose your gear. Ready up. Drop in.'],
 siege:['RAINBOW SIX // OPERATIONS','Prepare your tactical kit','Select your utilities. Secure your setup.'],
 cod:['CALL OF DUTY // LOADOUT','Deploy your ultimate setup','Mission ready. Your tools. Your choice.']
 };
 const themeExtras={
 cyberpunk:{tag:'NEON GRID',action:'JACK IN',icon:'◈',meter:'CYBERDECK STATUS'},
 gta:{tag:'LOS SANTOS',action:'START YOUR EMPIRE',icon:'✦',meter:'GARAGE STATUS'},
 minecraft:{tag:'OVERWORLD',action:'START CRAFTING',icon:'▣',meter:'CRAFTING PROGRESS'},
 league:{tag:'THE SUMMONER',action:'ENTER THE RIFT',icon:'✧',meter:'CHAMPION SELECT'},
 apex:{tag:'THE OUTLANDS',action:'READY UP',icon:'▲',meter:'SQUAD STATUS'},
 siege:{tag:'TACTICAL HQ',action:'PREPARE OPERATION',icon:'⬡',meter:'OPERATION STATUS'},
 cod:{tag:'MISSION CONTROL',action:'DEPLOY LOADOUT',icon:'▰',meter:'MISSION STATUS'},
 default:{tag:'APPFORGE',action:'BUILD YOUR SETUP',icon:'◆',meter:'SETUP PROGRESS'}
 };
 const key='appforge-theme';
 const eyebrow=document.createElement('div');eyebrow.className='theme-scene-eyebrow';
 const label=document.createElement('div');label.className='theme-scene-label';
 const sub=document.createElement('div');sub.className='theme-scene-sub';
 const hero=document.querySelector('.hero-copy');
 if(hero){hero.prepend(eyebrow);const badges=hero.querySelector('.hero-badges');if(badges){badges.before(label,sub);}}
 const dashboard=document.createElement('div');dashboard.className='theme-dashboard';dashboard.setAttribute('aria-live','polite');
 dashboard.innerHTML='<div class="theme-dashboard-head"><span class="theme-dashboard-icon"></span><div><strong class="theme-dashboard-title"></strong><small class="theme-dashboard-meter-label"></small></div></div><div class="theme-dashboard-progress"><span></span></div><div class="theme-dashboard-stats"><span class="theme-dashboard-count">0 APPS SELECTED</span><span class="theme-dashboard-platform">WINDOWS</span></div><button class="theme-dashboard-action" type="button"></button>';
 if(hero){hero.append(dashboard);}
 dashboard.querySelector('.theme-dashboard-action').addEventListener('click',()=>document.querySelector('#apps-section')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
 const refreshDashboard=()=>{
 const count=document.querySelectorAll('.app-row.selected').length;
 const active=document.querySelector('.platform-btn.active b')?.textContent||'Windows';
 dashboard.querySelector('.theme-dashboard-count').textContent=count+' APPS SELECTED';
 dashboard.querySelector('.theme-dashboard-platform').textContent=active.toUpperCase();
 dashboard.querySelector('.theme-dashboard-progress span').style.width=Math.min(100,count*10)+'%';
 };
 const observer=new MutationObserver(refreshDashboard);const catalog=document.querySelector('#catalog');if(catalog)observer.observe(catalog,{subtree:true,attributes:true,attributeFilter:['class'],childList:true});
 document.querySelector('.platform-picker')?.addEventListener('click',()=>requestAnimationFrame(refreshDashboard));
 refreshDashboard();
 const status=document.createElement('div');status.className='theme-status';status.setAttribute('aria-hidden','true');document.body.append(status);
 const apply=value=>{
  const theme=themes.includes(value)?value:'default';
  document.body.classList.remove(...themes);
  if(theme!=='default')document.body.classList.add(theme);
  picker.value=theme;localStorage.setItem(key,theme);
  const [e,l,subline]=config[theme];eyebrow.textContent=e;label.textContent=l;sub.textContent=subline;
  status.textContent=theme==='default'?'APPFORGE // READY':e;
  const extras=themeExtras[theme];dashboard.querySelector('.theme-dashboard-icon').textContent=extras.icon;
  dashboard.querySelector('.theme-dashboard-title').textContent=extras.tag;
  dashboard.querySelector('.theme-dashboard-meter-label').textContent=extras.meter;
  dashboard.querySelector('.theme-dashboard-action').textContent=extras.action+' ↓';
  refreshDashboard();
  document.documentElement.style.setProperty('--theme-progress','0%');
 };
 apply(localStorage.getItem(key)||'default');
 picker.addEventListener('change',()=>{apply(picker.value);document.body.classList.remove('theme-switching');void document.body.offsetWidth;document.body.classList.add('theme-switching');setTimeout(()=>document.body.classList.remove('theme-switching'),550);});
 let ticking=false;addEventListener('pointermove',e=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*100).toFixed(1)+'%');document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*100).toFixed(1)+'%');ticking=false;});},{passive:true});
})();
