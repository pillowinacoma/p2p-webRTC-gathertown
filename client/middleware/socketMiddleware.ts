import { AnyAction, Dispatch, Middleware } from 'redux'
import * as io from 'socket.io-client'
import SimplePeer, { Instance, SignalData } from 'simple-peer'
import { toPairs } from 'lodash'
import { store } from '../store'
import {
    movePlayer,
    setAvatar,
    setRemoteStream,
    addPeer as ap,
    removePeer as rp,
} from '../slices/boardSlice'
import { movePlayerAction, setAvatarAction, restructuredData } from '../types'

const socket = io.connect()
const useTrickle = true

const addPeer = (socketId: string, initiator: boolean) => {
    const peer = new SimplePeer({
        initiator,
        trickle: useTrickle, // useTrickle doit être a true pour que le peer persiste
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            ],
        },
    })

    // console.log('PEERS', connectedPeers.keys())

    peer.on('signal', (signal) => {
        // console.log('PEER ON SIGNAL')

        socket.emit('signal', {
            signal,
            socketId,
        })
    })
    peer.on('connect', () => {
        console.log(`Peer connection established`)
        const avatar = store.getState().playerAvatar
        const position = store.getState().playerPosition
        avatar && store.dispatch(setAvatar({ avatar }, true))
        store.dispatch(movePlayer({ position }, true))
    })
    peer.on('error', (err) =>
        console.log(`Error sending data to peer : ${err}`)
    )
    peer.on('data', (data) => {
        const restructuredData: restructuredData = JSON.parse(data)
        const { type, payload } = restructuredData

        switch (type) {
            case 'movePlayer':
                store.dispatch(
                    movePlayer(
                        {
                            position: (<movePlayerAction>payload).position,
                            peerId: socketId,
                        },
                        false
                    )
                )
                break
            case 'setAvatar':
                store.dispatch(
                    setAvatar(
                        {
                            avatar: (<setAvatarAction>payload).avatar,
                            peerId: socketId,
                        },
                        false
                    )
                )
                break
        }
    })
    peer.on('stream', (stream) => {
        stream.addEventListener('inactive', () =>
            store.dispatch(
                setRemoteStream({ stream: undefined, peerId: socketId })
            )
        )
        store.dispatch(setRemoteStream({ stream, peerId: socketId }))
    })

    store.dispatch(ap({ peerId: socketId, peer }))
}

const removePeer = (socketId: string) => {
    store.dispatch(rp(socketId, true))
}

socket.on('connect', () => {
    // console.log(`Connection to signaling server on socket : ${socket.id}`)
})

socket.on('initReceive', (socketId) => {
    // console.log(`INIT RECEIVE ${socketId}`)
    addPeer(socketId, false)
    socket.emit('initSend', socketId)
})

socket.on('initSend', (socketId) => {
    // console.log(`INIT SEND ${socketId}`)
    addPeer(socketId, true)
})

socket.on(
    'signal',
    (data: { socketId: string; signal: SimplePeer.SignalData }) => {
        const connectedPeers = store.getState().peers
        const { socketId, signal } = data
        connectedPeers[socketId].signal(signal)
    }
)

socket.on('removePeer', (socketId) => {
    console.log(`REMOVE PEER ${socketId}`)
    removePeer(socketId)
})

socket.on('disconnect', () => {
    const connectedPeers = store.getState().remote
    console.log(`DISCONNECTED`)
    Object.entries(connectedPeers).forEach(([peerId]) => {
        removePeer(peerId)
    })
})

export const actionMiddleware: Middleware<Dispatch> =
    () => (next) => (action: AnyAction) => {
        const { meta, type, payload } = action
        const [sliceName, reducer] = type.split('/')
        const peers = store.getState().peers

        if (meta?.propagate) {
            if (sliceName === 'board') {
                const message = JSON.stringify({
                    type: reducer,
                    payload,
                })

                switch (reducer) {
                    case 'movePlayer':
                        toPairs(peers).forEach(([_, peer]) => {
                            peer.send(message)
                        })
                        break
                    case 'setAvatar':
                        toPairs(peers).forEach(([_, peer]) =>
                            peer.send(message)
                        )
                        break
                }
            }
        }

        return next(action)
    }
