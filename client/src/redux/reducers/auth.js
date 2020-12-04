import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR
} from '../actionTypes'

export default function (state = {
    authenticated: !!localStorage.getItem('auth_jwt_token')
}, action) {
    switch (action.type) {
    case AUTH_USER:
        return { ...state, error: '', authenticated: true }
    case UNAUTH_USER:
        return { ...state, authenticated: false }
    case AUTH_ERROR:
        return {
            ...state,
            error: action.payload,
            authenticated: false
        }
    default:
        return state
    }
}
