# Research Gallery

A research gallery of videos and posters, organized by umbrella project and individual work. The current project is **MINERVA**, containing **Geo-aware localization** and **Robust localization**. Each work manages and publishes its selected content from its own repository. This public repository contains the gallery interface and source registry.

Website: https://yuhang-yohoo.github.io/Supplementary-Videos/

## Scan to visit

<img src="assets/site-qr.svg" alt="QR code for the Research Gallery website" width="180" height="180">

Scan this QR code to open the research gallery on your phone.

[Download QR code (SVG)](https://yuhang-yohoo.github.io/Supplementary-Videos/assets/site-qr.svg)

To save the SVG, right-click the download link and choose **Save link as…**.

## Content sources

`sources.json` is the only work registry maintained in this repository:

```json
[
  {
    "id": "d-localization",
    "repository": "https://github.com/Yuhang-Yohoo/Geo-awared-localization",
    "manifest": "https://yuhang-yohoo.github.io/Geo-awared-localization/gallery.json"
  },
  {
    "id": "robust-localization",
    "repository": "https://github.com/Yuhang-Yohoo/robust_localization",
    "manifest": "https://yuhang-yohoo.github.io/robust_localization/gallery.json"
  }
]
```

The repository URL is management metadata and is not rendered in the gallery interface. `assets/catalog.js` loads each published catalog independently and resolves its media paths relative to that catalog's URL. One unavailable work does not hide other available works.

## Update a video or poster

Update the asset or its entry in `gallery.json` in the **work repository**, then commit and push to its `main` branch. Its **Publish gallery content** GitHub Actions workflow tests and deploys the approved catalog and media directly to that repository's Pages site. Once deployment completes, visitors see the updates on reloading the gallery. No local publishing script, media copy, or commit in this gallery repository is needed.

The repositories have these responsibilities:

```text
Geo-awared-localization (private repository)
  -> GitHub Actions publishes only gallery.json, video, poster, and .nojekyll
  -> https://yuhang-yohoo.github.io/Geo-awared-localization/

robust_localization (private repository)
  -> GitHub Actions publishes only gallery.json, animations/final.mp4, and .nojekyll
  -> https://yuhang-yohoo.github.io/robust_localization/

Supplementary-Videos (public gallery)
  -> index.html, assets/, sources.json
  -> loads the work's public Pages catalog and media
```

The Geo-aware localization catalog has this structure:

```json
{
  "id": "d-localization",
  "project": "MINERVA",
  "work": "Geo-aware localization",
  "items": [
    {
      "id": "geo-aware-localization",
      "type": "video",
      "title": "Geo-aware localization",
      "description": "Demonstration of Geo-aware localization.",
      "src": "video/geo-aware-localization.mp4"
    }
  ]
}
```

Posters use `"type": "poster"` and can point to an image or a PDF. The Project dropdown filters umbrella projects. The Work dropdown lists works within the selected project. **All works** shows every video and poster in that project.

## Add a work

Publish the new work's `gallery.json` and selected media from its repository's Pages site, then register its unique ID, source repository URL, and published catalog URL in `sources.json`. The catalog's `id` must match the registered source ID. Keep item IDs unique across all works. Relative catalog paths and other HTTPS hosts remain supported; cross-origin hosts must allow this gallery to fetch their JSON.

The work repositories remain private. Each workflow publishes only its explicitly selected assets using GitHub's temporary Pages deployment token. Geo-aware localization publishes its catalog, video, poster, and empty `.nojekyll`; Robust localization publishes its catalog, `animations/final.mp4`, and empty `.nojekyll`. Other research material and repository sources remain private. See `GALLERY.md` in each work repository for its exact allowlist. No separate delivery repository, deploy key, or cross-repository secret is needed.

Keep IDs stable so shared links continue to work. Link to any item with `?item=<id>`; existing `?video=<id>` links are also supported:

https://yuhang-yohoo.github.io/Supplementary-Videos/?item=geo-aware-localization

Media is served directly from each work's Pages site. The previous media copies in this gallery repository and local cross-repository publishing script have been retired; the former intermediary repository remains archived.

## Enable GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. The empty `.nojekyll` file allows the static files to be published directly.

## Local preview

Serve the repository through an HTTP server rather than opening `index.html` as a local file. If Python is installed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. The site uses plain HTML, CSS, and JavaScript with no build step or external dependencies.

Run the gallery behavior checks with `node tests/gallery.test.cjs`.
