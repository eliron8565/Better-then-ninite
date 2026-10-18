// Extra AppForge catalog entries.
// Windows indexes stay append-only: personalized installer tokens depend on them.
(() => {
  const extras = [
    // Download managers — index 70 is already supported by AppForgeInstaller.
    ['Free Download Manager','Utilities','freedownloadmanager.org',9,'SoftDeluxe.FreeDownloadManager',70,['essentials','free']],

    // More browsers
    ['Zen Browser','Popular Browsers','zen-browser.app',9,'Zen-Team.Zen-Browser',71,['essentials']],
    ['LibreWolf','Privacy Browsers','librewolf.net',8,'LibreWolf.LibreWolf',72,['privacy']],
    ['Floorp','Privacy Browsers','floorp.app',7,'Ablaze.Floorp',73,['privacy']],
    ['Tor Browser','Privacy Browsers','torproject.org',9,'TorProject.TorBrowser',74,['privacy','security']],
    ['Mullvad Browser','Privacy Browsers','mullvad.net/browser',8,'MullvadVPN.MullvadBrowser',75,['privacy','security']],
    ['Waterfox','Privacy Browsers','waterfox.net',7,'Waterfox.Waterfox',76,['privacy']],
    ['Chromium','Alternative Browsers','chromium.org',7,'Hibbiki.Chromium',77,['developer']],
    ['Falkon','Alternative Browsers','falkon.org',6,'KDE.Falkon',78,[]],
    ['Ungoogled Chromium','Privacy Browsers','github.com/ungoogled-software/ungoogled-chromium-windows',7,'eloston.ungoogled-chromium',79,['privacy']],
    ['Firefox ESR','Alternative Browsers','mozilla.org/firefox/enterprise',7,'Mozilla.Firefox.ESR',80,[]],
    ['Thorium Browser','Alternative Browsers','thorium.rocks',7,'Alex313031.Thorium',81,[]],
    ['Arc Browser','Alternative Browsers','arc.net',8,'TheBrowserCompany.Arc',82,[]],
    ['Opera GX','Gaming Browsers','opera.com/gx',9,'Opera.OperaGX',83,['gaming','ai','free']],
    ['DuckDuckGo Browser','Privacy Browsers','duckduckgo.com/windows',8,'DuckDuckGo.DesktopBrowser',84,['privacy']],

    // Privacy & security
    ['Proton VPN','Privacy & Security','protonvpn.com',9,'Proton.ProtonVPN',85,['privacy','security','essentials']],
    ['Mullvad VPN','Privacy & Security','mullvad.net',8,'MullvadVPN.MullvadVPN',86,['privacy','security']],
    ['Proton Pass','Privacy & Security','proton.me/pass',8,'Proton.ProtonPass',87,['privacy','security']],
    ['VeraCrypt','Privacy & Security','veracrypt.fr',8,'IDRIX.VeraCrypt',88,['privacy','security']],
    ['Cryptomator','Privacy & Security','cryptomator.org',7,'Cryptomator.Cryptomator',89,['privacy','security']],
    ['SimpleWall','Privacy & Security','github.com/henrypp/simplewall',8,'Henry++.simplewall',90,['privacy','security']],

    // Local AI / AI desktop
    ['Ollama','AI & Local Models','ollama.com',10,'Ollama.Ollama',91,['ai','developer']],
    ['LM Studio','AI & Local Models','lmstudio.ai',10,'ElementLabs.LMStudio',92,['ai']],
    ['Jan','AI & Local Models','jan.ai',9,'Jan.Jan',93,['ai','privacy']],
    ['GPT4All','AI & Local Models','nomic.ai/gpt4all',8,'Nomic.GPT4All',94,['ai','privacy']],
    ['AnythingLLM','AI & Local Models','anythingllm.com',9,'MintplexLabs.AnythingLLM',95,['ai','agent','privacy']],

    // AI agents / coding assistants
    ['Claude Desktop','AI Agents','claude.ai',9,'Anthropic.Claude',96,['ai','agent']],
    ['ChatGPT Desktop','AI Agents','openai.com/chatgpt/desktop',10,'OpenAI.ChatGPT',97,['ai','agent']],
    ['Cursor','AI Agents','cursor.com',10,'Anysphere.Cursor',98,['ai','agent','developer']],
    ['Windsurf','AI Agents','windsurf.com',9,'Codeium.Windsurf',99,['ai','agent','developer']],
    ['GitHub Desktop + Copilot tools','AI Agents','github.com/features/copilot',7,'url:https://github.com/features/copilot',100,['ai','agent','developer']],

    // Free AI browser. Basic AI features are available without a paid subscription.
    ['Comet Browser','AI Browsers','perplexity.ai',9,'url:https://www.perplexity.ai/comet',101,['ai','agent','free']],

    // PDF tools
    ['PDF24 Creator','Documents & Office','pdf24.org',9,'geeksoftwareGmbH.PDF24Creator',102,['essentials','student','free']],

    // Minecraft creation tools
    ['MCreator','Minecraft','mcreator.net',10,'url:https://mcreator.net/download',103,['gaming','creator','developer','free']],
    ['Minecraft Launcher','Minecraft','minecraft.net',10,'Mojang.MinecraftLauncher',104,['gaming','essentials']],
    ['Modrinth App','Minecraft','modrinth.com',10,'Modrinth.ModrinthApp',105,['gaming','mods','free']],
    ['XMCL','Minecraft','xmcl.app',8,'CI010.XMinecraftLauncher',106,['gaming','mods','free']],
    ['Amulet Editor','Minecraft','amuletmc.com',8,'url:https://www.amuletmc.com/',107,['gaming','creator']],

    // Discord alternative
    ['Root','Messaging','rootapp.com',9,'url:https://www.rootapp.com/',108,['gaming','free']],

    // Minecraft / modding
    ['CurseForge','Minecraft','curseforge.com',10,'Overwolf.CurseForge',109,['gaming','mods']],
    ['Fabric','Minecraft','fabricmc.net',9,'url:https://fabricmc.net/use/installer/',110,['gaming','mods','developer','free']],
    ['NeoForge','Minecraft','neoforged.net',8,'url:https://neoforged.net/',111,['gaming','mods','developer','free']],
    ['Aseprite','Design & Imaging','aseprite.org',8,'url:https://www.aseprite.org/',112,['creator']],

    // Gaming launchers
    ['EA app','Gaming','ea.com/ea-app',9,'ElectronicArts.EADesktop',113,['gaming']],
    ['Ubisoft Connect','Gaming','ubisoftconnect.com',9,'Ubisoft.Connect',114,['gaming']],
    ['GOG GALAXY','Gaming','gog.com/galaxy',9,'GOG.Galaxy',115,['gaming']],
    ['Playnite','Gaming','playnite.link',9,'Playnite.Playnite',116,['gaming','free']],

    // Gaming performance
    ['MSI Afterburner','Gaming','msi.com/Landing/afterburner',9,'url:https://www.msi.com/Landing/afterburner/graphics-cards',117,['gaming']],

    // Cybersecurity
    ['Wireshark','Security','wireshark.org',10,'WiresharkFoundation.Wireshark',118,['security','developer','student']],
    ['Nmap','Security','nmap.org',10,'Insecure.Nmap',119,['security','developer','student']],
    ['VirtualBox','Development','virtualbox.org',9,'Oracle.VirtualBox',120,['developer','student']],
    ['Burp Suite Community','Security','portswigger.net/burp/communitydownload',10,'PortSwigger.BurpSuite.Community',121,['security','developer','student','free']],
    ['OWASP ZAP','Security','zaproxy.org',9,'url:https://www.zaproxy.org/download/',122,['security','developer','student','free']],

    // AI image workflows
    ['ComfyUI','AI & Local Models','comfy.org',9,'url:https://www.comfy.org/download',123,['ai','creator','free']],

    // Content creation / game development
    ['DaVinci Resolve','Media','blackmagicdesign.com/products/davinciresolve',10,'url:https://www.blackmagicdesign.com/products/davinciresolve',124,['creator','free']],
    ['CapCut','Media','capcut.com',9,'url:https://www.capcut.com/tools/desktop-video-editor',125,['creator']],
    ['Kdenlive','Media','kdenlive.org',9,'url:https://kdenlive.org/download/',126,['creator','free']],
    ['Godot','Development','godotengine.org',10,'url:https://godotengine.org/download/',127,['developer','creator','free']],
    ['Unreal Engine','Development','unrealengine.com',10,'url:https://www.unrealengine.com/download',128,['developer','creator','gaming']],
    ['Unity Hub','Development','unity.com/download',10,'url:https://unity.com/download',129,['developer','creator','gaming']],

    // Messaging / Discord alternatives
    ['Revolt','Messaging','revolt.chat',8,'url:https://revolt.chat/',130,['gaming','free']],
    ['Element','Messaging','element.io',9,'url:https://element.io/download',131,['privacy','free']],
    ['Mumble','Messaging','mumble.info',8,'url:https://www.mumble.info/downloads/',132,['gaming','free']],
    ['Guilded','Messaging','guilded.gg',8,'url:https://www.guilded.gg/downloads',134,['gaming','free']],
    ['Anki','Documents & Office','apps.ankiweb.net',9,'Anki.Anki',135,['student','free']],
    ['LocalSend','Utilities','localsend.org',9,'LocalSend.LocalSend',136,['essentials','free']],
    ['Ventoy','Utilities','ventoy.net',9,'Ventoy.Ventoy',137,['developer','free']],
    ['Moonlight','Gaming','moonlight-stream.org',9,'MoonlightGameStreamingProject.Moonlight',138,['gaming','free']],
    ['RetroArch','Gaming','retroarch.com',9,'Libretro.RetroArch',139,['gaming','free']],
    ['EarTrumpet','Utilities','eartrumpet.app',9,'File-New-Project.EarTrumpet',140,['essentials','free']],
    ['SoundSwitch','Utilities','soundswitch.aaflalo.me',9,'AntoineAflalo.SoundSwitch',141,['essentials','free']],
    ['FilmCraft','Media','getartcraft.com',8,'url:https://getartcraft.com/apps/filmcraft',142,['creator','free']],
    ['XAMPP','Development','apachefriends.org',9,'url:https://www.apachefriends.org/download.html',143,['developer','student','free']],
    ['OpenCode','Development','opencode.ai',9,'url:https://opencode.ai/',144,['developer','ai','free']],
    // New Windows entries: never reuse existing selection indices (145/146 are security tools).
    ['Zed','Development','zed.dev',9,'ZedIndustries.Zed',147,['developer','free']],
    ['Kate','Development','kate-editor.org',9,'KDE.Kate',148,['developer','free']],
    ['Apache NetBeans IDE','Development','netbeans.apache.org',9,'Apache.NetBeans',149,['developer','student','free']],
    ['Parabolic','Media','nickvision.org/parabolic.html',9,'Nickvision.Parabolic',150,['media','free']],
    ['Upscayl','Design & Imaging','upscayl.org',9,'Upscayl.Upscayl',151,['creator','ai','free']],
    ['LocalAI','AI & Local Models','localai.io',9,'url:https://localai.io/',152,['ai','developer','free']],
    ['Eden Emulator','Gaming','eden-emu.dev',9,'url:https://eden-emu.dev/downloads/',153,['gaming','free']],
    ['Odysseus AI Workspace','AI & Local Models','odysseus-dev.github.io/odysseus/',8,'url:https://github.com/odysseus-dev/odysseus',154,['ai','developer','free']],
    ['TMOG (Task Manager OG)','Utilities','tmog.org',9,'url:https://tmog.org/',155,['utilities','free']],
    ['VSCodium','Development','vscodium.com',9,'VSCodium.VSCodium',156,['developer','student','free']],
    ['Neovim','Development','neovim.io',9,'Neovim.Neovim',157,['developer','free']],
    ['Helix Editor','Development','helix-editor.com',9,'Helix.Helix',158,['developer','free']],
    ['Filelight','Utilities','apps.kde.org/filelight',8,'KDE.Filelight',159,['essentials','free']],
    ['Pear Desktop','Media','github.com/pear-devs/pear-desktop',8,'pear-devs.pear-desktop',160,['media','free']],
    ['Twintail Launcher','Gaming','twintaillauncher.app',9,'TwintailTeam.TTL',161,['gaming','free']],
    ['ONLYOFFICE Desktop Editors','Documents & Office','onlyoffice.com',10,'ONLYOFFICE.DesktopEditors',162,['student','essentials','free']]
  ];

  for (const [name,category,domain,popular,windows,winIndex,tags] of extras) {
    const key=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    if (apps.some(a=>a.key===key)) continue;
    const pkg={windows};

    if(name==='ONLYOFFICE Desktop Editors'){pkg.linux='org.onlyoffice.desktopeditors';pkg.mac={type:'cask',id:'onlyoffice'};}
    if(name==='VSCodium'){pkg.linux='com.vscodium.codium';pkg.mac={type:'cask',id:'vscodium'};}
    if(name==='Neovim'){pkg.linux='io.neovim.nvim';pkg.mac={type:'formula',id:'neovim'};}
    if(name==='Helix Editor'){pkg.linux='com.helix_editor.Helix';pkg.mac={type:'formula',id:'helix'};}
    if(name==='Filelight'){pkg.linux='org.kde.filelight';}
    if(name==='Pear Desktop'){pkg.linux='url:https://github.com/pear-devs/pear-desktop/releases/latest';pkg.mac={type:'cask',id:'pear-devs/pear/pear-desktop'};}
    if(name==='Twintail Launcher'){pkg.linux='app.twintaillauncher.ttl';}
    if(name==='Parabolic'){pkg.linux='org.nickvision.tubeconverter';pkg.mac={type:'url',id:'https://github.com/NickvisionApps/Parabolic/releases'};}
    if(name==='Upscayl'){pkg.linux='org.upscayl.Upscayl';pkg.mac={type:'url',id:'https://github.com/upscayl/upscayl/releases'};}
    if(name==='LocalAI'){pkg.linux='url:https://localai.io/';pkg.mac={type:'url',id:'https://localai.io/'};}
    if(name==='Eden Emulator'){pkg.linux='url:https://eden-emu.dev/downloads/';pkg.mac={type:'url',id:'https://eden-emu.dev/downloads/'};}
    if(name==='Odysseus AI Workspace'){pkg.linux='url:https://github.com/odysseus-dev/odysseus';pkg.mac={type:'url',id:'https://github.com/odysseus-dev/odysseus'};}
    if(name==='Ollama'){pkg.linux='url:https://ollama.com/download/linux';pkg.mac={type:'url',id:'https://ollama.com/download'};}
    if(name==='Jan'){pkg.linux='ai.jan.Jan';pkg.mac={type:'url',id:'https://www.jan.ai/download'};}
    if(name==='LibreWolf'){pkg.linux='io.gitlab.librewolf-community';pkg.mac={type:'cask',id:'librewolf'};}
    if(name==='Zed'){pkg.linux='dev.zed.Zed';pkg.mac={type:'cask',id:'zed'};}
    if(name==='Kate'){pkg.linux='org.kde.kate';pkg.mac={type:'cask',id:'kate'};}
    if(name==='Apache NetBeans IDE'){pkg.linux='org.apache.netbeans';pkg.mac={type:'cask',id:'netbeans'};}
    if(name==='TMOG (Task Manager OG)'){pkg.linux='url:https://tmog.org/';pkg.mac={type:'url',id:'https://tmog.org/'};}
    if(name==='Tor Browser'){pkg.linux='url:https://www.torproject.org/download/';pkg.mac={type:'url',id:'https://www.torproject.org/download/'};}
    if(name==='Waterfox'){pkg.linux='url:https://www.waterfox.net/download/';pkg.mac={type:'url',id:'https://www.waterfox.net/download/'};}
    if(name==='Mullvad VPN'){pkg.linux='url:https://mullvad.net/en/download/vpn/linux';pkg.mac={type:'url',id:'https://mullvad.net/en/download/vpn/macos'};}
    if(name==='Wireshark'){pkg.linux='url:https://www.wireshark.org/download.html';pkg.mac={type:'cask',id:'wireshark'};}
    if(name==='Nmap'){pkg.linux='native:nmap';pkg.mac={type:'formula',id:'nmap'};}
    if(name==='Zen Browser'){pkg.linux='app.zen_browser.zen';pkg.mac={type:'cask',id:'zen'};}
    if(name==='Proton VPN'){pkg.linux='url:https://protonvpn.com/support/official-linux-vpn';pkg.mac={type:'url',id:'https://protonvpn.com/download-macos'};}
    if(name==='OpenCode'){pkg.linux='url:https://opencode.ai/';pkg.mac={type:'url',id:'https://opencode.ai/'};}
    if(name==='XAMPP'){pkg.linux='url:https://www.apachefriends.org/download.html';pkg.mac={type:'url',id:'https://www.apachefriends.org/download.html'};}
    if(name==='FilmCraft'){pkg.linux='url:https://getartcraft.com/apps/filmcraft';pkg.mac={type:'url',id:'https://getartcraft.com/apps/filmcraft'};}
    if(name==='Floorp'){pkg.linux='one.ablaze.floorp';pkg.mac={type:'cask',id:'floorp'};}
    if(name==='MCreator'){pkg.linux='url:https://mcreator.net/download';pkg.mac={type:'url',id:'https://mcreator.net/download'};}
    if(name==='Modrinth App'){pkg.linux='com.modrinth.ModrinthApp';pkg.mac={type:'cask',id:'modrinth-app'};}
    const descriptions={
      'LibreWolf':'Privacy-focused Firefox-based browser. Linux uses the LibreWolf Flathub package.',
      'Zed':'Fast code editor. On Linux uses a community-packaged, unverified Flathub build.',
      'Kate':'KDE advanced code editor with syntax highlighting, Git and terminal support.',
      'Apache NetBeans IDE':'Java and multi-language IDE. Linux Flatpak is community-packaged and not verified by Apache.',
      'Parabolic':'Free media downloader based on yt-dlp. Flatpak on Linux; official builds on Windows and macOS.',
      'Upscayl':'Free open-source AI image upscaler with desktop builds for Windows, Linux and macOS.',
      'LocalAI':'Run local AI APIs on your hardware. Installation requires platform-specific setup; opens official guide.',
      'Eden Emulator':'Open-source Nintendo Switch emulator. Choose the correct official build for your OS and architecture.',
      'Odysseus AI Workspace':'Self-hosted local-first AI workspace. Requires setup such as Docker and local/server models.',
      'TMOG (Task Manager OG)':'Free cross-platform native task manager by Dave Plummer. Official downloads for Windows, Linux and macOS; optional paid Pro features.',
      'VSCodium':'Open-source telemetry-free VS Code-compatible editor. Linux version is a community Flatpak.',
      'Neovim':'Powerful, configurable terminal editor. Linux Flatpak is community-maintained.',
      'Helix Editor':'Modal terminal editor with tree-sitter and language-server features; Linux Flatpak is community-maintained.',
      'Filelight':'KDE graphical disk-usage analyzer; explore folders and find files using the most space.',
      'Pear Desktop':'Open-source YouTube Music desktop player with custom themes and plugins.',
      'Twintail Launcher':'Anime game launcher for Genshin Impact, Honkai and more; game compatibility and anti-cheat restrictions still apply.'
    };
    apps.push({name,category,domain,popular,tags,pkg,winIndex,key,logo:fav(domain),desc:descriptions[name]||`${name} — install or open the official installer automatically.`});
  }

  // Keep previously listed Windows tools, but extend their official Linux/macOS choices.
  for(const app of apps){
    if(app.name==='Ollama'){
      app.pkg.linux='url:https://ollama.com/download';
      app.pkg.mac={type:'url',id:'https://ollama.com/download'};
      app.desc='Run local LLMs on Windows, Linux or macOS using the official installer.';
    }
    if(app.name==='Jan'){
      app.pkg.linux='ai.jan.Jan';
      app.pkg.mac={type:'url',id:'https://www.jan.ai/download'};
      app.desc='Local AI desktop assistant; official Linux Flatpak and Windows/macOS downloads.';
    }
  }

  // Security assessment tools. Windows indexes are append-only to preserve installer bitsets.
  // On Windows Metasploit and John open their official download pages for manual installation.
  if(!apps.some(a=>a.key==='metasploit-framework')) apps.push({
    name:'Metasploit Framework',key:'metasploit-framework',category:'Security',domain:'metasploit.com',popular:9,
    tags:['security','developer','student','free'],
    winIndex:145,
    pkg:{
      windows:'url:https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html',
      linux:'url:https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html',
      mac:{type:'url',id:'https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html'}
    },
    logo:fav('metasploit.com'),
    desc:'Open-source penetration-testing framework. Official setup instructions; manual installation required.'
  });
  if(!apps.some(a=>a.key==='john-the-ripper')) apps.push({
    name:'John the Ripper',key:'john-the-ripper',category:'Security',domain:'openwall.com/john',popular:9,
    tags:['security','developer','student','free'],
    winIndex:146,
    pkg:{
      windows:'url:https://www.openwall.com/john/',
      linux:'native:john-the-ripper',
      mac:{type:'formula',id:'john-jumbo'}
    },
    logo:fav('openwall.com'),
    desc:'Offline password-strength auditing tool; packages on Linux, Homebrew on macOS, official Windows downloads.'
  });

  // RARLAB publishes WinRAR with a GUI on Windows only. Linux and macOS have
  // an official command-line RAR build (trial), not a WinRAR GUI application.
  const winrarApp=apps.find(a=>a.name==='WinRAR');
  if(winrarApp){
    winrarApp.desc='WinRAR archive manager for Windows (trial). Install using winget.';
  }
  if(!apps.some(a=>a.key==='rar-command-line')) apps.push({
    name:'RAR (Linux / macOS CLI)',
    key:'rar-command-line',
    category:'Compression',
    domain:'rarlab.com',
    popular:8,
    tags:['linux','compression','utilities'],
    pkg:{
      linux:'url:https://www.rarlab.com/download.htm',
      mac:{type:'url',id:'https://www.rarlab.com/download.htm'}
    },
    logo:fav('rarlab.com'),
    desc:'Official RARLAB RAR archive tools for Linux and macOS. Command-line only; trial. Choose your platform on the official download page.'
  });

  if(!apps.some(a=>a.key==='impression')) apps.push({
    name:'Impression',key:'impression',category:'Utilities',domain:'apps.gnome.org/Impression',
    popular:9,tags:['linux','free','utilities'],
    pkg:{linux:'io.gitlab.adhami3310.Impression'},logo:fav('apps.gnome.org'),
    desc:'Create bootable USB drives from ISO/disk images on Linux. Writing will erase selected USB drive data.'
  });
  // Linux-only native package; do not assign a Windows installer index.
  if(!apps.some(a=>a.key==='wine')) apps.push({name:'Wine',key:'wine',category:'Utilities',domain:'winehq.org',popular:9,tags:['linux','gaming','developer','free'],pkg:{linux:'native:wine'},logo:fav('winehq.org'),desc:'Run compatible Windows applications on Linux using Wine.'});

  if(!apps.some(a=>a.key==='brave-origin')) apps.push({name:'Brave Origin',key:'brave-origin',category:'Privacy Browsers',domain:'brave.com',popular:9,tags:['privacy','linux','free'],pkg:{linux:'url:https://brave.com/origin/linux/'},logo:fav('brave.com'),desc:'Brave Origin for Linux, separate from standard Brave.'});
  if(!apps.some(a=>a.key==='vim')) apps.push({name:'Vim',key:'vim',category:'Development',domain:'vim.org',popular:9,tags:['developer','student','free'],winIndex:163,pkg:{windows:'url:https://www.vim.org/download.php',linux:'native:vim',mac:{type:'formula',id:'vim'}},logo:fav('vim.org'),desc:'Free, powerful terminal text editor.'});

  // Linux file managers. These entries have no Windows installer index.
  if(!apps.some(a=>a.key==='yazi')) apps.push({name:"Yazi",key:'yazi',category:'File Managers',domain:'yazi-rs.github.io',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:yazi',mac:{type:'formula',id:'yazi'}},logo:fav('yazi-rs.github.io'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='krusader')) apps.push({name:"Krusader",key:'krusader',category:'File Managers',domain:'krusader.org',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:krusader'},logo:fav('krusader.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='gnome-files')) apps.push({name:"GNOME Files",key:'gnome-files',category:'File Managers',domain:'apps.gnome.org/Nautilus',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:gnome-files'},logo:fav('apps.gnome.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='konqueror')) apps.push({name:"Konqueror",key:'konqueror',category:'File Managers',domain:'apps.kde.org/konqueror',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:konqueror'},logo:fav('apps.kde.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='double-commander')) apps.push({name:"Double Commander",key:'double-commander',category:'File Managers',domain:'doublecmd.sourceforge.io',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:double-commander'},logo:fav('doublecmd.sourceforge.io'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='midnight-commander')) apps.push({name:"Midnight Commander (mc)",key:'midnight-commander',category:'File Managers',domain:'midnight-commander.org',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:midnight-commander',mac:{type:'formula',id:'midnight-commander'}},logo:fav('midnight-commander.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='dolphin')) apps.push({name:"Dolphin",key:'dolphin',category:'File Managers',domain:'apps.kde.org/dolphin',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:dolphin'},logo:fav('apps.kde.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='ranger')) apps.push({name:"Ranger",key:'ranger',category:'File Managers',domain:'ranger.github.io',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:ranger',mac:{type:'formula',id:'ranger'}},logo:fav('ranger.github.io'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='thunar')) apps.push({name:"Thunar",key:'thunar',category:'File Managers',domain:'docs.xfce.org/xfce/thunar/start',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:thunar'},logo:fav('docs.xfce.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='pcmanfm')) apps.push({name:"PCManFM",key:'pcmanfm',category:'File Managers',domain:'wiki.lxde.org/en/PCManFM',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:pcmanfm'},logo:fav('wiki.lxde.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='vifm')) apps.push({name:"Vifm",key:'vifm',category:'File Managers',domain:'vifm.info',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:vifm',mac:{type:'formula',id:'vifm'}},logo:fav('vifm.info'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='caja')) apps.push({name:"Caja",key:'caja',category:'File Managers',domain:'mate-desktop.org',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:caja'},logo:fav('mate-desktop.org'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='lf')) apps.push({name:"lf",key:'lf',category:'File Managers',domain:'github.com/gokcehan/lf',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:lf',mac:{type:'formula',id:'lf'}},logo:fav('github.com'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='nemo')) apps.push({name:"Nemo",key:'nemo',category:'File Managers',domain:'github.com/linuxmint/nemo',popular:8,tags:['linux','free','utilities'],pkg:{linux:'native:nemo'},logo:fav('github.com'),desc:'Free file manager for Linux.'});
  if(!apps.some(a=>a.key==='superfile')) apps.push({name:"Superfile",key:'superfile',category:'File Managers',domain:'github.com/yorukot/superfile',popular:8,tags:['linux','free','utilities'],pkg:{linux:'url:https://github.com/yorukot/superfile#installation',mac:{type:'formula',id:'superfile'}},logo:fav('github.com'),desc:'Free file manager for Linux.'});

  // Faugus is a Linux-native gaming launcher built on UMU/Proton (not a Windows/macOS app).
  if(!apps.some(a=>a.key==='faugus-launcher')) apps.push({
    name:'Faugus Launcher',key:'faugus-launcher',category:'Linux Gaming & Compatibility',
    domain:'github.com/Faugus/faugus-launcher',popular:9,tags:['linux','gaming','free'],
    pkg:{linux:'io.github.Faugus.faugus-launcher'},logo:fav('github.com'),
    desc:'Launch supported Windows and Linux games with UMU/Proton. Does not bypass unsupported anti-cheat.'
  });

  // CoolerControl controls fan/temperature hardware via a system daemon; use upstream
  // distro-specific setup instead of assuming a standalone Flatpak is sufficient.
  if(!apps.some(a=>a.key==='coolercontrol')) apps.push({
    name:'CoolerControl',key:'coolercontrol',category:'Utilities',
    domain:'coolercontrol.org',popular:9,tags:['linux','hardware','free'],
    pkg:{linux:'url:https://docs.coolercontrol.org/installation/'},
    logo:fav('docs.coolercontrol.org'),
    desc:'Linux fan/pump control with hardware daemon. Follow official distro instructions and hardware compatibility guidance.'
  });
  // Linux gaming and Windows-compatibility tools. No Windows installer indices.
  const linuxGamingTools=[
    {name:'Bottles',key:'bottles',domain:'usebottles.com',linux:'com.usebottles.bottles',desc:'Manage Wine prefixes with a graphical interface.'},
    {name:'Lutris',key:'lutris',domain:'lutris.net',linux:'net.lutris.Lutris',desc:'Install and manage Linux and Windows games; game support varies.'},
    {name:'ProtonUp-Qt',key:'protonup-qt',domain:'github.com/DavidoTek/ProtonUp-Qt',linux:'net.davidotek.pupgui2',desc:'Manage GE-Proton and compatible game runner versions.'},
    {name:'GameMode',key:'gamemode',domain:'github.com/FeralInteractive/gamemode',linux:'native:gamemode',desc:'Feral Interactive game performance optimization daemon.'},
    {name:'MangoHud',key:'mangohud',domain:'github.com/flightlessmango/MangoHud',linux:'native:mangohud',desc:'Gaming FPS and performance overlay.'},
    {name:'Winetricks',key:'winetricks',domain:'github.com/Winetricks/winetricks',linux:'native:winetricks',desc:'Configure extra Windows components for Wine prefixes.'}
  ];
  for(const tool of linuxGamingTools){
    if(apps.some(a=>a.key===tool.key))continue;
    apps.push({name:tool.name,key:tool.key,category:'Linux Gaming & Compatibility',domain:tool.domain,popular:9,tags:['linux','gaming','free'],pkg:{linux:tool.linux},logo:fav(tool.domain),desc:tool.desc});
  }
  // Linux audio, Roblox and music applications. No fabricated Windows installer entries.
  const newLinuxApps=[
    {name:'JamesDSP',key:'jamesdsp',category:'Audio & Sound',domain:'github.com/Audio4Linux/JDSP4Linux',linux:'me.timschneeberger.jdsp4linux',tags:['linux','audio','free'],desc:'PipeWire audio effects, EQ, reverb and DSP for Linux. Requires PipeWire; PulseAudio users need the separate legacy build.'},
    {name:'EasyEffects',key:'easyeffects',category:'Audio & Sound',domain:'github.com/wwmm/easyeffects',linux:'com.github.wwmm.easyeffects',tags:['linux','audio','free'],desc:'PipeWire system-wide audio equalizer, compressor and microphone effects.'},
    {name:'Sober',key:'sober',category:'Linux Gaming & Compatibility',domain:'sober.vinegarhq.org',linux:'org.vinegarhq.Sober',tags:['linux','gaming'],desc:'Community Roblox compatibility port for Linux (proprietary, unofficial). Roblox updates may break it; use at your own risk.'},
    {name:'Spun',key:'spun',category:'Media',domain:'github.com/yappologistic/Spun',linux:'url:https://github.com/yappologistic/Spun#install',tags:['linux','media'],desc:'Linux music player with CD, vinyl and cassette views. Source build only (Qt 6.8+ / TagLib 2.0+); source-available under noncommercial license, not an automatic install.'}
  ];
  for(const app of newLinuxApps){
    if(apps.some(a=>a.key===app.key))continue;
    apps.push({name:app.name,key:app.key,category:app.category,domain:app.domain,popular:9,
      tags:app.tags,pkg:{linux:app.linux},logo:fav(app.domain),desc:app.desc});
  }
  const browserGroups = {
    'Google Chrome':'Popular Browsers','Mozilla Firefox':'Popular Browsers','Microsoft Edge':'Popular Browsers',
    'Brave':'AI Browsers','Opera':'AI Browsers','Vivaldi':'Popular Browsers'
  };
  for (const app of apps) if (browserGroups[app.name]) app.category=browserGroups[app.name];
  updatePlatformUI();
})();