import { resolve } from 'node:path'

export default {
  root: resolve(__dirname),
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      stream: resolve(__dirname, '../../../node_modules/readable-stream')
    }
  }
}
