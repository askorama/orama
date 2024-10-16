import b from 'benny'
import { insert, insertMultiple, searchPlain, searchWithFilters, searchWithLongTextAndComplexFilters } from './src/get-orama.js'

function benchmarkInsert() {
  return b.suite('insert',
    b.add('insert in Orama 2.1.1', async () => {
      await insert.orama211()
    }),
    b.add('insert in Orama 3.0.0-rc-2', () => {
      insert.orama300rc2()
    }),
    b.add('insert in Orama latest', () => {
      insert.oramaLatest()
    }),
    b.add('insert in Orama latest with PT15', () => {
      insert.oramaLatestPT15()
    }),
    b.add('insert in Orama latest with QPS', () => {
      insert.oramaLatestQPS()
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'insert', version: '1.0.0' }),
    b.save({ file: 'insert', format: 'chart.html' }),
  )
}

function benchmarkInsertMultiple() {
  return b.suite('insert multiple',
    b.add('insert multiple in Orama 2.1.1', async () => {
      await insertMultiple.orama211()
    }),
    b.add('insert multiple in Orama 3.0.0-rc-2', () => {
      insertMultiple.orama300rc2()
    }),
    b.add('insert multiple in Orama latest', () => {
      insertMultiple.oramaLatest()
    }),
    b.add('insert multiple in Orama latest with PT15', () => {
      insertMultiple.oramaLatestPT15()
    }),
    b.add('insert multiple in Orama latest with QPS', () => {
      insertMultiple.oramaLatestQPS()
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'insert multiple', version: '1.0.0' }),
    b.save({ file: 'insert multiple', format: 'chart.html' }),
  )
}

function benchmarkSearch() {
  return b.suite('plain search',
    b.add('plain search in Orama 2.1.1', async () => {
      await searchPlain.orama211()
    }),
    b.add('plain search in Orama 3.0.0-rc-2', () => {
      searchPlain.orama300rc2()
    }),
    b.add('plain search in Orama latest', () => {
      searchPlain.oramaLatest()
    }),
    b.add('plain search in Orama latest with PT15', () => {
      searchPlain.oramaLatestPT15()
    }),
    b.add('plain search in Orama latest with QPS', () => {
      searchPlain.oramaLatestQPS()
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'plain search', version: '1.0.0' }),
    b.save({ file: 'plain search', format: 'chart.html' }),
  )  
}

function benchmarkSearchWithFilters() {
  return b.suite('search with filters',
    b.add('search with filters in Orama 2.1.1', async () => {
      await searchWithFilters.orama211()
    }),
    b.add('search with filters in Orama 3.0.0-rc-2', () => {
      searchWithFilters.orama300rc2()
    }),
    b.add('search with filters in Orama latest', () => {
      searchWithFilters.oramaLatest()
    }),
    b.add('search with filters in Orama latest with PT15', () => {
      searchWithFilters.oramaLatestPT15()
    }),
    b.add('search with filters in Orama latest with QPS', () => {
      searchWithFilters.oramaLatestQPS()
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'search with filters', version: '1.0.0' }),
    b.save({ file: 'search with filters', format: 'chart.html' }),
  )  
}

function benchmarkSearchWithLongTextAndComplexFilters() {
  return b.suite('search with long text and complex filters',
    b.add('search with long text and complex filters in Orama 2.1.1', async () => {
      await searchWithLongTextAndComplexFilters.orama211()
    }),
    b.add('search with long text and complex filters in Orama 3.0.0-rc-2', () => {
      searchWithLongTextAndComplexFilters.orama300rc2()
    }),
    b.add('search with long text and complex filters in Orama latest', () => {
      searchWithLongTextAndComplexFilters.oramaLatest()
    }),
    b.add('search with long text and complex filters in Orama latest with PT15', () => {
      searchWithLongTextAndComplexFilters.oramaLatestPT15()
    }),
    b.add('search with long text and complex filters in Orama latest with QPS', () => {
      searchWithLongTextAndComplexFilters.oramaLatestQPS()
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'search with long text and complex filters', version: '1.0.0' }),
    b.save({ file: 'ssearch with long text and complex filters', format: 'chart.html' }),
  )  
}

await benchmarkInsert()
await benchmarkInsertMultiple()
await benchmarkSearch()
await benchmarkSearchWithFilters()
await benchmarkSearchWithLongTextAndComplexFilters()