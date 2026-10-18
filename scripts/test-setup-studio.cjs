const assert = require('node:assert/strict');
const studio = require('../setup-studio.js');
const catalog = [
 {key:'chrome',name:'Chrome',pkg:{windows:'Google.Chrome',mac:{type:'cask',id:'google-chrome'}}},
 {key:'chatgpt',name:'ChatGPT',pkg:{windows:'msstore:9PLM9XGG6VKS'}},
 {key:'vendor-app',name:'Vendor',pkg:{windows:'url:https://vendor.example/download'}},
 {key:'linux-only',name:'Linux Only',pkg:{linux:'org.example.Test'}}
];
assert.equal(studio.category(catalog[0],'windows'),'automatic');
assert.equal(studio.category(catalog[1],'windows'),'automatic');
assert.equal(studio.category(catalog[2],'windows'),'manual');
assert.equal(studio.category(catalog[3],'windows'),'unavailable');

const profile=studio.exportProfile(catalog,['chrome','vendor-app','linux-only'],'windows','Fresh PC');
assert.equal(profile.apps.length,2);
assert.equal(profile.format,'appforge-profile');
assert.equal(profile.platform,'windows');
assert.deepEqual(studio.parseProfile(JSON.stringify(profile),catalog).keys,['chrome','vendor-app']);

const winExport={Sources:[
 {SourceDetails:{Name:'winget'},Packages:[{PackageIdentifier:'Google.Chrome'},{PackageIdentifier:'Unknown.Missing'}]},
 {SourceDetails:{Name:'msstore'},Packages:[{PackageIdentifier:'9PLM9XGG6VKS'}]}
]};
const result=studio.parseProfile(JSON.stringify(winExport),catalog);
assert.deepEqual(result.keys,['chrome','chatgpt']);
assert.equal(result.unmatched.length,1);
assert.equal(result.format,'winget');
assert.equal(result.os,'windows');

const install=studio.windowsScript(catalog,['chrome','chatgpt','vendor-app'],'install');
assert.equal(install.automatic,2);
assert.equal(install.manual,1);
assert.ok(install.content.includes("--source msstore"));
assert.ok(install.content.includes("--source winget"));
assert.ok(!install.content.includes('winget install --id \'url:'));

const update=studio.windowsScript(catalog,['chrome'],'upgrade');
assert.ok(update.content.includes('& winget upgrade'));
const removal=studio.windowsScript(catalog,['chrome'],'uninstall');
assert.ok(removal.content.includes('Type REMOVE'));
assert.ok(removal.content.indexOf('Type REMOVE') < removal.content.indexOf('& winget uninstall'));

assert.throws(()=>studio.parseProfile('{}',catalog),/Import an AppForge/);
assert.throws(()=>studio.parseProfile('{',catalog),/Invalid JSON/);
assert.throws(()=>studio.parseProfile('x'.repeat(1000001),catalog),/exceeds 1 MB/);
assert.throws(()=>studio.windowsScript(catalog,['chrome'],'delete'),/Invalid action/);

console.log('Setup Studio tests passed: profiles, Winget imports, package classification and scripts.');
