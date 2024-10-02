import t from 'tap'
import {
  create,
  insert,
  searchByRadius,
  searchByPolygon,
  removeDocByID,
  getDocIDsByCoordinates,
  contains,
  BKDType
} from '../src/trees/bkd.js'

const coordinates = [
  {
    name: 'Golden Gate Bridge',
    lat: 37.8207190397588,
    lon: -122.47838916631231
  },
  {
    name: 'Alcatraz Island',
    lat: 37.82900695513881,
    lon: -122.4231989875759
  },
  {
    name: 'Union Square',
    lat: 37.78816576971418,
    lon: -122.4055109069127
  }
]

t.test('create', async (t) => {
  t.test('should create a new, empty tree', async (t) => {
    t.same(create(false), {
      type: BKDType,
      isArray: false,
      root: null
    })
  })
})

t.test('insert', async (t) => {
  t.test('should insert a new node into an empty tree', async (t) => {
    const tree = create(false)
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    t.same(tree, {
      type: BKDType,
      isArray: false,
      root: {
        docIDs: [],
        point: {
          lat: 37.8207190397588,
          lon: -122.47838916631231
        },
        right: {
          docIDs: [],
          point: {
            lat: 37.82900695513881,
            lon: -122.4231989875759
          },
          left: {
            docIDs: [],
            point: {
              lat: 37.78816576971418,
              lon: -122.4055109069127
            }
          }
        }
      }
    })
  })

  t.test('should merge docIDs if the point already exists', async (t) => {
    const tree = create(false)

    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [1])
    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [2])
    insert(tree, { lat: 12.1234243234235, lon: -122.1293 }, [3])

    t.same(getDocIDsByCoordinates(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }), [1, 2])
  })
})

t.test('searchByRadius', async (t) => {
  t.test('should return all points within a given radius', async (t) => {
    const tree = create(false)
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    // Should return the coordinates of the Golden Gate Bridge. Additional properties not implemented yet.
    t.same(searchByRadius(tree.root, { lat: 37.7909625, lon: -122.4700284 }, 5_000, true, null), [
      {
        point: {
          lat: 37.8207190397588,
          lon: -122.47838916631231
        },
        docIDs: []
      }
    ])

    // Should return nothing as the center is on the east side.
    t.same(searchByRadius(tree.root, { lat: 42.9195535, lon: -70.9817219 }, 10_000, true, null), [])

    // Should return the coordinates of all the California locations as they're outside the radius.
    t.same(
      searchByRadius(tree.root, { lat: 42.9195535, lon: -70.9817219 }, 10_000, false, null),
      coordinatePoints.map(({ lat, lon }) => ({
        point: {
          lat,
          lon
        },
        docIDs: []
      }))
    )
  })
})

t.test('searchInsidePolygon', async (t) => {
  t.test('should return all points inside a given polygon', async (t) => {
    const tree = create(false)
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    const polygon = [
      {
        lon: -122.5305176,
        lat: 37.8247008
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
        lat: 37.8247008
      }
    ]

    // Should return the coordinates of all the California locations as they're outside the polygon
    t.same(
      searchByPolygon(tree.root, polygon, true),
      coordinatePoints.map(({ lat, lon }) => ({
        point: {
          lat,
          lon
        },
        docIDs: []
      }))
    )

    // Should return nothing as all the coordinates are outside the polygon, and the search is not inclusive
    t.same(searchByPolygon(tree.root, polygon, false), [])
  })
})

t.test('contains', async (t) => {
  t.test('should return true if the tree contains the given point', async (t) => {
    const tree = create(false)
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      insert(tree, point, [])
    }

    t.same(contains(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }), true)
    t.same(contains(tree, { lat: 10.1927374719287, lon: -132.123 }), false)
  })
})

t.test('removeDocByID', async (t) => {
  t.test('should remove a document from the tree by its ID', async (t) => {
    const tree = create(false)

    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [1])
    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [2])
    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [3])
    insert(tree, { lat: 10.1923018231231, lon: -102.01823819273723 }, [4])

    removeDocByID(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, 2)

    t.same(getDocIDsByCoordinates(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }), [1, 3])
  })

  t.test("If the node doesn't have any more docIDs, it should remove the node", async (t) => {
    const tree = create(false)

    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [1])
    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [2])
    insert(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, [3])
    insert(tree, { lat: 10.1923018231231, lon: -102.01823819273723 }, [4])

    removeDocByID(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, 1)
    removeDocByID(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, 2)
    removeDocByID(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }, 3)

    t.same(contains(tree, { lat: 37.8207190397588, lon: -122.47838916631231 }), false)
  })
})
