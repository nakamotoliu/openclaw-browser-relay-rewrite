# PATCH GUIDE（OpenClaw 升级后重写/重打补丁）

## 1) 同步最新官方源码

```bash
bash scripts/sync_from_openclaw.sh
```

## 2) 对比关键文件

- `src/background.js`
- `src/manifest.json`

建议：
```bash
git diff -- src/background.js src/manifest.json
```

## 3) 重新确认以下逻辑仍在

- `autoAttach()` 函数存在
- `chrome.runtime.onStartup` 自动触发
- `chrome.tabs.onUpdated` 自动触发
- `isAlreadyAttached()` 防重入
- `host_permissions` 包含 `https://play.sonos.com/*`

## 4) 重载扩展

- Chrome -> `chrome://extensions`
- 选择本项目 `src/` 对应扩展
- 点击 Reload

## 5) 验证

- 打开 Sonos 页面
- 等待 1-2 秒
- OpenClaw `browser.tabs --profile chrome` 返回非空

## 6) 回归测试（建议）

- 首次打开 Sonos 自动 attach
- 刷新页面后自动重连
- 非 Sonos 页面不 attach