import os, sys, subprocess, threading, tkinter as tk
from tkinter import ttk, messagebox

MARKER=b"\nAPPFORGE_KEYS_V1:"
END=b":END\n"

CATALOG={
'google-chrome':('Google Chrome','com.google.Chrome','google-chrome'),
'mozilla-firefox':('Mozilla Firefox','org.mozilla.firefox','firefox'),
'brave':('Brave','com.brave.Browser','brave-browser'),
'vivaldi':('Vivaldi','com.vivaldi.Vivaldi','vivaldi'),
'discord':('Discord','com.discordapp.Discord','discord'),
'telegram':('Telegram','org.telegram.desktop','telegram'),
'slack':('Slack','com.slack.Slack','slack'),
'zoom':('Zoom','us.zoom.Zoom','zoom'),
'steam':('Steam','com.valvesoftware.Steam','steam'),
'prism-launcher':('Prism Launcher','org.prismlauncher.PrismLauncher','prismlauncher'),
'heroic-games-launcher':('Heroic Games Launcher','com.heroicgameslauncher.hgl','heroic'),
'vlc-media-player':('VLC media player','org.videolan.VLC','vlc'),
'spotify':('Spotify','com.spotify.Client','spotify'),
'obs-studio':('OBS Studio','com.obsproject.Studio','obs'),
'audacity':('Audacity','org.audacityteam.Audacity','audacity'),
'handbrake':('HandBrake','fr.handbrake.ghb','handbrake-app'),
'visual-studio-code':('Visual Studio Code','com.visualstudio.code','visual-studio-code'),
'postman':('Postman','com.getpostman.Postman','postman'),
'blockbench':('Blockbench','net.blockbench.Blockbench','blockbench'),
'libreoffice':('LibreOffice','org.libreoffice.LibreOffice','libreoffice'),
'obsidian':('Obsidian','md.obsidian.Obsidian','obsidian'),
'thunderbird':('Thunderbird','org.mozilla.Thunderbird','thunderbird'),
'krita':('Krita','org.kde.krita','krita'),
'gimp':('GIMP','org.gimp.GIMP','gimp'),
'blender':('Blender','org.blender.Blender','blender'),
'inkscape':('Inkscape','org.inkscape.Inkscape','inkscape'),
'qbittorrent':('qBittorrent','org.qbittorrent.qBittorrent','qbittorrent'),
'filezilla':('FileZilla','org.filezillaproject.Filezilla','filezilla'),
'bitwarden':('Bitwarden','com.bitwarden.desktop','bitwarden'),
'keepassxc':('KeePassXC','org.keepassxc.KeePassXC','keepassxc'),
'rustdesk':('RustDesk','com.rustdesk.RustDesk','rustdesk'),
'floorp':('Floorp','one.ablaze.floorp','floorp'),
'librewolf':('LibreWolf','io.gitlab.librewolf-community','librewolf'),
'faugus-launcher':('Faugus Launcher','io.github.Faugus.faugus-launcher',None),
'zed':('Zed','dev.zed.Zed','zed'),
'kate':('Kate','org.kde.kate','kate'),
'apache-netbeans-ide':('Apache NetBeans IDE','org.apache.netbeans','netbeans'),
'vscodium':('VSCodium','com.vscodium.codium','vscodium'),
'neovim':('Neovim','io.neovim.nvim',None),
'helix-editor':('Helix Editor','com.helix_editor.Helix',None),
'filelight':('Filelight','org.kde.filelight',None),
'impression':('Impression','io.gitlab.adhami3310.Impression',None),
'pear-desktop':('Pear Desktop',None,'pear-devs/pear/pear-desktop'),
'twintail-launcher':('Twintail Launcher','app.twintaillauncher.ttl',None),
'onlyoffice-desktop-editors':('ONLYOFFICE Desktop Editors','org.onlyoffice.desktopeditors','onlyoffice'),
'jamesdsp':('JamesDSP','me.timschneeberger.jdsp4linux',None),
'easyeffects':('EasyEffects','com.github.wwmm.easyeffects',None),
'sober':('Sober','org.vinegarhq.Sober',None),
'parabolic':('Parabolic','org.nickvision.tubeconverter',None),
'upscayl':('Upscayl','org.upscayl.Upscayl',None),
'jan':('Jan','ai.jan.Jan',None),

}

