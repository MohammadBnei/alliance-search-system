import axios from 'axios'
import { push } from 'connected-react-router'
import {
    GET_USER_PROFILE
} from '../actionTypes'

import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR
} from './types'
const API_URI = process.env.API_URI || 'http://server.localhost/api'

axios.defaults.baseURL = API_URI
if (localStorage.getItem('auth_jwt_token')) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token')
}
axios.defaults.headers.post['Content-Type'] = 'application/json'

export function signUserIn (data) {
    return (dispatch) => {
        // Submit email/password to server
        axios
            .post('/signin', data)
            .then(res => {
                dispatch({ type: AUTH_USER })
                localStorage.setItem('auth_jwt_token', res.data.token)
                axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token')
                axios.get('/user/profile')
                    .then(({ data }) => {
                        dispatch({ type: GET_USER_PROFILE, payload: data })
                        dispatch(push('/dashboard'))
                    })
            })
            .catch(error => {
                console.log(error)
                dispatch({ type: AUTH_ERROR, payload: error.response })
            })
    }
}

// export function signUserUp (userObj) {
//     return function (dispatch) {
//         // Submit email/password to server
//         axios
//             .post('/signup', userObj)
//             .then(res => {
//                 dispatch({ type: AUTH_USER })
//                 axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token')
//                 dispatch(push('/signin'))
//             })
//             .catch(error => {
//                 console.log(error)
//                 dispatch({ type: AUTH_ERROR, payload: error.response })
//             })
//     }
// }

export function signUserOut () {
    return function (dispatch) {
        dispatch({ type: UNAUTH_USER })
        localStorage.removeItem('auth_jwt_token')
        dispatch(push('/signin'))
    }
}

const request = axios
export { request }
