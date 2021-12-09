import { AnyAction, Dispatch, Middleware } from 'redux'
import * as io from 'socket.io-client'
import SimplePeer, { SignalData } from 'simple-peer'
import { store } from '../store'
import { movePlayer, setAvatar, setRemoteStream } from '../slices/boardSlice'

const socket = io.connect()
const useTrickle = true
const connectedPeers = new Map()
let peerId: string

socket.on('connect', () => {
    // console.log(`Connection to signaling server on socket : ${socket.id}`)
})

socket.on('peer', (peerInfo) => {
    // console.log(peerInfo)

    peerId = peerInfo.peerId
    const peer: SimplePeer.Instance = new SimplePeer({
        initiator: peerInfo.initiator,
        trickle: useTrickle,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            ],
        },
    })

    socket.on('signal', (data) => {
        // console.log('SOCKET : SIGNAL', data)
        peer.signal(data.signal)
    })

    peer.on('signal', (signal: SignalData) => {
        // console.log('PEER : SIGNAL', signal)
        socket.emit('signal', {
            peerId,
            signal,
        })
    })

    peer.on('error', console.log)

    peer.on('connect', () => console.log('Peer Connection Established'))

    peer.on('data', (data) => {
        // console.log('Received data from peer:' + data)
        const restructuredData: restructuredData = JSON.parse(data)
        const { type, payload } = restructuredData

        payload.local = false

        console.log(`${type}|${payload}`)
        switch (type) {
            case 'movePlayer':
                // console.log('Recieved : movePlayer', payload)
                store.dispatch(movePlayer(<movePlayerAction>payload, false))
                break
            case 'setAvatar':
                // console.log('Recieved : setAvatar', payload)
                store.dispatch(setAvatar(<setAvatarAction>payload, false))
                break
            default:
                console.log('DEFAULT')

                break
        }
    })

    peer.on('stream', (stream): void => {
        store.dispatch(setRemoteStream(stream))
        console.log('got stream ')
    })
    peerId = peerInfo.peerId
    connectedPeers.set(peerInfo.peerId, peer)
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

                if (peerId) {
                    if (reducer !== 'setStream')
                        connectedPeers.get(peerId).send(message)
                    else {
                        console.log(payload)

                        connectedPeers.get(peerId).addStream(payload)
                    }
                }
            }
        }

        return next(action)
    }
