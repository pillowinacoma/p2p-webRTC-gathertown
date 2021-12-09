import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
    playerPosition: [number, number]
    playerAvatar: string
    remotePlayerPosition: [number, number]
    remotePlayerAvatar: string
    board: {
        width: number
        height: number
        tiles: Tile[]
    }
}

// Define the initial state using that type
const initialState: AppState = {
    playerPosition: [10, 24],
    playerAvatar: '',
    remotePlayerPosition: [0, 0],
    remotePlayerAvatar: '',
    board: {
        width: 60,
        height: 60,
        tiles: [], // unused for now, could be useful for collision management
    },
}

export const boardSlice = createSlice({
    name: 'board',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        movePlayer: {
            reducer(state, action: PayloadAction<movePlayerAction>) {
                if (action.payload.local) {
                    state.playerPosition = action.payload.position
                } else {
                    state.remotePlayerPosition = action.payload.position
                    console.log('REMOTE MOVE')
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
                if (action.payload.local) {
                    state.playerAvatar = action.payload.avatar
                } else {
                    state.remotePlayerAvatar = action.payload.avatar
                    console.log('REMOTE AVATAR')
                }
                return state
            },
            prepare(payload: setAvatarAction, propagate: boolean) {
                return { payload, meta: { propagate } }
            },
        },
        salut: {
            reducer: () => {
                // console.log('SALUT')
            },
            prepare: (payload: string, propagate: boolean) => {
                return { payload, meta: { propagate } }
            },
        },
    },
})

export const { movePlayer, setAvatar, salut } = boardSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.slidesApp.value

export default boardSlice.reducer
