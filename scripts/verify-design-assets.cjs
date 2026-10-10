const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../tarot-design-kit');
const cards = JSON.parse(fs.readFileSync(path.join(root, 'cards.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets-manifest.json'), 'utf8'));
assert.equal(cards.length, 22);
const hashes = new Set();
for (const card of cards) {
  assert.notEqual(card.day, card.list);
  for (const role of ['day', 'list']) {
    const data = fs.readFileSync(path.join(root, card[role]));
    const expected = manifest.find(item => item.path === card[role]);
    assert.ok(expected, card[role]);
    assert.equal(data.subarray(1, 4).toString(), 'PNG');
    assert.equal(data.readUInt32BE(16), expected.width);
    assert.equal(data.readUInt32BE(20), expected.height);
    assert.equal(data[25], 6, `${card[role]} must be RGBA`);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    assert.equal(hash, expected.sha256);
    hashes.add(hash);
  }
}
assert.equal(hashes.size, 44);
assert.equal(cards[8].name, 'Сила');
assert.equal(cards[11].name, 'Справедливость');
process.stdout.write('44 distinct RGBA PNG files match the registry and manifest. VIII/XI order is correct.\n');
