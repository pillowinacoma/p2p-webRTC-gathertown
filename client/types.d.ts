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
    local: boolean
}

interface setAvatarAction {
    avatar: string
    local: boolean
}

interface genAction<T, P> {
    type: T
    payload: P
}
type restructuredData =
    | genAction<'movePlayer', movePlayerAction>
    | genAction<'setAvatar', setAvatarAction>
