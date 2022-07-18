#!/usr/bin/env zx

const datasetName = `title.basics.tsv`;
const dataset = `https://datasets.imdbws.com/${datasetName}`;
const datasetOutputDir = `./dataset`;
const datasetNewName = `title.tsv`

await $`wget ${dataset} -O ${datasetOutputDir}/${datasetName}.gz`;
await $`gunzip ${datasetOutputDir}/${datasetName}`;
await $`head -1000000 ${datasetOutputDir}/${datasetName} >> ${datasetOutputDir}/${datasetNewName}`
await $`rm ${datasetOutputDir}/${datasetName}.gz`