import * as React from 'react'
import { Board } from './components/Board'

export const App: React.FC = () => {
    return (
        <div className="flex justify-center content-center bg-lightBlue-900">
            <Board />
        </div>
    )
}
