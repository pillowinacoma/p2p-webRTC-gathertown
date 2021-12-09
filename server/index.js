/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 4000
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

io.on('connection', function (socket) {
    const keys = [...io.sockets.sockets.keys()]
    const connected = [...io.sockets.sockets.values()]
        .filter((x) => x.connected)
        .map((x) => x.id)

    const peersToAdvertise = connected
        .filter((x) => x !== socket.id)
        .map((x) => io.sockets.sockets.get(x))

    console.log(
        'advertising peers',
        peersToAdvertise.map((x) => x.id)
    )

    peersToAdvertise.forEach(function (socket2) {
        console.log('Advertising peer %s to %s', socket.id, socket2.id)
        socket2.emit('peer', {
            peerId: socket.id,
            initiator: true,
        })
        socket.emit('peer', {
            peerId: socket2.id,
            initiator: false,
        })
    })

    socket.on('signal', (data) => {
        // const socket2 = io.sockets.connected[data.peerId]
        const socket2 = io.sockets.sockets.get(data.peerId)

        if (!socket2) {
            return
        }
        console.log('Proxying signal from peer %s to %s', socket.id, socket2.id)

        io.to(socket2.id).emit('signal', {
            signal: data.signal,
            peerId: socket.id,
        })
    })
    console.log(connected)
})

server.listen(port, function () {
    console.log('App listening on port: ' + port)
})