# Packages supported by the graphical Linux installer (other packages use the website command generator).
LINUX_NATIVE={
    'nmap': {'apt-get':'nmap','dnf':'nmap','pacman':'nmap','zypper':'nmap','apk':'nmap','xbps-install':'nmap','emerge':'net-analyzer/nmap','eopkg':'nmap','nix':'nmap'},
    'john-the-ripper': {'apt-get':'john','dnf':'john','pacman':'john','zypper':'john','apk':'john','xbps-install':'john','emerge':'app-crypt/johntheripper','nix':'john'},
}
SECURITY_NAMES={'nmap':'Nmap','john-the-ripper':'John the Ripper','metasploit-framework':'Metasploit Framework'}
SECURITY_MANUAL_URL='https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html'

MAC_FORMULAS={
'git':'git','python-3':'python','node-js-lts':'node','7-zip':'sevenzip','neovim':'neovim','helix-editor':'helix','nmap':'nmap','john-the-ripper':'john-jumbo'
}
MAC_CASKS={
'github-desktop':'github','docker-desktop':'docker','pycharm-community':'pycharm-ce','intellij-idea-community':'intellij-idea-ce','balenaetcher':'balenaetcher','raycast':'raycast','rectangle':'rectangle','iterm2':'iterm2'
}

# Official project pages for applications requiring interactive/platform-specific setup.
MANUAL_APPS={
  'parabolic':('Parabolic','https://github.com/NickvisionApps/Parabolic/releases',{'darwin'}),
  'upscayl':('Upscayl','https://github.com/upscayl/upscayl/releases',{'darwin'}),
  'jan':('Jan','https://www.jan.ai/download',{'darwin'}),
  'ollama':('Ollama','https://ollama.com/download',{'linux','darwin'}),
  'localai':('LocalAI','https://localai.io/',{'linux','darwin'}),
  'eden-emulator':('Eden Emulator','https://eden-emu.dev/downloads/',{'linux','darwin'}),
  'odysseus-ai-workspace':('Odysseus AI Workspace','https://github.com/odysseus-dev/odysseus',{'linux','darwin'}),
  'coolercontrol':('CoolerControl','https://docs.coolercontrol.org/installation/',{'linux'}),
  'pear-desktop':('Pear Desktop','https://github.com/pear-devs/pear-desktop/releases/latest',{'linux'}),
  'tmog-task-manager-og':('TMOG (Task Manager OG)','https://tmog.org/',{'linux','darwin'}),
  'spun':('Spun','https://github.com/yappologistic/Spun#install',{'linux'})
}

def selection_source():
    if sys.platform.startswith('linux') and os.environ.get('APPIMAGE'):
        return os.environ['APPIMAGE']
    return sys.executable

def read_selection():
    try:
        with open(selection_source(),'rb') as f: data=f.read()
        start=data.rfind(MARKER)
        if start<0: return []
        start+=len(MARKER); end=data.find(END,start)
        if end<0: return []
        return [x for x in data[start:end].decode('utf-8','ignore').split(',') if x]
    except Exception:
        return []

