import { create, insert, Orama, search } from '@orama/orama'
import t from 'tap'
import { UNSUPPORTED_FORMAT, METHOD_MOVED } from '../src/errors.js'
import { persist, restore, persistToFile as deprecatedPersistToFile, restoreFromFile as deprecatedRestoreFromFile } from '../src/index.js'
import { persistToFile, restoreFromFile } from '../src/server.js'

let _rm

async function rm(path: string): Promise<void> {
  if (!_rm) {
    // @ts-expect-error Choosing runtime
    _rm = typeof Deno !== 'undefined' ? Deno.remove : (await import('node:fs/promises')).rm
  }

  return _rm(path)
}

async function generateTestDBInstance(): Promise<Orama<any>> {
  const db = await create({
    schema: {
      quote: 'string',
      author: 'string'
    }
  })

  await insert(db, {
    quote: 'I am a great programmer',
    author: 'Bill Gates'
  })

  await insert(db, {
    quote: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde'
  })

  await insert(db, {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: 'Thomas A. Edison'
  })

  await insert(db, {
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  })

  return db
}

t.test('binary persistence', t => {
  t.plan(3)

  t.test('should generate a persistence file on the disk with random name', async t => {
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

    // Clean up
    await rm(path)
  })

  t.test('should generate a persistence file on the disk with a given name', async t => {
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

    // Clean up
    await rm(path)
  })

  t.test('should generate a persistence file on the disk using LYRA_DB_NAME env', async t => {
    t.plan(3)

    let currentOramaDBNameValue: string | undefined

    // @ts-expect-error Deno is only available in Deno
    if (typeof Deno !== 'undefined') {
      // @ts-expect-error Deno is only available in Deno
      currentOramaDBNameValue = Deno.env.get('LYRA_DB_NAME')

      // @ts-expect-error Deno is only available in Deno
      Deno.env.set('LYRA_DB_NAME', 'example_db_dump')
    } else {
      currentOramaDBNameValue = process.env.LYRA_DB_NAME
      process.env.LYRA_DB_NAME = 'example_db_dump'
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

    // Clean up
    await rm(path)

    if (currentOramaDBNameValue) {
      // @ts-expect-error Deno is only available in Deno
      if (typeof Deno !== 'undefined') {
        // @ts-expect-error Deno is only available in Deno
        Deno.env.set('LYRA_DB_NAME', currentOramaDBNameValue)
      } else {
        process.env.LYRA_DB_NAME = currentOramaDBNameValue
      }
    }
  })
})

t.test('json persistence', t => {
  t.plan(2)

  t.test('should generate a persistence file on the disk with random name and json format', async t => {
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

    // Clean up
    await rm(path)
  })

  t.test('should generate a persistence file on the disk with a given name and json format', async t => {
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

    // Clean up
    await rm(path)
  })
})

t.test('dpack persistence', t => {
  t.plan(2)

  t.test('should generate a persistence file on the disk with random name and dpack format', async t => {
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

    // Clean up
    await rm(path)
  })

  t.test('should generate a persistence file on the disk with a given name and dpack format', async t => {
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

    // Clean up
    await rm(path)
  })
})

t.test('should persist data in-memory', async t => {
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

t.test('errors', t => {
  t.plan(2)

  t.test('should throw an error when trying to persist a database in an unsupported format', async t => {
    t.plan(1)

    const db = await generateTestDBInstance()
    try {
      // @ts-expect-error - 'unsupported' is not a supported format
      await persistToFile(db, 'unsupported')
    } catch ({ message }) {
      t.match(message, 'Unsupported serialization format: unsupported')
    }
  })

  t.test('should throw an error when trying to restoreFromFile a database from an unsupported format', async t => {
    t.plan(1)

    const format = 'unsupported'
    const db = await generateTestDBInstance()
    const path = await persistToFile(db, 'binary', 'supported')
    try {
      // @ts-expect-error - 'unsupported' is not a supported format
      await restoreFromFile(format, path)
    } catch ({ message }) {
      t.match(message, UNSUPPORTED_FORMAT(format))
      await rm(path)
    }
  })
})

t.test('should throw an error when trying to use a deprecated method', async t => {
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