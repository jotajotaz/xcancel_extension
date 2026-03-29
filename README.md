# xcancel

Browser extension that redirects x.com and twitter.com links to [xcancel.com](https://xcancel.com), an alternative frontend for X/Twitter.

Links to X articles are **not** redirected (xcancel doesn't support them).

## Install on Chrome

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked**
5. Select the root folder of this repository (the one containing `manifest.json`)

The extension will appear as **xcancel – Redirect X to xcancel**.

### Updating

After pulling new changes, go to `chrome://extensions` and click the reload button on the extension card.

## How it works

Three redirect layers ensure x.com never loads:

1. **declarativeNetRequest** — static rules that intercept requests at the network level, before any connection to x.com is made
2. **Content script at `document_start`** — runs on x.com pages before they render and redirects immediately via `location.replace()`
3. **webNavigation** — service worker fallback that redirects the tab URL for direct navigations

Links on other websites (e.g. someone shares an x.com link on Reddit) are rewritten in-place by a content script using a `MutationObserver`.

## What gets redirected

| URL | Redirected? |
|-----|-------------|
| `x.com/user/status/123` | Yes |
| `twitter.com/user` | Yes |
| `www.x.com/search?q=foo` | Yes |
| `x.com/i/article/123` | **No** (articles not supported by xcancel) |
| `x.com/user/article/456` | **No** |

## Development

```bash
# Run tests
npm install
npm test
```

No build step required — Chrome loads the source files directly.
