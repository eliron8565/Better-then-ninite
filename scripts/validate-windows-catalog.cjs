// Prevent selected Windows apps from silently disappearing inside the EXE.
// Run: node scripts/validate-windows-catalog.cjs
const fs = require('node:fs');
const base = fs.readFileSync('app.js', 'utf8');
const extra = fs.readFileSync('extra-apps.js', 'utf8');
const installer = fs.readFileSync('src/AppForgeInstaller/Program.cs', 'utf8');
const downloader = fs.readFileSync('download-fix.js', 'utf8');

const entries = [];
for (const m of base.matchAll(/^\s*\{name:'([^']+)'[^\n]*?pkg:\{windows:'([^']+)'/gm)) {
  entries.push({ index: entries.length, name: m[1], pkg: m[2] });
}
for (const m of extra.matchAll(/^\s*\['([^']+)','[^']+','[^']+',\d+,'([^']+)',(\d+),\[[^\]]*\]\],?\s*$/gm)) {
  entries.push({ index: Number(m[3]), name: m[1], pkg: m[2] });
}
for (const name of ['Metasploit Framework', 'John the Ripper']) {
  const at = extra.indexOf("name:'" + name + "'");
  if (at < 0) throw new Error('Expected Windows catalog entry missing: ' + name);
  const block = extra.slice(at, at + 500);
  const index = /winIndex:\s*(\d+)/.exec(block);
  const pkg = /windows:'([^']+)'/.exec(block);
  if (!index || !pkg) throw new Error('Incomplete Windows catalog entry: ' + name);
  entries.push({ index: Number(index[1]), name, pkg: pkg[1] });
}

// Detect one-line manually registered Windows apps; they also need a stable index.
for (const m of extra.matchAll(/apps\.push\(\{([^\n]*)\}\);/g)) {
  const obj = m[1];
  const pkg = /pkg:\{windows:'([^']+)'/.exec(obj);
  if (!pkg) continue;
  const name = /\bname:'([^']+)'/.exec(obj);
  const index = /\bwinIndex:\s*(\d+)/.exec(obj);
  if (!name || !index) throw new Error('Windows app has no stable winIndex: ' + obj.slice(0, 120));
  entries.push({ index: Number(index[1]), name: name[1], pkg: pkg[1] });
}

const compiled = [...installer.matchAll(/\bA\((\d+),"([^"]+)","([^"]+)"\)/g)]
  .map(m => ({ index: Number(m[1]), name: m[2], pkg: m[3] }));

const errors = [];
const toMap = (items, type) => {
  const map = new Map();
  for (const entry of items) {
    if (map.has(entry.index)) errors.push(type + ' duplicate index ' + entry.index);
    map.set(entry.index, entry);
  }
  return map;
};
const web = toMap(entries, 'Web');
const exe = toMap(compiled, 'EXE');
for (const [id, item] of web) {
  const actual = exe.get(id);
  if (!actual) errors.push('Missing from EXE: ' + id + ' (' + item.name + ')');
  else if (actual.name !== item.name || actual.pkg !== item.pkg)
    errors.push('Mismatch at index ' + id + ': web ' + JSON.stringify(item) + ', EXE ' + JSON.stringify(actual));
}
for (const [id, item] of exe) {
  if (!web.has(id)) errors.push('EXE has unexpected index ' + id + ' (' + item.name + ')');
}
if (!downloader.includes('new Uint8Array(21)')) errors.push('Unexpected Windows bitset layout');
for (const id of web.keys()) if (id < 0 || id > 167) errors.push('Windows index outside bitset: ' + id);
if (entries.length < 163) errors.push('Web catalog unexpectedly small: ' + entries.length);

if (errors.length) {
  console.error('AppForge Windows catalog FAILED:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('AppForge Windows catalog OK: ' + web.size + ' web entries match ' + exe.size + ' EXE entries.');
console.log('This validates catalog parity only, not package existence or real installations.');
