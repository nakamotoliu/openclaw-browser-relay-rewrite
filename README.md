# Sonos Browser Relay for OpenClaw

A Chrome extension that bridges OpenClaw agents to the Sonos Web App (`play.sonos.com`) for automated music playback control.

## Features

- **One-click attach**: Click the extension icon to automatically open Sonos Web App and attach OpenClaw
- **Auto-attach on startup**: Automatically attaches when Chrome starts with Sonos tab
- **Auto-attach on navigation**: Automatically attaches when navigating to play.sonos.com
- **Configurable default URL**: Set your preferred default website (defaults to Sonos Web App)
- **Persistent connection**: Maintains connection across service worker restarts

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `src/` directory
5. The extension icon should appear in your toolbar

## Configuration

1. Click the extension icon and select "Options" (or right-click → Options)
2. Set the **Default URL** (defaults to `https://play.sonos.com/`)
3. Configure the **Relay Port** (default: `18792`)
4. Enter your **Gateway Token** from OpenClaw

## Usage

### Basic Usage

1. Click the extension icon on any tab
2. If not on a Sonos page, it will automatically open `play.sonos.com` in a new tab
3. The extension will auto-attach to the Sonos tab
4. Use OpenClaw with `profile="chrome"` to control the browser

### With OpenClaw

```bash
# Check attached tabs
openclaw browser tabs --profile chrome

# Take a snapshot
openclaw browser snapshot --profile chrome
```

## Architecture

- **Manifest V3** Chrome extension
- **Service Worker** background script for persistent connections
- **CDP (Chrome DevTools Protocol)** via `chrome.debugger` API
- **WebSocket relay** to OpenClaw Gateway

## Files

- `src/background.js` - Main service worker logic
- `src/options.html` / `options.js` - Extension settings UI
- `src/manifest.json` - Extension manifest
- `src/icons/` - Extension icons

## Development

### Project Structure

```
├── src/
│   ├── background.js          # Main service worker
│   ├── background-utils.js    # Utility functions
│   ├── options.html           # Settings page
│   ├── options.js             # Settings logic
│   ├── options-validation.js  # Input validation
│   ├── manifest.json          # Extension manifest
│   └── icons/                 # Extension icons
├── docs/
│   ├── CHANGELOG.md           # Version history
│   └── PATCH_GUIDE.md         # Upgrade guide
└── scripts/
    └── sync_from_openclaw.sh  # Sync from upstream
```

### Key Features

1. **Default Website Opening**: When clicking the extension icon on a non-Sonos page, it automatically opens the configured default URL (Sonos Web App)

2. **Smart URL Detection**: Only auto-attaches to URLs matching `play.sonos.com`

3. **Connection State Management**: Prevents duplicate attachments and handles reconnection

4. **Options Persistence**: Settings stored in `chrome.storage.local`

## License

MIT License - See LICENSE file for details

## Related Projects

- [OpenClaw](https://github.com/openclaw/openclaw) - The AI agent framework this extension works with
- [sonos-hybrid-control](https://github.com/nakamotoliu/sonos-hybrid-control) - OpenClaw skill for Sonos control

## Changelog

### v0.2.0
- Added configurable default URL setting in options
- Extension now opens default URL when clicked on non-Sonos tabs
- Renamed to "Sonos Browser Relay for OpenClaw"

### v0.1.1
- Auto-attach on startup and tab updates
- Sonos URL filtering
- Duplicate attach prevention

## Credits

Based on the OpenClaw Browser Relay extension, modified for Sonos Web App automation.
