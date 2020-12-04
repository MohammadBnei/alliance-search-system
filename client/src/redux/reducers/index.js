import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from './auth'
import user from './user'
import search from './search'

import { ERROR } from '../actionTypes'

const error = (state = { errors: [] }, { type, payload }) => {
    switch (type) {
    case ERROR:
        return {
            ...state,
            errors: [...state.errors, payload]
        }
    default:
        return state
    }
}

const createRootReducer = history => combineReducers({
    router: connectRouter(history),
    auth,
    user,
    search,
    error
})

export default createRootReducer
