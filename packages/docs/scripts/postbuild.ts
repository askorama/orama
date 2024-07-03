import type { GeneralPurposeCrawlerResult } from '@orama/crawly'
import { readFileSync } from 'node:fs'
import { globby } from 'globby'
import { generalPurposeCrawler } from '@orama/crawly'
import { CloudManager } from '@oramacloud/client'
import 'dotenv/config'

const baseURL = new URL('../dist', import.meta.url).pathname

const docsCloud = `${baseURL}/cloud/**/*.html`
const docsOSS = `${baseURL}/open-source/**/*.html`

const isGitHubAction = Boolean(process.env.GITHUB_ACTIONS)

if (isGitHubAction) {
  process.exit(0)
}

function unslugify(slug: string) {
  return slug
    .toLowerCase()
    .split(/[-_.\s]/)
    .map((w) => `${w.charAt(0).toUpperCase()}${w.substring(1)}`).join(' ');
}

async function getAllRenderedDocs() {
  const [cloud, oss] = await Promise.all([
    globby(docsCloud),
    globby(docsOSS)
  ])

  return {
    cloud,
    oss
  }
}

function parseDoc(path: string) {
  const content = readFileSync(path, 'utf-8')
  const fullPath = `http://localhost:3000${path.replace(baseURL, '').replace(/^\/(open-source|cloud)/, '')}`

  return generalPurposeCrawler(fullPath, content, {
    parseCodeBlocks: true,
  })
}

async function getAllParsedDocuments() {
  const { cloud, oss } = await getAllRenderedDocs()

  const cloudDocs = (await Promise.all(cloud.map(parseDoc))).flat().map((doc) => ({ ...doc, category: 'Cloud', section: unslugify(doc.section) }))
  const ossDocs = (await Promise.all(oss.map(parseDoc))).flat().map((doc) => ({ ...doc, category: 'Open Source', section: unslugify(doc.section) }))
  
  return [...cloudDocs, ...ossDocs]
}

async function updateOramaCloud(docs: GeneralPurposeCrawlerResult[]) {
  const oramaCloudManager = new CloudManager({
    api_key: process.env.ORAMA_CLOUD_PRIVATE_API_KEY,
  })

  const docsIndex = oramaCloudManager.index(process.env.ORAMA_CLOUD_INDEX_ID)

  console.log(`Updating Orama Cloud with ${docs.length} documents...`)
  await docsIndex.snapshot(docs)

  console.log('Deploying Orama Cloud...')
  await docsIndex.deploy()
}

const docs = await getAllParsedDocuments()

await updateOramaCloud(docs)