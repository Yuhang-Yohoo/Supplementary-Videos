'use strict';

async function fetchCatalogJson(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status}): ${url}`);
  return response.json();
}

function catalogUrl(value, base) {
  const url = new URL(value, base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported catalog or media URL.');
  return url.href;
}

async function loadWorkCatalog(source) {
  const manifestUrl = catalogUrl(source.manifest, location.href);
  const manifest = await fetchCatalogJson(manifestUrl);
  if (!manifest || manifest.id !== source.id || !['project', 'work'].every(key => typeof manifest[key] === 'string' && manifest[key].trim()) || !Array.isArray(manifest.items)) {
    throw new Error(`Invalid work catalog: ${source.id}`);
  }
  const ids = new Set();
  return manifest.items.map(item => {
    if (!item || !['id', 'title', 'src'].every(key => typeof item[key] === 'string' && item[key].trim()) || ids.has(item.id) || !['video', 'poster'].includes(item.type) || (item.description !== undefined && typeof item.description !== 'string')) {
      throw new Error(`Invalid or duplicate item in work: ${source.id}`);
    }
    ids.add(item.id);
    return {
      ...item,
      project: manifest.project,
      work: manifest.work,
      src: catalogUrl(item.src, manifestUrl)
    };
  });
}

async function loadCatalog() {
  const sources = await fetchCatalogJson('sources.json');
  if (!Array.isArray(sources)) throw new Error('Source registry must be an array.');
  const sourceIds = new Set();
  for (const source of sources) {
    if (!source || !['id', 'manifest'].every(key => typeof source[key] === 'string' && source[key].trim()) || sourceIds.has(source.id)) {
      throw new Error('Each work source needs a unique id and a manifest URL.');
    }
    sourceIds.add(source.id);
  }
  const results = await Promise.allSettled(sources.map(loadWorkCatalog));
  const catalog = [];
  const ids = new Set();
  let unavailable = 0;
  let loaded = 0;
  for (const result of results) {
    if (result.status === 'rejected' || result.value.some(item => ids.has(item.id))) {
      unavailable += 1;
      console.error(result.status === 'rejected' ? result.reason : new Error('Duplicate item IDs across work sources.'));
      continue;
    }
    loaded += 1;
    for (const item of result.value) {
      ids.add(item.id);
      catalog.push(item);
    }
  }
  if (sources.length && !loaded) throw new Error('No work catalogs are currently available.');
  return { catalog, unavailable };
}
