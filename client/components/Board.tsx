import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { calculDistance, movePlayer } from '../slices/boardSlice'
import { useAppSelector } from '../hooks'
import samplemap from '../img/samplemap_16.png'
import alex from '../img/Alex.png'
import bob from '../img/Bob.png'
import adam from '../img/Adam.png'
import amelia from '../img/Amelia.png'
import { AvatarPicker } from './AvatarPicker'
import VideoBar from './VideoBar'

export const Board: React.FC = () => {
    const board = useAppSelector((state) => state.board)
    const playerPosition = useAppSelector((state) => state.playerPosition)
    const remotePositions = useAppSelector((state) => state.remotePositions)
    const playerAvatar = useAppSelector((state) => state.playerAvatar)
    const remoteAvatars = useAppSelector((state) => state.remoteAvatars)
    const distances = useAppSelector((state) => state.distances)
    const [grid, setGrid] = useState([])

    const dispatch = useDispatch<AppDispatch>()

    const keyDownHandler = useCallback(
        (event: KeyboardEvent) => {
            let newPosition = playerPosition
            if (event.code === 'ArrowUp') {
                event.preventDefault()
                newPosition = [
                    playerPosition[0],
                    (playerPosition[1] - 1) % board.width,
                ]
            }
            if (event.code === 'ArrowDown') {
                event.preventDefault()
                newPosition = [
                    playerPosition[0],
                    (playerPosition[1] + 1) % board.width,
                ]
            }
            if (event.code === 'ArrowLeft') {
                event.preventDefault()
                newPosition = [
                    (playerPosition[0] - 1) % board.width,
                    playerPosition[1],
                ]
            }
            if (event.code === 'ArrowRight') {
                event.preventDefault()
                newPosition = [
                    (playerPosition[0] + 1) % board.width,
                    playerPosition[1],
                ]
            }
            // console.log(newPosition)
            dispatch(movePlayer({ position: newPosition }, true))
        },
        [playerPosition]
    )

    const tileWidth = Math.floor(window.innerHeight / 60)

    const boardStyle = {
        display: `grid`,
        gridTemplateColumns: `repeat(60, ${tileWidth}px)` as const,
        gridTemplateRows: `repeat(60, ${tileWidth}px)` as const,
        gridColumnGap: `0px` as const,
        gridRowGap: `0px` as const,
        backgroundImage: `url(` + samplemap + `)`,
        backgroundSize: `${60 * tileWidth}px` as const,
        backgroundRepeat: `no-repeat` as const,
    }

    const cellStyle = {
        width: `${tileWidth}px`,
        padding: `0px`,
        textAlign: `center` as const,
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

    useEffect(() => {
        const grid = []

        for (let i = 0; i < board.width * board.height; i++) {
            grid.push(<div style={cellStyle} key={i}></div>)
        }

        const posIdx = playerPosition[1] * board.width + playerPosition[0]
        grid[posIdx] = (
            <div style={cellStyle} key={posIdx}>
                <img src={avatarImg(playerAvatar)}></img>
            </div>
        )

        Object.entries(remotePositions).forEach(([peerId, position]) => {
            const i = position[1] * board.width + position[0]
            grid[i] = (
                <div style={cellStyle} key={i}>
                    <img src={avatarImg(remoteAvatars[peerId])}></img>
                </div>
            )
        })
        setGrid(grid)
    }, [remotePositions, remoteAvatars, playerPosition, playerAvatar])

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler)
        return () => {
            window.removeEventListener('keydown', keyDownHandler)
        }
    }, [keyDownHandler])

    useEffect(() => {
        dispatch(calculDistance())
    }, [playerPosition, remotePositions])

    return (
        <div className="flex flex-row h">
            <AvatarPicker />
            <div className="p-0 m-0" style={boardStyle}>
                {grid}
            </div>
            <VideoBar />
        </div>
    )
}
