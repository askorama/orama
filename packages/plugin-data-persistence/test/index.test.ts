import { create, insert, Orama, search, searchVector } from '@orama/orama'
import t from 'tap'
import { UNSUPPORTED_FORMAT, METHOD_MOVED } from '../src/errors.js'
import {
  persist,
  restore,
  persistToFile as deprecatedPersistToFile,
  restoreFromFile as deprecatedRestoreFromFile
} from '../src/index.js'
import { persistToFile, restoreFromFile } from '../src/server.js'

let _rm

async function rm(path: string): Promise<void> {
  if (!_rm) {
    // @ts-expect-error Choosing runtime
    _rm = typeof Deno !== 'undefined' ? Deno.remove : (await import('node:fs/promises')).rm
  }

  return _rm(path)
}

async function generateTestDBInstance() {
  const db = await create({
    schema: {
      quote: 'string',
      author: 'string',
      genre: 'enum',
      colors: 'enum[]'
    } as const
  })

  await insert(db, {
    quote: 'I am a great programmer',
    author: 'Bill Gates',
    genre: 'tech',
    colors: ['red', 'blue']
  })

  await insert(db, {
    quote: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    genre: 'life',
    colors: ['red', 'green']
  })

  await insert(db, {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: 'Thomas A. Edison',
    genre: 'tech',
    colors: ['red', 'blue']
  })

  await insert(db, {
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  })

  return db
}

t.test('binary persistence', (t) => {
  t.plan(5)

  t.test('should generate a persistence file on the disk with random name', async (t) => {
    t.plan(2)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in binary format
    const path = await persistToFile(db, 'binary')
    t.teardown(rmTeardown(path))

    // Load database from disk in binary format
    const db2 = await restoreFromFile('binary')

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })

  t.test('should generate a persistence file on the disk with a given name', async (t) => {
    t.plan(2)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in binary format
    const path = await persistToFile(db, 'binary', 'test.dpack')
    t.teardown(rmTeardown(path))

    // Load database from disk in binary format
    const db2 = await restoreFromFile('binary', 'test.dpack')

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })

  t.test('should generate a persistence file on the disk using ORAMA_DB_NAME env', async (t) => {
    t.plan(3)
    let currentOramaDBNameValue: string | undefined

    // @ts-expect-error Deno is only available in Deno
    if (typeof Deno !== 'undefined') {
      // @ts-expect-error Deno is only available in Deno
      currentOramaDBNameValue = Deno.env.get('ORAMA_DB_NAME')

      // @ts-expect-error Deno is only available in Deno
      Deno.env.set('ORAMA_DB_NAME', 'example_db_dump')
    } else {
      currentOramaDBNameValue = process.env.ORAMA_DB_NAME
      process.env.ORAMA_DB_NAME = 'example_db_dump'
    }

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in binary format
    const path = await persistToFile(db, 'binary')
    t.teardown(rmTeardown(path))
    t.match(path, 'example_db_dump')

    // Load database from disk in binary format
    const db2 = await restoreFromFile('binary', path)

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)

    if (currentOramaDBNameValue) {
      // @ts-expect-error Deno is only available in Deno
      if (typeof Deno !== 'undefined') {
        // @ts-expect-error Deno is only available in Deno
        Deno.env.set('ORAMA_DB_NAME', currentOramaDBNameValue)
      } else {
        process.env.ORAMA_DB_NAME = currentOramaDBNameValue
      }
    }
  })

  t.test('should continue to work with `enum`', async (t) => {
    t.plan(1)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      where: {
        genre: { eq: 'way' }
      }
    })

    const path = await persistToFile(db, 'binary', 'test.dpack')
    t.teardown(rmTeardown(path))

    const db2 = await restoreFromFile('binary', 'test.dpack')

    const qp1 = await search(db2, {
      where: {
        genre: { eq: 'way' }
      }
    })

    t.same(q1.hits, qp1.hits)
  })

  t.test('should continue to work with `enum[]`', async (t) => {
    t.plan(1)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      where: {
        colors: { containsAll: ['green'] }
      }
    })

    const path = await persistToFile(db, 'binary', 'test.dpack')
    t.teardown(rmTeardown(path))

    const db2 = await restoreFromFile('binary', 'test.dpack')

    const qp1 = await search(db2, {
      where: {
        colors: { containsAll: ['green'] }
      }
    })

    t.same(q1.hits, qp1.hits)
  })
})

