import { AnyAction, Dispatch, Middleware } from 'redux'
import { io } from 'socket.io-client'

const socket = io()

export const actionMiddleware: Middleware<Dispatch> =
  () => (next) => (action: AnyAction) => {
    if (action.meta) {
      if (action.type === 'board/movePlayer') {
        socket.emit('movePlayer', {
          type: 'movePlayer',
          value: action.payload
        })
    }
    return next(action)
  }
}
