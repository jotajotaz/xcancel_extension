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

## Install on Safari (macOS)

Requires Xcode (free from the App Store).

1. Download or clone this repository
2. Open `safari/xcancel/xcancel.xcodeproj` in Xcode
3. Select the **xcancel (macOS)** scheme in the top bar (next to the Play button)
4. Click Play (or Cmd+R) to build and run
5. A window will appear saying the extension is off — click **Quit and Open Safari Settings**
6. In Safari: **Settings → Advanced** → enable **Show features for web developers**
7. In the menu bar: **Develop → Allow unsigned extensions** (enter your password)
8. Go to **Safari → Settings → Extensions** → enable **xcancel**

Note: "Allow unsigned extensions" resets every time you restart Safari, so you'll need to re-enable it after each reboot.

## Install on Safari (iOS)

Requires Xcode and a USB cable connected to your iPhone.

1. Connect your iPhone to your Mac
2. On the iPhone: **Settings → Privacy & Security → Developer Mode** → turn on
3. Open `safari/xcancel/xcancel.xcodeproj` in Xcode
4. Select the **xcancel (iOS)** scheme and your iPhone as the destination
5. In Xcode, go to **Signing & Capabilities** for both the app and extension targets → select your Apple ID as the signing team
6. Click Play (or Cmd+R) to build and install on your device
7. On the iPhone: **Settings → Safari → Extensions** → enable **xcancel**

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

## Contributing

This is a vibe-coded project. Pull requests are not accepted, but forks are encouraged.

## Development

```bash
# Run tests
npm install
npm test
```

No build step required — Chrome loads the source files directly.
