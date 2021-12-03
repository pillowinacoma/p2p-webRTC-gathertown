import { AnyAction, Dispatch, Middleware } from 'redux'
import * as io from 'socket.io-client'

// import SimplePeer from 'simple-peer'
const socket = io.connect()
// const peer = new SimplePeer()

socket.on('peer', (msg) => {
    console.log(msg)
    // TODO propagate signal from socket to peer
})

/*
peer.on('signal', function (data) {
    console.log('Advertising signaling data' + data + 'to Peer ID:' + peerId)
    // TODO propagate signal from peer to socket
})
*/

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
