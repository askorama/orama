import t from 'tap'
import { create, insert } from '../src/trees/bkd.js'

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
      insert(tree, point)
    }

    t.same(tree, {
      root: {
        point: {
          lat: 37.8207190397588,
          lon: -122.47838916631231,
        },
        right: {
          point: {
            lat: 37.82900695513881,
            lon: -122.4231989875759,
          },
          left: {
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