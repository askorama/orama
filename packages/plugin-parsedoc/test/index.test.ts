import { create, Orama, search } from '@orama/orama'
import { documentStore } from '@orama/orama/components'
import t from 'tap'
import { defaultHtmlSchema as schema, populateFromGlob } from '../src/index.js'

function getDocs(orama: Orama): Document[] {
  return Object.values((orama.data.docs as documentStore.DefaultDocumentStore).docs)
}

t.test('it should store the values', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/index.html'
  await populateFromGlob(db, filepath)
  t.strictSame(
    (await search(db, { term: 'Test' })).hits.map(({ document }) => document),
    [{ path: `${filepath}/root[1].html[0].head[1]`, content: 'Test', type: 'title', properties: {} }]
  )
})

t.test('when there are multiple consecutive elements with text with the same tag', async t => {
  await t.test('it should merge the values when the strategy is merge (default)', async t => {
    const db = await create({ schema })
    await populateFromGlob(db, 'test/fixtures/two-paragraphs.html')
    t.equal(getDocs(db).length, 1)
  })

  await t.test('it should keep records separated when the strategy is split', async t => {
    const db = await create({ schema })
    await populateFromGlob(db, 'test/fixtures/two-paragraphs.html', { mergeStrategy: 'split' })
    t.equal(getDocs(db).length, 2)
  })

  await t.test('it should keep separated and merged records when the strategy is both', async t => {
    const db = await create({ schema })
    await populateFromGlob(db, 'test/fixtures/two-paragraphs.html', { mergeStrategy: 'both' })
    t.equal(getDocs(db).length, 3)
  })
})

t.test('it should not merge records when a different tag element goes in between', async t => {
  const db = await create({ schema })
  await populateFromGlob(db, 'test/fixtures/item-in-between.html')
  t.equal(getDocs(db).length, 3)
})

t.test('it should not merge records when they belong to different containers', async t => {
  const db = await create({ schema })
  await populateFromGlob(db, 'test/fixtures/different-containers.html')
  t.equal(getDocs(db).length, 2)
})

t.test('it should change tags when specified in a transformFn', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/h1.html'
  await populateFromGlob(db, filepath, {
    transformFn: node => (node.tag === 'h1' ? { ...node, tag: 'h2' } : node)
  })
  t.strictSame(getDocs(db), [
    { path: `${filepath}/root[0].html[1].body[0]`, content: 'Heading', type: 'h2', properties: {} }
  ])
})

t.test('it should change the content when specified in a transformFn', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/h1.html'
  await populateFromGlob(db, filepath, {
    transformFn: node => (node.tag === 'h1' ? { ...node, content: 'New content' } : node)
  })
  t.strictSame(getDocs(db), [
    { path: `${filepath}/root[0].html[1].body[0]`, content: 'New content', type: 'h1', properties: {} }
  ])
})

t.test('it should change the raw content when specified in a transformFn', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/h1.html'
  await populateFromGlob(db, filepath, {
    transformFn: node => (node.tag === 'h1' ? { ...node, raw: '<div><p>Hello</p></div>' } : node)
  })
  t.strictSame(getDocs(db), [
    { path: `${filepath}/root[0].html[1].body[0].div[0]`, content: 'Hello', type: 'p', properties: {} }
  ])
})

t.test('it should prioritize raw change over tag and content changes when both are specified', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/h1.html'
  await populateFromGlob(db, filepath, {
    transformFn: node =>
      node.tag === 'h1' ? { tag: 'h2', content: 'New content', raw: '<div><p>Hello</p></div>' } : node
  })
  t.strictSame(getDocs(db), [
    { path: `${filepath}/root[0].html[1].body[0].div[0]`, content: 'Hello', type: 'p', properties: {} }
  ])
})

t.test('it should parse markdown files', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/markdown.md'
  await populateFromGlob(db, filepath)
  t.strictSame(getDocs(db), [
    { path: `${filepath}/root[1].html[1].body[0]`, content: 'Title', type: 'h1', properties: {} },
    { path: `${filepath}/root[1].html[1].body[1]`, content: 'Some content', type: 'p', properties: {} },
    { path: `${filepath}/root[1].html[1].body[2]`, content: 'Subtitle', type: 'h2', properties: {} },
    { path: `${filepath}/root[1].html[1].body[3]`, content: 'Some more content', type: 'p', properties: {} }
  ])
})

t.test('should preserve the first property when there are multiple properties with the same name', async t => {
  const db = await create({ schema })
  const filepath = 'test/fixtures/merge-properties.html'
  await populateFromGlob(db, filepath, { mergeStrategy: 'merge' })
  t.strictSame(getDocs(db), [
    {
      path: `${filepath}/root[0].html[1].body[0]`,
      content: 'First Second',
      type: 'p',
      properties: { id: 'first' }
    }
  ])
})
