import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import * as Resize from 'iframe-resizer/js/iframeResizer.contentWindow'

import posthog from 'posthog-js'
import { useParentInfo } from './composables/useParentInfo'
import { trackPageView } from './analytics/posthogClient'

const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.startsWith('192.168.') ||
                    window.location.hostname.startsWith('10.') ||
                    window.location.hostname.endsWith('.local')

if (!isLocalhost) {
  posthog.init('phc_oYZCnssb1ITj2v3Lh6R2YqsQwurkUJu2hIyjbtbbF3h', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2026-01-30',
    disable_session_recording: true
  })

  const { getParentInfo } = useParentInfo()
  const parentInfo = getParentInfo()

  if (parentInfo.parentUrl) {
    posthog.register({
      iframe_parent_url: parentInfo.parentUrl,
      iframe_detection_method: parentInfo.detectionMethod,
      is_embedded: true
    })
  } else {
    posthog.register({ is_embedded: false })
  }
} else {
  console.log('[Analytics] PostHog disabled (localhost detected)')
}

const app = createApp(App)

app.config.errorHandler = (err) => {
  if (!isLocalhost) {
    posthog.captureException(err instanceof Error ? err : new Error(String(err)))
  }
}

router.afterEach((to, from) => {
  trackPageView({
    activity_name: to.name || to.path,
    path: to.path,
    from_path: from?.path || null
  })
})

app.use(router).use(Resize).mount('#app')
