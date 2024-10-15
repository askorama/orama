import t from 'tap'

import { BKDTree } from '../src/trees/bkd.js'

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
    const tree = new BKDTree()
    t.equal(tree.root, null)
  })
})

t.test('insert', async (t) => {
  t.test('should insert a new node into an empty tree', async (t) => {
    const tree = new BKDTree()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      tree.insert(point, [])
    }

    // Use the toJSON method to get a serializable representation
    const expectedTree = {
      root: {
        point: {
          lat: 37.8207190397588,
          lon: -122.47838916631231
        },
        docIDs: [],
        left: null,
        right: {
          point: {
            lat: 37.82900695513881,
            lon: -122.4231989875759
          },
          docIDs: [],
          left: {
            point: {
              lat: 37.78816576971418,
              lon: -122.4055109069127
            },
            docIDs: [],
            left: null,
            right: null
          },
          right: null
        }
      }
    }

    t.same(tree.toJSON(), expectedTree)
  })

  t.test('should merge docIDs if the point already exists', async (t) => {
    const tree = new BKDTree()

    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [1])
    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [2])
    tree.insert({ lat: 12.1234243234235, lon: -122.1293 }, [3])

    const docIDs = tree.getDocIDsByCoordinates({
      lat: 37.8207190397588,
      lon: -122.47838916631231
    })

    // Sort the arrays before comparison to handle unordered Sets
    t.same(docIDs ? docIDs.sort() : null, [1, 2])
  })
})

t.test('searchByRadius', async (t) => {
  t.test('should return all points within a given radius', async (t) => {
    const tree = new BKDTree()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      tree.insert(point, [])
    }

    // Should return the coordinates of the Golden Gate Bridge.
    t.same(tree.searchByRadius({ lat: 37.7909625, lon: -122.4700284 }, 5_000, true, null), [
      {
        point: {
          lat: 37.8207190397588,
          lon: -122.47838916631231
        },
        docIDs: []
      }
    ])

    // Should return nothing as the center is on the east side.
    t.same(tree.searchByRadius({ lat: 42.9195535, lon: -70.9817219 }, 10_000, true, null), [])

    // Should return the coordinates of all the California locations as they're outside the radius.
    t.same(
      tree.searchByRadius({ lat: 42.9195535, lon: -70.9817219 }, 10_000, false, null),
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
    const tree = new BKDTree()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      tree.insert(point, [])
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

    // Should return the coordinates of the points inside the polygon
    t.same(
      tree.searchByPolygon(polygon, true),
      coordinatePoints.map(({ lat, lon }) => ({
        point: {
          lat,
          lon
        },
        docIDs: []
      }))
    )

    // Should return nothing as all the coordinates are inside the polygon, and the search is not inclusive
    t.same(tree.searchByPolygon(polygon, false), [])
  })
})

t.test('contains', async (t) => {
  t.test('should return true if the tree contains the given point', async (t) => {
    const tree = new BKDTree()
    const coordinatePoints = coordinates.map(({ lat, lon }) => ({ lat, lon }))

    for (const point of coordinatePoints) {
      tree.insert(point, [])
    }

    t.equal(tree.contains({ lat: 37.8207190397588, lon: -122.47838916631231 }), true)
    t.equal(tree.contains({ lat: 10.1927374719287, lon: -132.123 }), false)
  })
})

t.test('removeDocByID', async (t) => {
  t.test('should remove a document from the tree by its ID', async (t) => {
    const tree = new BKDTree()

    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [1])
    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [2])
    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [3])
    tree.insert({ lat: 10.1923018231231, lon: -102.01823819273723 }, [4])

    tree.removeDocByID({ lat: 37.8207190397588, lon: -122.47838916631231 }, 2)

    const docIDs = tree.getDocIDsByCoordinates({
      lat: 37.8207190397588,
      lon: -122.47838916631231
    })

    t.same(docIDs ? docIDs.sort() : null, [1, 3])
  })

  t.test("If the node doesn't have any more docIDs, it should remove the node", async (t) => {
    const tree = new BKDTree()

    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [1])
    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [2])
    tree.insert({ lat: 37.8207190397588, lon: -122.47838916631231 }, [3])
    tree.insert({ lat: 10.1923018231231, lon: -102.01823819273723 }, [4])

    tree.removeDocByID({ lat: 37.8207190397588, lon: -122.47838916631231 }, 1)
    tree.removeDocByID({ lat: 37.8207190397588, lon: -122.47838916631231 }, 2)
    tree.removeDocByID({ lat: 37.8207190397588, lon: -122.47838916631231 }, 3)

    t.equal(tree.contains({ lat: 37.8207190397588, lon: -122.47838916631231 }), false)
  })
})
