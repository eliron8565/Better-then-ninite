/* AppForge Setup Studio. All profiles and preferences are stored locally.
   Script files are exported for user review, never executed by the website. */
(function(root){
'use strict';
const PROFILE_KEY='appforge-profiles-v1', CHECK_KEY='appforge-format-checklist-v1';
const CHECKS=[
['backup','Back up documents, photos, projects, browser profiles and game saves.'],
['drivers','Save a network/Wi-Fi driver and prepare your Windows installation USB.'],
['accounts','Confirm that your Microsoft and password-manager account logins work.'],
['profile','Export your AppForge profile to a USB drive.'],
['installer','Save the personalized AppForge EXE to USB and verify its SHA256.'],
['test','Test a small installation before formatting; keep an internet connection ready.']
];
const norm=x=>String(x??'').trim().toLowerCase();
const category=(app,os)=>{
 const p=app?.pkg?.[os];
 if(!p)return 'unavailable';
 if(os==='windows')return String(p).startsWith('url:https://')?'manual':/^(?:msstore:)?[a-z0-9.+_-]+$/i.test(p)?'automatic':'unavailable';
 if(os==='mac')return p.type==='url'?'manual':'package';
 return String(p).startsWith('url:')?'manual':'package';
};
const selectedApps=(catalog,keys,os)=>{const s=new Set(keys);return catalog.filter(a=>s.has(a.key)&&a.pkg?.[os]);};
function exportProfile(catalog,keys,os,name){
 if(!['windows','linux','mac'].includes(os))throw Error('Unsupported platform');
 return {format:'appforge-profile',version:1,name:String(name||'My setup').trim().slice(0,70)||'My setup',platform:os,createdAt:new Date().toISOString(),
 apps:selectedApps(catalog,keys,os).map(a=>({key:a.key,name:a.name,packageId:os==='windows'?a.pkg.windows:undefined}))};
}
function parseProfile(text,catalog,currentOS='windows'){
 if(typeof text!=='string'||text.length>1000000)throw Error('JSON exceeds 1 MB.');
 let obj;try{obj=JSON.parse(text)}catch{throw Error('Invalid JSON.')}
 if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Expected JSON object.');
 const winget=Array.isArray(obj.Sources);
 const forge=obj.format==='appforge-profile'&&obj.version===1&&Array.isArray(obj.apps);
 if(!winget&&!forge)throw Error('Import an AppForge profile or Winget export JSON.');
 const os=winget?'windows':['windows','linux','mac'].includes(obj.platform)?obj.platform:currentOS;
 const entries=winget?obj.Sources.flatMap(s=>Array.isArray(s.Packages)?s.Packages.map(p=>p?.PackageIdentifier).filter(x=>typeof x==='string'):[]):obj.apps;
 if(entries.length>2000)throw Error('Too many entries.');
 const keys=new Map(catalog.map(a=>[norm(a.key),a]));
 const ids=new Map(catalog.filter(a=>typeof a.pkg?.windows==='string'&&!a.pkg.windows.startsWith('url:')).map(a=>[norm(a.pkg.windows).replace(/^msstore:/,''),a]));
 const matched=new Set(),unmatched=[];
 for(const entry of entries){
   const objEntry=typeof entry==='string'?{key:entry,packageId:entry}:entry;
   const hit=winget?ids.get(norm(entry)):objEntry&&typeof objEntry==='object'
     ?keys.get(norm(objEntry.key))||ids.get(norm(objEntry.packageId).replace(/^msstore:/,'')):null;
   if(hit&&hit.pkg?.[os])matched.add(hit.key);
   else unmatched.push(String(winget?entry:(objEntry?.name||objEntry?.key||'Unknown')).slice(0,100));
 }
 return {os,format:winget?'winget':'appforge',keys:[...matched],total:entries.length,unmatched};
}
function windowsScript(catalog,keys,mode){
 if(!['install','upgrade','uninstall'].includes(mode))throw Error('Invalid action');
 const chosen=selectedApps(catalog,keys,'windows'),manual=chosen.filter(a=>category(a,'windows')==='manual'),automatic=chosen.filter(a=>category(a,'windows')==='automatic');
 const lines=['# AppForge Setup Studio — review before executing.','## Mode: '+mode,'$ErrorActionPreference = "Continue"',
 'if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { Write-Error "Install Microsoft App Installer first."; exit 1 }','$failures = 0'];
 if(mode==='uninstall')lines.push('Write-Warning "This script will REMOVE selected installed applications."','$answer = Read-Host "Type REMOVE to proceed"','if ($answer -cne "REMOVE") { exit 1 }');
 for(const a of automatic){
  const value=a.pkg.windows,store=value.startsWith('msstore:'),id=store?value.slice(8):value;
  if(!/^[a-z0-9.+_-]+$/i.test(id))continue;
  const flags=mode==='install'?' --silent --accept-package-agreements --accept-source-agreements':' --accept-source-agreements';
  lines.push('# '+a.name.replace(/[\r\n]/g,' '),'& winget '+mode+" --id '"+id+"' --exact --source "+(store?'msstore':'winget')+flags,
  'if ($LASTEXITCODE -ne 0) { $failures++; Write-Warning "Failed: '+id+'" }');
 }
 if(manual.length){
  lines.push('# MANUAL: these are vendor download pages, not automatic installs.');
  for(const a of manual)lines.push('# '+a.name.replace(/[\r\n]/g,' ')+': '+a.pkg.windows.slice(4));
  lines.push('Write-Warning "'+manual.length+' manual setups still required."');
 }
 lines.push('Write-Host "Done. Failed commands: $failures. Manual setups: '+manual.length+'."','if ($failures -gt 0) { exit 1 }');
 return {content:lines.join('\r\n')+'\r\n',automatic:automatic.length,manual:manual.length,total:chosen.length};
}
const core={category,selectedApps,exportProfile,parseProfile,windowsScript};
if(typeof module!=='undefined'&&module.exports)module.exports=core;
if(typeof document==='undefined')return;
root.AppForgeStudio=core;
const $=id=>document.getElementById(id);
function message(value,bad=false){const n=$('studioFeedback');if(n){n.textContent=value;n.classList.toggle('studio-danger',bad)}}
function fileDownload(body,filename,type){
 const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),6000);
}
function saved(){try{const j=JSON.parse(localStorage.getItem(PROFILE_KEY)||'[]');return Array.isArray(j)?j.filter(x=>x?.format==='appforge-profile').slice(0,20):[]}catch{return []}}
function saveProfiles(v){localStorage.setItem(PROFILE_KEY,JSON.stringify(v.slice(0,20)))}
function current(){return selectedApps(apps,selected,platform).map(a=>a.key)}
function profile(){return exportProfile(apps,current(),platform,$('studioProfileName').value)}
function restore(keys,os){
 if(!['windows','linux','mac'].includes(os))throw Error('Invalid OS');
 const valid=new Set(apps.filter(a=>a.pkg?.[os]).map(a=>a.key));platform=os;localStorage.setItem('appforge-platform',os);
 selected.clear();for(const k of keys)if(valid.has(k))selected.add(k);
 saveSelection();updatePlatformUI();refresh();
}
function savedSelect(){
 const e=$('studioSaved'),old=e.value;e.replaceChildren();
 const list=saved();if(!list.length)e.add(new Option('No saved setups',''));
 list.forEach((p,i)=>e.add(new Option(p.name+' · '+p.platform+' · '+p.apps.length+' apps',String(i))));
 if(list.some((_,i)=>String(i)===old))e.value=old;
}
function refresh(){
 if(!$('setupStudio'))return;
 const a=selectedApps(apps,selected,platform);
 $('studioTotal').textContent=a.length;
 $('studioAuto').textContent=platform==='windows'?a.filter(x=>category(x,platform)==='automatic').length:'—';
 $('studioManual').textContent=a.filter(x=>category(x,platform)==='manual').length;
 $('studioWin').hidden=platform!=='windows';
 $('studioPlatform').textContent=platform==='mac'?'macOS':platform==='linux'?'Linux':'Windows';
 const tags=$('studioPills');tags.replaceChildren();
 for(const app of a.slice(0,14)){
  const tag=document.createElement('span');tag.className='studio-pill'+(category(app,platform)==='manual'?' manual':'');tag.textContent=app.name+(category(app,platform)==='manual'?' · Manual':'');tags.appendChild(tag);
 }
 if(a.length>14){const tag=document.createElement('span');tag.className='studio-pill';tag.textContent='+'+(a.length-14);tags.appendChild(tag)}
 if(!a.length){const tag=document.createElement('span');tag.textContent='Select apps from the catalog below.';tags.appendChild(tag)}
 $('studioPreview').textContent=platform==='windows'?windowsScript(apps,current(),$('studioAction').value).content:'Select Windows for a PowerShell preview.';
}
function markChecks(){
 let state={};try{state=JSON.parse(localStorage.getItem(CHECK_KEY)||'{}')||{}}catch{}
 const area=$('studioChecks');area.replaceChildren();
 for(const [key,value] of CHECKS){
  const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');
  input.type='checkbox';input.checked=state[key]===true;span.textContent=value;
  input.addEventListener('change',()=>{state[key]=input.checked;localStorage.setItem(CHECK_KEY,JSON.stringify(state));countChecks()});
  label.append(input,span);area.appendChild(label);
 }
 function countChecks(){$('studioChecksTotal').textContent=area.querySelectorAll('input:checked').length+' / '+CHECKS.length+' completed'}
 countChecks();
}
function setup(){
 const target=$('apps-section');if(!target||$('setupStudio'))return;
 const area=document.createElement('section');area.id='setupStudio';area.className='studio-wrap';
 area.innerHTML=[
 '<div class="studio-hero"><div><span class="studio-overline">APPFORGE · SETUP STUDIO</span><h2>Your apps. Your setup. Ready for your next PC.</h2>',
 '<p>Back up your app selection, import a Winget list, and prepare safely for a clean Windows install. No account required.</p></div>',
 '<strong class="studio-platform" id="studioPlatform">Windows</strong></div>',
 '<div class="studio-stats"><div><small>Chosen apps</small><strong id="studioTotal">0</strong></div>',
 '<div><small>Automatic on Windows</small><strong id="studioAuto">0</strong></div>',
 '<div><small>Manual vendor setups</small><strong id="studioManual">0</strong></div></div>',
 '<div class="studio-pills" id="studioPills"></div>',
 '<div class="studio-grid">',
 '<article class="studio-card"><span class="studio-overline">01 · BACKUP AND RESTORE</span><h3>Save your PC setup</h3>',
 '<p>Keep your chosen apps as a small JSON file on a USB. Import AppForge JSON or the JSON from <code>winget export</code>.</p>',
 '<label for="studioProfileName">Setup name</label><input id="studioProfileName" type="text" maxlength="70" value="My new PC">',
 '<div class="studio-controls"><button id="studioSave" type="button">Save locally</button><button id="studioExport" type="button">Download JSON</button><button id="studioImport" type="button">Import JSON</button></div>',
 '<input type="file" id="studioFile" accept=".json,application/json" hidden>',
 '<label for="studioSaved">Saved setups in this browser</label><div class="studio-controls">',
 '<select id="studioSaved" aria-label="Saved setups"></select><button id="studioLoad" type="button">Load</button><button id="studioDelete" class="subtle" type="button">Delete</button></div>',
 '<small>Local saves disappear if you format this PC. Always download JSON to USB!</small></article>',
 '<article class="studio-card" id="studioWin"><span class="studio-overline">02 · WINGET TOOLS</span><h3>Install, update or uninstall</h3>',
 '<p>Create a PowerShell script for chosen apps. The website does not run commands. Uninstall requires confirmation.</p>',
 '<label for="studioAction">Choose an operation</label><select id="studioAction"><option value="install">Install selected apps</option>',
 '<option value="upgrade">Update selected apps</option><option value="uninstall">Uninstall selected apps</option></select>',
 '<div class="studio-controls"><button id="studioCopy" type="button">Copy script</button><button id="studioScript" type="button">Download .ps1</button></div>',
 '<details><summary>Preview the complete script</summary><pre id="studioPreview"></pre></details>',
 '<div class="studio-hint"><strong>Already have a PC with apps installed?</strong><p>Run this in PowerShell to export a Winget list, then import the file above.</p>',
 '<code>winget export -o "$env:USERPROFILE\\Desktop\\winget-apps.json" --accept-source-agreements</code>',
 '<button id="studioWinget" type="button">Copy Winget export command</button></div></article></div>',
 '<details class="studio-check" open><summary>03 · Before-formatting checklist <small id="studioChecksTotal"></small></summary>',
 '<div id="studioChecks"></div><p>These checkboxes are reminders, not an automatic system check. Copy your app profile and personalized EXE to USB; installations require internet.</p></details>',
 '<p class="studio-feedback" id="studioFeedback" role="status" aria-live="polite"></p>'
 ].join('');
 target.parentNode.insertBefore(area,target);
 $('studioSave').onclick=()=>{
  const p=profile();if(!p.apps.length)return message('Choose some apps first.',true);
  const list=saved(),idx=list.findIndex(x=>x.name===p.name&&x.platform===p.platform);
  if(idx>=0){if(!confirm('Replace the saved setup '+p.name+'?'))return;list.splice(idx,1)}
  list.unshift(p);saveProfiles(list);savedSelect();message('Saved locally. Download JSON before formatting!');
 };
 $('studioExport').onclick=()=>{
  const p=profile();if(!p.apps.length)return message('Choose some apps first.',true);
  fileDownload(JSON.stringify(p,null,2),'AppForge-'+p.platform+'-profile.json','application/json');
  message('Profile downloaded. Keep it on USB.');
 };
 $('studioImport').onclick=()=>$('studioFile').click();
 $('studioFile').onchange=async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
   if(file.size>1000000)throw Error('File exceeds 1 MB.');
   const p=parseProfile(await file.text(),apps,platform);
   if(!p.keys.length)throw Error('No matching apps. Your selection was not changed.');
   if(current().length&&!confirm('Replace your selected apps with '+p.keys.length+' imported apps?'))return;
   restore(p.keys,p.os);
   message('Imported '+p.keys.length+'/'+p.total+' ('+p.format+'). '+(p.unmatched.length?p.unmatched.length+' not matched: '+p.unmatched.slice(0,4).join(', '):'All matched.'));
  }catch(e){message(e.message,true)}finally{event.target.value=''}
 };
 $('studioLoad').onclick=()=>{
  const p=saved()[Number($('studioSaved').value)];if(!p)return message('No saved setup.',true);
  try{
   const imported=parseProfile(JSON.stringify(p),apps,platform);
   if(!imported.keys.length)throw Error('No matching applications.');
   if(current().length&&!confirm('Replace current selection?'))return;
   restore(imported.keys,imported.os);message('Loaded '+imported.keys.length+' apps from '+p.name+'.');
  }catch(e){message(e.message,true)}
 };
 $('studioDelete').onclick=()=>{
  const list=saved(),i=Number($('studioSaved').value);
  if(!list[i]||!confirm('Delete this saved setup?'))return;
  list.splice(i,1);saveProfiles(list);savedSelect();message('Saved setup deleted.');
 };
 $('studioAction').onchange=refresh;
 function chosenScript(){
  const p=windowsScript(apps,current(),$('studioAction').value);
  if(!p.automatic)throw Error('Select at least one automatically managed Windows app.');
  return p;
 }
 $('studioCopy').onclick=async()=>{
  try{const p=chosenScript();await navigator.clipboard.writeText(p.content);message('Script copied. '+p.automatic+' package commands; '+p.manual+' manual steps.');}
  catch(e){message(e.message,true)}
 };
 $('studioScript').onclick=()=>{
  try{const p=chosenScript();fileDownload(p.content,'AppForge-'+$('studioAction').value+'.ps1','text/plain');message('PowerShell script downloaded. Review before running.');}
  catch(e){message(e.message,true)}
 };
 $('studioWinget').onclick=async()=>{
  try{await navigator.clipboard.writeText('winget export -o "$env:USERPROFILE\\Desktop\\winget-apps.json" --accept-source-agreements');message('Export command copied. Run on your old PC.')}
  catch{message('Clipboard unavailable; select and copy the command above.',true)}
 };
 markChecks();savedSelect();refresh();
 document.addEventListener('change',e=>{if(e.target?.matches('#catalog input'))setTimeout(refresh,0)});
 document.addEventListener('click',e=>{if(e.target?.closest('.preset-btn,.platform-btn,#clearSelection,#reviewButton,#loadSetup,#newPcPreset,#creatorPreset'))setTimeout(refresh,0)});
 const count=$('selectionCount');
 if(count&&typeof MutationObserver!=='undefined')new MutationObserver(refresh).observe(count,{childList:true,subtree:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);
else setup();
})(typeof window!=='undefined'?window:globalThis);
