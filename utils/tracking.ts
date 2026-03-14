declare global {
  interface Window {
    fbq?: (event: string, name: string, params?: Record<string, unknown>) => void
    dataLayer?: unknown[]
  }
}

type TrackingEvent =
  | 'LeadStart'
  | 'DDDDetected'
  | 'InstagramRequested'
  | 'InstagramValidated'
  | 'LeadCaptured'
  | 'RedirectAgent'

export function trackEvent(
  event: TrackingEvent,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return

  // Meta Pixel
  if (window.fbq) {
    window.fbq('trackCustom', event, params)
  }

  // Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({ event, ...params })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Tracking] ${event}`, params)
  }
}
