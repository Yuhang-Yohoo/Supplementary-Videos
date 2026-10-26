const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'videos.json'), 'utf8'));

class Element {
  constructor(id = '') {
    this.id = id;
    this.value = '';
    this.hidden = false;
    this.children = [];
    this.events = {};
    this.attributes = {};
    this.textContent = '';
  }
  set textContent(text) { this.text = text; this.children = []; }
  get textContent() { return this.text; }
  replaceChildren(...children) { this.textContent = ''; this.children = children; }
  append(child) { this.children.push(child); }
  add(child) { this.append(child); }
  addEventListener(name, handler) { this.events[name] = handler; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this[name]; }
  pause() { this.paused = true; }
  load() { this.reloaded = true; }
}

async function boot(data = catalog, query = '') {
  const elements = new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(match => [match[1], new Element(match[1])]));
  for (const id of ['player', 'poster', 'poster-pdf', 'actions']) elements.get(id).hidden = true;
  const location = { href: 'https://example.com/gallery/' + query };
  const context = {
    URL, location,
    document: { getElementById: id => elements.get(id), createElement: () => new Element() },
    Option: function(text, value) { this.text = text; this.value = value; },
    history: { replaceState(_state, _title, url) { location.href = String(url); } },
    fetch: async () => ({ ok: true, json: async () => data }),
    navigator: { clipboard: { async writeText(text) { context.copied = text; } } }
  };
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return { get: id => elements.get(id), context, location };
}

(async () => {
  const live = await boot();
  assert.equal(live.get('group').value, 'MINERVA');
  assert.equal(live.get('work').value, '');
  assert.equal(live.get('work').children[1].value, 'Geo-aware localization');
  assert.equal(live.get('count').textContent, '1 item');
  assert.equal(live.get('project').textContent, 'MINERVA');
  assert.equal(live.get('title').textContent, 'Geo-aware localization');
  assert.equal(live.get('item-type').textContent, 'Video');
  assert.equal(live.get('player').hidden, false);
  assert.equal(live.get('poster').hidden, true);
  assert.equal(live.get('search'), undefined);
  assert.ok(fs.existsSync(path.join(root, catalog[0].src)));

  for (const query of ['?video=icra27-4954-vi-i', '?video=geo-aware-localization', '?item=geo-aware-localization']) {
    const linked = await boot(catalog, query + '&keep=yes#details');
    assert.equal(linked.get('status').textContent, '');
    assert.equal(linked.get('work').value, 'Geo-aware localization');
    const url = new URL(linked.location.href);
    assert.equal(url.searchParams.get('item'), 'geo-aware-localization');
    assert.equal(url.searchParams.has('video'), false);
    assert.equal(url.searchParams.get('keep'), 'yes');
    assert.equal(url.hash, '#details');
  }

  const mixed = [
    ...catalog,
    { ...catalog[0], id: 'image-poster', type: 'poster', title: 'Geometry poster', src: 'posters/geometry.png' },
    { ...catalog[0], id: 'pdf-poster', work: 'Another work', type: 'poster', title: 'PDF poster', src: 'posters/another.PDF?download=1' },
    { ...catalog[0], id: 'other-project', project: 'Other project', work: 'Other work' }
  ];
  const gallery = await boot(mixed);
  assert.equal(gallery.get('count').textContent, '4 items');
  gallery.get('group').value = 'MINERVA';
  gallery.get('group').events.change();
  assert.equal(gallery.get('count').textContent, '3 items');
  assert.deepEqual(gallery.get('work').children.map(option => option.value), ['', 'Another work', 'Geo-aware localization']);
  gallery.get('work').value = 'Geo-aware localization';
  gallery.get('work').events.change();
  assert.equal(gallery.get('count').textContent, '2 items');
  gallery.get('list').children[1].events.click();
  assert.equal(gallery.get('poster').hidden, false);
  assert.equal(gallery.get('poster').alt, 'Geometry poster');
  assert.equal(gallery.get('player').hidden, true);
  assert.equal(gallery.get('player').src, undefined);
  assert.equal(gallery.get('player').paused, true);
  assert.equal(gallery.get('download').textContent, 'Download poster');
  assert.equal(gallery.get('item-type').textContent, 'Poster');
  gallery.get('player').events.error();
  assert.equal(gallery.get('status').textContent, '');

  gallery.get('work').value = 'Another work';
  gallery.get('work').events.change();
  assert.equal(gallery.get('count').textContent, '1 item');
  assert.equal(gallery.get('poster-pdf').hidden, false);
  assert.equal(gallery.get('poster').hidden, true);
  assert.equal(gallery.get('poster').src, undefined);
  assert.equal(gallery.get('poster-pdf').title, 'PDF poster — Poster');
  gallery.get('group').value = 'Other project';
  gallery.get('group').events.change();
  assert.equal(gallery.get('work').value, '');
  assert.deepEqual(gallery.get('work').children.map(option => option.value), ['', 'Other work']);
  assert.equal(gallery.get('poster-pdf').src, undefined);
  assert.equal(gallery.get('player').hidden, false);
  assert.equal(gallery.get('project').textContent, 'Other project');
  await gallery.get('share').events.click();
  assert.equal(gallery.context.copied, gallery.location.href);

  const posterLink = await boot(mixed, '?item=pdf-poster');
  assert.equal(posterLink.get('group').value, 'MINERVA');
  assert.equal(posterLink.get('work').value, 'Another work');
  assert.equal(posterLink.get('poster-pdf').hidden, false);
  assert.equal(posterLink.get('count').textContent, '1 item');

  const empty = await boot([]);
  assert.equal(empty.get('title').textContent, 'No items yet');
  assert.equal(empty.get('count').textContent, '0 items');
  assert.equal(empty.get('actions').hidden, true);
  assert.equal(empty.get('player').hidden, true);
  const missing = await boot(catalog, '?item=unknown');
  assert.equal(missing.get('status').textContent, 'Requested item was not found. Showing the first item.');
  for (const invalid of [[catalog[0], catalog[0]], [{ ...catalog[0], type: 'unknown' }]]) {
    const broken = await boot(invalid);
    assert.equal(broken.get('title').textContent, 'Unable to load gallery');
  }
  console.log('Passed: project/work filters, mixed video/image/PDF items, media cleanup, share links, legacy links, empty and invalid catalogs.');
})().catch(error => { console.error(error); process.exitCode = 1; });
