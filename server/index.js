/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000
const path = require('path')
const { SocketAddress } = require('net')

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
    const keys = [...io.sockets.sockets.keys()]
    console.log('START\t', socket.id)
    io.sockets.emit('peer', {
        peerId: socket.id,
        initiator: keys[0] === socket.id,
    })

    socket.on('movePlayer', (msg) => {
        console.log(msg)
    })
    socket.on('disconnect', (msg) => {
        console.log(`END\t${socket.id}`)
    })
})

server.listen(port, function () {
    console.log('App listening on port: ' + port)
})
