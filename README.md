# Research Gallery

A research gallery of videos and posters, organized by umbrella project and individual work. The current project is **MINERVA**, containing **Geo-aware localization**.

Website: https://yuhang-yohoo.github.io/Supplementary-Videos/

## Scan to visit

<img src="assets/site-qr.svg" alt="QR code for the Supplementary Videos website" width="180" height="180">

Scan this QR code to open the research gallery on your phone.

[Download QR code (SVG)](https://yuhang-yohoo.github.io/Supplementary-Videos/assets/site-qr.svg)

To save the SVG, right-click the download link and choose **Save link as…**.

## Add a video or poster

1. Place videos in `videos/<work>/` and posters in `posters/<work>/`. Prefer browser-compatible MP4 (H.264 video and AAC audio) for videos; posters can be images or PDFs.
2. Add an entry to `videos.json` with a unique, stable `id`, an umbrella `project`, a specific `work`, a `type` (`video` or `poster`), a `title`, an optional `description`, and a `src` relative to the repository root. Multiple items can share the same project and work.
3. Commit and push. The page loads the catalog automatically; no HTML changes are needed.

Example entry:

```json
{
  "id": "geo-aware-localization",
  "project": "MINERVA",
  "work": "Geo-aware localization",
  "type": "video",
  "title": "Geo-aware localization",
  "description": "Experiment demonstration",
  "src": "videos/geo-aware-localization/geo-aware-localization.mp4"
}
```

The Project dropdown filters umbrella projects. The Work dropdown lists works within the selected project. **All works** shows every video and poster in that project.

Keep IDs stable so shared links continue to work. Link to any item with `?item=<id>`; existing `?video=<id>` links are also supported:

https://yuhang-yohoo.github.io/Supplementary-Videos/?item=geo-aware-localization

External HTTPS video URLs are also supported in `src` if the library outgrows repository storage. Ordinary GitHub Git uploads must stay within the [file size limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github); files above 100 MiB are blocked. Git LFS is not supported by GitHub Pages, so use suitable external hosting for large videos.

## Enable GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. The empty `.nojekyll` file allows the static files to be published directly.

## Local preview

Serve the repository through an HTTP server rather than opening `index.html` as a local file. If Python is installed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. The site uses plain HTML, CSS, and JavaScript with no build step or external dependencies.

Run the gallery behavior checks with `node tests/gallery.test.cjs`.
