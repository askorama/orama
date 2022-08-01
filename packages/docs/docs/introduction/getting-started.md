---
sidebar_position: 1
---

# Getting Started with Lyra

Lyra is a **blazingly fast, immutable, edge and in-memory full-text search engine** capable of working both on client and server.

Through the implementation of an optimized prefix tree and some clever tweaks, Lyra can perform searches through millions of entries in **microseconds**.

### Requirements

- [Node.js](https://nodejs.org/en/download/) and a **package manager** of your choice (npm, yarn, pnpm).

## Installation

Lyra can be installed using either ***npm***, ***yarn***, or ***pnpm***.

<details open><summary>npm</summary>

```bash
npm install @nearform/lyra
```

</details>


<details><summary>yarn</summary>

```bash
yarn add @nearform/lyra
```

</details>

<details><summary>pnpm</summary>

```bash
pnpm add @nearform/lyra
```

</details>

## Start working with Lyra

Once Lyra is installed, it can easily be imported it in any project. 

**esm**
```js
import { Lyra } from '@nearform/lyra'
```

**cjs**
```js
const { Lyra } = require('@nearform/lyra');
```

> Lyra exposes its own types, ESM modules and CJS modules.
