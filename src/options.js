import { deriveRelayToken } from './background-utils.js'
import { classifyRelayCheckException, classifyRelayCheckResponse } from './options-validation.js'

const DEFAULT_PORT = 18792
const DEFAULT_AUTO_ATTACH_ALL = true

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

async function load() {
  const stored = await chrome.storage.local.get(['relayPort', 'gatewayToken', 'autoAttachAll'])
  const port = clampPort(stored.relayPort)
  const token = String(stored.gatewayToken || '').trim()
  const autoAttachAll = typeof stored.autoAttachAll === 'boolean' ? stored.autoAttachAll : DEFAULT_AUTO_ATTACH_ALL
  document.getElementById('port').value = String(port)
  document.getElementById('token').value = token
  document.getElementById('auto-attach-all').checked = autoAttachAll
  updateRelayUrl(port)
  await checkRelayReachable(port, token)
}

async function save() {
  const portInput = document.getElementById('port')
  const tokenInput = document.getElementById('token')
  const autoAttachAllInput = document.getElementById('auto-attach-all')
  const port = clampPort(portInput.value)
  const token = String(tokenInput.value || '').trim()
  const autoAttachAll = !!autoAttachAllInput.checked
  await chrome.storage.local.set({ relayPort: port, gatewayToken: token, autoAttachAll })
  portInput.value = String(port)
  tokenInput.value = token
  autoAttachAllInput.checked = autoAttachAll
  updateRelayUrl(port)
  await checkRelayReachable(port, token)
}

document.getElementById('save').addEventListener('click', () => void save())
void load()
