import { create, insertMultiple, search } from '@orama/orama'
import {qpsComponents} from '../dist/index.js'
import dataset from '/Users/allevo/repos/orama/benchmarks/src/dataset.json' assert { type: 'json' }

const db = create({
    schema: {
        description: 'string',
    },
    components: {
        ...qpsComponents()
    }
})

await insertMultiple(db, dataset)

console.log('........')

search(db, { term: '' });

/*
for (let i = 0; i < 2000; ++i) {
    search(db, { term: 'League' });
}
*/