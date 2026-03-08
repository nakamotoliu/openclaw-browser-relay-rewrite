import { deriveRelayToken } from './background-utils.js'
import { classifyRelayCheckException, classifyRelayCheckResponse } from './options-validation.js'

const DEFAULT_PORT = 18792
const DEFAULT_URL = 'https://play.sonos.com/'
const DEFAULT_AUTO_ATTACH_ALL_SITES = false
const ALL_SITES_ORIGINS = ['http://*/*', 'https://*/*']

function clampPort(value) {
  const n = Number.parseInt(String(value || ''), 10)
  if (!Number.isFinite(n)) return DEFAULT_PORT
  if (n <= 0 || n > 65535) return DEFAULT_PORT
  return n
}

function updateRelayUrl(port) {
  const el = document.getElementById('relay-url')
  if (!el) return
  el.textContent = `http://127.0.0.1:${port}/`
}

function setStatus(kind, message) {
  const status = document.getElementById('status')
  if (!status) return
  status.dataset.kind = kind || ''
  status.textContent = message || ''
}

async function checkRelayReachable(port, token) {
  const url = `http://127.0.0.1:${port}/json/version`
  const trimmedToken = String(token || '').trim()
  if (!trimmedToken) {
    setStatus('error', 'Gateway token required. Save your gateway token to connect.')
    return
  }
  try {
    const relayToken = await deriveRelayToken(trimmedToken, port)
    // Delegate the fetch to the background service worker to bypass
    // CORS preflight on the custom x-openclaw-relay-token header.
    const res = await chrome.runtime.sendMessage({
      type: 'relayCheck',
      url,
      token: relayToken,
    })
    const result = classifyRelayCheckResponse(res, port)
    if (result.action === 'throw') throw new Error(result.error)
    setStatus(result.kind, result.message)
  } catch (err) {
    const result = classifyRelayCheckException(err, port)
    setStatus(result.kind, result.message)
  }
}

async function ensureAllSitesPermission(enabled) {
  if (!chrome.permissions?.contains) return true

  if (enabled) {
    const alreadyGranted = await chrome.permissions.contains({ origins: ALL_SITES_ORIGINS })
    if (alreadyGranted) return true
    return await chrome.permissions.request({ origins: ALL_SITES_ORIGINS })
  }

  const alreadyGranted = await chrome.permissions.contains({ origins: ALL_SITES_ORIGINS })
  if (!alreadyGranted) return true
  return await chrome.permissions.remove({ origins: ALL_SITES_ORIGINS })
}

async function load() {
  const stored = await chrome.storage.local.get(['relayPort', 'gatewayToken', 'defaultUrl', 'autoAttachAllSites'])
  const port = clampPort(stored.relayPort)
  const token = String(stored.gatewayToken || '').trim()
  const defaultUrl = String(stored.defaultUrl || DEFAULT_URL).trim()
  const autoAttachAllSites = stored.autoAttachAllSites === true ? true : DEFAULT_AUTO_ATTACH_ALL_SITES

  const portEl = document.getElementById('port')
  const tokenEl = document.getElementById('token')
  const urlEl = document.getElementById('defaultUrl')
  const autoAttachAllSitesEl = document.getElementById('autoAttachAllSites')

  if (portEl) portEl.value = String(port)
  if (tokenEl) tokenEl.value = token
  if (urlEl) urlEl.value = defaultUrl
  if (autoAttachAllSitesEl) autoAttachAllSitesEl.checked = autoAttachAllSites

  updateRelayUrl(port)
  await checkRelayReachable(port, token)
}

async function save() {
  const portInput = document.getElementById('port')
  const tokenInput = document.getElementById('token')
  const urlInput = document.getElementById('defaultUrl')
  const autoAttachAllSitesInput = document.getElementById('autoAttachAllSites')

  const port = clampPort(portInput?.value)
  const token = String(tokenInput?.value || '').trim()
  const defaultUrl = String(urlInput?.value || DEFAULT_URL).trim()
  const requestedAutoAttachAllSites = autoAttachAllSitesInput?.checked === true

  if (requestedAutoAttachAllSites) {
    const confirmed = window.confirm(
      'Enable all-sites auto-attach? This may attach any normal HTTP/HTTPS page and can stream browser debugging events to your local OpenClaw relay/gateway. Manual toolbar clicks will still keep the configured default-site fallback.'
    )
    if (!confirmed) {
      if (autoAttachAllSitesInput) autoAttachAllSitesInput.checked = false
      setStatus('error', 'All-sites mode was cancelled before saving.')
      return
    }
  }

  const permissionGranted = await ensureAllSitesPermission(requestedAutoAttachAllSites)
  const autoAttachAllSites = requestedAutoAttachAllSites && permissionGranted

  if (requestedAutoAttachAllSites && !permissionGranted) {
    if (autoAttachAllSitesInput) autoAttachAllSitesInput.checked = false
    setStatus('error', 'All-sites permission was not granted. Setting was not enabled.')
  }

  await chrome.storage.local.set({ relayPort: port, gatewayToken: token, defaultUrl, autoAttachAllSites })

  if (portInput) portInput.value = String(port)
  if (tokenInput) tokenInput.value = token
  if (urlInput) urlInput.value = defaultUrl
  if (autoAttachAllSitesInput) autoAttachAllSitesInput.checked = autoAttachAllSites

  updateRelayUrl(port)
  await checkRelayReachable(port, token)
  if (!requestedAutoAttachAllSites || permissionGranted) {
    setStatus('ok', autoAttachAllSites ? 'Saved. All-sites mode is enabled for this browser.' : 'Saved. All-sites mode is disabled.')
  }
}

document.getElementById('save')?.addEventListener('click', () => void save())
void load()
