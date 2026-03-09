# Changelog

All notable changes to the OpenClaw Browser Relay Rewriter extension are documented here.

## [0.2.4] - 2026-03-09

### Added
- **All-sites Auto-attach Toggle**: New configurable option to enable/disable auto-attach on all domains
- **Hardened Auto-attach Behavior**: Improved stability and reliability of the auto-attach mechanism
- **Official Extension Sync**: Synchronized with official OpenClaw Browser Relay (GitHub update 2026-03-08)
- **SOP Documentation**: Complete Standard Operating Procedures for relay extension customization and versioning

### Changed
- Extension name updated to "OpenClaw Browser Relay Rewriter" (from "Sonos Browser Relay")
- Improved version management rules (Official extension base date now tracked separately)
- Enhanced domain matching and attachment logic

### Technical Details
- **Base**: Official OpenClaw Chrome extension (2026-03-08, commit 362248e55908)
- **Custom Version**: 0.2.4
- **Manifest V3** with hardened permissions and improved service worker logic

## [0.2.1] - 2026-02-15

### Added
- Version bump and enforcement of version-bump rule in automation skill
- Enhanced relay extension stability

### Fixed
- Improved attachment reliability

## [0.2.0] - 2026-01-20

### Added
- Configurable default URL setting in options
- Extension now opens default URL when clicked on non-Sonos tabs
- Renamed to "Sonos Browser Relay for OpenClaw"
- One-click attach functionality
- Auto-attach on startup and tab updates
- Sonos URL filtering
- Persistent connection across service worker restarts

### Features
- Chrome extension (Manifest V3)
- Service Worker background script
- OpenClaw integration support

## [0.1.1] - 2025-12-10

### Added
- Auto-attach on startup and tab updates
- Sonos URL filtering
- Duplicate attach prevention
- Basic browser relay functionality

---

## Version Management

### Important Rules
1. **Official Extension Base Date**: Refers to the latest GitHub update date of `openclaw/openclaw` path `assets/chrome-extension` (NOT the repo HEAD date)
2. **Custom Version**: OpenClaw Browser Relay Rewriter version is tracked independently
3. **Sync Process**:
   - Official base date + commit hash are recorded in extension description
   - Custom patches are applied on top of official base
   - Version increments reflect custom enhancements

### Current Status
- **Official Base**: 2026-03-08 (commit 362248e55908)
- **Custom Version**: 0.2.4
- **Status**: Synchronized with official extension + custom all-domains auto-attach enhancements
