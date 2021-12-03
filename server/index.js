/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000
const path = require('path')

const DIST_DIR = path.join(__dirname, '../dist')
const HTML_FILE = path.join(DIST_DIR, 'index.html')

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
app.use(express.static(DIST_DIR))

io.on('connection', (socket) => {
    console.log('START\t', socket.id)
    socket.on('movePlayer', (msg) => {
        console.log(msg)
    })
})

server.listen(port, function () {
    console.log('App listening on port: ' + port)
})
