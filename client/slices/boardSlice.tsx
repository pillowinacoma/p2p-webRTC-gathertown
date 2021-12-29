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
    stream: MediaProvider
    remoteStreams: { [key: string]: MediaProvider }
    distance: number
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
    distance: 1000,
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
            reducer: (state, action: PayloadAction<MediaProvider>) => {
                state.stream = action.payload
                return state
            },
            prepare: (payload: MediaProvider, propagate: boolean) => {
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
            reducer: (state, action: PayloadAction<MediaProvider>) => {
                state.stream = undefined
            },
            prepare: (payload: MediaProvider, propagate: boolean) => {
                return { payload, meta: { propagate } }
            },
        },
        // calculDistance: (state) => {
        // state.distance =
        // Math.abs(
        //     state.playerPosition[0] - state.remotePlayerPosition[0]
        // ) +
        // Math.abs(
        //     state.playerPosition[1] - state.remotePlayerPosition[1]
        // )
        // },
    },
})

export const {
    movePlayer,
    setAvatar,
    setStream,
    setRemoteStream,
    breakStream,
    // calculDistance,
} = boardSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.slidesApp.value

export default boardSlice.reducer