def supported(keys):
    out=[]
    for key in keys:
        if key in CATALOG:
            name,linux,mac=CATALOG[key]
            if sys.platform=='darwin':
                if key in MAC_FORMULAS: out.append((key,name,'formula',MAC_FORMULAS[key]))
                elif mac: out.append((key,name,'cask',mac))
                elif key in MANUAL_APPS and 'darwin' in MANUAL_APPS[key][2]:
                    out.append((key,name,'url',MANUAL_APPS[key][1]))
            elif sys.platform.startswith('linux'):
                if linux: out.append((key,name,'flatpak',linux))
                elif key in MANUAL_APPS and 'linux' in MANUAL_APPS[key][2]:
                    out.append((key,name,'url',MANUAL_APPS[key][1]))
        elif key in MANUAL_APPS and (sys.platform in MANUAL_APPS[key][2] or (sys.platform.startswith('linux') and 'linux' in MANUAL_APPS[key][2])):
            out.append((key,MANUAL_APPS[key][0],'url',MANUAL_APPS[key][1]))
        elif sys.platform.startswith('linux') and key in LINUX_NATIVE:
            out.append((key,SECURITY_NAMES[key],'native',key))
        elif sys.platform.startswith('linux') and key=='metasploit-framework':
            out.append((key,SECURITY_NAMES[key],'url',SECURITY_MANUAL_URL))
        elif sys.platform=='darwin' and key=='metasploit-framework':
            out.append((key,SECURITY_NAMES[key],'url',SECURITY_MANUAL_URL))
        elif key=='rar-command-line' and (sys.platform.startswith('linux') or sys.platform=='darwin'):
            out.append((key,'RAR (Linux / macOS CLI)','url','https://www.rarlab.com/download.htm'))
        elif sys.platform=='darwin' and key in MAC_FORMULAS:
            out.append((key,SECURITY_NAMES.get(key,key.replace('-',' ').title()),'formula',MAC_FORMULAS[key]))
        elif sys.platform=='darwin' and key in MAC_CASKS:
            out.append((key,key.replace('-',' ').title(),'cask',MAC_CASKS[key]))
    return out

