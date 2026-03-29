# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser extension that rewrites `x.com` (and `twitter.com`) links to `xcancel.com` in real time. Works on Safari (desktop + iOS) and Chrome (desktop).

**Key rule:** links to X articles (`x.com/i/article/...`, `x.com/<user>/article/...`) must NOT be rewritten — xcancel does not render articles.

## Architecture

```
xcancel/
├── manifest.json            # Chrome Manifest V3 (root = Chrome extension root)
├── shared/                  # Cross-browser core logic
│   ├── content.js           # Content script: DOM link rewriting + MutationObserver
│   ├── background.js        # Service worker: declarativeNetRequest / redirect rules
│   └── url-rewriter.js      # Pure functions: URL detection, article filtering, rewriting
├── safari/                  # Xcode project wrapper for Safari Web Extension (see safari/README.md)
├── icons/                   # Extension icons (SVG source + generated PNGs)
└── tests/                   # Unit tests for url-rewriter.js
```

### How the rewriting works

Two layers, both using `url-rewriter.js`:

1. **Content script (`content.js`)** — Runs on all pages. Finds `<a>` elements pointing to x.com/twitter.com, rewrites `href` in-place. Uses `MutationObserver` to catch dynamically inserted links (SPAs, infinite scroll).

2. **Background service worker (`background.js`)** — Uses `declarativeNetRequest` (Chrome) or equivalent to redirect navigations to x.com directly at the network level, as a fallback for links opened in new tabs or typed in the address bar. Safari iOS may have limitations here.

### URL patterns

Rewrite: `x.com/*`, `twitter.com/*`, `www.x.com/*`, `www.twitter.com/*`

Exclude (do NOT rewrite):
- `x.com/i/article/*`
- `x.com/<username>/article/*`
- Any future article URL patterns (keep the exclusion list in `url-rewriter.js` as a single source of truth)

## Build & Development

```bash
# No build step for Chrome — load project root as unpacked extension
# Chrome: chrome://extensions → "Load unpacked" → select project root

# Safari: open safari/xcancel/xcancel.xcodeproj in Xcode
# Build target: "xcancel (macOS)" or "xcancel (iOS)"
# Safari requires enabling unsigned extensions in Develop menu

# Tests
npm test                    # Run url-rewriter unit tests
npm run test:watch          # Watch mode
```

## Cross-Browser Notes

- Chrome uses Manifest V3 (`manifest.json` with `"manifest_version": 3`).
- Safari uses the WebExtension API via Xcode's "Safari Web Extension" template. The Xcode project wraps the same shared JS/JSON.
- Keep all rewriting logic in `shared/url-rewriter.js` — browser-specific code should only handle API differences (permissions, declarativeNetRequest variants).
- Safari iOS does not support `declarativeNetRequest` redirects the same way — content script is the primary mechanism there.

## Conventions

- Pure JS, no frameworks, no build tools for the extension itself.
- `url-rewriter.js` must be side-effect-free and fully testable without browser APIs.
- When adding new URL exclusions, add them in `url-rewriter.js` AND add corresponding test cases.
