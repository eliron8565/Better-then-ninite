# AppForge

AppForge is an open-source application installer that lets users select the applications they want and download one installer for their selection.

Website: https://eliron8565.github.io/Better-then-ninite/

## Features

- Searchable application catalog
- Category filters and quick presets
- Select multiple applications on the website
- Native installer workflow for supported operating systems
- Windows installation through trusted package sources such as Winget where available
- Official vendor download pages for applications that require manual vendor installation
- Public source code and automated GitHub Actions builds

## Windows post-format setup options (P0)

The Windows selection dialog offers two ways to download your chosen applications:

1. **Personalized EXE (classic)** — the current app selection is encoded in the downloaded EXE filename. Do not rename the file. This is retained for compatibility.
2. **ZIP + setup JSON (recommended)** — download `AppForge-Windows-Setup.zip`, extract `AppForge-Windows.exe` and `appforge-setup.json` to the **same folder**, then run the EXE. The binary is unchanged; the installer validates its SHA-256 against the manifest and rejects unknown or altered package IDs. If a manifest is present but invalid, installation does not start.

Both options download selected Winget / Microsoft Store packages only **after execution on Windows**, and may open vendor download pages for manual installations. Neither is offline. The ZIP process uses extra browser memory, so the classic EXE remains available for low-memory browsers.

**PC Scanner:** it can scan locally, export a Winget package list to JSON for Setup Studio, and (only after an explicit confirmation dialog) attempt package updates. Software inventory exports may reveal installed apps; keep them private.

See [SECURITY.md](SECURITY.md) for checksums, unsigned build warnings, validation limits and automated-test coverage.

## Setup Studio — backup, restore and manage apps

AppForge includes a client-side Setup Studio above the application catalog, inspired by
features in UniGetUI, Patch My PC, winstall and Wingetter. You can:

- Save multiple named profiles in the browser, and export/import them as **AppForge JSON**.
- Import a standard **WinGet JSON export** from a previously used Windows PC.
- See which Windows apps have an automatic package source and which require manual setup.
- Filter the Windows catalog by automatic/manual setup.
- Preview, copy or download selected-app **install**, **upgrade** and **uninstall** PowerShell scripts.
- Use a pre-format checklist for backups, credentials, installer and driver preparation.

**Before formatting Windows:** choose your apps, download a personalized EXE from the
website, and separately export your AppForge JSON profile. Put both on a USB drive.
The profile stores app identifiers **not installers**. Winget still needs internet and
Microsoft App Installer after Windows is reinstalled.

You can export your currently installed Winget packages on the old PC with:

```powershell
winget export -o "$env:USERPROFILE\Desktop\winget-apps.json" --accept-source-agreements
```

Then import the JSON in Setup Studio to match supported apps. Unmatched apps are reported
rather than fabricated; vendor/manual apps may not be available in a Winget export.

**Safety and limitations:** the site cannot inspect installed apps, uninstall programs,
apply system optimizations, or schedule updates on your computer. Generated PowerShell
scripts are text files for your review and explicitly require you to execute them.
The uninstall script requires typing `REMOVE` before it can run removal commands.
Selecting apps or checking off the pre-format checklist does not prove installations
or backups completed. Full Windows fresh-install compatibility is not guaranteed.

## Testing

Website syntax, Setup Studio profile/script tests, and Windows catalog consistency
are run in the `Test AppForge Website` GitHub Actions workflow. Windows EXE build tests
run separately and do not substitute for real installs on a fresh PC.

## Downloads

Use the AppForge website to select the applications you want and download the installer:

https://eliron8565.github.io/Better-then-ninite/

## Code signing policy

AppForge is applying for the SignPath Foundation open-source code-signing program.

**Free code signing provided by SignPath.io, certificate by SignPath Foundation.**

No AppForge release is represented as SignPath-signed until SignPath Foundation has accepted the project and the individual release has actually received a valid signature.

See [CODE_SIGNING_POLICY.md](CODE_SIGNING_POLICY.md) for the complete policy, including project roles, trusted builds, release approval and privacy information.

## Privacy

See [PRIVACY.md](PRIVACY.md).

AppForge does not operate an AppForge account service and does not intentionally collect or sell personal information. Network access is used for functionality requested by the user, including retrieving application information/icons, downloading AppForge, opening official vendor pages, and installing selected applications through supported package services.

## Uninstallation

AppForge itself is a standalone installer and does not require a traditional installation. The third-party applications installed through AppForge can be removed using the operating system's normal Apps/Installed Apps or package-management facilities.

## License

AppForge is released under the [MIT License](LICENSE).

## Development

The source code and build configuration are public in this repository. Windows release builds are produced with GitHub Actions.

The project is independent and is not affiliated with Ninite, Microsoft, or the third-party applications listed in its catalog.