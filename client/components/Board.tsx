/* eslint-disable no-fallthrough */
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { movePlayer } from '../slices/boardSlice'
import { useAppSelector } from '../hooks'
import samplemap from '../img/samplemap_16.png'
import alex from '../img/Alex_idle_16x16.png'
import { useCallback, useEffect } from 'react'

export const Board: React.FC = () => {
    const board = useAppSelector((state) => state.board)
    const playerPosition: [number, number] = useAppSelector(
        (state) => state.playerPosition
    )
    const dispatch = useDispatch<AppDispatch>()

    const keyDownHandler = useCallback(
        (event) => {
            console.log(event.code)
            console.log(playerPosition)
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
            console.log(newPosition)
            dispatch(movePlayer(newPosition, false))
        },
        [playerPosition]
    )

    const boardStyle = {
        display: 'grid',
        'grid-template-columns': 'repeat(60, 16px)',
        'grid-template-rows': 'repeat(60, 16px)',
        'grid-column-gap': '0px',
        'grid-row-gap': '0px',
        backgroundImage: 'url(' + samplemap + ')',
        'background-repeat': 'no-repeat',
    }

    const alexStyle = {
        display: 'block',
        width: '16px',
        height: '32px',
        background: 'url(' + alex + ') -48px 0',
        'background-repeat': 'no-repeat',
    }

    const cellStyle = {
        width: '16px',
        padding: '0px',
        'text-align': 'center',
    }

    const displayPlayers = () => {
        let i = 0
        const grid = []
        for (i = 0; i < board.width * board.height; i++) {
            if (i === playerPosition[1] * board.width + playerPosition[0]) {
                grid.push(<div style={alexStyle} key={i}></div>)
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
        <>
            <div style={boardStyle}>{displayPlayers()}</div>
        </>
    )
}
