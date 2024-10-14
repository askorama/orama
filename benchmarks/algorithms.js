import b from 'benny'
import { create, insertMultiple, search } from 'orama_latest'
import { pluginPT15 } from '@orama/plugin-pt15'
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
await insertMultiple(dbBM25, dataset)
await insertMultiple(dbWithPT15, dataset)

b.suite('search-algorithms',
    b.add('search bm25', () => {
        search(dbBM25, { term: 'L' })
    }),
    b.add('search pt15', () => {
        search(dbWithPT15, { term: 'L' })
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: 'insert', version: '1.0.0' }),
    b.save({ file: 'search-algorithms', format: 'chart.html' }),
)