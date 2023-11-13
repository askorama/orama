import t from 'tap'
import sinon from 'sinon'
import { sendBeacon } from '../polyfills.js'

t.test('sendBeacon function', async t => {
  const endpoint = 'https://test-endpoint.com'
  const body = JSON.stringify({ key: 'value' })

  t.beforeEach(() => {
    // @ts-ignore
    global.navigator = {
      sendBeacon: sinon.stub().returns(true)
    }

    // Stubbing the global fetch function
    global.fetch = sinon.stub().resolves({
      ok: true,
      json: async () => await Promise.resolve({})
    })
  })

  t.afterEach(() => {
    // @ts-ignore
    delete global.navigator
    // @ts-ignore
    delete global.fetch
  })

  t.test('should use navigator.sendBeacon if available', async t => {
    sendBeacon(endpoint, body)

    // @ts-expect-error - navigator is not typed
    t.ok(global.navigator.sendBeacon.calledWith(endpoint, body), 'navigator.sendBeacon was called with correct arguments')
    t.end()
  })

  t.test('should fall back to fetch if navigator.sendBeacon is not available', async t => {
    // @ts-ignore
    global.navigator = undefined

    await sendBeacon(endpoint, body)

    // @ts-ignore
    t.ok(global.fetch.calledWith(sinon.match(endpoint), sinon.match.has('body', body)), 'fetch was called with correct arguments')
    t.end()
  })

  t.test('should handle fetch errors', async t => {
    global.fetch = sinon.stub().rejects(new Error('Network Error'))

    await sendBeacon(endpoint, body)

    t.pass('Error handled gracefully')
    t.end()
  })
})
