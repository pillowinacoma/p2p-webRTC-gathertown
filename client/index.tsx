import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Windmill } from '@windmill/react-ui'
import { App } from './App'

ReactDOM.render(
    <Windmill>
        <App userName="Tiw8-TP3" lang="TypeScript" />
    </Windmill>,
    document.getElementById('root')
)
