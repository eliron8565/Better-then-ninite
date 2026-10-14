// AppForge reliable personalized downloads.
(function () {
  const KEY_MARKER='\nAPPFORGE_KEYS_V1:';

  function saveBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
  async function fetchFile(path){const r=await fetch(`${path}${path.includes('?')?'&':'?'}v=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`${path.split('/').pop()} is unavailable (${r.status}).`);return r}

  function windowsIndexes(chosen){return [...new Set(chosen.map(a=>Number(a.winIndex)).filter(i=>Number.isInteger(i)&&i>=0&&i<=167))].sort((a,b)=>a-b)}
  function windowsSelectionToken(chosen){
    const ids=windowsIndexes(chosen);if(!ids.length)throw new Error('Could not prepare the Windows app selection.');
    // 21 bytes = indexes 0..167. No random bytes: every bit is selection data.
    // Variable-length Base64URL bitsets are supported by the installer.
    const bytes=new Uint8Array(21);for(const i of ids)bytes[Math.floor(i/8)]|=1<<(i%8);
    let s='';for(const b of bytes)s+=String.fromCharCode(b);
    return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function windowsName(chosen){return `AppForge-${windowsSelectionToken(chosen)}.exe`}

  function downloadWindows(chosen){
    // Same-origin download keeps the personalized filename without loading/mutating a 70MB EXE in browser memory.
    const a=document.createElement('a');
    a.href=`downloads/AppForge-Windows.exe?v=${Date.now()}`;
    a.download=windowsName(chosen);
    document.body.appendChild(a);a.click();a.remove();
  }

  async function downloadLinux(chosen){const r=await fetchFile('downloads/AppForge-Linux.AppImage');const base=await r.arrayBuffer();if(base.byteLength<10000)throw new Error('Linux AppImage is not ready yet.');const data=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);saveBlob(new Blob([base,data],{type:'application/octet-stream'}),'AppForge-Linux.AppImage')}
  async function downloadMac(chosen){if(typeof JSZip==='undefined')throw new Error('macOS packager did not load. Refresh and try again.');const r=await fetchFile('downloads/AppForge-macOS.zip');const zip=await JSZip.loadAsync(await r.arrayBuffer());const entry=zip.file('AppForge.app/Contents/MacOS/AppForge');if(!entry)throw new Error('macOS app package is invalid.');const binary=await entry.async('uint8array');const marker=new TextEncoder().encode(`${KEY_MARKER}${chosen.map(a=>a.key).join(',')}:END\n`);const combined=new Uint8Array(binary.length+marker.length);combined.set(binary);combined.set(marker,binary.length);zip.file('AppForge.app/Contents/MacOS/AppForge',combined,{binary:true,unixPermissions:0o755});saveBlob(await zip.generateAsync({type:'blob',platform:'UNIX',compression:'DEFLATE'}),'AppForge-macOS.zip')}

  const linuxNative = {
    'nmap':{apt:'nmap',dnf:'nmap',pacman:'nmap',zypper:'nmap'},
    'john-the-ripper':{apt:'john',dnf:'john',pacman:'john',zypper:'john'},

    'bottles':{apt:'bottles',dnf:'bottles',pacman:'bottles'},
    'lutris':{apt:'lutris',dnf:'lutris',pacman:'lutris',zypper:'lutris'},
    'protonup-qt':{pacman:'protonup-qt'},
    'gamemode':{apt:'gamemode',dnf:'gamemode',pacman:'gamemode',zypper:'gamemode'},
    'mangohud':{apt:'mangohud',dnf:'mangohud',pacman:'mangohud',zypper:'mangohud'},
    'winetricks':{apt:'winetricks',dnf:'winetricks',pacman:'winetricks',zypper:'winetricks'},
    'yazi':{apt:'yazi',dnf:'yazi',pacman:'yazi',zypper:'yazi'},
    'krusader':{apt:'krusader',dnf:'krusader',pacman:'krusader',zypper:'krusader'},
    'gnome-files':{apt:'nautilus',dnf:'nautilus',pacman:'nautilus',zypper:'nautilus'},
    'konqueror':{apt:'konqueror',dnf:'konqueror',pacman:'konqueror',zypper:'konqueror'},
    'double-commander':{apt:'doublecmd-gtk',dnf:'doublecmd-gtk',pacman:'doublecmd-gtk2',zypper:'doublecmd-gtk'},
    'midnight-commander':{apt:'mc',dnf:'mc',pacman:'mc',zypper:'mc'},
    'dolphin':{apt:'dolphin',dnf:'dolphin',pacman:'dolphin',zypper:'dolphin'},
    'ranger':{apt:'ranger',dnf:'ranger',pacman:'ranger',zypper:'ranger'},
    'thunar':{apt:'thunar',dnf:'thunar',pacman:'thunar',zypper:'thunar'},
    'pcmanfm':{apt:'pcmanfm',dnf:'pcmanfm',pacman:'pcmanfm',zypper:'pcmanfm'},
    'vifm':{apt:'vifm',dnf:'vifm',pacman:'vifm',zypper:'vifm'},
    'caja':{apt:'caja',dnf:'caja',pacman:'caja',zypper:'caja'},
    'lf':{apt:'lf',dnf:'lf',pacman:'lf',zypper:'lf'},
    'nemo':{apt:'nemo',dnf:'nemo',pacman:'nemo',zypper:'nemo'},
    'superfile':{},
    'vim':{apt:'vim',dnf:'vim-enhanced',pacman:'vim',zypper:'vim'},
    'wine':{apt:'wine',dnf:'wine',pacman:'wine',zypper:'wine'},
    'vlc-media-player':{apt:'vlc',dnf:'vlc',pacman:'vlc',zypper:'vlc'},
    'mozilla-firefox':{apt:'firefox',dnf:'firefox',pacman:'firefox',zypper:'MozillaFirefox'},
    'git':{apt:'git',dnf:'git',pacman:'git',zypper:'git'},
    'python-3':{apt:'python3',dnf:'python3',pacman:'python',zypper:'python3'},
    'gimp':{apt:'gimp',dnf:'gimp',pacman:'gimp',zypper:'gimp'},
    'blender':{apt:'blender',dnf:'blender',pacman:'blender',zypper:'blender'},
    'inkscape':{apt:'inkscape',dnf:'inkscape',pacman:'inkscape',zypper:'inkscape'},
    'krita':{apt:'krita',dnf:'krita',pacman:'krita',zypper:'krita'},
    'libreoffice':{apt:'libreoffice',dnf:'libreoffice',pacman:'libreoffice-fresh',zypper:'libreoffice'},
    'audacity':{apt:'audacity',dnf:'audacity',pacman:'audacity',zypper:'audacity'},
    'obs-studio':{apt:'obs-studio',dnf:'obs-studio',pacman:'obs-studio',zypper:'obs-studio'},
    'qbittorrent':{apt:'qbittorrent',dnf:'qbittorrent',pacman:'qbittorrent',zypper:'qbittorrent'},
    'keepassxc':{apt:'keepassxc',dnf:'keepassxc',pacman:'keepassxc',zypper:'keepassxc'},
    'vlc':{apt:'vlc',dnf:'vlc',pacman:'vlc',zypper:'vlc'},
    'firefox':{apt:'firefox',dnf:'firefox',pacman:'firefox',zypper:'MozillaFirefox'},
    'python':{apt:'python3',dnf:'python3',pacman:'python',zypper:'python3'},
    'obs':{apt:'obs-studio',dnf:'obs-studio',pacman:'obs-studio',zypper:'obs-studio'}
  };
  function linuxCommand(chosen){
    const chosenManager=document.querySelector('#linuxPackageManager')?.value||'auto';
    const managerBin={apt:'apt-get',dnf:'dnf',pacman:'pacman',zypper:'zypper',apk:'apk',xbps:'xbps-install',emerge:'emerge',eopkg:'eopkg',nix:'nix'};
    const nativeExtra={
      apk:{'nmap':'nmap','john-the-ripper':'john','wine':'wine','vim':'vim','git':'git','python-3':'python3','gnome-files':'nautilus','midnight-commander':'mc','ranger':'ranger','thunar':'thunar','pcmanfm':'pcmanfm','vifm':'vifm','nemo':'nemo','dolphin':'dolphin','lutris':'lutris','gamemode':'gamemode','mangohud':'mangohud','winetricks':'winetricks'},
      xbps:{'nmap':'nmap','john-the-ripper':'john','wine':'wine','vim':'vim','git':'git','python-3':'python3','gnome-files':'nautilus','midnight-commander':'mc','ranger':'ranger','thunar':'thunar','pcmanfm':'pcmanfm','vifm':'vifm','nemo':'nemo','dolphin':'dolphin','lutris':'lutris','gamemode':'gamemode','mangohud':'mangohud','winetricks':'winetricks'},
      emerge:{'nmap':'net-analyzer/nmap','john-the-ripper':'app-crypt/johntheripper','wine':'app-emulation/wine-vanilla','vim':'app-editors/vim','git':'dev-vcs/git','python-3':'dev-lang/python','gnome-files':'gnome-base/nautilus','midnight-commander':'app-misc/mc','ranger':'app-misc/ranger','thunar':'xfce-base/thunar','dolphin':'kde-apps/dolphin','lutris':'games-util/lutris','gamemode':'games-util/gamemode','mangohud':'games-util/mangohud','winetricks':'app-emulation/winetricks'},
      eopkg:{'nmap':'nmap','wine':'wine','vim':'vim','git':'git','python-3':'python3','gnome-files':'nautilus','midnight-commander':'mc','ranger':'ranger','thunar':'thunar','dolphin':'dolphin','lutris':'lutris'},
      nix:{'nmap':'nmap','john-the-ripper':'john','wine':'wine','vim':'vim','git':'git','python-3':'python3','gnome-files':'nautilus','midnight-commander':'mc','ranger':'ranger','thunar':'xfce.thunar','dolphin':'kdePackages.dolphin','gamemode':'gamemode','mangohud':'mangohud','winetricks':'winetricks','lutris':'lutris'}
    };
    const managers=Object.keys(managerBin);
    const shell=v=>"'"+String(v).replace(/'/g,"'\\''")+"'";
    const flatpakIds=chosen.filter(a=>typeof a.pkg?.linux==='string'&&/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/.test(a.pkg.linux)).map(a=>a.pkg.linux);
    const urls=chosen.filter(a=>a.pkg?.linux?.startsWith('url:https://')).map(a=>a.pkg.linux.slice(4));
    const installables=chosen.filter(a=>a.pkg?.linux?.startsWith('native:')||flatpakIds.includes(a.pkg?.linux));
    if(!installables.length&&!urls.length)return '';
    const lines=['#!/usr/bin/env bash','# AppForge Linux installer — review before running.','# Select manager: '+chosenManager,'set -u',
      'manager='+shell(chosenManager),'if [ "$manager" = auto ]; then',
      ...managers.map((m,i)=>(i?'elif':'if')+' command -v '+managerBin[m]+' >/dev/null 2>&1; then manager='+m),
      'else manager=none; fi','fi',
      'echo "AppForge package manager: $manager"'];
    for(const m of managers){
      const mappings=installables.map(a=>({a,p:(linuxNative[a.key]?.[m]||nativeExtra[m]?.[a.key])})).filter(x=>x.p);
      if(!mappings.length)continue;
      const prefix={apt:'sudo apt-get update && sudo apt-get install -y',dnf:'sudo dnf install -y',pacman:'sudo pacman -S --needed --noconfirm',zypper:'sudo zypper install -y',apk:'sudo apk add',xbps:'sudo xbps-install -Sy',emerge:'sudo emerge --ask=n',eopkg:'sudo eopkg install -y',nix:'nix profile install'}[m];
      const packages=[...new Set(mappings.map(x=>m==='nix'?'nixpkgs#'+x.p:x.p))];
      lines.push('if [ "$manager" = '+m+' ]; then');
      lines.push('  if '+managerBin[m]+' --version >/dev/null 2>&1; then');
      lines.push('    '+prefix+' '+packages.map(shell).join(' ')+' || echo "Native installation failed; inspect package names or repositories."');
      lines.push('  else echo "Selected manager '+m+' is not installed."; fi');
      lines.push('fi');
    }
    // Flatpak apps are installed regardless of whether native apps are also selected.
    // Do not install a second copy when the current manager already handles that app.
    for(const a of installables){
      const id=a.pkg?.linux;
      const hasFlatpak=flatpakIds.includes(id);
      if(!hasFlatpak)continue;
      const nativeManagers=managers.filter(m=>linuxNative[a.key]?.[m]||nativeExtra[m]?.[a.key]);
      lines.push('if '+(chosenManager==='flatpak'?'true':nativeManagers.length?'[ "$manager" != '+nativeManagers.map(shell).join(' ] && [ "$manager" != ')+' ]':'true')+'; then');
      lines.push('  if command -v flatpak >/dev/null 2>&1; then');
      lines.push('    flatpak remote-add --user --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo && flatpak install --user -y flathub '+shell(id));
      lines.push('  else echo '+shell('Flatpak is required for '+a.name+': https://flatpak.org/setup/')+'; fi');
      lines.push('fi');
    }
    for(const a of installables.filter(a=>a.pkg?.linux?.startsWith('native:'))){
      const supporting=managers.filter(m=>linuxNative[a.key]?.[m]||nativeExtra[m]?.[a.key]);
      lines.push('if '+(supporting.length?'[ "$manager" != '+supporting.map(shell).join(' ] && [ "$manager" != ')+' ]':'true')+'; then echo '+shell('No verified native package mapping for '+a.name+' on the selected manager. See the project website.')+'; fi');
    }
    for(const url of urls)lines.push('echo '+shell('Official/manual install: '+url));
    lines.push('echo "AppForge: installation commands finished. Review any warnings above."');
    return "bash <<'APPFORGE_INSTALL'\n"+lines.join('\n')+"\nAPPFORGE_INSTALL";
  }
  function commandFor(chosen){if(platform==='windows'){const vals=chosen.map(a=>a.pkg?.windows).filter(Boolean);const cmds=[];for(const item of vals){if(String(item).startsWith('url:https://')){const u=String(item).slice(4).replace(/'/g,"''");cmds.push("Start-Process '"+u+"'");}else if(/^[A-Za-z0-9.+_-]+$/.test(String(item))){cmds.push('winget install --id "'+item+'" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity');}}return cmds.join(' ; ')}if(platform==='linux')return linuxCommand(chosen);const pkgs=chosen.map(a=>a.pkg.mac).filter(Boolean),f=pkgs.filter(p=>p.type==='formula').map(p=>p.id),c=pkgs.filter(p=>p.type==='cask').map(p=>p.id),parts=[];if(f.length)parts.push(`brew install ${f.map(x=>`"${x}"`).join(' ')}`);if(c.length)parts.push(`brew install --cask ${c.map(x=>`"${x}"`).join(' ')}`);const urls=pkgs.filter(p=>p.type==='url').map(p=>p.id);if(urls.length)parts.push(urls.map(u=>'open "'+u+'"').join(' ; '));return parts.join(' ; ')}
  function refreshCommand(){const box=document.querySelector('#installCommand'),hint=document.querySelector('#commandHint');if(!box)return;const chosen=availableApps().filter(a=>selected.has(a.key)),cmd=commandFor(chosen);const mgr=document.querySelector('#linuxManagerWrap');if(mgr)mgr.style.display=platform==='linux'?'block':'none';box.textContent=cmd||'No compatible packages found for this manager. Try Flatpak or select another app.';if(hint)hint.textContent=platform==='windows'?'PowerShell: Winget installs supported apps; official download pages open for manual setups.':platform==='linux'?'Supports APT, DNF, Pacman, Zypper, APK, XBPS, Portage, Eopkg, Nix and Flatpak where package mappings exist. Review script and warnings before running.':'Runs with Homebrew.'}
  // Download a complete, readable shell script for the current Linux selection.
  function wireLinuxExport(){
    const target=document.querySelector('.dialog-actions');if(!target||document.querySelector('#downloadLinuxCommands'))return;
    const button=document.createElement('button');button.type='button';button.id='downloadLinuxCommands';button.className='command-copy';button.textContent='⬇ Download Linux install script (.sh)';
    button.addEventListener('click',()=>{
      if(platform!=='linux')return;
      const chosen=availableApps().filter(a=>selected.has(a.key));
      const command=linuxCommand(chosen);if(!command)return;
      const script=command.replace(/^bash <<'APPFORGE_INSTALL'\n/,'').replace(/\nAPPFORGE_INSTALL$/,'')+'\n';
      saveBlob(new Blob([script],{type:'text/x-shellscript;charset=utf-8'}),'AppForge-Linux-Install.sh');
    });
    target.appendChild(button);
    const refresh=()=>{button.style.display=platform==='linux'?'inline-block':'none';};
    document.querySelectorAll('.platform-btn').forEach(btn=>btn.addEventListener('click',()=>requestAnimationFrame(refresh)));
    refresh();
  }
  function wireCommand(){wireLinuxExport();const mgr=document.querySelector('#linuxPackageManager');if(mgr&&!mgr.dataset.wired){mgr.dataset.wired='1';mgr.addEventListener('change',refreshCommand);}const copy=document.querySelector('#copyInstallCommand');if(copy&&!copy.dataset.wired){copy.dataset.wired='1';copy.addEventListener('click',async()=>{refreshCommand();const text=document.querySelector('#installCommand')?.textContent||'';if(!text||text.startsWith('No compatible'))return;try{await navigator.clipboard.writeText(text);const old=copy.textContent;copy.textContent='✓ Copied';setTimeout(()=>copy.textContent=old,1600)}catch{alert('Could not copy automatically.')}})}const review=document.querySelector('#reviewButton');if(review&&!review.dataset.commandWired){review.dataset.commandWired='1';review.addEventListener('click',()=>setTimeout(refreshCommand,0))}}
  function wire(){const old=document.querySelector('#downloadScript');if(!old||old.dataset.nativeDownload==='1'){wireCommand();return}const button=old.cloneNode(true);button.dataset.nativeDownload='1';old.replaceWith(button);button.addEventListener('click',async()=>{const chosen=availableApps().filter(a=>selected.has(a.key));if(!chosen.length)return;const oldText=button.textContent;button.disabled=true;button.textContent=platform==='windows'?'Downloading AppForge…':'Preparing AppForge…';try{if(platform==='windows')downloadWindows(chosen);else if(platform==='linux')await downloadLinux(chosen);else await downloadMac(chosen)}catch(e){alert(`AppForge: ${e.message}`)}finally{button.disabled=false;button.textContent=oldText}});wireCommand()}
  wire();
})();