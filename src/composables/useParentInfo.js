export function useParentInfo() {
  const getParentInfo = () => {
    const debug = {
      referrer: document.referrer,
      ancestorOrigins: window.location.ancestorOrigins ? [...window.location.ancestorOrigins] : null
    }

    let parentUrl = null
    let detectionMethod = null

    // 1. Try document.referrer (Preferred: can be full URL)
    if (debug.referrer && debug.referrer !== '') {
      parentUrl = debug.referrer
      detectionMethod = 'referrer'
    } 
    // 2. Try ancestorOrigins (Fallback: origin only)
    else if (debug.ancestorOrigins && debug.ancestorOrigins.length > 0) {
      parentUrl = debug.ancestorOrigins[debug.ancestorOrigins.length - 1]
      detectionMethod = 'ancestorOrigins'
    }

    return {
      parentUrl,       // The best guess result
      detectionMethod, // Which method succeeded
      debug            // The raw data from all attempts
    }
  }

  return {
    getParentInfo
  }
}
