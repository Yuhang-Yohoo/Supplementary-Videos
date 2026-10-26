# Research Gallery

A research gallery of videos and posters, organized by umbrella project and individual work. The current project is **MINERVA**, containing **Geo-aware localization**. Each work manages its original content in its own repository; this public repository contains the gallery interface, source registry, and selected published media under `content/<work>/`.

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
    "manifest": "content/d-localization/gallery.json"
  }
]
```

The repository URL is management metadata and is not rendered in the gallery interface. `assets/catalog.js` loads each published catalog independently and resolves its media paths relative to that catalog's URL. One unavailable work does not hide other available works.

## Update a video or poster

Update the asset or its entry in `gallery.json` in the **work repository**, commit and push there, then run `python .github/scripts/publish-gallery.py` from that repository. The script fetches this repository, updates only `content/d-localization/`, and commits and pushes those files. The gallery interface and other works are preserved. After GitHub Pages deploys, visitors see the updates when they reload this page. Pull the latest commits in a separate local gallery checkout after publishing.

The published layout is:

```text
Supplementary-Videos/
├── index.html
├── assets/
├── sources.json
└── content/d-localization/
    ├── gallery.json
    ├── paper-poster.pdf
    └── video/geo-aware-localization.mp4
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

Publish the new work's `gallery.json` and selected media under `content/<work>/`, then register its unique ID, source repository URL, and relative catalog path in `sources.json`. The catalog's `id` must match the registered source ID. Keep item IDs unique across all works. External HTTPS catalog URLs remain supported; cross-origin hosts must allow this gallery to fetch their JSON.

A private repository cannot be fetched directly by public visitors. For Geo-aware localization, the local publishing command copies only the approved catalog, video, and poster into this public gallery using the maintainer's existing Git credentials. The private manuscript and source files stay in the private work repository. See `GALLERY.md` there for the exact allowlist. No separate delivery repository or new publishing credentials are needed.

Keep IDs stable so shared links continue to work. Link to any item with `?item=<id>`; existing `?video=<id>` links are also supported:

https://yuhang-yohoo.github.io/Supplementary-Videos/?item=geo-aware-localization

Published media copies are stored in this gallery repository. Their editable originals and any private research sources remain in the work repositories.

## Enable GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. The empty `.nojekyll` file allows the static files to be published directly.

## Local preview

Serve the repository through an HTTP server rather than opening `index.html` as a local file. If Python is installed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. The site uses plain HTML, CSS, and JavaScript with no build step or external dependencies.

Run the gallery behavior checks with `node tests/gallery.test.cjs`.