class AppForge(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('AppForge')
        self.geometry('850x650')
        self.minsize(700,500)
        self.configure(bg='#07111e')
        self.keys=read_selection()
        self.apps=supported(self.keys)
        self.vars=[]
        self.build()

    def build(self):
        style=ttk.Style(self)
        try: style.theme_use('clam')
        except: pass
        style.configure('TButton',font=('Arial',11,'bold'),padding=10)
        style.configure('TProgressbar',thickness=14)
        top=tk.Frame(self,bg='#07111e'); top.pack(fill='x',padx=24,pady=(22,10))
        tk.Label(top,text='AppForge',fg='white',bg='#07111e',font=('Arial',28,'bold')).pack(anchor='w')
        subtitle=f'{len(self.apps)} selected apps ready to install' if self.apps else 'No website selection was found. Download AppForge again after choosing apps.'
        tk.Label(top,text=subtitle,fg='#8fa8c2',bg='#07111e',font=('Arial',11)).pack(anchor='w',pady=(4,0))
        body=tk.Frame(self,bg='#0c1a2b',highlightbackground='#1c3a56',highlightthickness=1); body.pack(fill='both',expand=True,padx=24,pady=10)
        canvas=tk.Canvas(body,bg='#0c1a2b',highlightthickness=0); scroll=ttk.Scrollbar(body,orient='vertical',command=canvas.yview)
        inner=tk.Frame(canvas,bg='#0c1a2b'); inner.bind('<Configure>',lambda e: canvas.configure(scrollregion=canvas.bbox('all')))
        canvas.create_window((0,0),window=inner,anchor='nw'); canvas.configure(yscrollcommand=scroll.set); canvas.pack(side='left',fill='both',expand=True); scroll.pack(side='right',fill='y')
        for key,name,kind,pkg in self.apps:
            var=tk.BooleanVar(value=True); self.vars.append((var,(key,name,kind,pkg)))
            row=tk.Frame(inner,bg='#102238'); row.pack(fill='x',padx=10,pady=5)
            tk.Checkbutton(row,variable=var,bg='#102238',activebackground='#102238',selectcolor='#102238').pack(side='left',padx=10,pady=10)
            tk.Label(row,text=name,fg='white',bg='#102238',font=('Arial',11,'bold')).pack(side='left',padx=(4,10))
            tk.Label(row,text={'flatpak':'Flatpak','native':'Linux package','url':'Official instructions','formula':'Homebrew','cask':'Homebrew'}.get(kind,'Package'),fg='#7f9bb7',bg='#102238',font=('Arial',9)).pack(side='right',padx=12)
        bottom=tk.Frame(self,bg='#07111e'); bottom.pack(fill='x',padx=24,pady=(8,22))
        self.status=tk.Label(bottom,text='Ready',fg='#8fa8c2',bg='#07111e'); self.status.pack(anchor='w')
        self.progress=ttk.Progressbar(bottom,mode='determinate'); self.progress.pack(fill='x',pady=(6,10))
        self.install=ttk.Button(bottom,text='Install selected apps',command=self.start_install); self.install.pack(side='right')
        if not self.apps: self.install.state(['disabled'])

    def start_install(self):
        chosen=[a for v,a in self.vars if v.get()]
        if not chosen: messagebox.showinfo('AppForge','Choose at least one app.'); return
        self.install.state(['disabled']); self.progress['maximum']=len(chosen); self.progress['value']=0
        threading.Thread(target=self.install_all,args=(chosen,),daemon=True).start()

    def run_hidden(self,args):
        p=subprocess.run(args,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        if p.returncode!=0: raise RuntimeError((p.stderr or p.stdout or 'Installation failed').strip()[-500:])

    def install_native_linux(self,key):
        pkg_map=LINUX_NATIVE.get(key,{})
        for manager,pkg in pkg_map.items():
            if not shutil_which(manager): continue
            if manager=='apt-get':
                command=['apt-get','install','-y',pkg]
            elif manager=='dnf':
                command=['dnf','install','-y',pkg]
            elif manager=='pacman':
                command=['pacman','-S','--needed','--noconfirm',pkg]
            elif manager=='zypper':
                command=['zypper','install','-y',pkg]
            elif manager=='apk':
                command=['apk','add',pkg]
            elif manager=='xbps-install':
                command=['xbps-install','-Sy',pkg]
            elif manager=='emerge':
                command=['emerge','--ask=n',pkg]
            elif manager=='eopkg':
                command=['eopkg','install','-y',pkg]
            elif manager=='nix':
                self.run_hidden(['nix','profile','install','nixpkgs#'+pkg])
                return
            else: continue
            # Prefer graphical authentication; sudo -n fails promptly when not authorized.
            if os.geteuid()==0:
                self.run_hidden(command)
            elif shutil_which('pkexec'):
                self.run_hidden(['pkexec']+command)
            else:
                self.run_hidden(['sudo','-n']+command)
            return
        raise RuntimeError('No supported native repository for '+key+'. Use the website Linux script or official installation guide.')

    def install_all(self,chosen):
        ok=0
        manual=0
        try:
            if sys.platform.startswith('linux') and any(a[2]=='flatpak' for a in chosen):
                if not shutil_which('flatpak'): raise RuntimeError('Flatpak is required on this Linux system.')
                self.run_hidden(['flatpak','remote-add','--if-not-exists','flathub','https://flathub.org/repo/flathub.flatpakrepo'])
            elif sys.platform=='darwin' and any(a[2] in ('cask','formula') for a in chosen) and not shutil_which('brew'):
                raise RuntimeError('Homebrew is required on this Mac.')
            for i,(key,name,kind,pkg) in enumerate(chosen,1):
                self.after(0,lambda n=name:self.status.config(text=f'Installing {n}...'))
                try:
                    if kind=='flatpak': self.run_hidden(['flatpak','install','-y','flathub',pkg])
                    elif kind=='native': self.install_native_linux(key)
                    elif kind=='formula': self.run_hidden(['brew','install',pkg])
                    elif kind=='cask': self.run_hidden(['brew','install','--cask',pkg])
                    elif kind=='url':
                        import webbrowser
                        if not webbrowser.open(pkg): raise RuntimeError('Could not open the official installation page: '+pkg)
                        manual+=1
                    else: raise RuntimeError('Unsupported installation type: '+kind)
                    if kind!='url': ok+=1
                except Exception as e:
                    self.after(0,lambda n=name,err=str(e):messagebox.showwarning('AppForge',f'{n}: {err}'))
                self.after(0,lambda v=i:self.progress.configure(value=v))
            self.after(0,lambda:self.status.config(text=f'Finished — {ok} installed; {manual} official installation pages opened.'))
        except Exception as e:
            self.after(0,lambda:messagebox.showerror('AppForge',str(e)))
            self.after(0,lambda:self.status.config(text='Could not start installation.'))
        finally:
            self.after(0,lambda:self.install.state(['!disabled']))

def shutil_which(name):
    import shutil
    return shutil.which(name)

if __name__=='__main__': AppForge().mainloop()
