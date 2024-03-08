import t from 'tap'
import { OramaPluginSync, create, insertMultiple, search } from '@orama/orama'
import { http, HttpResponse } from "msw";
import { setupServer, SetupServerApi } from "msw/node";

import { pluginAnalytics } from '../index.js'
import { DEFAULT_ORAMA_DEPLOYMENT_ID } from '../const.js';

const FAKE_ENDPOINT = 'http://localhost:3000/sso_collect'
const API_KEY = 'the-api-key'
const INDEX_ID = 'the-index-id'

t.test('analytics-plugin', async (t) => {
  const invocations: MockedRequest[] = []
  const server = getServer(invocations)
  await server.listen()
  t.teardown(async () => {
    await server.resetHandlers()
    await server.close()
  })

  const db = await create({
    schema: { name: 'string' } as const,
    plugins: [
      pluginAnalytics({
        apiKey: API_KEY,
        indexId: INDEX_ID,
        flushInterval: 100,
        flushSize: 1,
        endpoint: FAKE_ENDPOINT
      })
    ]
  })
  t.equal(db.plugins.length, 1)
  t.notSame((db.plugins[0] as OramaPluginSync).afterCreate, undefined)
  t.notSame((db.plugins[0] as OramaPluginSync).afterSearch, undefined)

  await insertMultiple(db, [
    { name: 'foo' },
    { name: 'bar' },
    { name: 'baz' },
  ])

  await search(db, { term: 'foo' })

  // just to make sure the request is sent
  await new Promise((resolve) => setTimeout(resolve, 100))

  const firstInvocation = invocations[0]

  t.matchStrict(firstInvocation, {
    url: `${FAKE_ENDPOINT}?api-key=${API_KEY}`,
    body: {
      source: 'oss-fe',
      deploymentID: DEFAULT_ORAMA_DEPLOYMENT_ID,
      index: INDEX_ID,
      events: [
        {
          query: {
            term: 'foo'
          },
          resultsCount: 1,
          roundTripTime: 0
        }
      ]
    }
  })

  await search(db, { term: 'b' })

  // just to make sure the request is sent
  await new Promise((resolve) => setTimeout(resolve, 200))

  const secondInvocation = invocations[1]

  t.matchStrict(secondInvocation, {
    url: `${FAKE_ENDPOINT}?api-key=${API_KEY}`,
    body: {
      source: 'oss-fe',
      deploymentID: DEFAULT_ORAMA_DEPLOYMENT_ID,
      index: INDEX_ID,
      events: [
        {
          query: {
            term: 'b'
          },
          resultsCount: 2,
          roundTripTime: 0
        }
      ]
    }
  })

  t.end()
})

t.test('enabled: false', async (t) => {
  const db = await create({
    schema: { name: 'string' } as const,
    plugins: [
      pluginAnalytics({
        apiKey: API_KEY,
        indexId: INDEX_ID,
        enabled: false
      })
    ]
  })

  // The plugin is registered but it doesn't do anything
  t.equal(db.plugins.length, 1)
  t.same((db.plugins[0] as OramaPluginSync).afterCreate, undefined)
  t.same((db.plugins[0] as OramaPluginSync).afterSearch, undefined)
})

t.test('throw error', async (t) => {
  t.test('if apiKey is missing', async (t) => {
    t.throws(() => pluginAnalytics({ indexId: 'a' } as any), /Missing apiKey for plugin-analytics/)
  })
  t.test('if indexId is missing', async (t) => {
    t.throws(() => pluginAnalytics({ apiKey: 'a' } as any), /Missing indexId for plugin-analytics/)
  })
})

function getServer(invocations: MockedRequest[]): SetupServerApi {
  return setupServer(
    http.post(FAKE_ENDPOINT, async (req) => {
      invocations.push({
        url: req.request.url.toString(),
        body: await req.request.json() as object,
      });
      return HttpResponse.json();
    }),
  );
}

interface MockedRequest {
  url: string
  body: object
}