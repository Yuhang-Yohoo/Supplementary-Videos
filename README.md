# Supplementary Videos

A dedicated library for supplementary research videos, with a static GitHub Pages player.

Website: https://yuhang-yohoo.github.io/Supplementary-Videos/

## Scan to visit

<img src="assets/site-qr.svg" alt="QR code for the Supplementary Videos website" width="180" height="180">

Scan this QR code to open the video library on your phone.

[Download QR code (SVG)](https://yuhang-yohoo.github.io/Supplementary-Videos/assets/site-qr.svg)

To save the SVG, right-click the download link and choose **Save link as…**.

## Add a video

1. Place the video in `videos/<project>/`. Prefer browser-compatible MP4 (H.264 video and AAC audio).
2. Add an entry to `videos.json` with a unique, stable `id`, a `group`, a `title`, an optional `description`, and a `src` relative to the repository root.
3. Commit and push. The page loads the catalog automatically; no HTML changes are needed.

Example entry:

```json
{
  "id": "project-a-demo",
  "group": "Project A",
  "title": "Demo",
  "description": "Experiment demonstration",
  "src": "videos/project-a/demo.mp4"
}
```

Keep IDs stable so shared links continue to work. A video can be linked directly with `?video=<id>`:

https://yuhang-yohoo.github.io/Supplementary-Videos/?video=icra27-4954-vi-i

External HTTPS video URLs are also supported in `src` if the library outgrows repository storage. Ordinary GitHub Git uploads must stay within the [file size limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github); files above 100 MiB are blocked. Git LFS is not supported by GitHub Pages, so use suitable external hosting for large videos.

## Enable GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. The empty `.nojekyll` file allows the static files to be published directly.

## Local preview

Serve the repository through an HTTP server rather than opening `index.html` as a local file. If Python is installed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. The site uses plain HTML, CSS, and JavaScript with no build step or external dependencies.
