# Research Gallery

A research gallery of videos and posters, organized by umbrella project and individual work. The current project is **MINERVA**, containing **d-localization**. Each work manages its catalog and media in its own repository; this repository contains the gallery interface and source registry.

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
    "manifest": "https://yuhang-yohoo.github.io/d-localization-gallery/gallery.json"
  }
]
```

The repository URL is management metadata and is not rendered in the gallery interface. `assets/catalog.js` loads each published catalog independently and resolves its media paths relative to that catalog's URL. One unavailable work does not hide other available works.

## Update a video or poster

Update the asset or its entry in `gallery.json` in the **work repository**, commit and push there, then run `python .github/scripts/publish-gallery.py` from that repository. After GitHub Pages deploys the approved files, visitors see the updates when they reload this page. No gallery code change or copy of the media is needed here.

The d-localization catalog has this structure:

```json
{
  "id": "d-localization",
  "project": "MINERVA",
  "work": "d-localization",
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

Publish the new work's `gallery.json` and selected media at browser-accessible HTTPS URLs, then register its unique ID, repository URL, and catalog URL in `sources.json`. The catalog's `id` must match the registered source ID. Keep item IDs unique across all work repositories. Cross-origin catalog hosts must allow this gallery to fetch their JSON; GitHub Pages project sites under the same `github.io` hostname share an origin.

A private repository cannot be fetched directly by public visitors. For d-localization, a local publishing command synchronizes only the approved catalog, video, and poster to the public `d-localization-gallery` delivery repository using the maintainer's existing Git credentials. GitHub Pages serves that copy. The private manuscript and source files stay private, and the main gallery stores no media. See `GALLERY.md` in the source repository for the exact allowlist. Do not add access tokens to the registry or browser code.

Keep IDs stable so shared links continue to work. Link to any item with `?item=<id>`; existing `?video=<id>` links are also supported:

https://yuhang-yohoo.github.io/Supplementary-Videos/?item=geo-aware-localization

Media files are not stored in this gallery repository. Work repositories can also point to external HTTPS media hosts when needed.

## Enable GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. The empty `.nojekyll` file allows the static files to be published directly.

## Local preview

Serve the repository through an HTTP server rather than opening `index.html` as a local file. If Python is installed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. The site uses plain HTML, CSS, and JavaScript with no build step or external dependencies.

Run the gallery behavior checks with `node tests/gallery.test.cjs`.
