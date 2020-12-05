import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from '../../entity/auth/reducer'
// import user from '../../entity/user/reducer'
import search from '../../entity/search/reducer'
import choosen from '../../entity/choosen/reducer'

import {
    ERROR, LOADING,
    END_LOADING
} from '../actionTypes'

const meta = (state = { errors: [], loading: false }, { type, payload }) => {
    switch (type) {
        case ERROR:
            return {
                ...state,
                errors: [payload, ...state.errors]
            }
        case LOADING:
            return {
                ...state,
                loading: true
            }
        case END_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}

const createRootReducer = history => combineReducers({
    router: connectRouter(history),
    auth,
    // user,
    search,
    choosen,
    meta
})

export default createRootReducer
