/* eslint-disable no-fallthrough */
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { movePlayer } from '../slices/boardSlice'
import { useAppSelector } from '../hooks'
import samplemap from '../img/samplemap_16.png'
import alex from '../img/Alex.png'
import bob from '../img/Bob.png'
import adam from '../img/Adam.png'
import amelia from '../img/Amelia.png'
import { useCallback, useEffect } from 'react'
import { AvatarPicker } from './AvatarPicker'
import VideoChat from './VideoChat'

export const Board: React.FC = () => {
    const board = useAppSelector((state) => state.board)
    const playerPosition: [number, number] = useAppSelector(
        (state) => state.playerPosition
    )
    const remotePlayerPosition: [number, number] = useAppSelector(
        (state) => state.remotePlayerPosition
    )
    const playerAvatar: string = useAppSelector((state) => state.playerAvatar)
    const remotePlayerAvatar: string = useAppSelector(
        (state) => state.remotePlayerAvatar
    )

    const dispatch = useDispatch<AppDispatch>()

    const keyDownHandler = useCallback(
        (event) => {
            // console.log(event.code)
            // console.log(playerPosition)
            let newPosition = playerPosition
            if (event.code === 'ArrowUp') {
                newPosition = [
                    playerPosition[0],
                    (playerPosition[1] - 1) % board.width,
                ]
            }
            if (event.code === 'ArrowDown') {
                newPosition = [
                    playerPosition[0],
                    (playerPosition[1] + 1) % board.width,
                ]
            }
            if (event.code === 'ArrowLeft') {
                newPosition = [
                    (playerPosition[0] - 1) % board.width,
                    playerPosition[1],
                ]
            }
            if (event.code === 'ArrowRight') {
                newPosition = [
                    (playerPosition[0] + 1) % board.width,
                    playerPosition[1],
                ]
            }
            // console.log(newPosition)
            dispatch(movePlayer({ position: newPosition, local: true }, true))
        },
        [playerPosition]
    )

    const boardStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(60, 16px)' as const,
        gridTemplateRows: 'repeat(60, 16px)' as const,
        gridColumnGap: '0px' as const,
        gridRowGap: '0px' as const,
        backgroundImage: 'url(' + samplemap + ')',
        backgroundRepeat: 'no-repeat' as const,
    }

    const cellStyle = {
        width: '16px',
        padding: '0px',
        textAlign: 'center' as const,
    }

    const avatarImg = (name: string) => {
        switch (name) {
            case 'Adam':
                return `${adam}`
                break
            case 'Amelia':
                return `${amelia}`
                break
            case 'Alex':
                return `${alex}`
                break
            case 'Bob':
                return `${bob}`
                break
        }
        return ''
    }

    const displayPlayers = () => {
        let i = 0
        const grid = []
        for (i = 0; i < board.width * board.height; i++) {
            if (i === playerPosition[1] * board.width + playerPosition[0]) {
                grid.push(
                    <div style={cellStyle} key={i}>
                        <img src={avatarImg(playerAvatar)}></img>
                    </div>
                )
            } else if (
                i ===
                remotePlayerPosition[1] * board.width + remotePlayerPosition[0]
            ) {
                grid.push(
                    <div style={cellStyle} key={i}>
                        <img src={avatarImg(remotePlayerAvatar)}></img>
                    </div>
                )
            } else {
                grid.push(<div style={cellStyle} key={i}></div>)
            }
        }
        return grid
    }

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler)
        return () => {
            window.removeEventListener('keydown', keyDownHandler)
        }
    }, [keyDownHandler])

    return (
        <div className="flex flex-row space-x-2">
            <div className="flew-grow-0" style={boardStyle}>
                {displayPlayers()}
            </div>
            <div className="flex-grow-0 flex-col space-y-2">
                <AvatarPicker></AvatarPicker>
                <div className="item h-48">
                    <VideoChat />
                </div>
            </div>
        </div>
    )
}
