import { configureStore } from '@reduxjs/toolkit'
import { logger } from 'redux-logger'
import boardReducer from '../slices/boardSlice'
import { actionMiddleware } from '../middleware/socketMiddleware'

export const store = configureStore({
    reducer: boardReducer,
    middleware: [actionMiddleware, logger],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
