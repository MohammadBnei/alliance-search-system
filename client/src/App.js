import React from 'react'
import {
    Switch,
    Route
} from 'react-router-dom'

import { ConnectedRouter } from 'connected-react-router'

import './App.css'

import Home from './views/Home'
import { Provider } from 'react-redux'
import store, { history } from './redux/store'
import Utils from './entity/Utils'

function App() {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div className="App">
                    <Utils />
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </ConnectedRouter>
        </Provider>
    )
}

export default App
