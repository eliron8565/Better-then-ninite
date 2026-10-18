# AppForge — Security & Transparency

## Installation paths

- **Personalized EXE (legacy):** the selected app indices are encoded in the EXE **filename**. Renaming this file loses the selection. The binary is not modified.
- **Windows ZIP + JSON (recommended):** the ZIP contains an unchanged `AppForge-Windows.exe`, an adjacent `appforge-setup.json`, and instructions. **Extract both files to the same folder** before running. The installer checks the executable SHA-256 from the manifest, validates known app indices, names and catalog-defined package IDs, then uses only those known entries. An invalid manifest stops automatic installation. No arbitrary commands in JSON are executed.
- Do **not** edit the manifest to install arbitrary packages. Select them through the website and regenerate the ZIP.
- The **ZIP is not an offline bundle**: package downloads require internet, Winget and/or Microsoft Store; vendor download pages still require manual installation.
- **Never assume all installations succeed.** Package availability, licensing, system requirements, internet connectivity, administrators' permissions and sources change.

## Verification and code signing

- GitHub Actions builds the Windows executable from public source and verifies its structure, basic startup, filename-selection round trips and sidecar-manifest validation.
- A passing CI job does **not** guarantee all third-party software installs on a clean Windows machine. Real end-to-end installs are still required to make such a claim.
- For releases, use the SHA-256 checksum published alongside the EXE to compare against your local file with PowerShell:
  ```powershell
  (Get-FileHash -Algorithm SHA256 -LiteralPath .\AppForge-Windows.exe).Hash
  ```
- As of October 2026, no trusted signing certificate is configured in the Windows workflow. A passing signing *step* can mean the unsigned path was skipped. **Do not claim the EXE is signed** without an actual valid Authenticode signature.
- SHA-256 inside a manifest verifies that the downloaded EXE and JSON belong together; it is **not an authenticity guarantee** when the entire download source is compromised.

## Data collection and privacy

- Setup Studio selection, checklist and saved profiles remain in the browser's local storage unless the user explicitly exports them. Formatting a computer clears local browser data; save JSON to removable storage first.
- PC Scanner reads Winget package information locally. The **Export Apps JSON** button opens a local file-save dialog; there is no automatic upload. The exported list can reveal installed software and should be handled privately.
- PC Scanner only runs upgrades after an explicit confirmation dialog.
- No AppForge account, cloud synchronization or live machine inspection is required by the static site.

## Limitations and threat model

- The static GitHub Pages website cannot scan local installed apps, approve UAC prompts or install software by itself.
- A package-manager ID is not a malware-free guarantee. Winget and external vendors may change their packages; review prompts and supplier names.
- Third-party dependencies and downloaded installers may require their own licenses and consent. Do not bypass operating-system security prompts.
- Security reports: open an issue without posting personal files or secrets, or use GitHub's private vulnerability reporting if enabled in the repository settings.

## Automated checks

- `Test AppForge Website`: JavaScript syntax; catalog matching; profile JSON; Windows ZIP manifest schema.
- `Build Windows EXE`: compilation and self-test; personalized filename round trips; valid JSON manifest plus tampered package ID/SHA rejection.
- `Build AppForge PC Scanner`: compilation and EXE structural check.

**Not tested by these checks:** all third-party downloads, native installer launches, UAC behaviors, antivirus results, and complete fresh-PC migrations.
