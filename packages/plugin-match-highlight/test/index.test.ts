import { create, insert } from '@orama/orama';
import t from 'tap';
import {
    afterInsert,
    loadWithHighlight,
    OramaWithHighlight,
    saveWithHighlight,
    searchWithHighlight,
} from '../src/index.js';

t.test('it should store the position of tokens', async t => {
    const db = await create({
        schema: {
            text: 'string',
        }, components: { afterInsert: (orama, key, doc) => afterInsert(orama, key) },
    });

    const id = await insert(db, { text: 'hello world' });

    t.same((db as OramaWithHighlight<typeof db>).data.positions[id], {
        text: { hello: [{ start: 0, length: 5 }], world: [{ start: 6, length: 5 }] },
    });
});

t.test('it should manage nested schemas', async t => {
    const schema = {
        other: {
            text: 'string',
        },
    } as const;

    const db = (await create({ schema, components: { afterInsert: (orama, key, doc) => afterInsert(orama, key) } }));

    const id = await insert(db, { other: { text: 'hello world' } });

    t.same((db as OramaWithHighlight<typeof db>).data.positions[id], {
        'other.text': { hello: [{ start: 0, length: 5 }], world: [{ start: 6, length: 5 }] },
    });
});

t.test('it shouldn\'t stem tokens', async t => {
    const schema = {
        text: 'string',
    } as const;

    const db = (await create({
        schema,
        components: { afterInsert: (orama, key, doc) => afterInsert(orama, key), tokenizer: { stemming: false } },
    }));

    const id = await insert(db, { text: 'hello personalization' });

    t.same((db as OramaWithHighlight<typeof db>).data.positions[id], {
        text: { hello: [{ start: 0, length: 5 }], personalization: [{ start: 6, length: 15 }] },
    });
});

t.test('should retrieve positions', async t => {
    const schema = {
        text: 'string',
    } as const;

    const db = (await create({ schema, components: { afterInsert } }));

    await insert(db, { text: 'hello world' });

    const results = await searchWithHighlight(db, { term: 'hello' });
    t.same(results.hits[0].positions, { text: { hello: [{ start: 0, length: 5 }] } });
});

t.test('should work with texts containing constructor and __proto__ properties', async t => {
    const schema = {
        text: 'string',
    } as const;

    const db = (await create({ schema, components: { afterInsert } }));

    await insert(db, { text: 'constructor __proto__' });

    const results = await searchWithHighlight(db, { term: 'constructor' });

    t.same(results.hits[0].positions, {
        text: { constructor: [{ start: 0, length: 11 }] },
    });
});

t.test('should correctly save and load data with positions', async t => {
    const schema = {
        text: 'string',
    } as const;

    const originalDB = (await create({ schema, components: { afterInsert } }));

    const id = await insert(originalDB, { text: 'hello world' });

    const DBData = await saveWithHighlight(originalDB);

    const newDB = (await create({ schema, components: { afterInsert } }));

    await loadWithHighlight(newDB, DBData);

    t.same((newDB as OramaWithHighlight<typeof newDB>).data.positions[id], {
        text: { hello: [{ start: 0, length: 5 }], world: [{ start: 6, length: 5 }] },
    });
});
