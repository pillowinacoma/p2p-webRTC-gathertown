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

app.get('/api', (req, res) => {
    res.send({
        message: 'Hello World',
    })
})
app.get('/', (req, res) => {
    res.sendFile(HTML_FILE)
})
app.use(express.static(DIST_DIR))

const peers = new Map()

io.on('connection', function (socket) {
    console.log(`client ${socket.id} is connected`)

    peers.set(socket.id, socket)
    console.log('PEERS', peers.keys())

    for (const [peerId, peerSocket] of peers) {
        if (peerId === socket.id) continue
        console.log(`init receive to ${socket.id}`)
        peerSocket.emit('initReceive', socket.id)
    }

    socket.on('initSend', (initSocketId) => {
        console.log(`init send by ${socket.id} for ${initSocketId}`)
        peers.get(initSocketId).emit('initSend', socket.id)
    })

    socket.on('signal', (data) => {
        const { socketId, signal } = data
        console.log(`sending signal from ${socket.id} to ${socketId}`)

        if (!peers.get(socketId)) return

        peers.get(socketId).emit('signal', {
            socketId: socket.id,
            signal,
        })
    })

    socket.on('disconnect', () => {
        console.log(`client ${socket.id} disconnected`)
        socket.broadcast.emit('removePeer', socket.id)
        peers.delete(socket.id)
    })
})

server.listen(port, function () {
    console.log('App listening on port: ' + port)
})