t.test('json persistence', (t) => {
  t.plan(5)

  t.test('should generate a persistence file on the disk with random name and json format', async (t) => {
    t.plan(2)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in json format
    const path = await persistToFile(db, 'json')
    t.teardown(rmTeardown(path))

    // Load database from disk in json format
    const db2 = await restoreFromFile('json')

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })

  t.test('should generate a persistence file on the disk with support for vectors', async (t) => {
    t.plan(1)
    const db1 = await create({
      schema: {
        text: 'string',
        vector: 'vector[5]'
      } as const
    })

    await insert(db1, { text: 'vector 1', vector: [1, 0, 0, 0, 0] })
    await insert(db1, { text: 'vector 2', vector: [1, 1, 0, 0, 0] })
    await insert(db1, { text: 'vector 3', vector: [0, 0, 0, 0, 0] })

    // Persist database on disk in json format
    const path = await persistToFile(db1, 'json', 'test.json')
    t.teardown(rmTeardown(path))

    // Load database from disk in json format
    const db2 = await restoreFromFile('json', 'test.json')

    const qp1 = await searchVector(db1, {
      vector: [1, 0, 0, 0, 0],
      property: 'vector'
    })

    const qp2 = await searchVector(db2, {
      vector: [1, 0, 0, 0, 0],
      property: 'vector'
    })

    // Queries on the loaded database should match the original database
    t.same(qp1.hits, qp2.hits)
  })

  t.test('should generate a persistence file on the disk with a given name and json format', async (t) => {
    t.plan(2)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in json format
    const path = await persistToFile(db, 'json', 'test.json')
    t.teardown(rmTeardown(path))

    // Load database from disk in json format
    const db2 = await restoreFromFile('json', 'test.json')

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })

  t.test('should continue to work with `enum`', async (t) => {
    t.plan(1)
    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      where: {
        genre: { eq: 'way' }
      }
    })

    const path = await persistToFile(db, 'json', 'test.json')
    t.teardown(rmTeardown(path))

    const db2 = await restoreFromFile('json', 'test.json')

    const qp1 = await search(db2, {
      where: {
        genre: { eq: 'way' }
      }
    })

    t.same(q1.hits, qp1.hits)
  })

  t.test('should continue to work with `enum[]`', async (t) => {
    t.plan(1)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      where: {
        colors: { containsAll: ['green'] }
      }
    })

    const path = await persistToFile(db, 'json', 'test.json')
    t.teardown(rmTeardown(path))

    const db2 = await restoreFromFile('json', 'test.json')

    const qp1 = await search(db2, {
      where: {
        colors: { containsAll: ['green'] }
      }
    })

    t.same(q1.hits, qp1.hits)
  })
})

