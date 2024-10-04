import t from 'tap'
import { create, insert, search } from '../src/index.js'

t.test('geosearch', (t) => {
  t.plan(5)

  t.test('should find geopoints inside a radius', async (t) => {
    t.plan(2)

    const db = create({
      schema: {
        id: 'string',
        location: 'geopoint'
      } as const
    })

    await insert(db, {
      id: '1',
      location: {
        lat: 9.0814233,
        lon: 45.2623823
      }
    })

    await insert(db, {
      id: '2',
      location: {
        lat: 9.0979028,
        lon: 45.1995182
      }
    })

    const results = await search(db, {
      where: {
        location: {
          radius: {
            coordinates: {
              lat: 9.1418481,
              lon: 45.2324096
            },
            unit: 'km',
            value: 10,
            inside: true
          }
        }
      }
    })

    t.same(results.count, 2)
    t.same(
      results.hits.map(({ id }) => id),
      ['1', '2']
    )
  })

  t.test('should find geopoints outside a radius', async (t) => {
    t.plan(2)

    const db = await create({
      schema: {
        id: 'string',
        location: 'geopoint'
      } as const
    })

    await insert(db, { id: '1', location: { lat: -72.1928787, lon: 42.9309292 } })
    await insert(db, { id: '2', location: { lat: -72.1928787, lon: 42.929908 } })
    await insert(db, { id: '3', location: { lat: -72.1912479, lon: 42.9302222 } })
    await insert(db, { id: '4', location: { lat: -72.1917844, lon: 42.9312277 } })
    await insert(db, { id: '5', location: { lat: -72.1928787, lon: 42.9309292 } })
    await insert(db, { id: '6', location: { lat: -10.2328721, lon: 20.9385112 } })

    const results = await search(db, {
      where: {
        location: {
          radius: {
            coordinates: {
              lat: -10.2328758,
              lon: 20.938517
            },
            value: 10,
            unit: 'km',
            inside: false
          }
        }
      }
    })

    t.same(results.count, 5)
    t.same(
      results.hits.map(({ id }) => id),
      ['1', '2', '3', '4', '5']
    )
  })

  t.test('should find geopoints inside a polygon', async (t) => {
    t.plan(2)

    const db = create({
      schema: {
        id: 'string',
        location: 'geopoint'
      } as const
    })

    await insert(db, { id: '1', location: { lat: -50.6964111, lon: 70.2120854 } })
    await insert(db, { id: '2', location: { lat: -50.7403564, lon: 70.1823094 } })
    await insert(db, { id: '3', location: { lat: -51.2512207, lon: 70.1123535 } })
    await insert(db, { id: '4', location: { lat: -50.8639526, lon: 70.0796264 } })
    await insert(db, { id: '5', location: { lat: -50.6167603, lon: 70.0973989 } })

    const results = await search(db, {
      where: {
        location: {
          polygon: {
            coordinates: [
              { lat: -51.3693237, lon: 70.4082687 },
              { lat: -51.5643311, lon: 69.8623282 },
              { lat: -49.9822998, lon: 69.8273124 },
              { lat: -49.7543335, lon: 70.3787763 },
              { lat: -51.3693237, lon: 70.4082687 }
            ]
          }
        }
      }
    })

    t.same(results.count, 5)
    t.same(
      results.hits.map(({ id }) => id),
      ['1', '2', '3', '4', '5']
    )
  })

  t.test('should find geopoints outside a polygon', async (t) => {
    t.plan(2)

    const db = create({
      schema: {
        id: 'string',
        location: 'geopoint'
      } as const
    })

    await insert(db, { id: '1', location: { lat: -50.6964111, lon: 70.2120854 } })
    await insert(db, { id: '2', location: { lat: -50.7403564, lon: 70.1823094 } })
    await insert(db, { id: '3', location: { lat: -51.2512207, lon: 70.1123535 } })
    await insert(db, { id: '4', location: { lat: -50.8639526, lon: 70.0796264 } })
    await insert(db, { id: '5', location: { lat: -50.6167603, lon: 70.0973989 } })

    const results = await search(db, {
      where: {
        location: {
          polygon: {
            coordinates: [
              { lat: -52.6779842, lon: 71.5489379 },
              { lat: -52.9086971, lon: 71.2828433 },
              { lat: -51.8759823, lon: 71.208667 },
              { lat: -51.5024471, lon: 71.4932231 },
              { lat: -52.6779842, lon: 71.5489379 }
            ],
            inside: false
          }
        }
      }
    })

    t.same(results.count, 5)
    t.same(
      results.hits.map(({ id }) => id),
      ['1', '2', '3', '4', '5']
    )
  })

  t.test('should run in high-precision mode', async (t) => {
    t.plan(4)

    const db = create({
      schema: {
        id: 'string',
        location: 'geopoint'
      } as const
    })

    await insert(db, { id: '1', location: { lat: -50.6964111, lon: 70.2120854 } })
    await insert(db, { id: '2', location: { lat: -50.7403564, lon: 70.1823094 } })
    await insert(db, { id: '3', location: { lat: -51.2512207, lon: 70.1123535 } })
    await insert(db, { id: '4', location: { lat: -50.8639526, lon: 70.0796264 } })
    await insert(db, { id: '5', location: { lat: -50.6167603, lon: 70.0973989 } })

    const polygonResults = await search(db, {
      where: {
        location: {
          polygon: {
            coordinates: [
              { lat: -52.6779842, lon: 71.5489379 },
              { lat: -52.9086971, lon: 71.2828433 },
              { lat: -51.8759823, lon: 71.208667 },
              { lat: -51.5024471, lon: 71.4932231 },
              { lat: -52.6779842, lon: 71.5489379 }
            ],
            inside: false,
            highPrecision: true
          }
        }
      }
    })

    const radiusResults = await search(db, {
      where: {
        location: {
          radius: {
            coordinates: {
              lat: -50.7403564,
              lon: 70.1823094
            },
            value: 10,
            unit: 'km',
            inside: true,
            highPrecision: true
          }
        }
      }
    })

    t.same(polygonResults.count, 5)
    t.same(
      polygonResults.hits.map(({ id }) => id),
      ['1', '2', '3', '4', '5']
    )
    t.same(radiusResults.count, 2)
    t.same(
      radiusResults.hits.map(({ id }) => id),
      ['1', '2']
    )
  })
})
