import { useRoute } from 'vue-router'
import * as posthogClient from '@/analytics/posthogClient'

const ROUTE_NAMES = {
  '/clos':         { name: 'CAT Pathway A', base: 'CAT' },
  '/clos-inverse': { name: 'CAT Pathway B', base: 'CAT' }
}

export function useAnalytics() {
  const route = useRoute()

  const getActivityContext = () => {
    const meta = ROUTE_NAMES[route?.path] || { name: route?.name || 'Unknown', base: 'CAT' }
    return { activity_name: meta.name, activity_base: meta.base }
  }

  const trackEvent = (eventName, properties = {}) => {
    posthogClient.trackEvent(eventName, { ...properties, ...getActivityContext() })
  }

  const trackFunnelStep = (percentage) => {
    posthogClient.trackEvent(`activity_progress_${percentage}`, {
      progress_percentage: percentage,
      ...getActivityContext()
    })
  }

  const trackCompletion = (metadata = {}) => {
    posthogClient.trackEvent('activity_completed', { ...metadata, ...getActivityContext() })
  }

  const trackExport = (metadata = {}) => {
    posthogClient.trackExport({ ...metadata, ...getActivityContext() })
  }

  return { trackEvent, trackFunnelStep, trackCompletion, trackExport }
}