t.test('dpack persistence', (t) => {
  t.plan(4)

  t.test('should generate a persistence file on the disk with random name and dpack format', async (t) => {
    t.plan(2)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in dpack format
    const path = await persistToFile(db, 'dpack')
    t.teardown(rmTeardown(path))

    // Load database from disk in dpack format
    const db2 = await restoreFromFile('dpack')

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })

  t.test('should generate a persistence file on the disk with a given name and dpack format', async (t) => {
    t.plan(2)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      term: 'way'
    })

    const q2 = await search(db, {
      term: 'i'
    })

    // Persist database on disk in json format
    const path = await persistToFile(db, 'dpack', 'test.dpack')
    t.teardown(rmTeardown(path))

    // Load database from disk in json format
    const db2 = await restoreFromFile('dpack', 'test.dpack')

    const qp1 = await search(db2, {
      term: 'way'
    })

    const qp2 = await search(db2, {
      term: 'i'
    })

    // Queries on the loaded database should match the original database
    t.same(q1.hits, qp1.hits)
    t.same(q2.hits, qp2.hits)
  })

  t.test('should continue to work with `enum`', async (t) => {
    t.plan(1)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      where: {
        genre: { eq: 'way' }
      }
    })

    const path = await persistToFile(db, 'dpack', 'test.dpack')
    t.teardown(rmTeardown(path))

    const db2 = await restoreFromFile('dpack', 'test.dpack')

    const qp1 = await search(db2, {
      where: {
        genre: { eq: 'way' }
      }
    })

    t.same(q1.hits, qp1.hits)
  })

  t.test('should continue to work with `enum[]`', async (t) => {
    t.plan(1)

    const db = await generateTestDBInstance()
    const q1 = await search(db, {
      where: {
        colors: { containsAll: ['green'] }
      }
    })

    const path = await persistToFile(db, 'dpack', 'test.dpack')
    t.teardown(rmTeardown(path))

    const db2 = await restoreFromFile('dpack', 'test.dpack')

    const qp1 = await search(db2, {
      where: {
        colors: { containsAll: ['green'] }
      }
    })

    t.same(q1.hits, qp1.hits)
  })
})

t.test('should persist data in-memory', async (t) => {
  t.plan(4)
  const db = await generateTestDBInstance()

  const q1 = await search(db, {
    term: 'way'
  })

  const q2 = await search(db, {
    term: 'i'
  })

  // Persist database in-memory
  const binDB = await persist(db, 'binary')
  const jsonDB = await persist(db, 'json')
  const dpackDB = await persist(db, 'dpack')

  // Load database from in-memory
  const binDB2 = await restore('binary', binDB)
  const jsonDB2 = await restore('json', jsonDB)
  const dpackDB2 = await restore('dpack', dpackDB)

  const qp1 = await search(binDB2, {
    term: 'way'
  })

  const qp2 = await search(jsonDB2, {
    term: 'i'
  })

  const qp3 = await search(dpackDB2, {
    term: 'way'
  })

  const qp4 = await search(dpackDB2, {
    term: 'i'
  })

  // Queries on the loaded database should match the original database
  t.same(q1.hits, qp1.hits)
  t.same(q2.hits, qp2.hits)
  t.same(q1.hits, qp3.hits)
  t.same(q2.hits, qp4.hits)
})

t.test('errors', (t) => {
  t.plan(2)

  t.test('should throw an error when trying to persist a database in an unsupported format', async (t) => {
    t.plan(1)

    const db = await generateTestDBInstance()
    try {
      // @ts-expect-error - 'unsupported' is not a supported format
      await persistToFile(db, 'unsupported')
    } catch ({ message }) {
      t.match(message, 'Unsupported serialization format: unsupported')
    }
  })

  t.test('should throw an error when trying to restoreFromFile a database from an unsupported format', async (t) => {
    t.plan(1)

    const format = 'unsupported'
    const db = await generateTestDBInstance()
    const path = await persistToFile(db, 'binary', 'supported')
    t.teardown(rmTeardown(path))

    try {
      // @ts-expect-error - 'unsupported' is not a supported format
      await restoreFromFile(format, path)
    } catch ({ message }) {
      t.match(message, UNSUPPORTED_FORMAT(format))
    }
  })
})

t.test('should throw an error when trying to use a deprecated method', async (t) => {
  t.plan(2)
  const db = await generateTestDBInstance()

  try {
    await deprecatedPersistToFile(db, 'binary')
  } catch ({ message }) {
    t.match(message, METHOD_MOVED('persistToFile'))
  }

  try {
    await deprecatedRestoreFromFile('binary', 'path')
  } catch ({ message }) {
    t.match(message, METHOD_MOVED('restoreFromFile'))
  }
})

function rmTeardown(p: string) {
  return async () => {
    try {
      await rm(p)
    } catch (e) {}
  }
}
