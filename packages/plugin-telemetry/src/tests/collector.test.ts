import t from 'tap'
import sinon from 'sinon'
import { Collector } from '../collector.js'

t.test('Collector', async (t) => {
  t.test('should create a collector', async (t) => {
    const config = { id: 'myid', api_key: '123', flushSize: 10, flushInterval: 1000 }
    const collector = Collector.create(config)

    t.equal(collector instanceof Collector, true, 'returns an instance of Collector')
    t.end()
  })
})

t.test('add and flush methods', async (t) => {
  const flushSize = 2
  const config = { id: 'test-id', api_key: 'test-key', flushSize, flushInterval: 1000 }
  const collector = Collector.create(config)

  // @ts-expect-error - global is not typed
  global.location = { toString: () => 'http://mock-location' }

  const flushSpy = sinon.spy(collector, 'flush')

  const testData = {
    rawSearchString: 'test string',
    query: { term: 'hello' },
    resultsCount: 10,
    roundTripTime: 100,
    searchedAt: new Date()
  }

  t.test('should add data correctly', async (t) => {
    collector.add(testData)
    // @ts-expect-error - data is private
    t.equal(collector.data.length, 1, 'data array length should increase')
    // @ts-expect-error - data is private
    t.match(
      collector.data[0],
      { ...testData, referer: 'http://mock-location' },
      'data should match added data with referer'
    )
    t.end()
  })

  t.test('should trigger flush when flush is called', async (t) => {
    collector.add(testData)
    collector.flush()

    t.ok(flushSpy.called, 'flush should be called')
    t.end()
  })

  t.test('should flush data when flush size is reached', async (t) => {
    collector.add(testData)
    collector.add(testData)

    t.ok(flushSpy.called, 'flush should be called')
    t.end()
  })

  t.test('should flush data when flush interval is reached', async (t) => {
    const clock = sinon.useFakeTimers()

    collector.add(testData)

    clock.tick(1200)

    t.ok(flushSpy.called, 'flush should be called')
    t.end()
  })

  // @ts-expect-error - global is not typed
  global.location = undefined
})
