# Reddit Gallery Keys

A small browser extension that lets you navigate Reddit's image gallery
lightbox using the **left** and **right** arrow keys.

When you open an image post on Reddit and the lightbox appears (URL ends in
`#lightbox`), pressing arrow keys will step between images in the gallery —
the same as clicking the on-screen `<` / `>` chevrons.

Works on Chromium-based browsers (Chrome, Brave, Edge, Vivaldi, Arc).

## Install

### From source (developer mode)

1. Clone or download this repository.
2. Open `chrome://extensions` (or `brave://extensions`, etc.).
3. Enable **Developer mode** (toggle in the top-right).
4. Click **Load unpacked** and select the project folder.
5. Open any Reddit post with a gallery and try the arrow keys.

### From the Chrome Web Store

*(Coming soon.)*

## How it works

The extension is a single content script (`content.js`) that:

1. Listens for `keydown` on `ArrowLeft` / `ArrowRight`.
2. Detects the lightbox via the URL hash and the `<shreddit-media-lightbox>`
   custom element.
3. Finds the gallery's prev/next buttons by their `slot="prevButton"` /
   `slot="nextButton"` attributes (locale-independent), with a multilingual
   `aria-label` regex as a fallback.
4. Traverses shadow DOM so it works with Reddit's web-component-based UI.
5. Programmatically clicks the matched button.

It does nothing outside the lightbox view and ignores arrow keys when you're
typing in an input or textarea.

## Development

There's no build step — it's plain JavaScript using Manifest V3. Edit
`content.js`, reload the extension on `chrome://extensions`, then reload the
Reddit tab.

To debug, open DevTools and look for log lines prefixed with
`[reddit-arrowkeys]`.

## Releasing

To package a new version for the Chrome Web Store:

1. Bump `"version"` in `manifest.json` (e.g. `0.1.0` → `0.2.0`).
2. Run `./release.sh` — produces `reddit-gallery-keys-v<version>.zip` in the
   project root, containing only the files the extension needs.
3. Upload the zip to the Chrome Web Store Developer Console.

## License

[MIT](LICENSE)

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by Reddit,
Inc. "Reddit" is a trademark of Reddit, Inc.
