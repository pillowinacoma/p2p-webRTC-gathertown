import * as React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { useAppSelector } from '../hooks'
import { setAvatar } from '../slices/boardSlice'
import alex from '../img/Alex.png'
import bob from '../img/Bob.png'
import adam from '../img/Adam.png'
import amelia from '../img/Amelia.png'
import { useCallback } from 'react'

export const AvatarPicker: React.FC = () => {
    const playerAvatar: string = useAppSelector((state) => state.playerAvatar)
    // const playerPosition: [number, number] = useAppSelector(
    //     (state) => state.playerPosition
    // )

    const dispatch = useDispatch<AppDispatch>()

    const avatarSelected = useCallback(
        (event) => {
            // console.log(event)
            const avatar = event.currentTarget.id
            const local = true
            dispatch(setAvatar({ avatar, local }, true))
        },
        [playerAvatar]
    )

    return (
        <div className="flex flex-row space-x-2 w-48 h-12" id="avatarList">
            <button
                id="Adam"
                onClick={avatarSelected}
                className={playerAvatar === 'Adam' ? 'selected' : ''}
            >
                <img className="m-2" src={adam}></img>
            </button>
            <button
                id="Alex"
                onClick={avatarSelected}
                className={playerAvatar === 'Alex' ? 'selected' : ''}
            >
                <img className="m-2" src={alex}></img>
            </button>
            <button
                id="Amelia"
                onClick={avatarSelected}
                className={playerAvatar === 'Amelia' ? 'selected' : ''}
            >
                <img className="m-2" src={amelia}></img>
            </button>
            <button
                id="Bob"
                onClick={avatarSelected}
                className={playerAvatar === 'Bob' ? 'selected' : ''}
            >
                <img className="m-2" src={bob}></img>
            </button>
        </div>
    )
}
