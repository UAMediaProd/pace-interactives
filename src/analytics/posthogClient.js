import posthog from 'posthog-js'

const isLocalhost = () => {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         hostname.endsWith('.local')
}

const TRACKING_ENABLED = !isLocalhost()

if (!TRACKING_ENABLED) {
  console.log('[Analytics] PostHog tracking disabled (localhost detected)')
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
const EMAIL_PATTERN_GLOBAL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

const eventDebounceCache = new Map()
const DEBOUNCE_WINDOW_MS = 1000

function sanitizeValue(value, key = '') {
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) return value.map((item, i) => sanitizeValue(item, `${key}[${i}]`))
  if (typeof value === 'object') return sanitizeObject(value)
  if (typeof value === 'string' && EMAIL_PATTERN.test(value)) {
    return value.replace(EMAIL_PATTERN_GLOBAL, '[EMAIL_REDACTED]')
  }
  return value
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value, key)
  }
  return sanitized
}

function shouldTrackEvent(eventName, properties) {
  const signature = `${eventName}:${JSON.stringify(properties)}`
  const now = Date.now()
  const lastTracked = eventDebounceCache.get(signature)
  if (lastTracked && (now - lastTracked) < DEBOUNCE_WINDOW_MS) return false
  eventDebounceCache.set(signature, now)
  if (eventDebounceCache.size > 100) eventDebounceCache.clear()
  return true
}

export function trackEvent(eventName, properties = {}) {
  if (!TRACKING_ENABLED) return
  const sanitized = sanitizeObject(properties)
  if (!shouldTrackEvent(eventName, sanitized)) return
  try { posthog.capture(eventName, sanitized) } catch (e) { /* silent */ }
}

export function trackPageView(properties = {}) {
  if (!TRACKING_ENABLED) return
  try { posthog.capture('$pageview', sanitizeObject(properties)) } catch (e) { /* silent */ }
}

export function trackExport(metadata = {}) {
  if (!TRACKING_ENABLED) return
  try { posthog.capture('export_performed', sanitizeObject(metadata)) } catch (e) { /* silent */ }
}
