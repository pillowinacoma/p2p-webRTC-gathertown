import React, {
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { movePlayer } from '../slices/boardSlice'
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
    const position = useAppSelector((state) => state.playerPosition)
    const playerPosition = useAppSelector((state) => state.playerPosition)
    const remotePositions = useAppSelector((state) => state.remotePositions)
    const playerAvatar = useAppSelector((state) => state.playerAvatar)
    const remoteAvatars = useAppSelector((state) => state.remoteAvatars)
    const [grid, setGrid] = useState([])

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
            dispatch(movePlayer({ position: newPosition }, true))
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

    const localVideoStyle = {
        position: 'absolute' as const,
        width: '10em' as const,
        zIndex: '100' as const,
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
    // useEffect(() => {
    //     dispatch(calculDistance())
    // }, [position, remotePosition])

    return (
        <div className="flex flex-row space-x-2">
            <div className="flew-grow-0" style={boardStyle}>
                {grid}
            </div>
            <div className="flex-grow-0 flex-col space-y-2">
                <AvatarPicker></AvatarPicker>
                <div className="item h-48">
                    <VideoBar />
                </div>
            </div>
        </div>
    )
}
