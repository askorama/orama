import { expect, test } from '@playwright/test'

test('should persist and restore the database in binary format', async ({ page }) => {
  await page.goto('/')

  const r1 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult1')!.innerHTML))
  const r2 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult2')!.innerHTML))
  const r3 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult3')!.innerHTML))
  const r4 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult4')!.innerHTML))

  expect(r1).toEqual(r2)
  expect(r3).toEqual(r4)
})

test('should persist and restore the database in json format', async ({ page }) => {
  await page.goto('/')

  const r1 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult5')!.innerHTML))
  const r2 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult6')!.innerHTML))
  const r3 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult7')!.innerHTML))
  const r4 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult8')!.innerHTML))

  expect(r1).toEqual(r2)
  expect(r3).toEqual(r4)
})

test('should persist and restore the database in dpack format', async ({ page }) => {
  await page.goto('/')

  const r1 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult9')!.innerHTML))
  const r2 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult10')!.innerHTML))
  const r3 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult11')!.innerHTML))
  const r4 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult12')!.innerHTML))

  expect(r1).toEqual(r2)
  expect(r3).toEqual(r4)
})

test('should forbid filesystem access', async ({ page }) => {
  await page.goto('/')

  const r1 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult13')!.innerHTML))
  const r2 = await page.evaluate(() => JSON.parse(document.getElementById('searchResult14')!.innerHTML))

  expect(r1).toEqual('Filesystem access is not supported on Browser')
  expect(r2).toEqual('Filesystem access is not supported on Browser')
})
