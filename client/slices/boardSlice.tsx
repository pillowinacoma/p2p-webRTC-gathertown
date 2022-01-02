import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
    playerPosition: [number, number]
    playerAvatar: string
    remotePositions: { [key: string]: [number, number] }
    remoteAvatars: { [key: string]: string }
    board: {
        width: number
        height: number
        tiles: Tile[]
    }
    stream: MediaStream
    remoteStreams: { [key: string]: MediaStream }
    distances: { [key: string]: number }
    peersToCall: string[]
    peersToStay: string[]
}

// Define the initial state using that type
const initialState: AppState = {
    playerPosition: [10, 24],
    playerAvatar: '',
    remotePositions: {},
    remoteAvatars: {},
    board: {
        width: 60,
        height: 60,
        tiles: [], // unused for now, could be useful for collision management
    },
    stream: undefined,
    remoteStreams: {},
    distances: {},
    peersToCall: [],
    peersToStay: [],
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
                    state.playerPosition = action.payload.position
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
                    state.playerAvatar = action.payload.avatar
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
            state.remoteStreams[peerId] = stream
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
            const tmp = Object.entries(state.remotePositions).map(
                ([peerId, position]) => {
                    const res: { [key: string]: number } = {}
                    res[peerId] =
                        Math.abs(state.playerPosition[0] - position[0]) +
                        Math.abs(state.playerPosition[1] - position[1])
                    return res
                }
            )
            state.distances = Object.assign({}, ...tmp)

            state.peersToCall = Object.entries(state.distances)
                .filter(([_, distance]) => distance < 2)
                .map(([peerId]) => peerId)

            state.peersToStay = Object.entries(state.distances)
                .filter(([_, distance]) => distance < 5)
                .map(([peerId]) => peerId)
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
} = boardSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.slidesApp.value

export default boardSlice.reducer
