import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'

import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from './reducers'

import thunk from 'redux-thunk'

const logger = createLogger()

export const history = createBrowserHistory()

const enhancer = compose(
    applyMiddleware(thunk, logger, routerMiddleware(history)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default createStore(createRootReducer(history), enhancer)
