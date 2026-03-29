# Safari Extension Setup

The Safari version requires Xcode to build. Steps:

## Generate the Xcode project

1. Open Xcode
2. File → New → Project → Safari Extension App
3. Product name: `xcancel`
4. Language: Swift
5. Check both "macOS" and "iOS" targets
6. Save inside this `safari/` directory

## Link the shared code

In the Xcode project, replace the auto-generated extension JS files with references to the shared files:

1. Delete the auto-generated `Resources/content.js` and `Resources/background.js`
2. Add references (not copies) to:
   - `../shared/url-rewriter.js`
   - `../shared/content.js`
   - `../shared/background.js`
3. Update the generated `manifest.json` inside the Xcode project to match the root `manifest.json` structure

## Build & Run

- Select the macOS or iOS target and build (Cmd+B)
- Safari → Settings → Extensions → Enable "xcancel"
- Safari → Develop → Allow Unsigned Extensions (for development)
