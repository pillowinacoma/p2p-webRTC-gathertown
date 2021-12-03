import express, { static } from 'express'
import { join } from 'path'
import http from 'http'
import { Server } from 'socket.io'
const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000

const DIST_DIR = join(__dirname, '../dist')
const HTML_FILE = join(DIST_DIR, 'index.html')

const mockResponse = {
    foo: 'bar',
    bar: 'foo',
}
app.get('/api', (req, res) => {
    res.send(mockResponse)
})
app.get('/', (req, res) => {
    res.sendFile(HTML_FILE)
})
app.use(static(DIST_DIR))

app.listen(port, function () {
    console.log('App listening on port: ' + port)
})

io.on('connection', (socket) => {
    console.log('START\t', socket.id)
})
