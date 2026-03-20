import fastify from "fastify"
import viewPlugin from '@fastify/view'
import fastifyStatic from '@fastify/static'
import pug from 'pug'
import path from 'path'
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = async () => {
    const app = fastify()
    const port = 3000

    await app.register(viewPlugin, {
        engine: { pug },
        root: './src/views',
    })

    await app.register(fastifyStatic, {
        root: path.join(__dirname, '../node_modules/bootstrap/dist/css'),
        prefix: '/assets/',
    })

    app.get('/', (req, res) => {
        res.view('index.pug', { message: 'Hello world!' })
    })

    app.listen({ port }, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

server()