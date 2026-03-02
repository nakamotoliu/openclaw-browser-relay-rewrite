# CHANGELOG

## 2026-03-01

### Added
- `background.js`
  - `isSonosPlayUrl(url)`
  - `isAlreadyAttached(tabId)`
  - `autoAttach(tabId, url, reason)`
- 自动触发入口：
  - `chrome.runtime.onStartup`
  - `chrome.tabs.onUpdated`（`changeInfo.status === "complete"`）

### Changed
- `manifest.json`
  - `host_permissions` 新增：`https://play.sonos.com/*`
  - `version`: `0.1.0` -> `0.1.1`

### Notes
- 保留原 attach 逻辑（`attachTab`），未重写核心 CDP attach 机制
- 自动 attach 仅在 URL 命中 Sonos 页面时触发，且已有连接会跳过