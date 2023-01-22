import path from 'path'

export default {
    root: path.resolve(__dirname),
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '@stemmer': path.resolve(__dirname, '../../../stemmer/lib')
        },
    }
}