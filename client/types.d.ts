import SimplePeer from 'simple-peer'

interface Tile {
    type: string
}

type RouteParams = {
    id: string // parameters will always be a string (even if they are numerical)
}

interface Participant {
    initiator: boolean
    peerId: string
}

interface movePlayerAction {
    position: [number, number]
    peerId?: string
}

interface setAvatarAction {
    avatar: string
    peerId?: string
}

interface setRemoteStreamAction {
    stream: MediaStream
    peerId: string
}

interface remotePlayer {
    stream?: MediaStream
    currentlyStreamingTo?: boolean
}

interface genAction<T, P> {
    type: T
    payload: P
}
type restructuredData =
    | genAction<'movePlayer', movePlayerAction>
    | genAction<'setAvatar', setAvatarAction>
    | genAction<'removeStream', string>
