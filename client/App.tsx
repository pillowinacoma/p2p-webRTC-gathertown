import * as React from 'react'
import { Board } from './components/Board'

export interface HelloWorldProps {
    userName: string
    lang: string
}
export const App: React.FC<HelloWorldProps> = (props) => {
    return (
        <>
            <h1>
                Hi {props.userName} from React! Welcome to {props.lang}!
            </h1>
            <Board></Board>
        </>
    )
}
