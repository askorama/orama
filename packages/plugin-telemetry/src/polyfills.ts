export function sendBeacon (endpoint: string, body?: string): Promise<Response> | undefined {
  if (typeof navigator !== 'undefined') {
    navigator.sendBeacon(endpoint, body)
    return
  }

  fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
