import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mapValues, omit, toPairs } from 'lodash'
import { Instance } from 'simple-peer'
import {
    movePlayerAction,
    setAvatarAction,
    remotePlayer,
    Tile,
    setRemoteStreamAction,
} from '../types'

// Define a type for the slice state
interface AppState {
    playerPosition: [number, number]
    playerAvatar: string
    remotePositions: { [key: string]: [number, number] }
    remoteAvatars: { [key: string]: string }
    distances: { [key: string]: number }
    board: {
        width: number
        height: number
        tiles: Tile[]
    }
    stream: MediaStream
    remote: { [key: string]: remotePlayer }
    peers: { [key: string]: Instance }
    connectedTo: { [key: string]: boolean }
}

// Define the initial state using that type
const initialState: AppState = {
    playerPosition: [
        Math.round(Math.random() * 10),
        Math.round(Math.random() * 10),
    ],
    playerAvatar: ['Amelia', 'Bob', 'Adam', 'Alex'][
        Math.floor(Math.random() * 4)
    ],
    remotePositions: {},
    remoteAvatars: {},
    distances: {},
    board: {
        width: 60,
        height: 60,
        tiles: [], // unused for now, could be useful for collision management
    },
    stream: undefined,
    remote: {}, // in the bigining I wanted to put all remote users' data here, but when I use useEffect on this variable i keep getting "infinite" renders
    peers: {},
    connectedTo: {},
}

export const boardSlice = createSlice({
    name: 'board',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        movePlayer: {
            reducer(state, action: PayloadAction<movePlayerAction>) {
                const { position, peerId } = action.payload
                if (!peerId) {
                    state.playerPosition = position
                } else {
                    state.remotePositions[peerId] = position
                }
                return state
            },
            prepare(payload: movePlayerAction, propagate: boolean) {
                return {
                    payload: payload,
                    meta: { propagate },
                }
            },
        },
        setAvatar: {
            reducer(state, action: PayloadAction<setAvatarAction>) {
                const { avatar, peerId } = action.payload

                if (!peerId) {
                    state.playerAvatar = avatar
                } else {
                    state.remoteAvatars[peerId] = avatar
                }
                return state
            },
            prepare(payload: setAvatarAction, propagate: boolean) {
                return { payload, meta: { propagate } }
            },
        },
        setStream: {
            reducer: (state, action: PayloadAction<MediaStream>) => {
                state.stream = action.payload
                return state
            },
            prepare: (payload: MediaStream, propagate: boolean) => {
                return { payload, meta: { propagate } }
            },
        },
        setRemoteStream: (
            state,
            action: PayloadAction<setRemoteStreamAction>
        ) => {
            const { stream, peerId } = action.payload
            if (stream) {
                state.remote[peerId].stream = stream
            } else {
                const remoteStream = state.remote[peerId].stream
                if (remoteStream) {
                    state.remote[peerId].stream = undefined
                }
            }
        },
        breakStream: {
            reducer: (state, action: PayloadAction<MediaStream>) => {
                state.stream = undefined
            },
            prepare: (payload: MediaStream, propagate: boolean) => {
                return { payload, meta: { propagate } }
            },
        },
        calculDistance: (state) => {
            mapValues(state.remotePositions, (position, peerId) => {
                state.distances[peerId] =
                    Math.abs(state.playerPosition[0] - position[0]) +
                    Math.abs(state.playerPosition[1] - position[1])
            })
        },
        removePeer: {
            reducer: (state, action: PayloadAction<string>) => {
                const peerId = action.payload
                state.peers[peerId].destroy()
                state.peers = omit(state.peers, peerId)
                state.remote = omit(state.remote, peerId)
                state.remoteAvatars = omit(state.remoteAvatars, peerId)
                state.remotePositions = omit(state.remotePositions, peerId)
                state.distances = omit(state.distances, peerId)
            },
            prepare: (payload: string, propagate: boolean) => {
                return { payload, meta: { propagate } }
            },
        },
        addPeer: (
            state,
            action: PayloadAction<{ peerId: string; peer?: Instance }>
        ) => {
            const { peerId, peer } = action.payload

            state.remote[peerId] = {}
            state.peers[peerId] = peer
        },
        sendStream: (state, action: PayloadAction<string>) => {
            const stream = state.stream
            const peerId = action.payload
            const peers = mapValues(state.peers, (peer) => peer)
            const target = peers[peerId]
            const cnd = state.remote[peerId].currentlyStreamingTo
            !cnd && target && stream && target.addStream(stream)
            state.remote[peerId].currentlyStreamingTo = true
            state.connectedTo[peerId] = true
        },
        removeStream: (state, action: PayloadAction<string>) => {
            const peerId = action.payload
            state.connectedTo[peerId] = false
        },
    },
})

export const {
    movePlayer,
    setAvatar,
    setStream,
    setRemoteStream,
    breakStream,
    calculDistance,
    addPeer,
    sendStream,
    removeStream,
    removePeer,
} = boardSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.slidesApp.value

export default boardSlice.reducer
