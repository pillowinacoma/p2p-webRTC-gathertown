import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store/index'
import './style.css'
import { App } from './App'
import { Windmill } from '@windmill/react-ui'

ReactDOM.render(
    <Provider store={store}>
        <Windmill dark>
            <App />
        </Windmill>
    </Provider>,
    document.getElementById('root')
)
