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
 const key='appforge-theme';
 const eyebrow=document.createElement('div');eyebrow.className='theme-scene-eyebrow';
 const label=document.createElement('div');label.className='theme-scene-label';
 const sub=document.createElement('div');sub.className='theme-scene-sub';
 const hero=document.querySelector('.hero-copy');
 if(hero){hero.prepend(eyebrow);const badges=hero.querySelector('.hero-badges');if(badges){badges.before(label,sub);}}
 const status=document.createElement('div');status.className='theme-status';status.setAttribute('aria-hidden','true');document.body.append(status);
 const apply=value=>{
  const theme=themes.includes(value)?value:'default';
  document.body.classList.remove(...themes);
  if(theme!=='default')document.body.classList.add(theme);
  picker.value=theme;localStorage.setItem(key,theme);
  const [e,l,subline]=config[theme];eyebrow.textContent=e;label.textContent=l;sub.textContent=subline;
  status.textContent=theme==='default'?'APPFORGE // READY':e;
  document.documentElement.style.setProperty('--theme-progress','0%');
 };
 apply(localStorage.getItem(key)||'default');
 picker.addEventListener('change',()=>{apply(picker.value);document.body.classList.remove('theme-switching');void document.body.offsetWidth;document.body.classList.add('theme-switching');setTimeout(()=>document.body.classList.remove('theme-switching'),550);});
 let ticking=false;addEventListener('pointermove',e=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*100).toFixed(1)+'%');document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*100).toFixed(1)+'%');ticking=false;});},{passive:true});
})();
