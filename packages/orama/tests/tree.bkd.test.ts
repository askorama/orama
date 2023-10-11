import t from 'tap'
import { create, insert, searchByRadius, searchByPolygon, contains } from '../src/trees/bkd.js'

const coordinates = [
  {
    "name": "Golden Gate Bridge",
    "lat": 37.8207190397588,
    "lon": -122.47838916631231
  },
  {
    "name": "Alcatraz Island",
    "lat": 37.82900695513881,
    "lon": -122.4231989875759
  },
  {
    "name": "Union Square",
    "lat": 37.78816576971418,
    "lon": -122.4055109069127
  }
]

t.only('create', t => {
  t.plan(1)

  t.only('should create a new, empty tree', t => {
    t.plan(1)

    t.same(create(), { root: null })
  })
})

t.only('insert', t => {
  t.plan(1)

  t.only('should insert a new node into an empty tree', t => {
    t.plan(1)

    const tree = create()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    t.same(tree, {
      root: {
        docIDs: [],
        point: {
          lat: 37.8207190397588,
          lon: -122.47838916631231,
        },
        right: {
          docIDs: [],
          point: {
            lat: 37.82900695513881,
            lon: -122.4231989875759,
          },
          left: {
            docIDs: [],
            point: {
              lat: 37.78816576971418,
              lon: -122.4055109069127,
            }
          },
        },
      }
    })
  })
})

t.only('searchByRadius', t => {
  t.plan(1)

  t.only('should return all points within a given radius', t => {
    t.plan(3)

    const tree = create()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    // Should return the coordinates of the Golden Gate Bridge. Additional properties not implemented yet.
    t.same(searchByRadius(tree.root, { lat: 37.7909625, lon: -122.4700284 }, 5_000, true, null), [ { lat: 37.8207190397588, lon: -122.47838916631231 } ])
    
    // Should return nothing as the center is on the east side.
    t.same(searchByRadius(tree.root, { lat: 42.9195535, lon: -70.9817219 }, 10_000, true, null), [])

    // Should return the coordinates of all the California locations as they're outside the radius.
    t.same(searchByRadius(tree.root, { lat: 42.9195535, lon: -70.9817219 }, 10_000, false, null), coordinatePoints)

  })
})

t.only('searchInsidePolygon', t => {
  t.plan(1)

  t.only('should return all points inside a given polygon', t => {
    t.plan(2)

    const tree = create()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    const polygon = [
      {
        lon: -122.5305176,
        lat: 37.8247008,
      },
      {
        lon: -122.5212479,
        lat: 37.7253794
      },
      {
        lon: -122.3574829,
        lat: 37.7509009
      },
      {
        lon: -122.3866653,
        lat: 37.8371743
      },
      {
        lon: -122.5305176,
        lat: 37.8247008,
      },
    ]

    // Should return the coordinates of all the California locations as they're outside the polygon
    t.same(searchByPolygon(tree.root, polygon, true), coordinatePoints)

    // Should return nothing as all the coordinates are outside the polygon, and the search is not inclusive
    t.same(searchByPolygon(tree.root, polygon, false), [])
  })
})

t.only('contains', t => {
  t.plan(1)

  t.only('should return true if the tree contains the given point', t => {
    t.plan(2)

    const tree = create()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    t.same(contains(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }), true)
    t.same(contains(tree, { lat: 10.1927374719287, lon: -132.97841923929291 }), false)
  })
})