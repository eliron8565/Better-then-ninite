const assert = require('node:assert/strict');
const {makeManifest} = require('../windows-bundle.js');
const sample = [
  {name:'Firefox',winIndex:1,pkg:{windows:'Mozilla.Firefox'}},
  {name:'ChatGPT Desktop',winIndex:97,pkg:{windows:'msstore:9PLM9XGG6VKS'}},
  {name:'Cisco Packet Tracer',winIndex:30,pkg:{windows:'url:https://www.netacad.com/learning-collections/cisco-packet-tracer'}}
];
const sha='a'.repeat(64);
const manifest = makeManifest(sample,sha);
assert.equal(manifest.format,'appforge-windows-manifest');
assert.equal(manifest.schemaVersion,1);
assert.equal(manifest.platform,'windows');
assert.deepEqual(manifest.apps.map(x=>x.index),[1,30,97]);
assert.equal(manifest.exeSha256,sha);
assert.equal(manifest.apps[1].packageId,sample[2].pkg.windows);
assert.throws(()=>makeManifest([],sha),/Select 1/);
assert.throws(()=>makeManifest(sample,'1234'),/SHA-256/);
assert.throws(()=>makeManifest([sample[0],sample[0]],sha),/duplicated/);
assert.throws(()=>makeManifest([{name:'Arbitrary',winIndex:166,pkg:{windows:'url:http://attacker.test'}}],sha),/Unsupported/);
assert.throws(()=>makeManifest([{name:'Broken',pkg:{windows:'Google.Chrome'}}],sha),/Unsupported/);
console.log('Windows bundle manifest tests passed');
