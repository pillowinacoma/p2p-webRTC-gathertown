import { AnyAction, Dispatch, Middleware } from 'redux'
import { io } from 'socket.io-client'

const socket = io("ws://localhost:3000")
const SimplePeer = require('simple-peer')
const wrtc = require('wrtc')
var peer = new SimplePeer()

socket.on('signal', function (data) {
    console.log('received signal on socket')
    console.log(data)
    // TODO propagate signal from socket to peer
})

socket.on('peer', (data) => {
    peer: SimplePeer.Instance = new SimplePeer({
        initiator: data.initiator,
        trickle: data.useTrickle, // useTrickle doit être a true pour que le peer persiste
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            ],
        },
    })
})

peer.on('signal', function (data) {
    console.log(
        'Advertising signaling data' + data + 'to Peer ID:' + peerId
    )
    // TODO propagate signal from peer to socket
})

export const actionMiddleware: Middleware<Dispatch> =
    () => (next) => (action: AnyAction) => {
        if (action.meta) {
            if (action.type === 'board/movePlayer') {
                socket.emit('movePlayer', {
                    type: 'movePlayer',
                    value: action.payload,
                })
            }
            return next(action)
        }
    }
