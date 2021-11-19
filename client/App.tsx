import * as React from 'react'
import LOGO from './logo.png'

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
            <img src={LOGO} alt="Logo" />
        </>
    )
}
