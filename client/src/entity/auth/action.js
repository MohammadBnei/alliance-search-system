import axios, { AUTH_URL } from '../../conf'
import { push } from 'connected-react-router'
import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR
} from '../../redux/actionTypes'

if (localStorage.getItem('auth_jwt_token')) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token')
}

export function signUserIn (data) {
    return (dispatch) => {
        // Submit email/password to server
        axios
            .post(AUTH_URL + 'signin/', data , {

            })
            .then(res => {
                dispatch({ type: AUTH_USER })
                localStorage.setItem('auth_jwt_token', res.data.token)
                axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token')
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
