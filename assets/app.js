'use strict';
const byId = id => document.getElementById(id);
let videos = [];
let selectedId = '';

function renderList() {
  const query = byId('search').value.trim().toLowerCase();
  const group = byId('group').value;
  const filtered = videos.filter(v => (!group || v.group === group) &&
    `${v.title} ${v.group} ${v.description || ''}`.toLowerCase().includes(query));
  byId('count').textContent = `${filtered.length} video${filtered.length === 1 ? '' : 's'}`;
  byId('list').replaceChildren();
  for (const video of filtered) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-item';
    button.setAttribute('aria-current', String(video.id === selectedId));
    button.textContent = video.title;
    const project = document.createElement('span');
    project.textContent = video.group;
    button.append(project);
    button.addEventListener('click', () => selectVideo(video));
    byId('list').append(button);
  }
  if (!filtered.length) byId('list').textContent = 'No matching videos.';
}

function selectVideo(video, updateUrl = true) {
  selectedId = video.id;
  byId('player').src = video.src;
  byId('title').textContent = video.title;
  byId('project').textContent = video.group;
  byId('description').textContent = video.description || '';
  byId('download').href = video.src;
  byId('actions').hidden = false;
  byId('status').textContent = '';
  document.title = `${video.title} | Supplementary Videos`;
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('video', video.id);
    history.replaceState(null, '', url);
  }
  renderList();
}

byId('group').addEventListener('change', renderList);
byId('search').addEventListener('input', renderList);
byId('player').addEventListener('error', () => {
  byId('status').textContent = 'Unable to play this video. Try downloading it or check the video path.';
});
byId('share').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    byId('status').textContent = 'Video link copied.';
  } catch {
    byId('status').textContent = `Copy this link: ${location.href}`;
  }
});

async function init() {
  try {
    const response = await fetch('videos.json');
    if (!response.ok) throw new Error('Unable to load video catalog.');
    const catalog = await response.json();
    const ids = new Set();
    if (!Array.isArray(catalog)) throw new Error('Video catalog must be an array.');
    for (const v of catalog) {
      if (!v || !['id', 'group', 'title', 'src'].every(key => typeof v[key] === 'string' && v[key].trim()) || ids.has(v.id)) {
        throw new Error('Each video needs a unique id, group, title, and src.');
      }
      const source = new URL(v.src, location.href);
      if (!['http:', 'https:'].includes(source.protocol)) throw new Error('Unsupported video URL.');
      ids.add(v.id);
    }
    videos = catalog;
    for (const group of [...new Set(videos.map(v => v.group))].sort()) {
      byId('group').add(new Option(group, group));
    }
    if (!videos.length) {
      byId('title').textContent = 'No videos yet';
      renderList();
      return;
    }
    const requested = new URL(location.href).searchParams.get('video');
    selectVideo(videos.find(v => v.id === requested) || videos[0]);
    if (requested && !ids.has(requested)) byId('status').textContent = 'Requested video was not found. Showing the first video.';
  } catch (error) {
    byId('title').textContent = 'Unable to load library';
    byId('status').textContent = `${error.message} For local preview, open this site through an HTTP server.`;
  }
}
init();
