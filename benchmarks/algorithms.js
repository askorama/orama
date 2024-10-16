import b from 'benny'
import { create, insertMultiple, search } from 'orama_latest'
import { pluginPT15 } from '@orama/plugin-pt15'
import { pluginQPS } from '@orama/plugin-qps'
import dataset from './src/dataset.json' assert { type: 'json' }
import {stopwords} from '@orama/stopwords/english'

const dbBM25 = create({
    schema: {
        description: 'string'
    },
    components: {
        tokenizer: {
            stopWords: stopwords,
        },
    }
})

const dbWithPT15 = create({
    schema: {
        description: 'string'
    },
    plugins: [pluginPT15()],
    components: {
        tokenizer: {
            stopWords: stopwords,
        },
    }
})

const dbWithQPS = create({
    schema: {
        description: 'string'
    },
    plugins: [pluginQPS()],
    components: {
        tokenizer: {
            stopWords: stopwords,
        },
    }
})

await insertMultiple(dbBM25, dataset)
await insertMultiple(dbWithPT15, dataset)
await insertMultiple(dbWithQPS, dataset)

b.suite('search-algorithms - single-term prefix',
    b.add('search bm25 - single-term prefix', () => {
        search(dbBM25, { term: 'L' })
    }),
    b.add('search pt15 - single-term prefix', () => {
        search(dbWithPT15, { term: 'L' })
    }),
    b.add('search qps - single-term prefix', () => {
        search(dbWithQPS, { term: 'L' })
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'insert', version: '1.0.0' }),
    b.save({ file: 'search-algorithms-single-term-prefix', format: 'chart.html' }),
)

b.suite('search-algorithms - entire words',
    b.add('search bm25 - entire words', () => {
        search(dbBM25, { term: 'Legend of Zelda' })
    }),
    b.add('search pt15 - entire words', () => {
        search(dbWithPT15, { term: 'Legend of Zelda' })
    }),
    b.add('search qps - entire words', () => {
        search(dbWithQPS, { term: 'Legend of Zelda' })
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'insert', version: '1.0.0' }),
    b.save({ file: 'search-algorithms-entire-words', format: 'chart.html' }),
)