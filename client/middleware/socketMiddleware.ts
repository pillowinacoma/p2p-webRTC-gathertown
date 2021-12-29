import { AnyAction, Dispatch, Middleware } from 'redux'
import * as io from 'socket.io-client'
import SimplePeer, { SignalData } from 'simple-peer'
import { store } from '../store'
import {
    movePlayer,
    setAvatar,
    setRemoteStream,
    setStream,
} from '../slices/boardSlice'

const socket = io.connect()
const useTrickle = true
const connectedPeers = new Map<string, SimplePeer.Instance>()
let peerId: string

const addPeer = (socketId: string, initiator: boolean) => {
    connectedPeers.set(
        socketId,
        new SimplePeer({
            initiator,
            trickle: useTrickle, // useTrickle doit être a true pour que le peer persiste
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                ],
            },
        })
    )

    const peer = connectedPeers.get(socketId)
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
        const stream = store.getState().stream
        store.dispatch(setAvatar({ avatar }, true))
        store.dispatch(movePlayer({ position }, true))
        store.dispatch(setStream(stream, true))
    })
    peer.on('error', (err) =>
        console.log(`Error sending data to peer : ${err}`)
    )
    peer.on('data', (data) => {
        const restructuredData: restructuredData = JSON.parse(data)
        const { type, payload } = restructuredData

        console.log(
            {
                avatar: (<setAvatarAction>payload).avatar,
                peerId: socketId,
            },
            false
        )

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
        store.dispatch(setRemoteStream({ stream, peerId: socketId }))
    })
}

const removePeer = (socketId: string) => {
    connectedPeers.get(socketId)?.destroy()
    connectedPeers.delete(socketId)
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

socket.on('signal', (data: { socketId: string; signal: any }) => {
    const { socketId, signal } = data
    connectedPeers.get(socketId).signal(signal)
})

socket.on('removePeer', (socketId) => {
    console.log(`REMOVE PEER ${socketId}`)
    removePeer(socketId)
})

socket.on('disconnect', () => {
    console.log(`DISCONNECTED`)
    connectedPeers.forEach((_, peerId) => {
        removePeer(peerId)
    })
})

export const actionMiddleware: Middleware<Dispatch> =
    () => (next) => (action: AnyAction) => {
        const { meta, type, payload } = action
        const [sliceName, reducer] = type.split('/')

        if (meta?.propagate) {
            if (sliceName === 'board') {
                const message = JSON.stringify({
                    type: reducer,
                    payload,
                })

                if (connectedPeers.size) {
                    switch (reducer) {
                        case 'movePlayer':
                            connectedPeers.forEach((peer) => peer.send(message))
                            break
                        case 'setAvatar':
                            connectedPeers.forEach((peer) => peer.send(message))
                            break
                        case 'setStream':
                            connectedPeers.forEach((peer) => {
                                console.log(peer)
                                peer.addStream(payload)
                            })
                            break
                        case 'breakStream':
                            // connectedPeers.get(peerId).removeStream(payload)
                            break
                    }
                }
            }
        }

        return next(action)
    }
