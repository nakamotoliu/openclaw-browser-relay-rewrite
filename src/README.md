# OpenClaw Chrome Extension Rewriter (Browser Relay)

Purpose: keep our custom relay extension aligned with the latest official OpenClaw Chrome extension, then layer our own behavior on top.

## Version split

- Official extension base date: **2026-03-08** (`openclaw/openclaw` → `assets/chrome-extension`, commit `362248e55908`)
- Custom rewriter version: **0.2.4**

## Local rule

From now on, this directory is maintained like this:

1. pull latest official code
2. overwrite this custom directory with the official extension files
3. re-apply our custom changes
4. keep Chrome loading this directory

No more parallel mystery versions.

## Custom behavior in this build

- default support for all `http://*/*` and `https://*/*` domains
- auto-attach on normal web pages by default
- ignore non-web URLs like `chrome://`, `chrome-extension://`, `devtools://`
- show official upstream base date separately from our custom version
