import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import {
    breakStream,
    calculDistance,
    movePlayer,
    removeStream,
    sendStream,
    setStream,
} from '../slices/boardSlice'
import { useAppSelector } from '../hooks'
import samplemap from '../img/samplemap_16.png'
import alex from '../img/Alex.png'
import bob from '../img/Bob.png'
import adam from '../img/Adam.png'
import amelia from '../img/Amelia.png'
import { AvatarPicker } from './AvatarPicker'
import VideoBar from './VideoBar'
import Participants from './Participants'
import { forIn, toPairs } from 'lodash'
import { Card, HelperText } from '@windmill/react-ui'

export const Board: React.FC = () => {
    const board = useAppSelector((state) => state.board)
    const playerPosition = useAppSelector((state) => state.playerPosition)
    const playerAvatar = useAppSelector((state) => state.playerAvatar)
    const remotePositions = useAppSelector((state) => state.remotePositions)
    const remoteAvatars = useAppSelector((state) => state.remoteAvatars)
    const distances = useAppSelector((state) => state.distances)
    const localStream = useAppSelector((state) => state.stream)
    const connectedTo = useAppSelector((state) => state.connectedTo)

    const dispatch = useDispatch<AppDispatch>()

    const [grid, setGrid] = useState([])

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

    const ownPlayer = {
        width: `${tileWidth}px`,
        padding: `0px`,
        textAlign: `center` as const,
        zIndex: 100 as const,
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

    const renderGrid = () => {
        const grid = []
        for (let i = 0; i < board.width * board.height; i++) {
            grid.push(<div style={cellStyle} key={i}></div>)
        }

        forIn(remotePositions, (position, peerId) => {
            const i = position[1] * board.width + position[0]
            grid[i] = (
                <div style={cellStyle} key={i}>
                    <img src={avatarImg(remoteAvatars[peerId])}></img>
                </div>
            )
        })

        const posIdx = playerPosition[1] * board.width + playerPosition[0]
        grid[posIdx] = (
            <div style={ownPlayer} key={posIdx}>
                <img src={avatarImg(playerAvatar)}></img>
                <div className="absolute z-50 p-0 pt-2 bg-cyan-700 bg-opacity-80">
                    <HelperText style={{ writingMode: 'vertical-rl' }}>
                        Moi
                    </HelperText>
                </div>
            </div>
        )

        return grid
    }

    useEffect(() => {
        setGrid(renderGrid)
    }, [remoteAvatars, remotePositions, playerPosition, playerAvatar])

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler)
        return () => {
            window.removeEventListener('keydown', keyDownHandler)
        }
    }, [keyDownHandler])

    useEffect(() => {
        dispatch(calculDistance())
        toPairs(distances).forEach(([peerId, distance]) => {
            if (distance <= 2) {
                localStream && dispatch(sendStream(peerId))
                !localStream &&
                    navigator.mediaDevices
                        .getUserMedia({
                            audio: true,
                            video: true,
                        })
                        .then((stream) => {
                            dispatch(setStream(stream, true))
                            return stream
                        })
                        .then(() => {
                            dispatch(sendStream(peerId))
                        })
                        .catch((e) => {
                            console.log(e)
                            alert('getUserMedia() error:' + e.name)
                        })
            } else if (distance > 5) {
                dispatch(removeStream(peerId))
                const shouldCutOwnStream =
                    toPairs(connectedTo).filter(([_, cnt]) => cnt).length === 0
                console.log(shouldCutOwnStream)

                shouldCutOwnStream &&
                    localStream &&
                    dispatch(breakStream(localStream, true))
            }
        })
    }, [playerPosition, remotePositions])

    return (
        <>
            <Participants />
            <div className="flex flex-row ">
                <AvatarPicker />
                <div className="p-0 m-0 order-2" style={boardStyle}>
                    {grid}
                </div>
                <VideoBar />
            </div>
        </>
    )
}
