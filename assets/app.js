'use strict';
const byId = id => document.getElementById(id);
let items = [];
let selectedId = '';
const legacyItemIds = new Map([
  ['icra27-4954-vi-i', 'geo-aware-localization']
]);
const typeLabel = item => item.type === 'poster' ? 'Poster' : 'Video';

function filteredItems() {
  const project = byId('group').value;
  const work = byId('work').value;
  return items.filter(item => (!project || item.project === project) && (!work || item.work === work));
}

function updateWorks() {
  const previous = byId('work').value;
  const project = byId('group').value;
  const works = [...new Set(items.filter(item => !project || item.project === project).map(item => item.work))].sort();
  byId('work').replaceChildren(new Option('All works', ''));
  for (const work of works) byId('work').add(new Option(work, work));
  byId('work').value = works.includes(previous) ? previous : '';
}

function renderList() {
  const filtered = filteredItems();
  byId('count').textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  byId('list').replaceChildren();
  for (const item of filtered) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-current', String(item.id === selectedId));
    button.textContent = item.title;
    const details = document.createElement('span');
    details.textContent = `${typeLabel(item)} · ${item.project}`;
    button.append(details);
    button.addEventListener('click', () => selectItem(item));
    byId('list').append(button);
  }
  if (!filtered.length) byId('list').textContent = 'No items in this selection.';
}

function clearMedia() {
  byId('player').pause();
  for (const id of ['player', 'poster', 'poster-pdf']) {
    byId(id).hidden = true;
    byId(id).removeAttribute('src');
  }
  byId('player').load();
}

function selectItem(item) {
  selectedId = item.id;
  clearMedia();
  const isPdf = item.type === 'poster' && new URL(item.src, location.href).pathname.toLowerCase().endsWith('.pdf');
  const viewer = byId(item.type === 'video' ? 'player' : isPdf ? 'poster-pdf' : 'poster');
  viewer.src = item.src;
  viewer.hidden = false;
  if (viewer.id === 'poster') viewer.alt = item.title;
  if (viewer.id === 'poster-pdf') viewer.title = `${item.title} — Poster`;
  byId('title').textContent = item.title;
  byId('project').textContent = item.project;
  byId('item-type').textContent = typeLabel(item);
  byId('description').textContent = item.description || '';
  byId('download').href = item.src;
  byId('download').textContent = `Download ${item.type}`;
  byId('actions').hidden = false;
  byId('status').textContent = '';
  document.title = `${item.title} | Research Gallery`;
  const url = new URL(location.href);
  url.searchParams.delete('video');
  url.searchParams.set('item', item.id);
  history.replaceState(null, '', url);
  renderList();
}

function refreshSelection() {
  const filtered = filteredItems();
  if (filtered.some(item => item.id === selectedId)) {
    renderList();
  } else if (filtered.length) {
    selectItem(filtered[0]);
  } else {
    selectedId = '';
    clearMedia();
    byId('title').textContent = 'No items yet';
    for (const id of ['project', 'item-type', 'description', 'status']) byId(id).textContent = '';
    byId('actions').hidden = true;
    document.title = 'Research Gallery | YuHang Zhao';
    const url = new URL(location.href);
    url.searchParams.delete('item');
    url.searchParams.delete('video');
    history.replaceState(null, '', url);
    renderList();
  }
}

byId('group').addEventListener('change', () => {
  updateWorks();
  refreshSelection();
});
byId('work').addEventListener('change', refreshSelection);
byId('player').addEventListener('error', () => {
  if (!byId('player').hidden) byId('status').textContent = 'Unable to play this video. Try downloading it.';
});
byId('poster').addEventListener('error', () => {
  if (!byId('poster').hidden) byId('status').textContent = 'Unable to display this poster. Try downloading it.';
});
byId('share').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    byId('status').textContent = 'Item link copied.';
  } catch {
    byId('status').textContent = `Copy this link: ${location.href}`;
  }
});

async function init() {
  try {
    const response = await fetch('videos.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to load gallery catalog.');
    const catalog = await response.json();
    const ids = new Set();
    if (!Array.isArray(catalog)) throw new Error('Gallery catalog must be an array.');
    for (const item of catalog) {
      if (!item || !['id', 'project', 'work', 'title', 'src'].every(key => typeof item[key] === 'string' && item[key].trim()) || ids.has(item.id)) {
        throw new Error('Each item needs a unique id, project, work, title, and src.');
      }
      if (!['video', 'poster'].includes(item.type)) throw new Error('Each item must be a video or poster.');
      const source = new URL(item.src, location.href);
      if (!['http:', 'https:'].includes(source.protocol)) throw new Error('Unsupported item URL.');
      ids.add(item.id);
    }
    items = catalog;
    const projects = [...new Set(items.map(item => item.project))].sort();
    for (const project of projects) byId('group').add(new Option(project, project));
    const url = new URL(location.href);
    const requested = url.searchParams.get('item') || url.searchParams.get('video');
    const requestedId = legacyItemIds.get(requested) || requested;
    const requestedItem = items.find(item => item.id === requestedId);
    byId('group').value = requestedItem ? requestedItem.project : projects.length === 1 ? projects[0] : '';
    updateWorks();
    if (requestedItem) {
      byId('work').value = requestedItem.work;
      selectItem(requestedItem);
    } else {
      refreshSelection();
      if (requested && items.length) byId('status').textContent = 'Requested item was not found. Showing the first item.';
    }
  } catch (error) {
    byId('title').textContent = 'Unable to load gallery';
    byId('status').textContent = `${error.message} For local preview, open this site through an HTTP server.`;
  }
}
init();
