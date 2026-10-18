/* AppForge Windows setup bundle: EXE unchanged, manifest validated against the built-in catalog.
   Uses JSZip only after the user requests a ZIP. Browser remains fully static / GitHub Pages compatible. */
(function(root){
'use strict';
function makeManifest(chosen,exeHash){
  if(!/^[0-9a-f]{64}$/i.test(String(exeHash)))throw new Error('Invalid installer SHA-256.');
  if(!Array.isArray(chosen)||!chosen.length||chosen.length>168)throw new Error('Select 1 to 168 Windows apps.');
  const ids=new Set(),apps=[];
  for(const app of chosen){
    const index=app?.winIndex, pkg=app?.pkg?.windows, name=app?.name;
    if(!Number.isInteger(index)||index<0||index>167||ids.has(index)||
       typeof name!=='string'||!name||typeof pkg!=='string'||
       !(pkg.startsWith('url:https://')||/^msstore:[a-z0-9]+$/i.test(pkg)||/^[a-z0-9.+_-]+$/i.test(pkg)))
      throw new Error('Unsupported or duplicated Windows app in selection.');
    ids.add(index);
    apps.push({index,name,packageId:pkg});
  }
  apps.sort((a,b)=>a.index-b.index);
  return {
    format:'appforge-windows-manifest',
    schemaVersion:1,
    platform:'windows',
    generatedAt:new Date().toISOString(),
    exeSha256:exeHash.toLowerCase(),
    apps
  };
}
const core={makeManifest};
if(typeof module!=='undefined'&&module.exports)module.exports=core;
if(typeof document==='undefined')return;
root.AppForgeWindowsBundle=core;

function install(){
  const host=document.querySelector('.dialog-actions');
  if(!host||document.getElementById('downloadWindowsBundle'))return;
  const btn=document.createElement('button');
  btn.id='downloadWindowsBundle';btn.type='button';btn.className='command-copy';
  btn.textContent='⬇ ZIP + setup JSON (recommended)';
  btn.title='Preserves the EXE and stores your app choices in a verified manifest; requires internet after formatting.';
  const info=document.createElement('small');info.id='bundleStatus';info.setAttribute('role','status');info.setAttribute('aria-live','polite');
  info.style.cssText='display:block;width:100%;padding:5px 2px;color:var(--muted,#94adbf);';
  info.textContent='Optional: download an unchanged EXE with a matching JSON app list. Extract both files into one folder.';
  host.append(btn,info);
  const refresh=()=>{const enabled=platform==='windows';btn.hidden=!enabled;info.hidden=!enabled;};
  document.querySelectorAll('.platform-btn').forEach(b=>b.addEventListener('click',()=>queueMicrotask(refresh)));
  refresh();

  btn.addEventListener('click',async()=>{
    if(platform!=='windows')return;
    const chosen=availableApps().filter(a=>selected.has(a.key));
    if(!chosen.length){info.textContent='Choose apps before downloading.';return;}
    if(typeof JSZip==='undefined'||!root.crypto?.subtle){
      info.textContent='ZIP preparation requires JSZip and a secure (HTTPS) browser. Use personalized EXE instead.';return;
    }
    btn.disabled=true;const previous=btn.textContent;
    try{
      btn.textContent='Preparing setup ZIP…';
      info.textContent='Downloading the Windows EXE. This may require more than 150 MB of free browser memory.';
      const response=await fetch('downloads/AppForge-Windows.exe?v='+Date.now(),{cache:'no-store'});
      if(!response.ok)throw new Error('EXE could not be downloaded (HTTP '+response.status+').');
      const bytes=await response.arrayBuffer();
      if(bytes.byteLength<10*1024*1024||bytes.byteLength>150*1024*1024)throw new Error('Unexpected EXE size. Refresh and try again.');
      info.textContent='Computing SHA-256 and packaging your selection…';
      const digest=await root.crypto.subtle.digest('SHA-256',bytes);
      const sha=[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
      const manifest=makeManifest(chosen,sha);
      const zip=new JSZip();
      zip.file('AppForge-Windows.exe',bytes,{binary:true,compression:'STORE'});
      zip.file('appforge-setup.json',JSON.stringify(manifest,null,2)+'\n',{compression:'STORE'});
      zip.file('README.txt','AppForge Windows Setup\n\nExtract AppForge-Windows.exe and appforge-setup.json to the SAME folder.\nRun the EXE; it verifies its SHA-256 and the listed package IDs before installing.\nAn internet connection and Windows Package Manager (Winget) are required for automatic installations.\nVendor download pages still require manual installation.\nNever run unknown EXEs or edit the package list. Download a fresh ZIP if validation fails.\n',{compression:'STORE'});
      const output=await zip.generateAsync({type:'blob',compression:'STORE',streamFiles:true});
      const url=URL.createObjectURL(output);
      const link=document.createElement('a');link.href=url;link.download='AppForge-Windows-Setup.zip';document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),10000);
      info.textContent='ZIP ready: extract both EXE and JSON to one folder; then run the EXE. Internet still required.';
    }catch(err){
      info.textContent='ZIP failed: '+(err?.message||String(err))+'. The original personalized EXE option remains available.';
    }finally{btn.disabled=false;btn.textContent=previous;}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})(typeof window!=='undefined'?window:globalThis);
