interface Window {
  posthog: {
    identify: (userId: string) => void
    get_distinct_id: () => string
    capture: (event: string, properties?: any) => void
  }
}