import React from 'react'
import {
    Switch,
    Route
} from 'react-router-dom'

import { ConnectedRouter } from 'connected-react-router'

import './App.css'

import SignIn from './views/signIn'
import Home from './views/Home'
import SignUp from './components/user/signUp'
import { Provider } from 'react-redux'
import store, { history } from './redux/store'

function App () {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div className="App">
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/signin">
                            <SignIn />
                        </Route>
                        <Route path="/signup">
                            <SignUp />
                        </Route>
                    </Switch>
                </div>
            </ConnectedRouter>
        </Provider>
    )
}

export default App
